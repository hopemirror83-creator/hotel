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
  if (latitude < 36.15 || latitude > 37.20 || longitude < 139.25 || longitude > 140.35 || !isLocal(address)) continue;
  const id = Number(row.hotel_id);
  const name = clean(row.hotel_translated_name || row.hotel_name);
  if (!Number.isInteger(id) || id <= 0 || !name) continue;
  candidates.push({
    slug: `tochigi-${id}`,
    hotelName: name,
    region: '도치기현',
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
    landingUrl: `https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1927566&hid=${id}`,
  });
}

candidates.sort((a, b) => rank(b) - rank(a));
await writeFile('data/candidates-tochigi-v1-all.json', `${JSON.stringify(candidates.slice(0, 1500), null, 2)}\n`, 'utf8');
console.log(`Selected ${Math.min(1500, candidates.length)} Tochigi candidates from ${candidates.length} coordinate and address matches`);

function rank(hotel) { return (hotel.reviewCount || 0) * Math.max(0.1, hotel.reviewScore || 0); }
function clean(value) { return String(value || '').replace(/\s+/g, ' ').trim(); }
function isLocal(value) {
  return /\b(?:Tochigi|Nikko|Kinugawa|Nasu|Utsunomiya|Oyama|Ashikaga|Sano|Mashiko|Moka|Shiobara|Yumoto Onsen|Itamuro)\b|栃木|日光|鬼怒川|那須|宇都宮|小山|足利|佐野|益子|真岡|塩原|湯元温泉|板室|도치기|닛코|기누가와|나스|우쓰노미야|오야마|아시카가|사노|마시코|모카|시오바라|유모토온천|이타무로/i.test(value);
}
function parse(line) {
  const result = [];
  let current = '';
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];
    if (char === '"' && quoted && next === '"') { current += '"'; i += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === ',' && !quoted) { result.push(current); current = ''; }
    else current += char;
  }
  result.push(current);
  return result;
}
