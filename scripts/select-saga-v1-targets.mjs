import { createReadStream } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { createInterface } from 'node:readline';

const csvPath = process.env.AGODA_CSV_PATH || '56A3C1A2-0531-49F3-8720-D7D4B1410E41_KO.csv';
const rows = createInterface({ input: createReadStream(csvPath, { encoding: 'utf8' }), crlfDelay: Infinity });
let headers = null;
const candidates = [];
for await (const line of rows) {
  if (!headers) { headers = parseCsvLine(line).map((value) => value.replace(/^\uFEFF/, '')); continue; }
  const values = parseCsvLine(line);
  if (values.length < headers.length) continue;
  const row = Object.fromEntries(headers.map((header, index) => [header, values[index] || '']));
  if (row.country !== '일본') continue;
  const latitude = Number(row.latitude || 0); const longitude = Number(row.longitude || 0);
  const address = clean([row.addressline1, row.addressline2, row.city, row.state].filter(Boolean).join(' '));
  if (latitude < 32.85 || latitude > 33.65 || longitude < 129.7 || longitude > 130.65 || !isSaga(address)) continue;
  const hotelId = Number(row.hotel_id); const hotelName = clean(row.hotel_translated_name || row.hotel_name);
  if (!Number.isInteger(hotelId) || hotelId <= 0 || !hotelName) continue;
  candidates.push({ slug: `saga-${hotelId}`, hotelName, region: '사가현', searchName: hotelName, naverName: hotelName, agodaHotelId: hotelId, fallbackAddress: address, latitude, longitude, starRating: Number(row.star_rating || 0) || undefined, reviewScore: Number(row.rating_average || 0), reviewCount: Number(row.number_of_reviews || 0), imageUrl: clean(row.photo1), landingUrl: `https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1927566&hid=${hotelId}` });
}
candidates.sort((a, b) => rank(b) - rank(a));
await writeFile('data/candidates-saga-v1-all.json', `${JSON.stringify(candidates.slice(0, 1500), null, 2)}\n`);
console.log(`Selected ${Math.min(1500, candidates.length)} Saga candidates from ${candidates.length} coordinate and address matches`);
function rank(hotel) { return (hotel.reviewCount || 0) * Math.max(0.1, hotel.reviewScore || 0); }
function clean(value) { return String(value || '').replace(/\s+/g, ' ').trim(); }
function isSaga(value) { return /\b(?:Saga|Karatsu|Takeo|Ureshino|Kashima|Imari|Tosu|Arita|Ogi|Kanzaki|Yoshinogari)\b|佐賀|唐津|武雄|嬉野|鹿島|伊万里|鳥栖|有田|小城|神埼|吉野ヶ里|사가|가라쓰|다케오|우레시노|가시마|이마리|도스|아리타|오기|간자키|요시노가리/i.test(value); }
function parseCsvLine(line) { const result = []; let current = ''; let quoted = false; for (let index = 0; index < line.length; index += 1) { const char = line[index]; const next = line[index + 1]; if (char === '"' && quoted && next === '"') { current += '"'; index += 1; } else if (char === '"') quoted = !quoted; else if (char === ',' && !quoted) { result.push(current); current = ''; } else current += char; } result.push(current); return result; }
