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
  if (latitude < 32.75 || latitude > 34.35 || longitude < 132.0 || longitude > 133.75 || !isEhime(address)) continue;

  const id = Number(row.hotel_id);
  const name = clean(row.hotel_translated_name || row.hotel_name);
  if (!Number.isInteger(id) || id <= 0 || !name) continue;
  candidates.push({
    slug: `ehime-${id}`,
    hotelName: name,
    region: '에히메현',
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
await writeFile('data/candidates-ehime-v1-all.json', `${JSON.stringify(candidates.slice(0, 1500), null, 2)}\n`);
console.log(`Selected ${Math.min(1500, candidates.length)} Ehime candidates from ${candidates.length} coordinate and address matches`);

function rank(hotel) {
  return (hotel.reviewCount || 0) * Math.max(0.1, hotel.reviewScore || 0);
}

function clean(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function isEhime(value) {
  return /Ehime|Matsuyama|Imabari|Uwajima|Saijo|Niihama|Ozu|Yawatahama|Shikokuchuo|Toon|Uchiko|Ikata|Ainan|愛媛|松山|今治|宇和島|西条|新居浜|大洲|八幡浜|四国中央|東温|内子|伊方|愛南|에히메|마쓰야마|마츠야마|이마바리|우와지마|사이조|니이하마|오즈|야와타하마|시코쿠추오|도온|우치코|이카타|아이난/i.test(value);
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
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === ',' && !quoted) {
      result.push(cell);
      cell = '';
    } else {
      cell += character;
    }
  }
  result.push(cell);
  return result;
}
