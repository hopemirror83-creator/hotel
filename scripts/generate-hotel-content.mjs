import { readFile, writeFile } from 'node:fs/promises';
import { createSign } from 'node:crypto';
import path from 'node:path';
import { loadEnv } from './env.mjs';

await loadEnv();
const env = process.env;

const ROOT = process.cwd();
const collectedPath = path.join(ROOT, 'data', 'generated', 'hotels.collected.json');
const outputModulePath = path.join(ROOT, 'src', 'data', 'generatedHotels.ts');
const genAiProvider = String(env.GENAI_PROVIDER || env.GEMINI_PROVIDER || (env.GOOGLE_APPLICATION_CREDENTIALS ? 'vertex' : 'gemini')).toLowerCase();
const geminiModel = env.GEMINI_MODEL || 'gemini-2.5-flash';
const vertexTokenCache = new Map();
let vertexServiceAccounts = null;

if (genAiProvider === 'vertex') {
  if (!env.GOOGLE_APPLICATION_CREDENTIALS) {
    throw new Error('GOOGLE_APPLICATION_CREDENTIALS is required when GENAI_PROVIDER=vertex.');
  }
} else if (!env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is required unless GENAI_PROVIDER=vertex is set.');
}

const collected = JSON.parse(await readFile(collectedPath, 'utf8'));
const existingHotels = await readExistingHotels();
const existingBySlug = new Map(existingHotels.map((hotel) => [hotel.slug, hotel]));
const publicHotels = collected.hotels.map((hotel) => {
  const existing = existingBySlug.get(hotel.slug);
  return existing?.analysis?.blogReview ? existing : stripPrivateSignals(hotel);
});
const reports = [];
const limit = Number(env.GEMINI_LIMIT || collected.hotels.length);
const startIndex = Number(env.GEMINI_START_INDEX || '0');
const concurrency = Math.max(1, Number(env.GEMINI_CONCURRENCY || '1'));
const hotelsPerRequest = Math.max(1, Number(env.GEMINI_HOTELS_PER_REQUEST || '1'));
const requestedSlugText = env.GEMINI_TARGET_SLUGS_FILE
  ? (JSON.parse(await readFile(path.resolve(ROOT, env.GEMINI_TARGET_SLUGS_FILE), 'utf8')) || []).join(',')
  : String(env.GEMINI_TARGET_SLUGS || '');
const requestedSlugs = new Set(
  requestedSlugText
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
);
let generatedCount = 0;

const indexedHotels = collected.hotels.map((hotel, index) => ({ hotel, index }));
const generationPool = requestedSlugs.size > 0
  ? indexedHotels.filter(({ hotel }) => requestedSlugs.has(hotel.slug))
  : indexedHotels.slice(startIndex, startIndex + limit);
const generationTargets = generationPool
  .filter(({ hotel }) => (
    env.GEMINI_SKIP_COMPLETED !== '1'
    || !existingBySlug.get(hotel.slug)?.analysis?.blogReview?.sections?.length
  ));

