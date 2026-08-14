import { createSign } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { loadEnv } from './env.mjs';
import { generatedHotels } from '../src/data/generatedHotels.ts';
import { manualHotels } from '../src/data/manualHotels.ts';

const generatedSlugs = new Set(generatedHotels.map((hotel) => hotel.slug));
const activeHotels = [...generatedHotels, ...manualHotels.filter((hotel) => !generatedSlugs.has(hotel.slug))];

await loadEnv();

const root = process.cwd();
const pilotRegion = process.env.PILOT_REGION || 'myeongdong';
const regionLabel = { myeongdong: '명동', gangnam: '강남', hongdae: '홍대', 'incheon-airport': '인천공항', busan: '부산', jeju: '제주' }[pilotRegion] || pilotRegion;
const localized = JSON.parse(await readFile(path.join(root, 'data', 'multilingual-myeongdong-content.json'), 'utf8'));
const targets = JSON.parse(await readFile(path.join(root, 'data', `multilingual-${pilotRegion}-pilot.json`), 'utf8'));
const sourceBySlug = new Map(activeHotels.map((hotel) => [hotel.slug, hotel]));
const account = JSON.parse(await readFile(path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS), 'utf8'));
const projectId = process.env.GOOGLE_CLOUD_PROJECT || account.project_id;
const location = process.env.VERTEX_LOCATION || 'global';
const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
const auditPath = path.join(root, 'data', `${pilotRegion}-japanese-audit.json`);
const previousAudit = await readJson(auditPath, { audits: [] });
const audits = previousAudit.audits || [];
let accessToken;

for (const target of targets) {
  if (audits.some((audit) => audit.slug === target.slug)) {
    console.log(`Skip completed audit: ${target.slug}`);
    continue;
  }
  const source = sourceBySlug.get(target.slug);
  const japanese = localized[target.slug]?.ja;
  if (!source || !japanese) throw new Error(`Missing source or Japanese content: ${target.slug}`);

  console.log(`Auditing ${target.slug}: ${source.hotelName}`);
  const prompt = `You are a bilingual Korean-Japanese travel-content auditor. Audit the Japanese hotel page below. Do not rewrite the page and do not praise it by default.

Tasks:
1. Back-translate the page's actual meaning into concise Korean, section by section.
2. Judge whether the Japanese sounds native and suitable for a Japanese traveler.
3. Compare every concrete statement with the supplied Korean source facts. Flag unsupported certainty, invented facilities, exact times/fees/sizes, transport claims, or misleading sales language.
4. Flag Korean contamination, unnatural machine-translation phrasing, hotel-name/address mistakes, and content that may belong to another hotel.
5. Distinguish a material error from a minor stylistic improvement.

Return JSON only:
{
  "hotelName": "...",
  "verdict": "pass|pass_with_minor_edits|needs_revision",
  "naturalnessScore": 1-10,
  "factualSafetyScore": 1-10,
  "backTranslation": {
    "title": "Korean meaning",
    "summary": "Korean meaning",
    "sections": [{"heading":"Korean heading","meaning":"2-4 sentence Korean summary"}],
    "faqs": [{"question":"Korean question","answer":"concise Korean meaning"}]
  },
  "strengths": ["..."],
  "materialIssues": [{"japanese":"exact short excerpt","issue":"Korean explanation","suggestion":"Korean correction direction"}],
  "minorIssues": [{"japanese":"exact short excerpt","issue":"Korean explanation"}],
  "koreanContamination": false,
  "wrongHotelRisk": false,
  "publishRecommendation": "Korean conclusion"
}

Korean source facts:
${JSON.stringify({
    hotelName: source.hotelName,
    region: source.region,
    address: source.address,
    starRating: source.starRating,
    reviewScore: source.reviewScore,
    reviewCount: source.reviewCount,
    includeBreakfast: source.includeBreakfast,
    freeWifi: source.freeWifi,
    summary: source.analysis?.summary,
    pros: source.analysis?.pros,
    cons: source.analysis?.cons,
    recommendedFor: source.analysis?.recommendedFor,
    notRecommendedFor: source.analysis?.notRecommendedFor,
    checkPoints: source.analysis?.checkPoints,
    blogReview: source.analysis?.blogReview,
    referenceTitles: (source.referenceLinks || []).map((link) => link.title)
  })}

Japanese page:
${JSON.stringify(japanese)}`;

  const audit = await generateJson(prompt);
  audits.push({ slug: target.slug, sourceHotelName: source.hotelName, ...audit });
  await writeFile(auditPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), model, audits }, null, 2)}\n`, 'utf8');
  await sleep(2500);
}

const lines = [
  `# ${regionLabel} 일본어 페이지 역번역 및 품질 검수`,
  '',
  `- 검수 모델: ${model}`,
  `- 검수 호텔: ${audits.length}개`,
  '- 사이트에는 반영하지 않은 별도 검수 결과입니다.',
  ''
];
for (const audit of audits) {
  lines.push(`## ${audit.sourceHotelName}`);
  lines.push('');
  lines.push(`- 판정: ${audit.verdict}`);
  lines.push(`- 일본어 자연스러움: ${audit.naturalnessScore}/10`);
  lines.push(`- 사실 안전성: ${audit.factualSafetyScore}/10`);
  lines.push(`- 한국어 혼입: ${audit.koreanContamination ? '있음' : '없음'}`);
  lines.push(`- 다른 호텔 내용 혼동 위험: ${audit.wrongHotelRisk ? '있음' : '없음'}`);
  lines.push(`- 결론: ${audit.publishRecommendation}`);
  lines.push('');
  lines.push(`### 제목 역번역`);
  lines.push(audit.backTranslation?.title || '');
  lines.push('');
  lines.push(`### 요약 역번역`);
  lines.push(audit.backTranslation?.summary || '');
  lines.push('');
  lines.push('### 본문 역번역');
  for (const section of audit.backTranslation?.sections || []) lines.push(`- **${section.heading}**: ${section.meaning}`);
  lines.push('');
  lines.push('### 예약 전 FAQ 역번역');
  for (const faq of audit.backTranslation?.faqs || []) lines.push(`- **${faq.question}**: ${faq.answer}`);
  lines.push('');
  lines.push('### 중대한 문제');
  if (audit.materialIssues?.length) {
    for (const issue of audit.materialIssues) lines.push(`- ${issue.japanese}: ${issue.issue} (권고: ${issue.suggestion})`);
  } else lines.push('- 없음');
  lines.push('');
  lines.push('### 경미한 개선점');
  if (audit.minorIssues?.length) {
    for (const issue of audit.minorIssues) lines.push(`- ${issue.japanese}: ${issue.issue}`);
  } else lines.push('- 없음');
  lines.push('');
}
await writeFile(path.join(root, 'docs', `${pilotRegion.toUpperCase()}_JAPANESE_BACKTRANSLATION_AUDIT.md`), `${lines.join('\n')}\n`, 'utf8');
console.log(`Completed ${audits.length} audits.`);

