import { createReadStream } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { createInterface } from 'node:readline';

const csvPath = process.env.AGODA_CSV_PATH || '56A3C1A2-0531-49F3-8720-D7D4B1410E41_KO.csv';
const rows = createInterface({ input: createReadStream(csvPath, { encoding: 'utf8' }), crlfDelay: Infinity });
let headers = null; const candidates = [];
for await (const line of rows) {
  if (!headers) { headers = parse(line).map((value) => value.replace(/^\uFEFF/, '')); continue; }
  const values = parse(line); if (values.length < headers.length) continue;
  const row = Object.fromEntries(headers.map((header, index) => [header, values[index] || '']));
  if (row.country !== '일본') continue;
  const latitude = Number(row.latitude || 0); const longitude = Number(row.longitude || 0);
  const address = clean([row.addressline1, row.addressline2, row.city, row.state].filter(Boolean).join(' '));
  if (latitude < 36.78 || latitude > 38.02 || longitude < 139.12 || longitude > 141.18 || !isLocal(address)) continue;
  const id = Number(row.hotel_id); const name = clean(row.hotel_translated_name || row.hotel_name);
  if (!Number.isInteger(id) || id <= 0 || !name) continue;
  candidates.push({ slug: `fukushima-${id}`, hotelName: name, region: '후쿠시마현', searchName: name, naverName: name, agodaHotelId: id, fallbackAddress: address, latitude, longitude, starRating: Number(row.star_rating || 0) || undefined, reviewScore: Number(row.rating_average || 0), reviewCount: Number(row.number_of_reviews || 0), imageUrl: clean(row.photo1), landingUrl: `https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1927566&hid=${id}` });
}
candidates.sort((a, b) => rank(b) - rank(a));
await writeFile('data/candidates-fukushima-v1-all.json', `${JSON.stringify(candidates.slice(0, 1500), null, 2)}\n`, 'utf8');
console.log(`Selected ${Math.min(1500, candidates.length)} Fukushima candidates from ${candidates.length} coordinate and address matches`);
function rank(hotel) { return (hotel.reviewCount || 0) * Math.max(0.1, hotel.reviewScore || 0); }
function clean(value) { return String(value || '').replace(/\s+/g, ' ').trim(); }
function isLocal(value) { return /\b(?:Fukushima|Koriyama|Aizuwakamatsu|Aizu|Iwaki|Bandai|Inawashiro|Kitakata|Soma|Shirakawa|Nihonmatsu|Minamiaizu|Urabandai|Higashiyama|Tsuchiyu|Iizaka|Onahama)\b|福島|郡山|会津若松|会津|いわき|磐梯|猪苗代|喜多方|相馬|白河|二本松|南会津|裏磐梯|東山|土湯|飯坂|小名浜|후쿠시마|고리야마|아이즈와카마쓰|아이즈|이와키|반다이|이나와시로|기타카타|소마|시라카와|니혼마쓰|미나미아이즈|우라반다이|히가시야마|쓰치유|이자카|오나하마/i.test(value); }
function parse(line) { const result = []; let current = ''; let quoted = false; for (let i = 0; i < line.length; i += 1) { const char = line[i]; const next = line[i + 1]; if (char === '"' && quoted && next === '"') { current += '"'; i += 1; } else if (char === '"') quoted = !quoted; else if (char === ',' && !quoted) { result.push(current); current = ''; } else current += char; } result.push(current); return result; }
