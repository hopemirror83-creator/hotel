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
  if (latitude < 40.20 || latitude > 41.58 || longitude < 139.45 || longitude > 141.72 || !local(address)) continue;
  const id = Number(row.hotel_id);
  const name = clean(row.hotel_translated_name || row.hotel_name);
  if (!Number.isInteger(id) || id <= 0 || !name) continue;
  candidates.push({
    slug: `aomori-${id}`,
    hotelName: name,
    region: '아오모리현',
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
await writeFile('data/candidates-aomori-v1-all.json', `${JSON.stringify(candidates.slice(0, 1500), null, 2)}\n`);
console.log(`Selected ${Math.min(1500, candidates.length)} Aomori candidates from ${candidates.length} coordinate and address matches`);

function rank(hotel) { return (hotel.reviewCount || 0) * Math.max(0.1, hotel.reviewScore || 0); }
function clean(value) { return String(value || '').replace(/\s+/g, ' ').trim(); }
function local(value) {
  return /\b(?:Aomori|Hirosaki|Hachinohe|Towada|Misawa|Mutsu|Goshogawara|Ajigasawa|Fukaura|Owani|Asamushi|Sukayu|Oirase|Shimokita)\b|青森|弘前|八戸|十和田|三沢|むつ|五所川原|鰺ヶ沢|深浦|大鰐|浅虫|酸ヶ湯|奥入瀬|下北|아오모리|히로사키|하치노헤|도와다|미사와|무쓰|고쇼가와라|아지가사와|후카우라|오와니|아사무시|스카유|오이라세/i.test(value);
}
function parse(line) {
  const result = [];
  let cell = '';
  let quoted = false;
  for (let index = 0; index < line.length; index++) {
    const character = line[index];
    const next = line[index + 1];
    if (character === '"' && quoted && next === '"') { cell += '"'; index++; }
    else if (character === '"') quoted = !quoted;
    else if (character === ',' && !quoted) { result.push(cell); cell = ''; }
    else cell += character;
  }
  result.push(cell);
  return result;
}
