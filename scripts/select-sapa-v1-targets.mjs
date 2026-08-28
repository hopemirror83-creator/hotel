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
  if (latitude < 22.18 || latitude > 22.62 || longitude < 103.65 || longitude > 104.05 || !isSapa(address) || isOutlier(address)) continue;
  const id = Number(row.hotel_id);
  const name = clean(row.hotel_translated_name || row.hotel_name);
  if (!Number.isInteger(id) || id <= 0 || !name) continue;
  candidates.push({ slug:`sapa-${id}`, hotelName:name, region:'베트남 사파·라오까이', searchName:name, naverName:name, agodaHotelId:id, fallbackAddress:address, latitude, longitude, starRating:Number(row.star_rating)||undefined, reviewScore:Number(row.rating_average)||0, reviewCount:Number(row.number_of_reviews)||0, imageUrl:clean(row.photo1), landingUrl:`https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1927566&hid=${id}` });
}
candidates.sort((a,b)=>(b.reviewCount*b.reviewScore)-(a.reviewCount*a.reviewScore));
await writeFile('data/candidates-sapa-v1-all.json',`${JSON.stringify(candidates.slice(0,2500),null,2)}\n`);
console.log(`Selected ${Math.min(2500,candidates.length)} Sapa candidates from ${candidates.length} matches`);
function clean(v){return String(v||'').replace(/\s+/g,' ').trim()}
function isSapa(v){return /Sa Pa|Sapa|사파|Lao Cai|Lào Cai|라오까이|Fansipan|판시판|Muong Hoa|Mường Hoa|깟깟|Cat Cat|Cát Cát|Ta Van|Tả Van|Bac Ha|Bắc Hà/i.test(v)}
function isOutlier(v){return /Ha Giang|Hà Giang|하장|Yen Bai|Yên Bái|옌바이|Hanoi|Ha Noi|Hà Nội|하노이|Dien Bien|Điện Biên|디엔비엔/i.test(v)}
function parse(line){const r=[];let c='',q=false;for(let i=0;i<line.length;i++){const x=line[i],n=line[i+1];if(x==='"'&&q&&n==='"'){c+='"';i++}else if(x==='"')q=!q;else if(x===','&&!q){r.push(c);c=''}else c+=x}r.push(c);return r}
