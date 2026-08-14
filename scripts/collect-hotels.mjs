import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { getAgodaCredentials, loadEnv, requireAnyEnv } from './env.mjs';

await loadEnv();

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'data');
const GENERATED_DIR = path.join(DATA_DIR, 'generated');
const outputModulePath = path.join(ROOT, 'src', 'data', 'generatedHotels.ts');
const targetHotelsPath = path.resolve(ROOT, process.env.TARGET_HOTELS_FILE || path.join(DATA_DIR, 'target-hotels.json'));
const targetHotels = JSON.parse(await readFile(targetHotelsPath, 'utf8'));
const existingPublicHotels = await readExistingPublicHotels();
const existingPublicBySlug = new Map(existingPublicHotels.map((hotel) => [hotel.slug, hotel]));
const existingCollected = process.env.MERGE_COLLECTED === '1' ? await readExistingCollectedHotels() : [];

const env = requireAnyEnv([
  ['NAVER_CLIENT_ID', 'NAVER_SEARCH_CLIENT_ID'],
  ['NAVER_CLIENT_SECRET', 'NAVER_SEARCH_CLIENT_SECRET'],
  ['AGODA_AFFILIATE_KEY', 'AGODA_SITE_ID']
]);

const naverClientId = env.NAVER_CLIENT_ID || env.NAVER_SEARCH_CLIENT_ID;
const naverClientSecret = env.NAVER_CLIENT_SECRET || env.NAVER_SEARCH_CLIENT_SECRET;
const { siteId, apiKey } = getAgodaCredentials();

const agodaEndpoint = env.AGODA_LONGTAIL_ENDPOINT || env.AGODA_API_BASE_URL || 'https://affiliateapi7643.agoda.com/affiliateservice/lt_v1';
const agodaMethod = env.AGODA_METHOD || 'POST';
const agodaCheckInDays = Number(env.AGODA_CHECKIN_DAYS || '30');
const agodaLengthOfStay = Number(env.AGODA_LENGTH_OF_STAY || '1');
const naverDisplay = Number(env.NAVER_SEARCH_DISPLAY || '5');
const searchDelayMs = Number(env.SEARCH_DELAY_MS || '220');
const agodaOnly = env.AGODA_ONLY === '1';

const hotels = [];
const reports = [];

for (const target of targetHotels) {
  console.log(`Collecting ${target.hotelName}`);
  const agoda = await safeCollectAgodaHotel(target);
  const naverSearch = agodaOnly ? [] : await safeCollectNaverSearchSignals(target);
  const mapMatch = agodaOnly || target.skipMapMatch ? null : await safeCollectNaverMapMatch(target);

  hotels.push(buildHotelRecord(target, agoda, naverSearch, mapMatch));
  reports.push({
    slug: target.slug,
    hotelName: target.hotelName,
    agodaMatched: Boolean(agoda?.hotelId || agoda?.hotelName),
    naverSearchSignalCount: naverSearch.reduce((sum, entry) => sum + entry.items.length, 0),
    mapMatched: Boolean(mapMatch?.latitude && mapMatch?.longitude)
  });
  await sleep(searchDelayMs);
}

await mkdir(GENERATED_DIR, { recursive: true });
const mergedHotels = mergeHotels(existingCollected, hotels);
await writeFile(path.join(GENERATED_DIR, 'hotels.collected.json'), JSON.stringify({ generatedAt: new Date().toISOString(), hotels: mergedHotels, reports }, null, 2), 'utf8');
await writePublicHotelsModule(mergedHotels.map(stripPrivateSignals));

console.log(`Collected ${hotels.length} hotels`);
console.log(`Merged public collection size: ${mergedHotels.length} hotels`);
console.table(reports);

