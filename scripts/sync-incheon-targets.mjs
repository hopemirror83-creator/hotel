import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { getAgodaCredentials, loadEnv } from './env.mjs';

await loadEnv();

const ROOT = process.cwd();
const { siteId, apiKey } = getAgodaCredentials();
const endpoint = process.env.AGODA_LONGTAIL_ENDPOINT || process.env.AGODA_API_BASE_URL || 'https://affiliateapi7643.agoda.com/affiliateservice/lt_v1';
const cityId = Number(process.env.AGODA_CITY_ID || '17234');
const region = process.env.TARGET_REGION || '인천';
const maxResult = Number(process.env.AGODA_MAX_RESULT || '500');
const checkIn = addDays(new Date(), Number(process.env.AGODA_CHECKIN_DAYS || '30'));
const checkOut = addDays(new Date(`${checkIn}T00:00:00Z`), Number(process.env.AGODA_LENGTH_OF_STAY || '1'));

const hotels = await fetchCityHotels();
const targets = hotels.map((hotel) => {
  const hotelName = String(hotel.hotelName || '').trim();
  return {
    slug: `incheon-${hotel.hotelId}`,
    hotelName,
    region,
    searchName: hotelName,
    naverName: hotelName,
    agodaHotelId: Number(hotel.hotelId),
    fallbackAddress: '인천광역시'
  };
});

await writeFile(path.join(ROOT, 'data', 'target-hotels.json'), `${JSON.stringify(targets, null, 2)}\n`, 'utf8');
console.log(`Wrote ${targets.length} Incheon targets`);
console.table(targets.map((target) => ({
  slug: target.slug,
  hotelName: target.hotelName,
  agodaHotelId: target.agodaHotelId
})));

async function fetchCityHotels() {
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
        sortBy: process.env.AGODA_SORT_BY || 'Recommended'
      },
      checkInDate: checkIn,
      checkOutDate: checkOut,
      cityId
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
    throw new Error(`Agoda city fetch failed: ${response.status} ${text.slice(0, 500)}`);
  }

  const candidates = flattenHotels(JSON.parse(text));
  const seen = new Set();
  return candidates.filter((hotel) => {
    const id = Number(hotel.hotelId);
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
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

function addDays(date, days) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result.toISOString().slice(0, 10);
}
