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
  if (latitude < 20.05 || latitude > 20.52 || longitude < 105.72 || longitude > 106.12 || !isNinhBinh(address) || isOutlier(address)) continue;
  const id = Number(row.hotel_id);
  const name = clean(row.hotel_translated_name || row.hotel_name);
  if (!Number.isInteger(id) || id <= 0 || !name) continue;
  candidates.push({
    slug: `ninhbinh-${id}`,
    hotelName: name,
    region: '베트남 닌빈',
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
await writeFile('data/candidates-ninhbinh-v1-all.json', `${JSON.stringify(candidates.slice(0, 2500), null, 2)}\n`);
console.log(`Selected ${Math.min(2500, candidates.length)} Ninh Binh candidates from ${candidates.length} matches`);

function clean(value) { return String(value || '').replace(/\s+/g, ' ').trim(); }
function isNinhBinh(value) { return /Ninh Binh|Ninh Bình|닌빈|Tam Coc|Tam Cốc|땀꼭|Trang An|Tràng An|짱안|Hoa Lu|Hoa Lư|호아루|Gia Vien|Gia Viễn|Bai Dinh|Bái Đính/i.test(value); }
function isOutlier(value) { return /Hanoi|Ha Noi|Hà Nội|하노이|Ha Nam|Hà Nam|Nam Dinh|Nam Định|Thanh Hoa|Thanh Hóa|Mai Chau|Mai Châu/i.test(value); }
function parse(line) { const result=[]; let cell='', quoted=false; for(let i=0;i<line.length;i+=1){const char=line[i],next=line[i+1];if(char==='"'&&quoted&&next==='"'){cell+='"';i+=1;}else if(char==='"')quoted=!quoted;else if(char===','&&!quoted){result.push(cell);cell='';}else cell+=char;}result.push(cell);return result; }
