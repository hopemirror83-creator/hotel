import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { loadEnv } from './env.mjs';
import { generatedHotels } from '../src/data/generatedHotels.ts';

await loadEnv();

const ROOT = process.cwd();
const outDir = path.join(ROOT, 'data', 'generated');
const naverClientId = process.env.NAVER_CLIENT_ID || process.env.NAVER_SEARCH_CLIENT_ID;
const naverClientSecret = process.env.NAVER_CLIENT_SECRET || process.env.NAVER_SEARCH_CLIENT_SECRET;
const agodaDelayMs = Number(process.env.AGODA_IMAGE_DELAY_MS || '400');
const naverDelayMs = Number(process.env.NAVER_IMAGE_DELAY_MS || '220');
const targetPrefixes = (process.env.TARGET_IMAGE_PREFIXES || '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);
const targetSlugFile = process.env.TARGET_IMAGE_SLUGS_FILE || '';
const targetSlugs = targetSlugFile
  ? new Set(JSON.parse(await readFile(path.resolve(ROOT, targetSlugFile), 'utf8')))
  : null;
const imageLimit = Number(process.env.IMAGE_ENRICH_LIMIT || '0');
const imageStartIndex = Number(process.env.IMAGE_ENRICH_START_INDEX || '0');

const corruptedSectionPlans = [
  {
    heading: '이 호텔 선택 이유',
    label: '호텔 전체/외관',
    naverTerms: ['호텔 외관', '호텔 전경', '호텔 전체'],
    keywords: ['exterior', 'outside', 'entrance', 'lobby', 'view', 'front', 'building', 'hotel', 'property', '숙소', '호텔', '외관', '전경', '입구', '로비']
  },
  {
    heading: '호텔 구성 및 특징',
    label: '객실',
    naverTerms: ['객실', '룸', '객실 내부'],
    keywords: ['room', 'bed', 'suite', 'guestroom', 'bathroom', 'deluxe', '침대', '객실', '룸', '스위트', '화장실']
  },
  {
    heading: '주요 장점',
    label: '시설/수영장',
    naverTerms: ['수영장 시설', '부대시설', '라운지 시설'],
    keywords: ['pool', 'facility', 'fitness', 'spa', 'restaurant', 'breakfast', 'lounge', 'bar', '시설', '수영장', '스파', '피트니스', '조식', '레스토랑', '라운지']
  },
  {
    heading: '경쟁 제품과 비교',
    label: '공용 시설/로비',
    naverTerms: ['시설', '로비', '부대시설'],
    keywords: ['lobby', 'facility', 'restaurant', 'lounge', 'bar', 'interior', '로비', '시설', '라운지', '레스토랑', '인테리어']
  },
  {
    heading: '팁 & 고려사항',
    label: '주변/위치',
    naverTerms: ['주변', '관광지 주변', '교통 위치'],
    keywords: ['location', 'nearby', 'view', 'airport', 'transport', 'surrounding', '위치', '주변', '공항', '전망', '교통']
  },
  {
    heading: '이런 분들 추천해요',
    label: '호텔 대표',
    naverTerms: ['호텔', '호텔 전경', '호텔 객실'],
    keywords: ['hotel', 'property', 'exterior', 'room', 'pool', 'view', '호텔', '숙소', '전경', '객실', '수영장']
  }
];

const corruptedLegacySectionPlans = [
  {
    heading: '이 호텔 선택 이유',
    label: '호텔 전체/외관',
    naverTerms: ['호텔 외관', '호텔 전경', '호텔 전체'],
    keywords: ['exterior', 'outside', 'entrance', 'lobby', 'view', 'front', 'building', 'hotel', 'property', '숙소', '호텔', '외관', '전경', '입구', '로비']
  },
  {
    heading: '호텔 구성 및 특징',
    label: '객실',
    naverTerms: ['객실', '룸', '객실 내부'],
    keywords: ['room', 'bed', 'suite', 'guestroom', 'bathroom', 'deluxe', '침대', '객실', '룸', '스위트', '욕실']
  },
  {
    heading: '주요 장점',
    label: '시설/수영장',
    naverTerms: ['수영장 시설', '부대시설', '라운지 시설'],
    keywords: ['pool', 'facility', 'fitness', 'spa', 'restaurant', 'breakfast', 'lounge', 'bar', '시설', '수영장', '스파', '피트니스', '조식', '레스토랑', '라운지']
  },
  {
    heading: '경쟁 제품과 비교',
    label: '공용 시설/로비',
    naverTerms: ['시설', '로비', '부대시설'],
    keywords: ['lobby', 'facility', 'restaurant', 'lounge', 'bar', 'interior', '로비', '시설', '라운지', '레스토랑', '인테리어']
  },
  {
    heading: '팁 & 고려사항',
    label: '주변/위치',
    naverTerms: ['주변', '영종도 주변', '인천공항 주변'],
    keywords: ['location', 'nearby', 'view', 'airport', 'transport', 'surrounding', '위치', '주변', '공항', '전망', '교통']
  },
  {
    heading: '이런 분들 추천해요',
    label: '호텔 대표',
    naverTerms: ['호텔', '호텔 전경', '호텔 객실'],
    keywords: ['hotel', 'property', 'exterior', 'room', 'pool', 'view', '호텔', '숙소', '전경', '객실', '수영장']
  }
];

const sectionPlans = [
  {
    heading: '이 호텔 선택 이유',
    label: '호텔 전체/외관',
    naverTerms: ['호텔 외관', '호텔 전경', '호텔 전체'],
    keywords: ['exterior', 'outside', 'entrance', 'lobby', 'view', 'front', 'building', 'hotel', 'property', '숙소', '호텔', '외관', '전경', '입구', '로비']
  },
  {
    heading: '호텔 구성 및 특징',
    label: '객실',
    naverTerms: ['객실', '룸', '객실 내부'],
    keywords: ['room', 'bed', 'suite', 'guestroom', 'bathroom', 'deluxe', '침대', '객실', '룸', '스위트', '욕실']
  },
  {
    heading: '주요 장점',
    label: '시설/수영장',
    naverTerms: ['수영장 시설', '부대시설', '라운지 시설'],
    keywords: ['pool', 'facility', 'fitness', 'spa', 'restaurant', 'breakfast', 'lounge', 'bar', '시설', '수영장', '스파', '피트니스', '조식', '레스토랑', '라운지']
  },
  {
    heading: '경쟁 제품과 비교',
    label: '공용 시설/로비',
    naverTerms: ['시설', '로비', '부대시설'],
    keywords: ['lobby', 'facility', 'restaurant', 'lounge', 'bar', 'interior', '로비', '시설', '라운지', '레스토랑', '인테리어']
  },
  {
    heading: '팁 & 고려사항',
    label: '주변/위치',
    naverTerms: ['주변', '관광지 주변', '교통 위치'],
    keywords: ['location', 'nearby', 'view', 'airport', 'transport', 'surrounding', '위치', '주변', '공항', '전망', '교통']
  },
  {
    heading: '이런 분들 추천해요',
    label: '호텔 대표',
    naverTerms: ['호텔', '호텔 전경', '호텔 객실'],
    keywords: ['hotel', 'property', 'exterior', 'room', 'pool', 'view', '호텔', '숙소', '전경', '객실', '수영장']
  }
];

const legacySectionPlans = sectionPlans;

const blockedNewsDomains = [
  /(^|\.)pinimg\.com$/,
  /(^|\.)pinterest\.[a-z.]+$/,
  /(^|\.)news\.naver\.com$/,
  /(^|\.)imgnews\.naver\.net$/,
  /(^|\.)yna\.co\.kr$/,
  /(^|\.)yonhapnews\.co\.kr$/,
  /(^|\.)newsis\.com$/,
  /(^|\.)news1\.kr$/,
  /(^|\.)chosun\.com$/,
  /(^|\.)joongang\.co\.kr$/,
  /(^|\.)donga\.com$/,
  /(^|\.)dongascience\.com$/,
  /(^|\.)hani\.co\.kr$/,
  /(^|\.)khan\.co\.kr$/,
  /(^|\.)hankookilbo\.com$/,
  /(^|\.)seoul\.co\.kr$/,
  /(^|\.)mk\.co\.kr$/,
  /(^|\.)hankyung\.com$/,
  /(^|\.)sedaily\.com$/,
  /(^|\.)edaily\.co\.kr$/,
  /(^|\.)mt\.co\.kr$/,
  /(^|\.)fnnews\.com$/,
  /(^|\.)heraldcorp\.com$/,
  /(^|\.)asiae\.co\.kr$/,
  /(^|\.)ytn\.co\.kr$/,
  /(^|\.)kbs\.co\.kr$/,
  /(^|\.)mbc\.co\.kr$/,
  /(^|\.)sbs\.co\.kr$/,
  /(^|\.)jtbc\.co\.kr$/,
  /(^|\.)mbn\.co\.kr$/
];

const corruptedBlockedNewsText = [
  '뉴스',
  '신문',
  '일보',
  '보도',
  '기사',
  '기자',
  '연합뉴스',
  '뉴시스',
  '뉴스1',
  '조선',
  '중앙일보',
  '동아일보',
  '한겨레',
  '경향',
  '매일경제',
  '한국경제',
  'YTN',
  'KBS',
  'MBC',
  'SBS',
  'JTBC',
  'MBN'
].map((value) => value.toLowerCase());

const blockedNewsText = [
  '뉴스', '신문', '일보', '보도', '기사', '기자', '연합뉴스', '뉴시스', '뉴스1',
  '조선', '중앙일보', '동아일보', '한겨레', '경향', '매일경제', '한국경제',
  'YTN', 'KBS', 'MBC', 'SBS', 'JTBC', 'MBN'
].map((value) => value.toLowerCase());

const blockedImageUrls = new Set([
  'https://i.pinimg.com/736x/62/a2/5d/62a25dbf570c26e4efcd2ff06600b166.jpg',
  'https://static.cdn.soomgo.com/upload/profile/aca23228-de3b-49b1-9864-a1411899e002.jpg?h=630&w=1200&webp=1',
  'https://res.cloudinary.com/titicaca-imgs/image/upload/v1521603763/nqhvygr3gnbgs2zu37ro.jpg'
]);

const corruptedBlockedPersonalImageText = [
  '셀카', '셀피', '프로필', '연예인', '가수', '배우', '팬미팅', '화보'
].map((value) => value.toLowerCase());

const blockedPersonalImageText = [
  '가수', '배우', '연예인', '셀카', '인물', '프로필', '화보', '얼굴', '팬미팅', '콘서트'
].map((value) => value.toLowerCase());

await mkdir(outDir, { recursive: true });

const reports = [];
let processedCount = 0;
let matchedIndex = 0;

for (const hotel of generatedHotels) {
  if (targetSlugs && !targetSlugs.has(hotel.slug)) continue;
  if (targetPrefixes.length > 0 && !targetPrefixes.some((prefix) => hotel.slug?.startsWith(`${prefix}-`))) {
    continue;
  }
  if (matchedIndex < imageStartIndex) {
    matchedIndex += 1;
    continue;
  }
  if (imageLimit > 0 && processedCount >= imageLimit) {
    break;
  }
  matchedIndex += 1;

  if (process.env.FORCE_IMAGE_ENRICH !== '1' && hasCompleteSectionImages(hotel)) {
    reports.push({
      slug: hotel.slug,
      hotelName: hotel.hotelName,
      status: 'skipped_existing_images',
      agodaCandidateCount: 0,
      sectionImages: hotel.analysis?.blogReview?.sections?.map((section) => section.image).filter(Boolean) || []
    });
    continue;
  }

  console.log(`Images for ${hotel.hotelName}`);
  processedCount += 1;
  const agodaResponse = await fetchAgodaSecondaryData(hotel);
  const agodaCandidates = extractAgodaImageCandidates(agodaResponse.text, hotel);
  const sectionImages = await selectSectionImages(hotel, agodaCandidates);

  for (const section of hotel.analysis?.blogReview?.sections || []) {
    const image = sectionImages.find((item) => item.heading === section.heading);
    if (image) section.image = image;
  }

  reports.push({
    slug: hotel.slug,
    hotelName: hotel.hotelName,
    status: agodaResponse.status,
    agodaCandidateCount: agodaCandidates.length,
    sectionImages
  });

  await sleep(agodaDelayMs);
  await writeCurrentOutputs(reports);
}

await writeCurrentOutputs(reports);

const reportRows = reports.map((report) => ({
  slug: report.slug,
  agodaCandidateCount: report.agodaCandidateCount,
  agodaImages: report.sectionImages.filter((image) => image.source === 'agoda_secondary_api').length,
  naverFallbacks: report.sectionImages.filter((image) => image.source === 'naver_image_search').length
}));

if (process.env.IMAGE_ENRICH_COMPACT === '1') {
  console.log(JSON.stringify({
    reports: reportRows.length,
    complete: reportRows.filter((row) => row.agodaImages + row.naverFallbacks >= 6).length,
    agodaOnly: reportRows.filter((row) => row.agodaImages >= 6 && row.naverFallbacks === 0).length,
    withNaverFallback: reportRows.filter((row) => row.naverFallbacks > 0).length,
    recent: reportRows.slice(-12)
  }, null, 2));
} else {
  console.table(reportRows);
}

async function writeCurrentOutputs(currentReports) {
  await writeFileWithRetry(
    path.join(ROOT, 'src', 'data', 'generatedHotels.ts'),
    `// @ts-nocheck\nexport const generatedHotels: any[] = ${JSON.stringify(generatedHotels, null, 2)};\n`
  );
  await writeFileWithRetry(path.join(outDir, 'image-report.json'), JSON.stringify(currentReports, null, 2));
  await writeFileWithRetry(path.join(outDir, 'agoda-first-image-report.html'), renderHtml(currentReports));
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

function hasCompleteSectionImages(hotel) {
  const sections = hotel.analysis?.blogReview?.sections || [];
  return sections.length > 0 && sections.every((section) => section.image?.url);
}

async function fetchAgodaSecondaryData(hotel) {
  const hid = new URL(hotel.landingUrl).searchParams.get('hid');
  const apiUrl = `https://www.agoda.com/api/cronos/property/BelowFoldParams/GetSecondaryData?cid=1927566&hid=${hid}&hotel_id=${hid}&all=false&isHostPropertiesEnabled=true`;
  const response = await fetch(apiUrl, {
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
      accept: 'application/json,text/plain,*/*',
      referer: hotel.landingUrl,
      'accept-language': 'ko-KR,ko;q=0.9,en;q=0.8'
    },
    signal: AbortSignal.timeout(45000)
  });
  return {
    status: response.status,
    text: await response.text()
  };
}

function extractAgodaImageCandidates(value, hotel) {
  const normalized = String(value || '')
    .replace(/\\u002F/g, '/')
    .replace(/\\\//g, '/')
    .replace(/&amp;/g, '&');

  const baseCandidates = [];
  try {
    walkJson(JSON.parse(value), [], baseCandidates);
  } catch {
    // Regex fallback below still captures usable Agoda image URLs.
  }

  const byUrl = new Map();
  for (const candidate of baseCandidates) {
    if (isAgodaImage(candidate.url)) byUrl.set(candidate.url, enhanceAgodaCandidate(candidate, hotel));
  }

  for (const url of extractAgodaUrls(normalized)) {
    if (!byUrl.has(url)) byUrl.set(url, enhanceAgodaCandidate({ url, context: '', path: '' }, hotel));
  }

  return [...byUrl.values()]
    .filter((candidate) => candidate.size !== 'tiny')
    .sort((a, b) => b.baseScore - a.baseScore);
}

function walkJson(node, pathParts, candidates) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    node.forEach((child, index) => walkJson(child, [...pathParts, String(index)], candidates));
    return;
  }

  for (const [key, value] of Object.entries(node)) {
    if (typeof value === 'string' && isAgodaImage(value)) {
      candidates.push({
        url: normalizeUrl(value),
        context: collectContext(node),
        path: [...pathParts, key].join('.')
      });
    }
  }

  for (const [key, value] of Object.entries(node)) {
    if (value && typeof value === 'object') walkJson(value, [...pathParts, key], candidates);
  }
}