for (let cursor = 0; cursor < generationTargets.length; cursor += concurrency * hotelsPerRequest) {
  const batch = generationTargets.slice(cursor, cursor + concurrency * hotelsPerRequest);
  const workerGroups = Array.from({ length: concurrency }, (_, workerIndex) => (
    batch.slice(workerIndex * hotelsPerRequest, (workerIndex + 1) * hotelsPerRequest)
  )).filter((group) => group.length > 0);
  const results = await Promise.allSettled(workerGroups.map(async (group, workerIndex) => {
    console.log(`Generating ${group.map(({ hotel }) => hotel.hotelName).join(', ')}`);
    const analyses = await generateAnalysesWithRetry(group.map(({ hotel }) => hotel), 3, workerIndex);
    return group.map(({ hotel, index }, groupIndex) => ({ hotel, index, analysis: analyses[groupIndex] }));
  }));

  let batchError = null;
  for (let resultIndex = 0; resultIndex < results.length; resultIndex += 1) {
    const result = results[resultIndex];
    const group = workerGroups[resultIndex];
    if (result.status === 'rejected') {
      batchError ||= result.reason;
      reports.push(...group.map(({ hotel }) => ({
        slug: hotel.slug,
        hotelName: hotel.hotelName,
        status: 'generation_failed',
        notes: [String(result.reason?.message || result.reason)]
      })));
      continue;
    }

    for (const { hotel, index, analysis } of result.value) {
      const quality = checkQuality(hotel, analysis);
      publicHotels[index] = stripPrivateSignals({ ...hotel, analysis, qualityStatus: quality.status });
      reports.push({ slug: hotel.slug, hotelName: hotel.hotelName, ...quality });
      generatedCount += 1;
    }
  }
  await writeOutputs();
  if (batchError && env.GEMINI_CONTINUE_ON_ERROR !== '1') throw batchError;
  await sleep(Number(env.GEMINI_DELAY_MS || '1000'));
}

await writeOutputs();

console.log(`Generated ${publicHotels.length} hotel pages`);
console.table(reports);

async function readExistingHotels() {
  try {
    const text = await readFile(outputModulePath, 'utf8');
    const match = text.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
    return match ? JSON.parse(match[1]) : [];
  } catch {
    return [];
  }
}

async function writeOutputs() {
  await writeFileWithRetry(outputModulePath, `// @ts-nocheck\nexport const generatedHotels: any[] = ${JSON.stringify(publicHotels, null, 2)};\n`);
  await writeFileWithRetry(path.join(ROOT, 'data', 'generated', 'generation-report.json'), JSON.stringify(reports, null, 2));
}

async function writeFileWithRetry(filePath, content, attempts = 5) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await writeFile(filePath, content, 'utf8');
      return;
    } catch (error) {
      if (attempt === attempts) throw error;
      await sleep(400 * attempt);
    }
  }
}

async function generateAnalysis(hotel, credentialIndex = 0) {
  const prompt = buildPrompt(hotel);
  const response = genAiProvider === 'vertex'
    ? await callVertexGemini(prompt, credentialIndex)
    : await callDeveloperGemini(prompt);

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Gemini failed for ${hotel.hotelName}: ${response.status} ${text.slice(0, 300)}`);
  }
  const data = JSON.parse(text);
  const content = data.candidates?.[0]?.content?.parts?.map((part) => part.text).join('\n') || '';
  return normalizeAnalysis(JSON.parse(extractJson(content)));
}

async function generateAnalyses(hotels, credentialIndex = 0) {
  if (hotels.length === 1) return [await generateAnalysis(hotels[0], credentialIndex)];

  const prompt = `아래 호텔별 작업 지시를 각각 독립적으로 수행하세요.
각 호텔의 사실과 검색 신호를 서로 섞지 마세요.
응답은 반드시 [{"slug":"호텔 슬러그","analysis":{...개별 작업 지시의 JSON 결과...}}] 형식의 JSON 배열만 출력하세요.

${JSON.stringify(hotels.map((hotel) => ({
    slug: hotel.slug,
    task: buildPrompt(hotel)
  })))}`;
  const response = genAiProvider === 'vertex'
    ? await callVertexGemini(prompt, credentialIndex)
    : await callDeveloperGemini(prompt);
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Gemini batch failed: ${response.status} ${text.slice(0, 300)}`);
  }
  const data = JSON.parse(text);
  const content = data.candidates?.[0]?.content?.parts?.map((part) => part.text).join('\n') || '';
  const parsed = JSON.parse(extractJson(content));
  if (!Array.isArray(parsed)) throw new Error('Gemini batch response is not an array.');
  const bySlug = new Map(parsed.map((item) => [String(item.slug || ''), item.analysis || item]));
  return hotels.map((hotel) => {
    const analysis = bySlug.get(hotel.slug);
    if (!analysis) throw new Error(`Gemini batch response is missing ${hotel.slug}.`);
    return normalizeAnalysis(analysis);
  });
}

