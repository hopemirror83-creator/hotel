import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { getAgodaCredentials, loadEnv, requireAnyEnv } from './env.mjs';
import { generatedHotels } from '../src/data/generatedHotels.ts';

await loadEnv();
requireAnyEnv([['AGODA_AFFILIATE_KEY', 'AGODA_SITE_ID']]);

const ROOT = process.cwd();
const { siteId, apiKey } = getAgodaCredentials();
const endpoint = process.env.AGODA_LONGTAIL_ENDPOINT || process.env.AGODA_API_BASE_URL || 'https://affiliateapi7643.agoda.com/affiliateservice/lt_v1';
const sampleDays = (process.env.AVG_PRICE_SAMPLE_DAYS || '7,10,14,17,21,24,28,31')
  .split(',')
  .map((item) => Number(item.trim()))
  .filter((item) => Number.isInteger(item) && item > 0);
const delayMs = Number(process.env.AVG_PRICE_DELAY_MS || '350');
const targetRegion = process.env.PRICE_TARGET_REGION || '';
const targetSlugPrefix = process.env.PRICE_TARGET_SLUG_PREFIX || '';
const targetHotels = JSON.parse(await readFile(path.join(ROOT, 'data', 'target-hotels.json'), 'utf8'));
const targetBySlug = new Map(targetHotels.map((hotel) => [hotel.slug, hotel]));
const report = [];

for (const hotel of generatedHotels) {
  if (targetRegion && hotel.region !== targetRegion) continue;
  if (targetSlugPrefix && !hotel.slug.startsWith(targetSlugPrefix)) continue;

  const target = targetBySlug.get(hotel.slug);
  const hotelId = Number(target?.agodaHotelId || new URL(hotel.landingUrl).searchParams.get('hid'));
  const rates = [];

  console.log(`Average price for ${hotel.hotelName}`);
  for (const offset of sampleDays) {
    const checkIn = addDays(new Date(), offset);
    const rate = await fetchRate(hotelId, checkIn);
    if (rate) rates.push({ checkIn, rate });
    await sleep(delayMs);
  }

  const trimmedRates = trimOutliers(rates.map((item) => item.rate));
  const average = trimmedRates.length > 0 ? Math.round(trimmedRates.reduce((sum, rate) => sum + rate, 0) / trimmedRates.length) : hotel.dailyRate;
  const roundedAverage = Number.isFinite(average) ? roundToNearest(average, 1000) : undefined;
  if (roundedAverage) {
    hotel.averageNightlyRate = roundedAverage;
  } else {
    delete hotel.averageNightlyRate;
  }
  hotel.averageNightlyRateSampleCount = trimmedRates.length;

  report.push({
    slug: hotel.slug,
    hotelName: hotel.hotelName,
    previousDailyRate: hotel.dailyRate,
    averageNightlyRate: hotel.averageNightlyRate,
    sampleCount: hotel.averageNightlyRateSampleCount,
    samples: rates
  });
}

await writeFile(path.join(ROOT, 'src', 'data', 'generatedHotels.ts'), `// @ts-nocheck\nexport const generatedHotels: any[] = ${JSON.stringify(generatedHotels, null, 2)};\n`, 'utf8');
await writeFile(path.join(ROOT, 'data', 'generated', 'average-price-report.json'), JSON.stringify(report, null, 2), 'utf8');

console.table(report.map((item) => ({
  slug: item.slug,
  previousDailyRate: item.previousDailyRate,
  averageNightlyRate: item.averageNightlyRate,
  sampleCount: item.sampleCount
})));

async function fetchRate(hotelId, checkIn) {
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
        }
      },
      checkInDate: checkIn,
      checkOutDate: addDays(new Date(`${checkIn}T00:00:00Z`), 1),
      hotelId: [hotelId]
    }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
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
    console.warn(`Agoda rate failed for ${hotelId} ${checkIn}: ${response.status} ${text.slice(0, 160)}`);
    return null;
  }

  const data = JSON.parse(text);
  const hotels = flattenHotels(data);
  const rate = hotels.map((item) => integer(pick(item, ['dailyRate', 'daily_rate', 'DailyRate', 'price', 'rate']))).find(Boolean);
  return rate || null;
}

function trimOutliers(values) {
  const sorted = values.filter(Boolean).sort((a, b) => a - b);
  if (sorted.length <= 4) return sorted;
  return sorted.slice(1, -1);
}

function roundToNearest(value, unit) {
  return Math.round(value / unit) * unit;
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

function integer(value) {
  const result = Number(String(value || '').replace(/[^\d.-]/g, ''));
  return Number.isFinite(result) ? Math.round(result) : undefined;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next.toISOString().slice(0, 10);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
