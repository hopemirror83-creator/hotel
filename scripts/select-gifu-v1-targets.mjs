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
  if (latitude < 35.10 || latitude > 36.55 || longitude < 136.20 || longitude > 137.75 || !isLocal(address)) continue;
  const id = Number(row.hotel_id);
  const name = clean(row.hotel_translated_name || row.hotel_name);
  if (!Number.isInteger(id) || id <= 0 || !name) continue;
  candidates.push({ slug: `gifu-${id}`, hotelName: name, region: '기후현', searchName: name, naverName: name, agodaHotelId: id, fallbackAddress: address, latitude, longitude, starRating: Number(row.star_rating || 0) || undefined, reviewScore: Number(row.rating_average || 0), reviewCount: Number(row.number_of_reviews || 0), imageUrl: clean(row.photo1), landingUrl: `https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1927566&hid=${id}` });
}

candidates.sort((a, b) => rank(b) - rank(a));
await writeFile('data/candidates-gifu-v1-all.json', `${JSON.stringify(candidates.slice(0, 1200), null, 2)}\n`, 'utf8');
console.log(`Selected ${Math.min(1200, candidates.length)} Gifu candidates from ${candidates.length} coordinate and address matches`);

function rank(hotel) { return (hotel.reviewCount || 0) * Math.max(0.1, hotel.reviewScore || 0); }
function clean(value) { return String(value || '').replace(/\s+/g, ' ').trim(); }
function isLocal(value) { return /\b(?:Gifu|Takayama|Hida|Shirakawa|Gero|Gujo|Okuhida|Hirayu|Shin-?Hotaka|Magome|Nakatsugawa|Ena|Ogaki|Minokamo|Seki|Mino|Kakamigahara)\b|岐阜|高山|飛騨|白川|下呂|郡上|奥飛騨|平湯|新穂高|馬籠|中津川|恵那|大垣|美濃加茂|関市|美濃市|各務原|기후|다카야마|히다|시라카와|게로|구조|오쿠히다|히라유|신호타카|마고메|나카쓰가와|에나|오가키|미노카모|세키|미노|가카미가하라/i.test(value); }
function parse(line) { const result = []; let current = ''; let quoted = false; for (let i = 0; i < line.length; i += 1) { const char = line[i]; const next = line[i + 1]; if (char === '"' && quoted && next === '"') { current += '"'; i += 1; } else if (char === '"') quoted = !quoted; else if (char === ',' && !quoted) { result.push(current); current = ''; } else current += char; } result.push(current); return result; }
