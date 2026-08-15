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
  if (latitude < 35.15 || latitude > 35.95 || longitude < 138.15 || longitude > 139.15 || !isLocal(address)) continue;
  const id = Number(row.hotel_id); const name = clean(row.hotel_translated_name || row.hotel_name);
  if (!Number.isInteger(id) || id <= 0 || !name) continue;
  candidates.push({ slug: `yamanashi-${id}`, hotelName: name, region: '야마나시현', searchName: name, naverName: name, agodaHotelId: id, fallbackAddress: address, latitude, longitude, starRating: Number(row.star_rating || 0) || undefined, reviewScore: Number(row.rating_average || 0), reviewCount: Number(row.number_of_reviews || 0), imageUrl: clean(row.photo1), landingUrl: `https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1927566&hid=${id}` });
}
candidates.sort((a, b) => rank(b) - rank(a));
await writeFile('data/candidates-yamanashi-v1-all.json', `${JSON.stringify(candidates.slice(0, 1500), null, 2)}\n`, 'utf8');
console.log(`Selected ${Math.min(1500, candidates.length)} Yamanashi candidates from ${candidates.length} coordinate and address matches`);
function rank(hotel) { return (hotel.reviewCount || 0) * Math.max(0.1, hotel.reviewScore || 0); }
function clean(value) { return String(value || '').replace(/\s+/g, ' ').trim(); }
function isLocal(value) { return /\b(?:Yamanashi|Kofu|Fujikawaguchiko|Kawaguchiko|Yamanakako|Fuefuki|Isawa|Hokuto|Kiyosato|Minobu|Otsuki|Koshu|Narusawa|Fujiyoshida|Fuji Five Lakes)\b|山梨|甲府|富士河口湖|河口湖|山中湖|笛吹|石和|北杜|清里|身延|大月|甲州|鳴沢|富士吉田|야마나시|고후|후지카와구치코|가와구치코|야마나카코|후에후키|이사와|호쿠토|기요사토|미노부|오쓰키|고슈|나루사와|후지요시다/i.test(value); }
function parse(line) { const result = []; let current = ''; let quoted = false; for (let i = 0; i < line.length; i += 1) { const char = line[i]; const next = line[i + 1]; if (char === '"' && quoted && next === '"') { current += '"'; i += 1; } else if (char === '"') quoted = !quoted; else if (char === ',' && !quoted) { result.push(current); current = ''; } else current += char; } result.push(current); return result; }
