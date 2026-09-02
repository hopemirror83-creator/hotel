import { createReadStream } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { createInterface } from 'node:readline';

const csv = process.env.AGODA_CSV_PATH || '56A3C1A2-0531-49F3-8720-D7D4B1410E41_KO.csv';
const rows = createInterface({ input: createReadStream(csv, { encoding: 'utf8' }), crlfDelay: Infinity });
let headers = null;
const candidates = [];

for await (const line of rows) {
  if (!headers) { headers = parse(line).map((value) => value.replace(/^\uFEFF/, '')); continue; }
  const values = parse(line);
  if (values.length < headers.length) continue;
  const row = Object.fromEntries(headers.map((header, index) => [header, values[index] || '']));
  if (row.country !== '베트남') continue;
  const latitude = Number(row.latitude) || 0;
  const longitude = Number(row.longitude) || 0;
  const address = clean([row.addressline1, row.addressline2, row.city, row.state].filter(Boolean).join(' '));
  if (latitude < 19.25 || latitude > 20.75 || longitude < 104.25 || longitude > 106.25 || !isRegion(address) || isOutlier(address)) continue;
  const id = Number(row.hotel_id);
  const name = clean(row.hotel_translated_name || row.hotel_name);
  if (!Number.isInteger(id) || id <= 0 || !name) continue;
  candidates.push({ slug: `thanhhoa-${id}`, hotelName: name, region: '베트남 타인호아', searchName: name, naverName: name, agodaHotelId: id, fallbackAddress: address, latitude, longitude, starRating: Number(row.star_rating) || undefined, reviewScore: Number(row.rating_average) || 0, reviewCount: Number(row.number_of_reviews) || 0, imageUrl: clean(row.photo1), landingUrl: `https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1927566&hid=${id}` });
}

candidates.sort((a, b) => (b.reviewCount * b.reviewScore) - (a.reviewCount * a.reviewScore));
await writeFile('data/candidates-thanhhoa-v1-all.json', `${JSON.stringify(candidates.slice(0, 3000), null, 2)}\n`);
console.log(`Selected ${Math.min(3000, candidates.length)} Thanh Hoa candidates from ${candidates.length} matches`);

function clean(value) { return String(value || '').replace(/\s+/g, ' ').trim(); }
function isRegion(value) { return /Thanh Hoa|Quảng Bình|꽝빈|Dong Hoi|Đồng Hới|동허이|Phong Nha|퐁냐|Bo Trach|Bố Trạch|바돈|Ba Don/i.test(value); }
function isOutlier(value) { return /Ninh Binh|Ninh Bình|닌빈|Nghe An|Nghệ An|응에안|Hanoi|Hà Nội|하노이/i.test(value); }
function parse(line) { const result = []; let cell = '', quoted = false; for (let index = 0; index < line.length; index++) { const char = line[index], next = line[index + 1]; if (char === '"' && quoted && next === '"') { cell += '"'; index++; } else if (char === '"') quoted = !quoted; else if (char === ',' && !quoted) { result.push(cell); cell = ''; } else cell += char; } result.push(cell); return result; }