async function generateJson(prompt) {
  accessToken ||= await getAccessToken(account);
  const host = location === 'global' ? 'aiplatform.googleapis.com' : `${location}-aiplatform.googleapis.com`;
  const url = `https://${host}/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:generateContent`;
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, responseMimeType: 'application/json' }
      }),
      signal: AbortSignal.timeout(180000)
    });
    const raw = await response.text();
    if (response.ok) {
      const payload = JSON.parse(raw);
      const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('') || '';
      return extractJson(text);
    }
    if (response.status !== 429 || attempt === 5) throw new Error(`Vertex ${response.status}: ${raw.slice(0, 500)}`);
    const delay = attempt * 15000;
    console.warn(`Vertex rate limit; retrying in ${delay / 1000}s.`);
    await sleep(delay);
  }
}

function extractJson(value) {
  const cleaned = String(value || '').replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  const start = cleaned.indexOf('{');
  if (start < 0) throw new Error('No JSON object found.');
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let index = start; index < cleaned.length; index += 1) {
    const char = cleaned[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') inString = true;
    else if (char === '{') depth += 1;
    else if (char === '}' && --depth === 0) return JSON.parse(cleaned.slice(start, index + 1));
  }
  throw new Error('Incomplete JSON object.');
}

async function readJson(filePath, fallback) {
  try { return JSON.parse(await readFile(filePath, 'utf8')); }
  catch { return fallback; }
}

function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

async function getAccessToken(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const encode = (value) => Buffer.from(value).toString('base64url');
  const input = `${encode(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${encode(JSON.stringify({
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  }))}`;
  const assertion = `${input}.${createSign('RSA-SHA256').update(input).sign(serviceAccount.private_key).toString('base64url')}`;
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(`Token request failed: ${JSON.stringify(data).slice(0, 300)}`);
  return data.access_token;
}
