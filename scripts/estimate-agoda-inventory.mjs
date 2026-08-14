import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { getAgodaCredentials, loadEnv } from './env.mjs';

await loadEnv();

const ROOT = process.cwd();
const GENERATED_DIR = path.join(ROOT, 'data', 'generated');
const endpoint = process.env.AGODA_LONGTAIL_ENDPOINT || process.env.AGODA_API_BASE_URL || 'https://affiliateapi7643.agoda.com/affiliateservice/lt_v1';
const { siteId, apiKey } = getAgodaCredentials();

const cities = parseCities(process.env.AGODA_CITY_IDS || '17234:인천');
const maxResult = Number(process.env.AGODA_MAX_RESULT || '500');
const checkInDays = Number(process.env.AGODA_CHECKIN_DAYS || '30');
const lengthOfStay = Number(process.env.AGODA_LENGTH_OF_STAY || '1');
const checkIn = addDays(new Date(), checkInDays);
const checkOut = addDays(new Date(`${checkIn}T00:00:00Z`), lengthOfStay);

const results = [];

for (const city of cities) {
  const result = await queryCity(city);
  results.push(result);
  console.log(`${city.name}(${city.id}): ${result.uniqueHotelIds} hotels, ${result.candidateObjects} API objects`);
  await sleep(350);
}

const totalUniqueHotelIds = results.reduce((sum, city) => sum + city.uniqueHotelIds, 0);
const report = {
  generatedAt: new Date().toISOString(),
  note: 'Counts are from Agoda Affiliate Lite API cityId queries for one search date and can be capped by maxResult.',
  checkIn,
  checkOut,
  maxResult,
  cityCount: results.length,
  totalUniqueHotelIds,
  results
};

await mkdir(GENERATED_DIR, { recursive: true });
await writeFile(path.join(GENERATED_DIR, 'agoda-inventory-estimate.json'), JSON.stringify(report, null, 2), 'utf8');

console.log(JSON.stringify({
  checkIn,
  checkOut,
  maxResult,
  cityCount: results.length,
  totalUniqueHotelIds
}, null, 2));

async function queryCity(city) {
  const body = {
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
        },
        maxResult,
        minimumReviewScore: 0,
        minimumStarRating: 0,
        sortBy: 'Recommended'
      },
      checkInDate: checkIn,
      checkOutDate: checkOut,
      cityId: city.id
    }
  };

  const response = await fetch(endpoint, {
    method: process.env.AGODA_METHOD || 'POST',
    headers: {
      Authorization: `${siteId}:${apiKey}`,
      'Accept-Encoding': 'gzip,deflate',
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30000)
  });
  const text = await response.text();
  if (!response.ok) {
    return {
      ...city,
      status: response.status,
      error: text.slice(0, 500),
      candidateObjects: 0,
      uniqueHotelIds: 0,
      capped: false,
      sample: []
    };
  }

  const data = JSON.parse(text);
  const candidates = flattenHotels(data);
  const ids = [...new Set(candidates.map((item) => pick(item, ['hotelId', 'hotel_id', 'HotelID', 'propertyId'])).filter(Boolean))];

  return {
    ...city,
    status: response.status,
    candidateObjects: candidates.length,
    uniqueHotelIds: ids.length,
    capped: ids.length >= maxResult,
    sample: candidates.slice(0, 5).map((item) => ({
      id: pick(item, ['hotelId', 'hotel_id', 'HotelID', 'propertyId']),
      name: pick(item, ['hotelName', 'hotel_name', 'HotelName', 'name', 'propertyName']),
      reviewScore: pick(item, ['reviewScore', 'review_score', 'ReviewScore', 'score']),
      reviewCount: pick(item, ['reviewCount', 'review_count', 'ReviewCount', 'numberOfReviews']),
      dailyRate: pick(item, ['dailyRate', 'daily_rate', 'DailyRate', 'price', 'rate'])
    }))
  };
}

function parseCities(value) {
  return String(value)
    .split(',')
    .map((entry) => {
      const [idText, name = idText] = entry.split(':');
      return { id: Number(idText.trim()), name: name.trim() };
    })
    .filter((entry) => Number.isInteger(entry.id) && entry.id > 0);
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
    Object.values(node).forEach(visit);
  };
  visit(value);
  return found;
}

function pick(item, names) {
  for (const name of names) {
    if (item?.[name] !== undefined && item[name] !== null && item[name] !== '') return item[name];
  }
  return undefined;
}

function addDays(date, days) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result.toISOString().slice(0, 10);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