function collectContext(node) {
  const keys = ['title', 'caption', 'description', 'name', 'category', 'categoryName', 'roomName', 'roomTypeName', 'facilityName', 'tag', 'type', 'imageType'];
  return keys.map((key) => (typeof node[key] === 'string' ? node[key] : '')).filter(Boolean).join(' ');
}

function extractAgodaUrls(text) {
  const urls = new Set();
  const patterns = [
    /https?:\/\/pix\d+\.agoda\.net\/hotelImages\/[^"'<>\\\s)]+/gi,
    /\/\/pix\d+\.agoda\.net\/hotelImages\/[^"'<>\\\s)]+/gi
  ];

  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      const url = normalizeUrl(match[0]);
      if (isAgodaImage(url)) urls.add(url);
    }
  }
  return [...urls];
}

function enhanceAgodaCandidate(candidate, hotel) {
  const originalUrl = normalizeUrl(candidate.url);
  const url = preferLargeSize(originalUrl);
  const searchText = `${url} ${candidate.context || ''} ${candidate.path || ''}`.toLowerCase();
  const hotelId = new URL(hotel.landingUrl).searchParams.get('hid');
  const size = classifySize(originalUrl);
  const hotelIdMatch = url.includes(`/hotelImages/${hotelId}/`) || url.includes(`/hotelImages/${hotelId.slice(0, 3)}/${hotelId}/`);
  const highRes = /s=(1024x768|800x600|640x480|600x450|512x384)/i.test(originalUrl);

  return {
    url,
    originalUrl,
    context: candidate.context || '',
    path: candidate.path || '',
    searchText,
    size,
    hotelIdMatch,
    baseScore: (hotelIdMatch ? 80 : 0) + (highRes ? 15 : 0) + (size === 'large' ? 10 : 0)
  };
}

