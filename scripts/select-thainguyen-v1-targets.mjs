import { createReadStream } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { createInterface } from 'node:readline';

const csv = process.env.AGODA_CSV_PATH || '56A3C1A2-0531-49F3-8720-D7D4B1410E41_KO.csv';
const rows = createInterface({ input: createReadStream(csv, { encoding: 'utf8' }), crlfDelay: Infinity });
let headers = null;
const candidates = [];

for await (const line of rows) {
  if (!headers) { headers = parse(line).map((v) => v.replace(/^\uFEFF/, '')); continue; }
  const values = parse(line);
  if (values.length < headers.length) continue;
  const row = Object.fromEntries(headers.map((h, i) => [h, values[i] || '']));
  if (row.country !== '베트남') continue;
  const latitude = Number(row.latitude) || 0;
  const longitude = Number(row.longitude) || 0;
  const address = clean([row.addressline1, row.addressline2, row.city, row.state].filter(Boolean).join(' '));
  if (latitude < 21.25 || latitude > 22.15 || longitude < 105.35 || longitude > 106.35 || !isRegion(address) || isOutlier(address)) continue;
  const id = Number(row.hotel_id);
  const name = clean(row.hotel_translated_name || row.hotel_name);
  if (!Number.isInteger(id) || id <= 0 || !name || isOutlier(name)) continue;
  candidates.push({ slug: `thainguyen-${id}`, hotelName: name, region: '베트남 타이응웬', searchName: name, naverName: name, agodaHotelId: id, fallbackAddress: address, latitude, longitude, starRating: Number(row.star_rating) || undefined, reviewScore: Number(row.rating_average) || 0, reviewCount: Number(row.number_of_reviews) || 0, imageUrl: clean(row.photo1), landingUrl: `https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1927566&hid=${id}` });
}

candidates.sort((a, b) => (b.reviewCount * b.reviewScore) - (a.reviewCount * a.reviewScore));
await writeFile('data/candidates-thainguyen-v1-all.json', JSON.stringify(candidates.slice(0, 3000), null, 2) + '\n');
console.log(`Selected ${Math.min(3000, candidates.length)} Thai Nguyen candidates from ${candidates.length} matches`);

function clean(v) { return String(v || '').replace(/\s+/g, ' ').trim(); }
function isRegion(v) { return /Thai Nguyen|Thái Nguyên|타이응웬|Song Cong|Sông Công|Pho Yen|Phổ Yên|Nui Coc|Núi Cốc|누이꽕|Dai Tu|Đại Từ|Dinh Hoa|Định Hóa/i.test(v); }
function isOutlier(v) { return /Tuyen Quang|Tuyên Quang|뚸옌꽝|Bac Kan|Bắc Kạn|박깐|Bac Giang|Bắc Giang|박장|Bac Ninh|Bắc Ninh|박닌|Vinh Phuc|Vĩnh Phúc|빈푸용|Tam Dao|Tam Đảo|땀다오|Ha Noi|Hanoi|Hà Nội|하노이/i.test(v); }
function parse(line) { const r = []; let c = '', q = false; for (let i = 0; i < line.length; i++) { const x = line[i], n = line[i + 1]; if (x === '"' && q && n === '"') { c += '"'; i++; } else if (x === '"') q = !q; else if (x === ',' && !q) { r.push(c); c = ''; } else c += x; } r.push(c); return r; }
