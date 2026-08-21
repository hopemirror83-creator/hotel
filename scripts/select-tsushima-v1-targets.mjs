import { createReadStream } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { createInterface } from 'node:readline';

const csvPath = process.env.AGODA_CSV_PATH || '56A3C1A2-0531-49F3-8720-D7D4B1410E41_KO.csv';
const rows = createInterface({ input: createReadStream(csvPath, { encoding: 'utf8' }), crlfDelay: Infinity });
let headers = null;
const candidates = [];

for await (const line of rows) {
  if (!headers) {
    headers = parse(line).map((value) => value.replace(/^\uFEFF/, ''));
    continue;
  }
  const values = parse(line);
  if (values.length < headers.length) continue;
  const row = Object.fromEntries(headers.map((header, index) => [header, values[index] || '']));
  if (row.country !== '일본') continue;

  const latitude = Number(row.latitude || 0);
  const longitude = Number(row.longitude || 0);
  const address = clean([row.addressline1, row.addressline2, row.city, row.state].filter(Boolean).join(' '));
  const isTsushimaCoordinate = latitude >= 33.95 && latitude <= 34.72 && longitude >= 129.15 && longitude <= 129.52;
  if (!isTsushimaCoordinate || !isTsushima(address)) continue;

  const id = Number(row.hotel_id);
  const name = clean(row.hotel_translated_name || row.hotel_name);
  if (!Number.isInteger(id) || id <= 0 || !name) continue;
  candidates.push({
    slug: `tsushima-${id}`,
    hotelName: name,
    region: '대마도',
    searchName: name,
    naverName: name,
    agodaHotelId: id,
    fallbackAddress: address,
    latitude,
    longitude,
    starRating: Number(row.star_rating || 0) || undefined,
    reviewScore: Number(row.rating_average || 0),
    reviewCount: Number(row.number_of_reviews || 0),
    imageUrl: clean(row.photo1),
    landingUrl: `https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1927566&hid=${id}`
  });
}

candidates.sort((a, b) => rank(b) - rank(a));
await writeFile('data/candidates-tsushima-v1-all.json', `${JSON.stringify(candidates, null, 2)}\n`);
console.log(`Selected ${candidates.length} exact Tsushima candidates`);

function rank(hotel) {
  return (hotel.reviewCount || 0) * Math.max(0.1, hotel.reviewScore || 0);
}

function isTsushima(value) {
  return /(?:^|[\s,])Tsushima(?:[\s,]|$)|対馬|대마도|쓰시마/i.test(value)
    && !/Matsushima|Komatsushima|松島|小松島/i.test(value);
}

function clean(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function parse(line) {
  const result = [];
  let cell = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const next = line[index + 1];
    if (character === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (character === '"') quoted = !quoted;
    else if (character === ',' && !quoted) {
      result.push(cell);
      cell = '';
    } else cell += character;
  }
  result.push(cell);
  return result;
}
