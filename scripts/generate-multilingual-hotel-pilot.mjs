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
const regionConfig = {
  myeongdong: { english: 'Myeongdong, Seoul', japanese: 'ソウル・明洞', focus: 'Myeongdong Station/Euljiro access, airport transfer planning, luggage storage, room size, breakfast, late arrival, shopping and sightseeing' },
  gangnam: { english: 'Gangnam, Seoul', japanese: 'ソウル・江南', focus: 'Gangnam Station, Yeoksam, Seolleung, Samseong and COEX access, airport transfer planning, business travel, luggage storage, room size, breakfast and late arrival' },
  hongdae: { english: 'Hongdae, Seoul', japanese: 'ソウル・弘大', focus: 'Hongik University Station, Yeonnam, Hapjeong and Sinchon access, AREX airport rail planning, nightlife noise, luggage storage, room size, breakfast, late arrival, shopping and live-music travel' },
  'incheon-airport': { english: 'Incheon Airport, South Korea', japanese: '韓国・仁川国際空港', focus: 'Incheon Airport terminal access, airport shuttle confirmation, AREX and Unseo Station access, early departures, late arrivals, luggage storage, room condition, breakfast, soundproofing and parking' },
  busan: { english: 'Busan, South Korea', japanese: '韓国・釜山', focus: 'Haeundae Beach, Busan Station, Seomyeon, subway and KTX access, beach views, luggage storage, room condition, breakfast, late arrival, family travel and city sightseeing' },
  jeju: { english: 'Jeju Island, South Korea', japanese: '韓国・済州島', focus: 'Jeju Airport access, Jeju City, Jungmun, Seogwipo, Seongsan and Pyoseon travel, rental-car parking, ocean views, resort facilities, room condition, breakfast, family travel and island sightseeing' }
}[pilotRegion];
if (!regionConfig) throw new Error(`Unsupported PILOT_REGION: ${pilotRegion}`);
const targetPath = path.join(root, 'data', `multilingual-${pilotRegion}-pilot.json`);
const outputPath = path.join(root, 'data', 'multilingual-myeongdong-content.json');
const modulePath = path.join(root, 'src', 'data', 'multilingualHotels.ts');
const targets = JSON.parse(await readFile(targetPath, 'utf8'));
const targetSlugs = new Set(targets.map((target) => target.slug));
const hotels = activeHotels.filter((hotel) => targetSlugs.has(hotel.slug));
const languages = {
  en: { name: 'English', locale: 'en-US' },
  ja: { name: 'Japanese', locale: 'ja-JP' }
};
const existing = await readJson(outputPath, {});
const serviceAccount = JSON.parse(await readFile(path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS), 'utf8'));
const projectId = process.env.GOOGLE_CLOUD_PROJECT || serviceAccount.project_id;
const location = process.env.VERTEX_LOCATION || 'global';
const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
let accessToken;

for (const hotel of hotels) {
  existing[hotel.slug] ||= {};
  for (const [language, languageMeta] of Object.entries(languages)) {
    if (existing[hotel.slug][language]?.sections?.length === 6 && process.env.FORCE_REGENERATE !== '1') {
      console.log(`Skip completed: ${hotel.hotelName} (${language})`);
      continue;
    }

    console.log(`Localizing: ${hotel.hotelName} (${language})`);
    const content = await generateWithRetry(buildPrompt(hotel, language, languageMeta), 3);
    validateContent(content, hotel, language);
    existing[hotel.slug][language] = {
      ...content,
      sourceSlug: hotel.slug,
      regionKey: pilotRegion,
      language,
      generatedAt: new Date().toISOString()
    };
    await writeOutputs(existing);
    await sleep(900);
  }
}

await writeOutputs(existing);
console.log(`Completed ${Object.keys(existing).length} multilingual hotels.`);