async function callDeveloperGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${env.GEMINI_API_KEY}`;
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildGeminiRequest(prompt)),
    signal: AbortSignal.timeout(60000)
  });
}

async function callVertexGemini(prompt, credentialIndex = 0) {
  const serviceAccount = await readVertexServiceAccount(credentialIndex);
  const projectId = env.GOOGLE_CLOUD_PROJECT || env.GCLOUD_PROJECT || serviceAccount.project_id;
  const locationPool = String(env.VERTEX_LOCATION_POOL || '')
    .split(';')
    .map((value) => value.trim())
    .filter(Boolean);
  const location = locationPool[credentialIndex % locationPool.length]
    || env.GOOGLE_CLOUD_LOCATION
    || env.VERTEX_LOCATION
    || 'us-central1';
  if (!projectId) {
    throw new Error('GOOGLE_CLOUD_PROJECT is required, or project_id must exist in the service account JSON.');
  }

  const token = await getVertexAccessToken(serviceAccount);
  const modelPath = geminiModel.startsWith('publishers/')
    ? geminiModel
    : `publishers/google/models/${geminiModel}`;
  const apiHost = location === 'global'
    ? 'aiplatform.googleapis.com'
    : `${location}-aiplatform.googleapis.com`;
  const url = `https://${apiHost}/v1/projects/${projectId}/locations/${location}/${modelPath}:generateContent`;
  return fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(buildGeminiRequest(prompt)),
    signal: AbortSignal.timeout(hotelsPerRequest > 1 ? 120000 : 60000)
  });
}

function buildGeminiRequest(prompt) {
  return {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.35,
      responseMimeType: 'application/json'
    }
  };
}

async function readVertexServiceAccount(credentialIndex = 0) {
  if (!vertexServiceAccounts) {
    const credentialPaths = String(env.GOOGLE_APPLICATION_CREDENTIALS_POOL || env.GOOGLE_APPLICATION_CREDENTIALS)
      .split(';')
      .map((value) => value.trim())
      .filter(Boolean);
    vertexServiceAccounts = await Promise.all(credentialPaths.map(async (credentialPath) => (
      JSON.parse(await readFile(path.resolve(credentialPath), 'utf8'))
    )));
  }
  return vertexServiceAccounts[credentialIndex % vertexServiceAccounts.length];
}

async function getVertexAccessToken(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const cached = vertexTokenCache.get(serviceAccount.client_email);
  if (cached?.token && cached.expiresAt - 90 > now) return cached.token;

  const jwt = signServiceAccountJwt(serviceAccount, now);
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    }),
    signal: AbortSignal.timeout(30000)
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Vertex token request failed: ${response.status} ${text.slice(0, 300)}`);
  }
  const data = JSON.parse(text);
  vertexTokenCache.set(serviceAccount.client_email, {
    token: data.access_token,
    expiresAt: now + Number(data.expires_in || 3600)
  });
  return data.access_token;
}

function signServiceAccountJwt(serviceAccount, now) {
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };
  const input = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`;
  const signature = createSign('RSA-SHA256').update(input).sign(serviceAccount.private_key);
  return `${input}.${base64url(signature)}`;
}

function base64url(value) {
  return Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

async function generateAnalysesWithRetry(hotels, attempts = 3, credentialIndex = 0) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await generateAnalyses(hotels, credentialIndex);
    } catch (error) {
      if (attempt === attempts) throw error;
      console.warn(`Retrying ${hotels.map((hotel) => hotel.hotelName).join(', ')} after generation error: ${error.message}`);
      const rateLimited = /(?:\b429\b|RESOURCE_EXHAUSTED)/i.test(String(error?.message || error));
      await sleep(rateLimited ? 30000 * attempt : 900 * attempt);
    }
  }
}

