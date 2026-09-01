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
  if (latitude < 8.25 || latitude > 10.85 || longitude < 104.35 || longitude > 106.95) continue;
  if (!isMekong(address) || isOutlier(address)) continue;
  const id = Number(row.hotel_id);
  const name = clean(row.hotel_translated_name || row.hotel_name);
  if (!Number.isInteger(id) || id <= 0 || !name) continue;
  candidates.push({
    slug: `cantho-${id}`,
    hotelName: name,
    region: '베트남 껀터·메콩델타',
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
    landingUrl: `https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1927566&hid=${id}`
  });
}

candidates.sort((a, b) => (b.reviewCount * b.reviewScore) - (a.reviewCount * a.reviewScore));
await writeFile('data/candidates-cantho-v1-all.json', `${JSON.stringify(candidates.slice(0, 3000), null, 2)}\n`);
console.log(`Selected ${Math.min(3000, candidates.length)} Can Tho/Mekong candidates from ${candidates.length} matches`);

function clean(value) { return String(value || '').replace(/\s+/g, ' ').trim(); }
function isMekong(value) { return /Can Tho|Cần Thơ|껀터|An Giang|Chau Doc|Châu Đốc|쩌우독|Dong Thap|Đồng Tháp|Vinh Long|Vĩnh Long|Ben Tre|Bến Tre|My Tho|Mỹ Tho|Tien Giang|Tiền Giang|Tra Vinh|Trà Vinh|Soc Trang|Sóc Trăng|Bac Lieu|Bạc Liêu|Ca Mau|Cà Mau|Hau Giang|Hậu Giang|Rach Gia|Rạch Giá|Long Xuyen|Long Xuyên/i.test(value); }
function isOutlier(value) { return /Ho Chi Minh|Hồ Chí Minh|호찌민|Vung Tau|Vũng Tàu|붕따우|Phu Quoc|Phú Quốc|푸꾸옥|Con Dao|Côn Đảo|콘다오/i.test(value); }
function parse(line) { const result = []; let cell = ''; let quoted = false; for (let index = 0; index < line.length; index += 1) { const char = line[index], next = line[index + 1]; if (char === '"' && quoted && next === '"') { cell += '"'; index += 1; } else if (char === '"') quoted = !quoted; else if (char === ',' && !quoted) { result.push(cell); cell = ''; } else cell += char; } result.push(cell); return result; }