function buildPrompt(hotel, language, languageMeta) {
  const source = {
    hotelName: hotel.hotelName,
    region: hotel.region,
    address: hotel.address,
    starRating: hotel.starRating,
    reviewScore: hotel.reviewScore,
    reviewCount: hotel.reviewCount,
    averageNightlyRate: hotel.averageNightlyRate || hotel.dailyRate,
    includeBreakfast: hotel.includeBreakfast,
    freeWifi: hotel.freeWifi,
    summary: hotel.analysis?.summary,
    pros: hotel.analysis?.pros,
    cons: hotel.analysis?.cons,
    recommendedFor: hotel.analysis?.recommendedFor,
    notRecommendedFor: hotel.analysis?.notRecommendedFor,
    checkPoints: hotel.analysis?.checkPoints,
    blogReview: hotel.analysis?.blogReview,
    referenceTitles: (hotel.referenceLinks || []).map((link) => link.title)
  };

  return `You are a native ${languageMeta.name} travel editor writing for international visitors planning a stay in ${regionConfig.english}.

Create a genuinely localized hotel decision guide in ${languageMeta.name} (${languageMeta.locale}). Do not translate sentence by sentence. Rewrite the material so it reads naturally to a native reader and addresses international-traveler intent.

Editorial rules:
- Never imply that you personally stayed at the hotel.
- Attribute findings carefully: use natural equivalents of "public reviews commonly mention" and "some guests note".
- Do not copy Agoda review text or Korean search snippets.
- Balance strengths and cautions. Avoid "best", "perfect", "must-book", or other sales language.
- Do not invent exact walking times, airport transfer times, shuttle service, breakfast price, check-in time, room size, or facilities that are absent from the source.
- If a detail is uncertain, tell readers to confirm it on Agoda or with the hotel.
- Focus on ${regionConfig.focus} only where supported.
- Preserve the six-section editorial flow, but use idiomatic headings in the target language.
- Write enough useful detail: intro 2 short paragraphs; each section 2 short paragraphs; each FAQ answer 2-3 sentences.
- Hotel names and Korean addresses should be naturally romanized or localized, without fabricating an official English/Japanese name.
- Return JSON only.

Required JSON schema:
{
  "hotelName": "localized display name",
  "regionLabel": "${language === 'ja' ? regionConfig.japanese : regionConfig.english}",
  "address": "localized address",
  "title": "natural long-tail H1 including hotel name, ${regionConfig.english} and 2-3 useful booking intents",
  "seoTitle": "search title under about 65 characters where practical",
  "metaDescription": "natural search description",
  "summary": "specific 2-3 sentence review summary",
  "pros": ["3 specific items"],
  "cons": ["2-3 specific cautions"],
  "recommendedFor": ["3 traveler types"],
  "notRecommendedFor": ["2 traveler types or cautions"],
  "checkPoints": ["4 booking checks"],
  "intro": ["paragraph 1", "paragraph 2"],
  "sections": [
    {"heading":"Why travelers choose this hotel","paragraphs":["...","..."]},
    {"heading":"Hotel layout and features","paragraphs":["...","..."]},
    {"heading":"Main advantages","paragraphs":["...","..."]},
    {"heading":"How it compares with nearby hotels","paragraphs":["...","..."]},
    {"heading":"Tips and considerations","paragraphs":["...","..."]},
    {"heading":"Who this hotel suits","paragraphs":["...","..."]}
  ],
  "faqs": [
    {"category":"Location","question":"...","answer":"..."},
    {"category":"Airport access","question":"...","answer":"..."},
    {"category":"Check-in","question":"...","answer":"..."},
    {"category":"Breakfast","question":"...","answer":"..."},
    {"category":"Room and luggage","question":"...","answer":"..."}
  ],
  "topHook": "review-count-aware line inviting readers to check current rooms and rates on Agoda",
  "topButton": "short booking-condition button label",
  "bottomHook": "restrained line inviting readers to compare Agoda reviews and booking terms",
  "bottomButton": "short Agoda button label"
}

Source material:
${JSON.stringify(source)}
`;
}

async function generateWithRetry(prompt, attempts) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await callVertex(prompt);
      const raw = await response.text();
      if (!response.ok) throw new Error(`Vertex ${response.status}: ${raw.slice(0, 500)}`);
      const payload = JSON.parse(raw);
      const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('') || '';
      return extractJson(text);
    } catch (error) {
      if (attempt === attempts) throw error;
      console.warn(`Retry ${attempt}: ${error.message}`);
      await sleep(attempt * 1800);
    }
  }
}

async function callVertex(prompt) {
  accessToken ||= await getAccessToken(serviceAccount);
  const host = location === 'global' ? 'aiplatform.googleapis.com' : `${location}-aiplatform.googleapis.com`;
  const url = `https://${host}/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:generateContent`;
  return fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.35, responseMimeType: 'application/json' }
    }),
    signal: AbortSignal.timeout(120000)
  });
}

async function getAccessToken(account) {
  const now = Math.floor(Date.now() / 1000);
  const input = `${base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${base64url(JSON.stringify({
    iss: account.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  }))}`;
  const signature = createSign('RSA-SHA256').update(input).sign(account.private_key);
  const assertion = `${input}.${base64url(signature)}`;
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(`Token request failed: ${JSON.stringify(data).slice(0, 300)}`);
  return data.access_token;
}

function extractJson(value) {
  const cleaned = String(value || '').replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  const start = cleaned.search(/[\[{]/);
  if (start < 0) throw new Error('No JSON object found.');
  const opening = cleaned[start];
  const closing = opening === '{' ? '}' : ']';
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
    else if (char === opening) depth += 1;
    else if (char === closing && --depth === 0) return JSON.parse(cleaned.slice(start, index + 1));
  }
  throw new Error('Incomplete JSON response.');
}

function validateContent(content, hotel, language) {
  if (!content || typeof content !== 'object') throw new Error('Invalid content object.');
  if (!Array.isArray(content.sections) || content.sections.length !== 6) throw new Error('Expected six sections.');
  if (!content.sections.every((section) => Array.isArray(section.paragraphs) && section.paragraphs.length >= 2)) {
    throw new Error('Every section must have at least two paragraphs.');
  }
  if (!Array.isArray(content.faqs) || content.faqs.length < 5) throw new Error('Expected five FAQs.');
  const serialized = JSON.stringify(content);
  if (language === 'en' && /[가-힣]{8,}/.test(serialized)) throw new Error(`Unexpected Korean block in ${hotel.hotelName} English output.`);
}

async function writeOutputs(content) {
  await writeFile(outputPath, `${JSON.stringify(content, null, 2)}\n`, 'utf8');
  await writeFile(modulePath, `// Generated by scripts/generate-multilingual-hotel-pilot.mjs\nexport const multilingualHotels = ${JSON.stringify(content, null, 2)} as const;\n`, 'utf8');
}

async function readJson(filePath, fallback) {
  try { return JSON.parse(await readFile(filePath, 'utf8')); }
  catch { return fallback; }
}

function base64url(value) {
  return Buffer.from(value).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