async function collectAgodaHotel(target) {
  const checkIn = new Date(Date.now() + agodaCheckInDays * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const hotelIds = parseHotelIds(target.agodaHotelId || target.agodaHotelIds || env.AGODA_HOTEL_IDS);
  const cityId = Number(target.agodaCityId || env.AGODA_CITY_ID);
  if (hotelIds.length === 0 && !Number.isFinite(cityId)) {
    return {
      rawStatus: 'missing_agoda_search_id',
      errorMessage: 'Affiliate Lite API requires cityId or hotelId. Add agodaHotelId per target hotel or AGODA_CITY_ID.'
    };
  }
  const requestBody = {
    siteid: siteId,
    apikey: apiKey,
    criteria: {
      additional: {
        currency: 'KRW',
        discountOnly: false,
        language: 'ko-kr',
        occupancy: {
          numberOfAdult: 2,
          numberOfChildren: 0
        }
      },
      checkInDate: checkIn,
      checkOutDate: addDays(checkIn, agodaLengthOfStay),
      ...(hotelIds.length > 0 ? { hotelId: hotelIds } : { cityId })
    }
  };

  if (hotelIds.length === 0) {
    requestBody.criteria.additional.maxResult = Number(env.AGODA_MAX_RESULT || '30');
    requestBody.criteria.additional.minimumReviewScore = 0;
    requestBody.criteria.additional.minimumStarRating = 0;
    requestBody.criteria.additional.sortBy = env.AGODA_SORT_BY || 'Recommended';
  }

  const response = await fetch(agodaEndpoint, {
    method: agodaMethod,
    headers: buildAgodaHeaders(),
    body: JSON.stringify(requestBody),
    signal: AbortSignal.timeout(30000)
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Agoda API failed for ${target.hotelName}: ${response.status} ${text.slice(0, 300)}`);
  }

  const data = parseResponse(text);
  const candidates = flattenHotels(data);
  const best = pickBestAgodaMatch(candidates, target);
  if (!best) {
    return { rawStatus: 'no_match', candidateCount: candidates.length };
  }
  return normalizeAgodaHotel(best, candidates.length);
}

async function safeCollectAgodaHotel(target) {
  try {
    return await collectAgodaHotel(target);
  } catch (error) {
    console.warn(`Agoda collection skipped for ${target.hotelName}: ${error.message}`);
    return {
      rawStatus: 'agoda_error',
      errorMessage: error.message
    };
  }
}

function buildAgodaHeaders() {
  return {
    Authorization: `${siteId}:${apiKey}`,
    'Accept-Encoding': 'gzip,deflate',
    'Content-Type': 'application/json',
    Accept: 'application/json'
  };
}

function parseHotelIds(value) {
  if (!value) return [];
  const values = Array.isArray(value) ? value : String(value).split(',');
  return values.map((item) => Number(item)).filter((item) => Number.isInteger(item) && item > 0);
}

async function collectNaverSearchSignals(target) {
  const baseName = target.naverName || target.hotelName;
  const queries = ['후기', '체크인', '짐보관', '조식', '방크기', '위치'].map((suffix) => `${baseName} ${suffix}`);
  const entries = [];

  for (const query of queries) {
    const url = new URL('https://openapi.naver.com/v1/search/blog.json');
    url.searchParams.set('query', query);
    url.searchParams.set('display', String(naverDisplay));
    url.searchParams.set('sort', 'sim');

    const response = await fetch(url, {
      headers: {
        'X-Naver-Client-Id': naverClientId,
        'X-Naver-Client-Secret': naverClientSecret
      },
      signal: AbortSignal.timeout(30000)
    });
    const text = await response.text();
    if (!response.ok) {
      throw new Error(`Naver blog search failed for ${query}: ${response.status} ${text.slice(0, 200)}`);
    }
    const data = JSON.parse(text);
    entries.push({
      query,
      total: data.total || 0,
      items: (data.items || []).map((item) => ({
        title: cleanHtml(item.title),
        description: cleanHtml(item.description),
        link: item.link,
        postdate: item.postdate
      }))
    });
    await sleep(searchDelayMs);
  }
  return entries;
}

async function safeCollectNaverSearchSignals(target) {
  try {
    return await collectNaverSearchSignals(target);
  } catch (error) {
    if (String(error.message).includes('429')) {
      await sleep(Number(process.env.NAVER_RETRY_DELAY_MS || '12000'));
      try {
        return await collectNaverSearchSignals(target);
      } catch (retryError) {
        console.warn(`Naver search retry skipped for ${target.hotelName}: ${retryError.message}`);
        return [];
      }
    }
    console.warn(`Naver search skipped for ${target.hotelName}: ${error.message}`);
    return [];
  }
}

async function safeCollectNaverMapMatch(target) {
  try {
    return await collectNaverMapMatch(target);
  } catch (error) {
    if (String(error.message).includes('429')) {
      await sleep(Number(process.env.NAVER_RETRY_DELAY_MS || '12000'));
      try {
        return await collectNaverMapMatch(target);
      } catch (retryError) {
        console.warn(`Naver local retry skipped for ${target.hotelName}: ${retryError.message}`);
        return null;
      }
    }
    console.warn(`Naver local skipped for ${target.hotelName}: ${error.message}`);
    return null;
  }
}

async function collectNaverMapMatch(target) {
  const query = target.naverName || target.hotelName;
  const url = new URL('https://openapi.naver.com/v1/search/local.json');
  url.searchParams.set('query', query);
  url.searchParams.set('display', '5');
  url.searchParams.set('sort', 'sim');

  const response = await fetch(url, {
    headers: {
      'X-Naver-Client-Id': naverClientId,
      'X-Naver-Client-Secret': naverClientSecret
    },
    signal: AbortSignal.timeout(30000)
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Naver local search failed for ${query}: ${response.status} ${text.slice(0, 200)}`);
  }
  const data = JSON.parse(text);
  const item = (data.items || [])
    .map((entry) => ({
      title: cleanHtml(entry.title),
      category: cleanHtml(entry.category),
      address: cleanHtml(entry.roadAddress || entry.address),
      latitude: coord(entry.mapy),
      longitude: coord(entry.mapx)
    }))
    .find((entry) => /호텔|리조트|숙박/.test(entry.category) || entry.title.includes(query.slice(0, 4)));

  if (!item) return null;

  const targetLatitude = number(target.latitude);
  const targetLongitude = number(target.longitude);
  if (targetLatitude && targetLongitude && item.latitude && item.longitude) {
    const distanceKm = haversineDistanceKm(
      targetLatitude,
      targetLongitude,
      item.latitude,
      item.longitude
    );
    if (distanceKm > 35) {
      console.warn(`Naver local mismatch skipped for ${target.hotelName}: ${distanceKm.toFixed(1)}km away`);
      return null;
    }
  }

  return item;
}

function haversineDistanceKm(latitude1, longitude1, latitude2, longitude2) {
  const radiusKm = 6371;
  const toRadians = (value) => value * Math.PI / 180;
  const latitudeDelta = toRadians(latitude2 - latitude1);
  const longitudeDelta = toRadians(longitude2 - longitude1);
  const a = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(toRadians(latitude1)) * Math.cos(toRadians(latitude2))
    * Math.sin(longitudeDelta / 2) ** 2;
  return 2 * radiusKm * Math.asin(Math.sqrt(a));
}

function buildHotelRecord(target, agoda, naverSearch, mapMatch) {
  const searchResultCount = naverSearch.reduce((sum, entry) => sum + entry.items.length, 0);
  const fallbackHotelId = Number(target.agodaHotelId);
  return {
    slug: target.slug,
    hotelName: agoda?.hotelName || target.hotelName,
    region: target.region,
    address: mapMatch?.address || agoda?.address || target.fallbackAddress,
    latitude: mapMatch?.latitude || agoda?.latitude || number(target.latitude),
    longitude: mapMatch?.longitude || agoda?.longitude || number(target.longitude),
    starRating: agoda?.starRating ?? number(target.starRating),
    reviewScore: agoda?.reviewScore ?? number(target.reviewScore),
    reviewCount: agoda?.reviewCount ?? integer(target.reviewCount),
    dailyRate: agoda?.dailyRate,
    crossedOutRate: agoda?.crossedOutRate,
    discountPercentage: agoda?.discountPercentage,
    imageUrl: agoda?.imageUrl || target.imageUrl || '',
    landingUrl: agoda?.landingUrl || target.landingUrl || buildPartnerLandingUrl(fallbackHotelId),
    includeBreakfast: Boolean(agoda?.includeBreakfast),
    freeWifi: Boolean(agoda?.freeWifi),
    lastUpdated: new Date().toISOString(),
    searchResultCount,
    sourceSignals: naverSearch,
    analysis: null
  };
}

function buildPartnerLandingUrl(hotelId) {
  if (!Number.isInteger(hotelId) || hotelId <= 0) return '';
  return `https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=${siteId}&hid=${hotelId}`;
}

async function writePublicHotelsModule(publicHotels) {
  const body = `// @ts-nocheck\nexport const generatedHotels: any[] = ${JSON.stringify(publicHotels, null, 2)};\n`;
  await writeFile(outputModulePath, body, 'utf8');
}

function stripPrivateSignals(hotel) {
  const { sourceSignals, ...publicHotel } = hotel;
  const referenceLinks = buildReferenceLinks(sourceSignals);
  const referenceLinkFields = referenceLinks.length > 0 ? { referenceLinks } : {};
  const existing = existingPublicBySlug.get(publicHotel.slug);
  if (existing?.analysis?.blogReview) {
    return {
      ...publicHotel,
      ...referenceLinkFields,
      analysis: existing.analysis,
      qualityStatus: existing.qualityStatus,
      averageNightlyRate: existing.averageNightlyRate,
      averageNightlyRateSampleCount: existing.averageNightlyRateSampleCount
    };
  }
  return {
    ...publicHotel,
    ...referenceLinkFields,
    analysis: hotel.analysis || buildPendingAnalysis(hotel)
  };
}

function buildReferenceLinks(sourceSignals = []) {
  const seenUrls = new Set();
  const links = [];

  for (const signal of sourceSignals) {
    for (const item of signal.items || []) {
      const url = normalizeNaverBlogUrl(item.link);
      if (!url || seenUrls.has(url)) continue;

      links.push({
        title: cleanReferenceTitle(item.title || item.link),
        url,
        query: signal.query,
        source: 'naver_blog'
      });
      seenUrls.add(url);

      if (links.length >= 5) return links;
    }
  }

  return links;
}

function normalizeNaverBlogUrl(value) {
  try {
    const url = new URL(String(value || ''));
    const hostname = url.hostname.toLowerCase();
    if (hostname !== 'blog.naver.com' && hostname !== 'm.blog.naver.com') return '';
    url.protocol = 'https:';
    url.hostname = 'blog.naver.com';
    return url.toString();
  } catch {
    return '';
  }
}

function cleanReferenceTitle(value) {
  return String(value || '')
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

async function readExistingPublicHotels() {
  try {
    const text = await readFile(outputModulePath, 'utf8');
    const match = text.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
    return match ? JSON.parse(match[1]) : [];
  } catch {
    return [];
  }
}

async function readExistingCollectedHotels() {
  try {
    const text = await readFile(path.join(GENERATED_DIR, 'hotels.collected.json'), 'utf8');
    const parsed = JSON.parse(text);
    return Array.isArray(parsed.hotels) ? parsed.hotels : [];
  } catch {
    return [];
  }
}

function mergeHotels(baseHotels, newHotels) {
  const bySlug = new Map();
  for (const hotel of baseHotels) bySlug.set(hotel.slug, hotel);
  for (const hotel of newHotels) bySlug.set(hotel.slug, hotel);
  return Array.from(bySlug.values());
}

function buildPendingAnalysis(hotel) {
  return {
    summary: `${hotel.hotelName}의 아고다 정보와 네이버 검색 신호를 수집했습니다. AI 분석 생성 후 위치, 체크인, 짐보관, 조식, 방크기 관련 예약 전 체크포인트가 채워집니다.`,
    pros: ['아고다 기본 정보 수집 완료', '네이버 검색 신호 수집 완료', '지도 매칭 정보 확인 중'],
    cons: ['AI 분석 생성 전이라 반복 단점은 아직 확정되지 않았습니다.'],
    recommendedFor: ['예약 전 정보를 빠르게 확인하려는 여행자'],
    notRecommendedFor: ['후기 분석 완료 전 즉시 판단하려는 여행자'],
    checkPoints: ['체크인 시간', '짐보관 가능 여부', '조식 포함 여부', '객실 크기', '공항 이동 방식'],
    seoTitle: `${hotel.hotelName} 후기 분석｜위치·체크인·조식 예약 전 체크`,
    metaDescription: `${hotel.hotelName} 후기를 AI로 분석해 위치, 체크인, 짐보관, 조식, 객실 크기와 추천 여행자 유형을 정리합니다.`
  };
}

function parseResponse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return { rawText: text };
  }
}

