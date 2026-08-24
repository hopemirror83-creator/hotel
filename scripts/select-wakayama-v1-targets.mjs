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
  const latitude = Number(row.latitude || 0);
  const longitude = Number(row.longitude || 0);
  const address = clean([row.addressline1, row.addressline2, row.city, row.state].filter(Boolean).join(' '));
  if (latitude < 33.35 || latitude > 34.45 || longitude < 134.95 || longitude > 136.05 || !isWakayama(address)) continue;
  const hotelId = Number(row.hotel_id);
  const hotelName = clean(row.hotel_translated_name || row.hotel_name);
  if (!Number.isInteger(hotelId) || hotelId <= 0 || !hotelName) continue;
  candidates.push({ slug: `wakayama-${hotelId}`, hotelName, region: '와카야마현', searchName: hotelName, naverName: hotelName, agodaHotelId: hotelId, fallbackAddress: address, latitude, longitude, starRating: Number(row.star_rating || 0) || undefined, reviewScore: Number(row.rating_average || 0), reviewCount: Number(row.number_of_reviews || 0), imageUrl: clean(row.photo1), landingUrl: `https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1927566&hid=${hotelId}` });
}

candidates.sort((a, b) => rank(b) - rank(a));
await writeFile('data/candidates-wakayama-v1-all.json', `${JSON.stringify(candidates.slice(0, 1500), null, 2)}\n`);
console.log(`Selected ${Math.min(1500, candidates.length)} Wakayama candidates from ${candidates.length} coordinate and address matches`);

function rank(hotel) { return (hotel.reviewCount || 0) * Math.max(0.1, hotel.reviewScore || 0); }
function clean(value) { return String(value || '').replace(/\s+/g, ' ').trim(); }
function isWakayama(value) { return /\b(?:Wakayama|Shirahama|Koyasan|Koya|Tanabe|Nachikatsuura|Katsuura|Kushimoto|Shingu|Arida|Yuasa|Minabe|Ryujin|Hongu|Kumano|Susami|Gobo)\b|和歌山|白浜|高野山|高野|田辺|那智勝浦|勝浦|串本|新宮|有田|湯浅|みなべ|龍神|本宮|熊野|すさみ|御坊|와카야마|시라하마|고야산|고야|다나베|나치카쓰우라|가쓰우라|구시모토|신구|아리다|유아사|미나베|류진|혼구|구마노|스사미|고보/i.test(value); }
function parseCsvLine(line) { const result = []; let current = ''; let quoted = false; for (let index = 0; index < line.length; index += 1) { const char = line[index]; const next = line[index + 1]; if (char === '"' && quoted && next === '"') { current += '"'; index += 1; } else if (char === '"') quoted = !quoted; else if (char === ',' && !quoted) { result.push(current); current = ''; } else current += char; } result.push(current); return result; }
