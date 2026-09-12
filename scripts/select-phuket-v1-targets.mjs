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
  if (row.country !== '태국') continue;
  const latitude = Number(row.latitude) || 0, longitude = Number(row.longitude) || 0;
  const address = clean([row.addressline1, row.addressline2, row.city, row.state].filter(Boolean).join(' '));
  if (latitude < 7.65 || latitude > 8.25 || longitude < 98.15 || longitude > 98.55) continue;
  if (!/Phuket|푸껫|푸켓|Patong|빠통|Kata|카타|Karon|카론|Kamala|카말라|Rawai|라와이|Mai Khao|마이카오|Bang Tao|방타오|Chalong|찰롱/i.test(address)) continue;
  if (/Krabi|끄라비|Phang Nga|팡아/i.test(address)) continue;
  const id = Number(row.hotel_id), name = clean(row.hotel_translated_name || row.hotel_name);
  if (!Number.isInteger(id) || id <= 0 || !name) continue;
  candidates.push({ slug: `phuket-${id}`, hotelName: name, region: '베트남 푸껫', searchName: name, naverName: name, agodaHotelId: id, fallbackAddress: address, latitude, longitude, starRating: Number(row.star_rating) || undefined, reviewScore: Number(row.rating_average) || 0, reviewCount: Number(row.number_of_reviews) || 0, imageUrl: clean(row.photo1), landingUrl: `https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1927566&hid=${id}` });
}
candidates.sort((a, b) => b.reviewCount * b.reviewScore - a.reviewCount * a.reviewScore);
await writeFile('data/candidates-phuket-v1-all.json', JSON.stringify(candidates, null, 2) + '\n');
console.log(`Selected ${candidates.length} Phuket candidates`);
function clean(v) { return String(v || '').replace(/\s+/g, ' ').trim(); }
function parse(line) { const r=[]; let c='',q=false; for(let i=0;i<line.length;i++){const x=line[i],n=line[i+1];if(x==='"'&&q&&n==='"'){c+='"';i++}else if(x==='"')q=!q;else if(x===','&&!q){r.push(c);c=''}else c+=x}r.push(c);return r; }