function flattenHotels(value) {
  const found = [];
  const visit = (node) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    const keys = Object.keys(node).map((key) => key.toLowerCase());
    if (keys.some((key) => /hotel(name|id)|property(name|id)/.test(key))) found.push(node);
    for (const child of Object.values(node)) visit(child);
  };
  visit(value);
  return found;
}

function pickBestAgodaMatch(candidates, target) {
  const targetTokens = normalize(`${target.searchName} ${target.hotelName}`).split(' ').filter((token) => token.length > 2);
  return candidates
    .map((candidate) => ({ candidate, score: scoreCandidate(candidate, targetTokens) }))
    .sort((a, b) => b.score - a.score)[0]?.candidate;
}

function scoreCandidate(candidate, targetTokens) {
  const text = normalize(JSON.stringify(candidate));
  let score = 0;
  for (const token of targetTokens) {
    if (text.includes(token)) score += 1;
  }
  return score;
}

function normalizeAgodaHotel(item, candidateCount) {
  return {
    hotelId: pick(item, ['hotelId', 'hotel_id', 'HotelID', 'hotel_id_pk', 'propertyId']),
    hotelName: pick(item, ['hotelName', 'hotel_name', 'HotelName', 'name', 'propertyName']),
    starRating: number(pick(item, ['starRating', 'star_rating', 'StarRating'])),
    reviewScore: number(pick(item, ['reviewScore', 'review_score', 'ReviewScore', 'score'])),
    reviewCount: integer(pick(item, ['reviewCount', 'review_count', 'ReviewCount', 'numberOfReviews'])),
    dailyRate: integer(pick(item, ['dailyRate', 'daily_rate', 'DailyRate', 'price', 'rate'])),
    crossedOutRate: integer(pick(item, ['crossedOutRate', 'crossed_out_rate', 'CrossedOutRate'])),
    discountPercentage: integer(pick(item, ['discountPercentage', 'discount_percentage', 'DiscountPercentage'])),
    imageUrl: pick(item, ['imageURL', 'imageUrl', 'image_url', 'ImageURL', 'thumbnailUrl']),
    landingUrl: pick(item, ['landingURL', 'landingUrl', 'landing_url', 'LandingURL', 'url']),
    includeBreakfast: Boolean(pick(item, ['includeBreakfast', 'include_breakfast', 'breakfastIncluded'])),
    freeWifi: Boolean(pick(item, ['freeWifi', 'free_wifi', 'FreeWifi', 'wifiIncluded'])),
    address: pick(item, ['address', 'Address', 'addressLine']),
    latitude: number(pick(item, ['latitude', 'lat', 'Latitude'])),
    longitude: number(pick(item, ['longitude', 'lng', 'lon', 'Longitude'])),
    candidateCount
  };
}

function pick(item, names) {
  for (const name of names) {
    if (item?.[name] !== undefined && item[name] !== null && item[name] !== '') return item[name];
  }
  return undefined;
}

function number(value) {
  const result = Number(value);
  return Number.isFinite(result) ? result : undefined;
}

function integer(value) {
  const result = Number(String(value || '').replace(/[^\d.-]/g, ''));
  return Number.isFinite(result) ? Math.round(result) : undefined;
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

function coord(value) {
  const result = Number(value);
  return Number.isFinite(result) ? result / 10000000 : undefined;
}

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, ' ')
    .trim();
}

function addDays(dateText, days) {
  const date = new Date(`${dateText}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
