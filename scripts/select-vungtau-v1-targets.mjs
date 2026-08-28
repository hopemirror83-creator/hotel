import { createReadStream } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { createInterface } from 'node:readline';

const csv = process.env.AGODA_CSV_PATH || '56A3C1A2-0531-49F3-8720-D7D4B1410E41_KO.csv';
const rows = createInterface({ input: createReadStream(csv, { encoding: 'utf8' }), crlfDelay: Infinity });
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
  if (row.country !== '베트남') continue;
  const latitude = Number(row.latitude) || 0;
  const longitude = Number(row.longitude) || 0;
  const address = clean([row.addressline1, row.addressline2, row.city, row.state].filter(Boolean).join(' '));
  if (latitude < 10.28 || latitude > 10.62 || longitude < 107.00 || longitude > 107.34 || !isVungTau(address) || isOutlier(address)) continue;
  const id = Number(row.hotel_id);
  const name = clean(row.hotel_translated_name || row.hotel_name);
  if (!Number.isInteger(id) || id <= 0 || !name) continue;
  candidates.push({
    slug: `vungtau-${id}`,
    hotelName: name,
    region: '베트남 붕따우·롱하이',
    searchName: name,
    naverName: name,
    agodaHotelId: id,
    fallbackAddress: address,
    latitude,
    longitude,
    starRating: Number(row.star_rating) || undefined,
    reviewScore: Number(row.rating_average) || 0,
    reviewCount: Number(row.number_of_reviews) || 0,
    imageUrl: clean(row.photo1),
    landingUrl: `https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1927566&hid=${id}`,
  });
}

candidates.sort((a, b) => (b.reviewCount * b.reviewScore) - (a.reviewCount * a.reviewScore));
await writeFile('data/candidates-vungtau-v1-all.json', `${JSON.stringify(candidates.slice(0, 2500), null, 2)}\n`);
console.log(`Selected ${Math.min(2500, candidates.length)} Vung Tau candidates from ${candidates.length} matches`);

function clean(value) { return String(value || '').replace(/\s+/g, ' ').trim(); }
function isVungTau(value) { return /Vung Tau|Vũng Tàu|붕따우|Ba Ria|Bà Rịa|바리아|Long Hai|Long Hải|롱하이|Ho Tram|Hồ Tràm|호짬|Ho Coc|Hồ Cốc|호꼭/i.test(value); }
function isOutlier(value) { return /Ho Chi Minh|Hồ Chí Minh|호치민|Mui Ne|Mũi Né|무이네|Phan Thiet|Phan Thiết|판티엣|Bien Hoa|Biên Hòa|비엔호아/i.test(value); }
function parse(line) {
  const result = [];
  let cell = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const current = line[index];
    const next = line[index + 1];
    if (current === '"' && quoted && next === '"') { cell += '"'; index += 1; }
    else if (current === '"') quoted = !quoted;
    else if (current === ',' && !quoted) { result.push(cell); cell = ''; }
    else cell += current;
  }
  result.push(cell);
  return result;
}
