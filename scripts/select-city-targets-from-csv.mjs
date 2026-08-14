import { createReadStream } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { createInterface } from 'node:readline';
import path from 'node:path';

const ROOT = process.cwd();
const csvPath = process.env.AGODA_CSV_PATH || '56A3C1A2-0531-49F3-8720-D7D4B1410E41_KO.csv';
const cityName = process.env.TARGET_CITY || '서울';
const slugPrefix = process.env.SLUG_PREFIX || romanizeCity(cityName);
const region = process.env.TARGET_REGION || cityName;
const limit = Number(process.env.TARGET_LIMIT || '200');
const minReviews = Number(process.env.MIN_REVIEWS || '1');
const outputPath = process.env.TARGET_OUTPUT || path.join(ROOT, 'data', `target-hotels-${slugPrefix}-${limit}.json`);

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
  if (!isTargetCity(row, cityName)) continue;

  const hotelId = Number(row.hotel_id);
  const reviewCount = Number(row.number_of_reviews || 0);
  const reviewScore = Number(row.rating_average || 0);
  if (!Number.isInteger(hotelId) || hotelId <= 0 || reviewCount < minReviews) continue;

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
    latitude: Number(row.latitude || 0) || undefined,
    longitude: Number(row.longitude || 0) || undefined,
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

console.log(`Selected ${selected.length} ${cityName} hotels from ${candidates.length} candidates`);
console.table(selected.slice(0, 20).map((hotel, index) => ({
  rank: index + 1,
  slug: hotel.slug,
  hotelName: hotel.hotelName,
  reviewScore: hotel.reviewScore,
  reviewCount: hotel.reviewCount
})));

function isTargetCity(row, target) {
  if (row.country !== '대한민국') return false;
  const text = `${row.city} ${row.state} ${row.hotel_name} ${row.hotel_translated_name} ${row.addressline1}`;
  if (target === '서울') return row.city === '서울';
  return text.includes(target);
}

function scoreHotel(hotel) {
  return (hotel.reviewCount || 0) * Math.max(0.1, hotel.reviewScore || 0);
}

function romanizeCity(value) {
  const map = {
    서울: 'seoul',
    부산: 'busan',
    제주: 'jeju',
    인천: 'incheon',
    경기: 'gyeonggi'
  };
  return map[value] || 'city';
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