async function selectSectionImages(hotel, candidates) {
  const usedFamilies = new Set();
  const usedUrls = new Set();
  const selected = [];

  for (const plan of sectionPlans) {
    const ranked = candidates
      .filter((candidate) => !usedUrls.has(candidate.url) && !usedFamilies.has(imageFamily(candidate.url)))
      .map((candidate) => scoreForPlan(candidate, plan))
      .sort((a, b) => b.score - a.score);

    const agodaPicked = ranked[0];
    if (agodaPicked) {
      usedUrls.add(agodaPicked.url);
      usedFamilies.add(imageFamily(agodaPicked.url));
      selected.push(toPublicImage(hotel, plan, agodaPicked, 'agoda_secondary_api'));
      continue;
    }

    const fallback = await findNaverFallback(hotel, plan, usedUrls);
    if (fallback) {
      usedUrls.add(fallback.url);
      selected.push(fallback);
    }
  }

  return selected;
}

function scoreForPlan(candidate, plan) {
  const keywordHits = plan.keywords.filter((keyword) => candidate.searchText.includes(keyword.toLowerCase()));
  const sectionBias = {
    '이 호텔 선택 이유': /\/0\//.test(candidate.url) ? 8 : 0,
    '호텔 구성 및 특징': /room|bed|suite|guestroom|객실|침대|roomtype|rooms/i.test(candidate.searchText) ? 35 : 0,
    '주요 장점': /pool|facility|spa|fitness|restaurant|breakfast|수영장|시설|조식/i.test(candidate.searchText) ? 35 : 0,
    '경쟁 제품과 비교': /lobby|facility|restaurant|interior|로비|시설/i.test(candidate.searchText) ? 25 : 0,
    '팁 & 고려사항': /view|location|airport|nearby|surrounding|위치|공항|주변/i.test(candidate.searchText) ? 25 : 0,
    '이런 분들 추천해요': /\/0\//.test(candidate.url) ? 6 : 0
  }[plan.heading] || 0;

  const score = candidate.baseScore + keywordHits.length * 20 + sectionBias;
  return {
    ...candidate,
    score,
    reason: keywordHits.length > 0 ? `keyword:${keywordHits.slice(0, 4).join(',')}` : 'best-agoda-candidate'
  };
}

