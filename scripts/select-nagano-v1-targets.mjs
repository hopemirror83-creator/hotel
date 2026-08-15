import { createReadStream } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { createInterface } from 'node:readline';

const csvPath = process.env.AGODA_CSV_PATH || '56A3C1A2-0531-49F3-8720-D7D4B1410E41_KO.csv';
const rows = createInterface({ input: createReadStream(csvPath, { encoding: 'utf8' }), crlfDelay: Infinity });
let headers = null;
const candidates = [];

for await (const line of rows) {
  if (!headers) { headers = parse(line).map((value) => value.replace(/^\uFEFF/, '')); continue; }
  const values = parse(line);
  if (values.length < headers.length) continue;
  const row = Object.fromEntries(headers.map((header, index) => [header, values[index] || '']));
  if (row.country !== '일본') continue;
  const latitude = Number(row.latitude || 0);
  const longitude = Number(row.longitude || 0);
  const address = clean([row.addressline1, row.addressline2, row.city, row.state].filter(Boolean).join(' '));
  if (latitude < 35.15 || latitude > 37.05 || longitude < 137.30 || longitude > 139.00 || !isLocal(address)) continue;
  const id = Number(row.hotel_id);
  const name = clean(row.hotel_translated_name || row.hotel_name);
  if (!Number.isInteger(id) || id <= 0 || !name) continue;
  candidates.push({ slug: `nagano-${id}`, hotelName: name, region: '나가노현', searchName: name, naverName: name, agodaHotelId: id, fallbackAddress: address, latitude, longitude, starRating: Number(row.star_rating || 0) || undefined, reviewScore: Number(row.rating_average || 0), reviewCount: Number(row.number_of_reviews || 0), imageUrl: clean(row.photo1), landingUrl: `https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1927566&hid=${id}` });
}

candidates.sort((a, b) => rank(b) - rank(a));
await writeFile('data/candidates-nagano-v1-all.json', `${JSON.stringify(candidates.slice(0, 1200), null, 2)}\n`, 'utf8');
console.log(`Selected ${Math.min(1200, candidates.length)} Nagano candidates from ${candidates.length} coordinate and address matches`);

function rank(hotel) { return (hotel.reviewCount || 0) * Math.max(0.1, hotel.reviewScore || 0); }
function clean(value) { return String(value || '').replace(/\s+/g, ' ').trim(); }
function isLocal(value) { return /\b(?:Nagano|Hakuba|Karuizawa|Matsumoto|Nozawa|Shiga Kogen|Yamanouchi|Yudanaka|Shibu|Kamikochi|Azumino|Suwa|Chino|Ueda|Komoro|Saku|Iiyama|Omachi|Kiso|Tateshina|Norikura|Madarao|Togakushi)\b|長野|白馬|軽井沢|松本|野沢|志賀高原|山ノ内|湯田中|渋温泉|上高地|安曇野|諏訪|茅野|上田|小諸|佐久|飯山|大町|木曽|蓼科|乗鞍|斑尾|戸隠|나가노|하쿠바|가루이자와|마쓰모토|노자와|시가고원|유다나카|시부온천|가미코치|아즈미노|스와|치노|우에다|고모로|사쿠|이야마|오마치|기소|다테시나|노리쿠라|마다라오|도가쿠시/i.test(value); }
function parse(line) { const result = []; let current = ''; let quoted = false; for (let i = 0; i < line.length; i += 1) { const char = line[i]; const next = line[i + 1]; if (char === '"' && quoted && next === '"') { current += '"'; i += 1; } else if (char === '"') quoted = !quoted; else if (char === ',' && !quoted) { result.push(current); current = ''; } else current += char; } result.push(current); return result; }
