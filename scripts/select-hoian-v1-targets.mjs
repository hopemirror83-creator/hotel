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
  if (latitude < 15.78 || latitude > 16.08 || longitude < 108.20 || longitude > 108.48 || !isHoiAn(address)) continue;
  if (isOutlier(address)) continue;
  const id = Number(row.hotel_id);
  const name = clean(row.hotel_translated_name || row.hotel_name);
  if (!Number.isInteger(id) || id <= 0 || !name) continue;
  candidates.push({
    slug: `hoian-${id}`,
    hotelName: name,
    region: '베트남 호이안',
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
await writeFile('data/candidates-hoian-v1-all.json', `${JSON.stringify(candidates.slice(0, 2500), null, 2)}\n`);
console.log(`Selected ${Math.min(2500, candidates.length)} Hoi An candidates from ${candidates.length} coordinate and address matches`);

function clean(value) { return String(value || '').replace(/\s+/g, ' ').trim(); }
function isHoiAn(value) { return /Hoi An|Hội An|호이안|Quang Nam|Quảng Nam|꽝남|An Bang|An Bàng|Cua Dai|Cửa Đại|Cam Chau|Cẩm Châu|Cam Thanh|Cẩm Thanh|Cam Pho|Cẩm Phô|Minh An|Tan An|Tân An|Tra Que|Trà Quế/i.test(value); }
function isOutlier(value) { return /Da Nang|Danang|Đà Nẵng|다낭|Hue|Huế|후에|Tam Ky|Tam Kỳ|땀끼|Chu Lai|쭈라이|My Son|Mỹ Sơn/i.test(value); }
function parse(line) { const result = []; let current = ''; let quoted = false; for (let index = 0; index < line.length; index += 1) { const char = line[index]; const next = line[index + 1]; if (char === '"' && quoted && next === '"') { current += '"'; index += 1; } else if (char === '"') quoted = !quoted; else if (char === ',' && !quoted) { result.push(current); current = ''; } else current += char; } result.push(current); return result; }