function toPublicImage(hotel, plan, candidate, source) {
  return {
    heading: plan.heading,
    url: candidate.url,
    alt: `${hotel.hotelName} ${plan.heading} 이미지`,
    source,
    query: `${hotel.hotelName} ${plan.label}`,
    score: candidate.score,
    reason: candidate.reason
  };
}

async function findNaverFallback(hotel, plan, usedUrls) {
  if (process.env.DISABLE_NAVER_IMAGE_FALLBACK === '1') return null;
  if (!naverClientId || !naverClientSecret) return null;
  for (const term of plan.naverTerms) {
    const query = `${hotel.hotelName} ${term}`;
    const candidates = await searchNaverImages(query).catch((error) => {
      console.warn(error.message);
      return [];
    });
    const picked = candidates.find((item) => isUsableNaverImage(item) && !usedUrls.has(item.link));
    if (picked) {
      await sleep(naverDelayMs);
      return {
        heading: plan.heading,
        url: picked.link,
        alt: `${hotel.hotelName} ${plan.heading} 이미지`,
        source: 'naver_image_search',
        query,
        score: 0,
        reason: 'naver-fallback'
      };
    }
    await sleep(naverDelayMs);
  }
  return null;
}

async function searchNaverImages(query) {
  const url = new URL('https://openapi.naver.com/v1/search/image');
  url.searchParams.set('query', query);
  url.searchParams.set('display', '20');
  url.searchParams.set('sort', 'sim');
  url.searchParams.set('filter', 'large');

  const response = await fetch(url, {
    headers: {
      'X-Naver-Client-Id': naverClientId,
      'X-Naver-Client-Secret': naverClientSecret
    },
    signal: AbortSignal.timeout(30000)
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`Naver image search failed for ${query}: ${response.status} ${text.slice(0, 200)}`);
  const data = JSON.parse(text);
  return (data.items || []).map((item) => ({
    title: cleanHtml(item.title),
    link: item.link,
    thumbnail: item.thumbnail
  }));
}

function isUsableNaverImage(item) {
  const url = item?.link;
  if (!/^https?:\/\//i.test(String(url || ''))) return false;
  if (/\.(gif|svg)(\?|$)/i.test(url)) return false;
  if (blockedImageUrls.has(url)) return false;
  const candidateText = `${url} ${item?.title || ''}`.toLowerCase();
  if (blockedPersonalImageText.some((keyword) => candidateText.includes(keyword))) return false;
  if (isBlockedNewsSource(url, item?.title)) return false;
  return true;
}

function isBlockedNewsSource(url, title = '') {
  let hostname = '';
  try {
    hostname = new URL(url).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return true;
  }
  if (blockedNewsDomains.some((pattern) => pattern.test(hostname))) return true;
  const text = `${hostname} ${url} ${title}`.toLowerCase();
  return blockedNewsText.some((keyword) => text.includes(keyword));
}

function normalizeUrl(value) {
  let url = String(value || '').trim();
  if (url.startsWith('//')) url = `https:${url}`;
  return url.replace(/\\+/g, '').replace(/&amp;/g, '&');
}

function isAgodaImage(url) {
  const value = normalizeUrl(url);
  if (!/^https?:\/\/pix\d+\.agoda\.net\/hotelImages\//i.test(value)) return false;
  if (/\.(gif|svg)(\?|$)/i.test(value)) return false;
  return /\.(jpg|jpeg|png|webp)(\?|$)/i.test(value);
}

function classifySize(url) {
  const size = String(url).match(/[?&]s=(\d+)x(\d+)/i);
  if (!size) return 'unknown';
  const width = Number(size[1]);
  const height = Number(size[2]);
  if (width < 300 || height < 220) return 'tiny';
  if (width >= 512 && height >= 384) return 'large';
  return 'medium';
}

function preferLargeSize(url) {
  return String(url)
    .replace(/([?&]s=)360x270/i, '$11024x768')
    .replace(/([?&]s=)512x384/i, '$11024x768');
}

function imageFamily(url) {
  return String(url).replace(/[?&]s=\d+x\d+/i, '').replace(/[?&]ar=[^&]+/i, '');
}

function cleanHtml(value) {
  return String(value || '')
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function renderHtml(items) {
  const cards = items.map((hotel) => `
    <section class="hotel">
      <h2>${escapeHtml(hotel.hotelName)}</h2>
      <p class="meta">${escapeHtml(hotel.slug)} · candidates ${hotel.agodaCandidateCount}</p>
      <div class="grid">
        ${hotel.sectionImages.map((image) => `
          <article class="card">
            <img src="${escapeHtml(image.url)}" alt="${escapeHtml(image.alt)}" loading="lazy" referrerpolicy="no-referrer">
            <div class="body">
              <h3>${escapeHtml(image.heading)}</h3>
              <p>${escapeHtml(image.source)} · score ${image.score}</p>
              <p>${escapeHtml(image.reason)}</p>
            </div>
          </article>
        `).join('')}
      </div>
    </section>
  `).join('');

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>HotelLog Agoda First Image Report</title>
  <style>
    body { margin: 0; background: #f5f7fb; color: #111827; font-family: Arial, sans-serif; }
    main { width: min(1160px, calc(100% - 28px)); margin: 32px auto; }
    h1 { margin: 0 0 8px; font-size: 32px; }
    .lead { margin: 0 0 24px; color: #667085; line-height: 1.6; }
    .hotel { margin: 0 0 28px; padding: 22px; border: 1px solid #e5eaf2; border-radius: 8px; background: #fff; }
    .hotel h2 { margin: 0 0 6px; font-size: 24px; }
    .meta { margin: 0 0 16px; color: #667085; font-size: 14px; }
    .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
    .card { overflow: hidden; border: 1px solid #e5eaf2; border-radius: 8px; background: #fff; }
    img { display: block; width: 100%; aspect-ratio: 16 / 10; object-fit: cover; background: #eef4ff; }
    .body { padding: 12px; }
    .body h3 { margin: 0 0 6px; font-size: 18px; }
    .body p { margin: 0 0 5px; color: #475467; line-height: 1.45; }
    @media (max-width: 760px) { .grid { grid-template-columns: 1fr; } .hotel { padding: 16px; } }
  </style>
</head>
<body>
  <main>
    <h1>Agoda First Image Report</h1>
    <p class="lead">아고다 내부 이미지 후보를 우선 사용하고, 부족할 경우에만 네이버 이미지로 보충하는 매칭 리포트입니다.</p>
    ${cards}
  </main>
</body>
</html>`;
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