function buildPrompt(hotel) {
  const sourceItems = (hotel.sourceSignals || [])
    .map((entry) => ({
      query: entry.query,
      total: entry.total,
      items: entry.items.map((item) => ({
        title: item.title,
        description: item.description,
        postdate: item.postdate
      }))
    }));

  return `당신은 호텔 예약 전 판단을 돕는 한국어 리뷰 분석 편집자입니다.

중요 원칙:
- 아고다 후기 원문이나 네이버 검색 결과 문장을 그대로 노출하지 않습니다.
- 검색 결과 제목/요약 문장을 복사하거나 비슷하게 재작성하지 않습니다.
- 제공된 호텔 링크와 API 데이터, 검색 신호를 근거로 분석하되, 최종 문장은 새로 작성합니다.
- 광고문처럼 과장하지 말고, 예약 전에 확인할 실용 정보 중심으로 씁니다.
- 호텔명, 위치, 체크인, 짐보관, 조식, 방크기, 공항 접근성 등 호텔별 고유 판단 요소가 드러나야 합니다.
- 블로그 후기글은 모바일에서 읽기 쉽게 한 문단을 45~90자 정도로 짧게 씁니다.
- 각 소제목마다 2~4개 문단을 작성합니다.
- "경쟁 제품과 비교"는 호텔이 속한 같은 지역 또는 같은 여행 목적의 숙소 선택지와 비교합니다. 다른 도시나 공항권 숙소를 임의로 끌어와 비교하지 않습니다. 확실하지 않은 경쟁 호텔명은 단정하지 않습니다.
- JSON만 출력합니다.

호텔 기본 정보:
${JSON.stringify({
  hotelName: hotel.hotelName,
  region: hotel.region,
  address: hotel.address,
  landingUrl: hotel.landingUrl,
  starRating: hotel.starRating,
  reviewScore: hotel.reviewScore,
  reviewCount: hotel.reviewCount,
  dailyRate: hotel.dailyRate,
  crossedOutRate: hotel.crossedOutRate,
  discountPercentage: hotel.discountPercentage,
  includeBreakfast: hotel.includeBreakfast,
  freeWifi: hotel.freeWifi,
  searchResultCount: hotel.searchResultCount
}, null, 2)}

네이버 검색 신호:
${JSON.stringify(sourceItems, null, 2)}

출력 JSON 형식:
{
  "summary": "2문장 이내",
  "pros": ["3~5개"],
  "cons": ["2~4개"],
  "recommended_for": ["2~4개"],
  "not_recommended_for": ["2~4개"],
  "check_points": ["4~6개"],
  "seo_title": "호텔명 후기 분석｜위치·체크인·조식 예약 전 체크",
  "meta_description": "120자 이내",
  "blog_review": {
    "intro": ["짧은 시작 문단 1", "짧은 시작 문단 2"],
    "sections": [
      {"heading": "이 호텔 선택 이유", "paragraphs": ["문단1", "문단2", "문단3"]},
      {"heading": "호텔 구성 및 특징", "paragraphs": ["문단1", "문단2", "문단3"]},
      {"heading": "주요 장점", "paragraphs": ["문단1", "문단2", "문단3"]},
      {"heading": "경쟁 제품과 비교", "paragraphs": ["문단1", "문단2", "문단3"]},
      {"heading": "팁 & 고려사항", "paragraphs": ["문단1", "문단2", "문단3"]},
      {"heading": "이런 분들 추천해요", "paragraphs": ["문단1", "문단2", "문단3"]}
    ]
  }
}`;
}

