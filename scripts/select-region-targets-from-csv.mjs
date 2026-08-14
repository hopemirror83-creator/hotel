import { createReadStream } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { createInterface } from 'node:readline';
import path from 'node:path';

const ROOT = process.cwd();
const csvPath = process.env.AGODA_CSV_PATH || '56A3C1A2-0531-49F3-8720-D7D4B1410E41_KO.csv';
const slugPrefix = process.env.SLUG_PREFIX || 'region';
const region = process.env.TARGET_REGION || slugPrefix;
const limit = Number(process.env.TARGET_LIMIT || '200');
const minReviews = Number(process.env.MIN_REVIEWS || '1');
const outputPath = process.env.TARGET_OUTPUT || path.join(ROOT, 'data', `target-hotels-${slugPrefix}-${limit}.json`);
const keywordPattern = new RegExp(process.env.TARGET_KEYWORDS || region, 'i');
const excludePattern = process.env.TARGET_EXCLUDE_KEYWORDS ? new RegExp(process.env.TARGET_EXCLUDE_KEYWORDS, 'i') : null;
const matchFields = (process.env.TARGET_MATCH_FIELDS || 'city,state,hotel_name,hotel_translated_name,addressline1,addressline2,overview')
  .split(',')
  .map((field) => field.trim())
  .filter(Boolean);
const minLatitude = optionalNumber(process.env.TARGET_MIN_LATITUDE);
const maxLatitude = optionalNumber(process.env.TARGET_MAX_LATITUDE);
const minLongitude = optionalNumber(process.env.TARGET_MIN_LONGITUDE);
const maxLongitude = optionalNumber(process.env.TARGET_MAX_LONGITUDE);

const rows = createInterface({
  input: createReadStream(csvPath, { encoding: 'utf8' }),
  crlfDelay: Infinity
});

let headers = null;
const candidates = [];

for await (const line of rows) {
  if (!headers) {
    headers = parseCsvLine(line).map((value) => value.replace(/^\uFEFF/, ''));
    continue;
  }

  const values = parseCsvLine(line);
  if (values.length < headers.length) continue;
  const row = Object.fromEntries(headers.map((header, index) => [header, values[index] || '']));
  if (row.country !== '대한민국') continue;
  if (!matchesTarget(row)) continue;

  const hotelId = Number(row.hotel_id);
  const reviewCount = Number(row.number_of_reviews || 0);
  const reviewScore = Number(row.rating_average || 0);
  if (!Number.isInteger(hotelId) || hotelId <= 0 || reviewCount < minReviews) continue;
  const latitude = Number(row.latitude || 0) || undefined;
  const longitude = Number(row.longitude || 0) || undefined;
  if (!matchesGeoBounds(latitude, longitude)) continue;

  const hotelName = clean(row.hotel_translated_name || row.hotel_name);
  if (!hotelName) continue;

  candidates.push({
    slug: `${slugPrefix}-${hotelId}`,
    hotelName,
    region,
    searchName: hotelName,
    naverName: hotelName,
    agodaHotelId: hotelId,
    fallbackAddress: clean([row.addressline1, row.addressline2, row.city, row.state].filter(Boolean).join(' ')),
    latitude,
    longitude,
    starRating: Number(row.star_rating || 0) || undefined,
    reviewScore,
    reviewCount,
    imageUrl: clean(row.photo1),
    landingUrl: `https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1927566&hid=${hotelId}`
  });
}

const selected = candidates
  .sort((a, b) => scoreHotel(b) - scoreHotel(a))
  .slice(0, limit);

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(selected, null, 2)}\n`, 'utf8');

console.log(`Selected ${selected.length} ${region} hotels from ${candidates.length} candidates`);
console.table(selected.slice(0, 20).map((hotel, index) => ({
  rank: index + 1,
  slug: hotel.slug,
  hotelName: hotel.hotelName,
  reviewScore: hotel.reviewScore,
  reviewCount: hotel.reviewCount
})));

function matchesTarget(row) {
  const text = matchFields.map((field) => row[field] || '').join(' ');
  if (!keywordPattern.test(text)) return false;
  if (!excludePattern) return true;
  const excludeText = [
    row.city,
    row.state,
    row.hotel_name,
    row.hotel_translated_name,
    row.addressline1,
    row.addressline2
  ].join(' ');
  return !excludePattern.test(excludeText);
}

function matchesGeoBounds(latitude, longitude) {
  if (minLatitude !== undefined && (!(latitude >= minLatitude))) return false;
  if (maxLatitude !== undefined && (!(latitude <= maxLatitude))) return false;
  if (minLongitude !== undefined && (!(longitude >= minLongitude))) return false;
  if (maxLongitude !== undefined && (!(longitude <= maxLongitude))) return false;
  return true;
}

function optionalNumber(value) {
  if (value === undefined || value === '') return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
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
