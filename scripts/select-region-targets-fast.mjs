import { spawnSync } from 'node:child_process';
import { createReadStream, mkdirSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import path from 'node:path';
import { generatedHotels } from '../src/data/generatedHotels.ts';

const csvPath = process.env.AGODA_CSV_PATH || '56A3C1A2-0531-49F3-8720-D7D4B1410E41_KO.csv';
const slugPrefix = process.env.SLUG_PREFIX || 'region';
const region = process.env.TARGET_REGION || slugPrefix;
const limit = Number(process.env.TARGET_LIMIT || '100');
const outputPath = process.env.TARGET_OUTPUT || path.join('data', `target-hotels-${slugPrefix}-extra-${limit}.json`);
const keywords = process.env.TARGET_KEYWORDS || region;
const matchFields = (process.env.TARGET_MATCH_FIELDS || 'city,state,addressline1,addressline2')
  .split(',')
  .map((field) => field.trim())
  .filter(Boolean);
const excludePattern = process.env.TARGET_EXCLUDE_KEYWORDS ? new RegExp(process.env.TARGET_EXCLUDE_KEYWORDS, 'i') : null;
const keywordPattern = new RegExp(keywords, 'i');
const minReviews = Number(process.env.MIN_REVIEWS || '1');
const minReviewScore = Number(process.env.MIN_REVIEW_SCORE || '0');
const maxHotelNameLength = Number(process.env.MAX_HOTEL_NAME_LENGTH || '0');
const excludeHotelNamePattern = process.env.EXCLUDE_HOTEL_NAME_PATTERN
  ? new RegExp(process.env.EXCLUDE_HOTEL_NAME_PATTERN, 'i')
  : null;
const countryIso = String(process.env.TARGET_COUNTRY_ISO || '').trim().toUpperCase();

const headers = await readHeaders();
const existingIds = new Set(generatedHotels.map((hotel) => String(hotel.agodaHotelId || hotel.hotelId || '')).filter(Boolean));
const existingSlugs = new Set(generatedHotels.map((hotel) => String(hotel.slug || '')).filter(Boolean));
const rows = [];

const rg = spawnSync('rg', ['--no-line-number', keywords, csvPath], {
  encoding: 'utf8',
  maxBuffer: 1024 * 1024 * 300
});

if (rg.error) throw rg.error;
if (rg.status && !rg.stdout) {
  throw new Error(`rg failed with status ${rg.status}: ${rg.stderr}`);
}

for (const line of rg.stdout.split(/\r?\n/)) {
  if (!line.trim()) continue;
  const values = parseCsvLine(line);
  if (values.length < headers.length) continue;
  const row = Object.fromEntries(headers.map((header, index) => [header, values[index] || '']));
  if (countryIso && String(row.countryisocode || '').trim().toUpperCase() !== countryIso) continue;
  const matchText = matchFields.map((field) => row[field] || '').join(' ');
  if (!keywordPattern.test(matchText)) continue;
  if (excludePattern) {
    const excludeText = [row.city, row.state, row.hotel_name, row.hotel_translated_name, row.addressline1, row.addressline2].join(' ');
    if (excludePattern.test(excludeText)) continue;
  }

  const hotelId = Number(row.hotel_id);
  const slug = `${slugPrefix}-${hotelId}`;
  if (!Number.isInteger(hotelId) || hotelId <= 0 || existingIds.has(String(hotelId)) || existingSlugs.has(slug)) continue;

  const reviewCount = Number(row.number_of_reviews || 0);
  const reviewScore = Number(row.rating_average || 0);
  if (reviewCount < minReviews || reviewScore < minReviewScore) continue;

  const hotelName = clean(row.hotel_translated_name || row.hotel_name);
  if (!hotelName) continue;
  if (maxHotelNameLength > 0 && hotelName.length > maxHotelNameLength) continue;
  if (excludeHotelNamePattern?.test(hotelName)) continue;

  rows.push({
    slug,
    hotelName,
    region,
    searchName: hotelName,
    naverName: hotelName,
    agodaHotelId: hotelId,
    fallbackAddress: clean([row.addressline1, row.addressline2, row.city, row.state].filter(Boolean).join(' ')),
    latitude: Number(row.latitude || 0) || undefined,
    longitude: Number(row.longitude || 0) || undefined,
    starRating: Number(row.star_rating || 0) || undefined,
    reviewScore,
    reviewCount,
    imageUrl: clean(row.photo1),
    landingUrl: `https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1927566&hid=${hotelId}`
  });
}

const selected = rows
  .sort((a, b) => scoreHotel(b) - scoreHotel(a))
  .slice(0, limit);

mkdirSync(path.dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(selected, null, 2)}\n`, 'utf8');

console.log(`Selected ${selected.length} ${region} hotels from ${rows.length} new candidates`);
console.table(selected.slice(0, 20).map((hotel, index) => ({
  rank: index + 1,
  slug: hotel.slug,
  hotelName: hotel.hotelName,
  reviewScore: hotel.reviewScore,
  reviewCount: hotel.reviewCount
})));

async function readHeaders() {
  const rows = createInterface({
    input: createReadStream(csvPath, { encoding: 'utf8' }),
    crlfDelay: Infinity
  });
  for await (const line of rows) {
    return parseCsvLine(line).map((value) => value.replace(/^\uFEFF/, ''));
  }
  return [];
}

function scoreHotel(hotel) {
  return (hotel.reviewCount || 0) * Math.max(0.1, hotel.reviewScore || 0);
}

function clean(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function parseCsvLine(line) {
  const result = [];
  let current = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];
    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}
