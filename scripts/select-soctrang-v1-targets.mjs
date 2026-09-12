import { createReadStream } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { createInterface } from 'node:readline';

const csv = process.env.AGODA_CSV_PATH || '56A3C1A2-0531-49F3-8720-D7D4B1410E41_KO.csv';
const rows = createInterface({ input: createReadStream(csv, { encoding: 'utf8' }), crlfDelay: Infinity });
let headers;
const candidates = [];
for await (const line of rows) {
  if (!headers) { headers = parse(line).map(v => v.replace(/^\uFEFF/, '')); continue; }
  const values = parse(line);
  if (values.length < headers.length) continue;
  const row = Object.fromEntries(headers.map((h, i) => [h, values[i] || '']));
  if (row.country !== '베트남') continue;
  const latitude = Number(row.latitude) || 0, longitude = Number(row.longitude) || 0;
  const address = clean([row.addressline1, row.addressline2, row.city, row.state].filter(Boolean).join(' '));
  if (latitude < 9.1 || latitude > 10.05 || longitude < 105.5 || longitude > 106.4) continue;
  if (!/Soc Trang|Sóc Trăng|속짱|Vinh Chau|Vĩnh Châu|Nga Nam|Ngã Năm|Ke Sach|Kế Sách|My Xuyen|Mỹ Xuyên/i.test(address)) continue;
  if (/Tra Vinh|Trà Vinh|짜빈|Can Tho|Cần Thơ|껀터|Hau Giang|Hậu Giang|Bac Lieu|Bạc Liêu|박리에우/i.test(address)) continue;
  const id = Number(row.hotel_id), name = clean(row.hotel_translated_name || row.hotel_name);
  if (!Number.isInteger(id) || id <= 0 || !name) continue;
  candidates.push({ slug: `soctrang-${id}`, hotelName: name, region: '베트남 속짱', searchName: name, naverName: name, agodaHotelId: id, fallbackAddress: address, latitude, longitude, starRating: Number(row.star_rating) || undefined, reviewScore: Number(row.rating_average) || 0, reviewCount: Number(row.number_of_reviews) || 0, imageUrl: clean(row.photo1), landingUrl: `https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1927566&hid=${id}` });
}
candidates.sort((a, b) => b.reviewCount * b.reviewScore - a.reviewCount * a.reviewScore);
await writeFile('data/candidates-soctrang-v1-all.json', JSON.stringify(candidates, null, 2) + '\n');
console.log(`Selected ${candidates.length} Soc Trang candidates`);
function clean(v) { return String(v || '').replace(/\s+/g, ' ').trim(); }
function parse(line) { const r=[]; let c='',q=false; for(let i=0;i<line.length;i++){const x=line[i],n=line[i+1];if(x==='"'&&q&&n==='"'){c+='"';i++}else if(x==='"')q=!q;else if(x===','&&!q){r.push(c);c=''}else c+=x}r.push(c);return r; }