function normalizeAnalysis(value) {
  return {
    summary: string(value.summary),
    pros: stringArray(value.pros),
    cons: stringArray(value.cons),
    recommendedFor: stringArray(value.recommended_for || value.recommendedFor),
    notRecommendedFor: stringArray(value.not_recommended_for || value.notRecommendedFor),
    checkPoints: stringArray(value.check_points || value.checkPoints),
    seoTitle: string(value.seo_title || value.seoTitle),
    metaDescription: string(value.meta_description || value.metaDescription),
    blogReview: normalizeBlogReview(value.blog_review || value.blogReview)
  };
}

function checkQuality(hotel, analysis) {
  const notes = [];
  const blogParagraphs = analysis.blogReview
    ? [
      ...analysis.blogReview.intro,
      ...analysis.blogReview.sections.flatMap((section) => section.paragraphs)
    ]
    : [];
  const combined = [
    analysis.summary,
    ...analysis.pros,
    ...analysis.cons,
    ...analysis.recommendedFor,
    ...analysis.notRecommendedFor,
    ...analysis.checkPoints,
    ...blogParagraphs
  ].join(' ');

  if (analysis.summary.length < 45) notes.push('summary_too_short');
  if (analysis.pros.length < 3) notes.push('not_enough_pros');
  if (analysis.cons.length < 2) notes.push('not_enough_cons');
  if (!analysis.blogReview) notes.push('blog_review_missing');
  if (analysis.blogReview?.intro.length < 1) notes.push('blog_intro_missing');
  if (analysis.blogReview?.sections.some((section) => section.paragraphs.length < 2)) notes.push('blog_section_too_short');
  if (blogParagraphs.join(' ').length < 900) notes.push('blog_review_too_short');
  const locationTokens = String(hotel.address || '')
    .split(/\s+/)
    .map((token) => token.replace(/[^\p{L}\p{N}]/gu, ''))
    .filter((token) => token.length >= 2);
  const hasHotelOrLocationSignal = (
    combined.includes(hotel.hotelName.slice(0, 2))
    || combined.includes(hotel.region)
    || locationTokens.some((token) => combined.includes(token))
  );
  if (!hasHotelOrLocationSignal) notes.push('not_specific_enough');
  if (/좋은 숙소|추천합니다|만족도가 높습니다/.test(combined) && combined.length < 260) notes.push('too_generic');

  return {
    status: notes.length > 0 ? 'review_required' : 'ready',
    notes: notes.join(', ')
  };
}

function normalizeBlogReview(value) {
  const expectedHeadings = [
    '이 호텔 선택 이유',
    '호텔 구성 및 특징',
    '주요 장점',
    '경쟁 제품과 비교',
    '팁 & 고려사항',
    '이런 분들 추천해요'
  ];
  const sections = Array.isArray(value?.sections) ? value.sections : [];

  return {
    intro: stringArray(value?.intro).slice(0, 3),
    sections: expectedHeadings.map((heading) => {
      const found = sections.find((section) => string(section.heading) === heading);
      return {
        heading,
        paragraphs: stringArray(found?.paragraphs).slice(0, 5)
      };
    })
  };
}

function stripPrivateSignals(hotel) {
  const { sourceSignals, ...publicHotel } = hotel;
  return publicHotel;
}

function extractJson(value) {
  const text = String(value || '').trim();
  const start = [...text].findIndex((char) => char === '{' || char === '[');
  if (start < 0) throw new Error(`Gemini did not return JSON: ${text.slice(0, 200)}`);

  const opening = text[start];
  const closing = opening === '{' ? '}' : ']';
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < text.length; index += 1) {
    const char = text[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') {
      inString = true;
      continue;
    }
    if (char === opening) depth += 1;
    if (char === closing) depth -= 1;
    if (depth === 0) return text.slice(start, index + 1);
  }

  throw new Error(`Gemini returned incomplete JSON: ${text.slice(0, 200)}`);
}

function string(value) {
  return String(value || '').trim();
}

function stringArray(value) {
  return Array.isArray(value) ? value.map(string).filter(Boolean) : [];
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
