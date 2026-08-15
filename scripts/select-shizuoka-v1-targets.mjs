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
  if (latitude < 34.50 || latitude > 35.65 || longitude < 137.45 || longitude > 139.25 || !isLocal(address)) continue;
  const id = Number(row.hotel_id);
  const name = clean(row.hotel_translated_name || row.hotel_name);
  if (!Number.isInteger(id) || id <= 0 || !name) continue;
  candidates.push({ slug: `shizuoka-${id}`, hotelName: name, region: '시즈오카현', searchName: name, naverName: name, agodaHotelId: id, fallbackAddress: address, latitude, longitude, starRating: Number(row.star_rating || 0) || undefined, reviewScore: Number(row.rating_average || 0), reviewCount: Number(row.number_of_reviews || 0), imageUrl: clean(row.photo1), landingUrl: `https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1927566&hid=${id}` });
}

candidates.sort((a, b) => rank(b) - rank(a));
await writeFile('data/candidates-shizuoka-v1-all.json', `${JSON.stringify(candidates.slice(0, 1500), null, 2)}\n`, 'utf8');
console.log(`Selected ${Math.min(1500, candidates.length)} Shizuoka candidates from ${candidates.length} coordinate and address matches`);

function rank(hotel) { return (hotel.reviewCount || 0) * Math.max(0.1, hotel.reviewScore || 0); }
function clean(value) { return String(value || '').replace(/\s+/g, ' ').trim(); }
function isLocal(value) { return /\b(?:Shizuoka|Hamamatsu|Atami|Izu|Ito|Shimoda|Fuji|Fujinomiya|Gotemba|Numazu|Mishima|Yaizu|Kakegawa|Kawazu|Higashiizu|Nishiizu|Omaezaki|Makinohara|Shuzenji|Dogashima|Toi|Izunokuni)\b|静岡|浜松|熱海|伊豆|伊東|下田|富士|富士宮|御殿場|沼津|三島|焼津|掛川|河津|東伊豆|西伊豆|御前崎|牧之原|修善寺|堂ヶ島|土肥|伊豆の国|시즈오카|하마마쓰|아타미|이즈|이토|시모다|후지|후지노미야|고텐바|누마즈|미시마|야이즈|가케가와|가와즈|히가시이즈|니시이즈|오마에자키|마키노하라|슈젠지|도가시마|토이/i.test(value); }
function parse(line) { const result = []; let current = ''; let quoted = false; for (let i = 0; i < line.length; i += 1) { const char = line[i]; const next = line[i + 1]; if (char === '"' && quoted && next === '"') { current += '"'; i += 1; } else if (char === '"') quoted = !quoted; else if (char === ',' && !quoted) { result.push(current); current = ''; } else current += char; } result.push(current); return result; }
