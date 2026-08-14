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
  const inArea = latitude >= 35.08 && latitude <= 35.45 && longitude >= 138.88 && longitude <= 139.25;
  if (!inArea || !hasLocality(address)) continue;
  const hotelId = Number(row.hotel_id);
  const hotelName = clean(row.hotel_translated_name || row.hotel_name);
  if (!Number.isInteger(hotelId) || hotelId <= 0 || !hotelName) continue;
  candidates.push({ slug: `hakone-${hotelId}`, hotelName, region: '하코네·오다와라', searchName: hotelName, naverName: hotelName, agodaHotelId: hotelId, fallbackAddress: address, latitude, longitude, starRating: Number(row.star_rating || 0) || undefined, reviewScore: Number(row.rating_average || 0), reviewCount: Number(row.number_of_reviews || 0), imageUrl: clean(row.photo1), landingUrl: `https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1927566&hid=${hotelId}` });
}

candidates.sort((a, b) => scoreHotel(b) - scoreHotel(a));
await writeFile('data/candidates-hakone-v1-all.json', `${JSON.stringify(candidates.slice(0, 600), null, 2)}\n`, 'utf8');
console.log(`Selected ${Math.min(600, candidates.length)} Hakone candidates from ${candidates.length} coordinate and address matches`);
function scoreHotel(hotel) { return (hotel.reviewCount || 0) * Math.max(0.1, hotel.reviewScore || 0); }
function clean(value) { return String(value || '').replace(/\s+/g, ' ').trim(); }
function hasLocality(value) { return /\b(?:Hakone|Odawara|Yugawara|Manazuru|Gora|Sengokuhara|Miyanoshita|Kowakudani|Ashinoko|Moto-Hakone)\b|箱根|小田原|湯河原|真鶴|強羅|仙石原|宮ノ下|小涌谷|芦ノ湖|元箱根|하코네|오다와라|유가와라|마나즈루|고라|센고쿠하라/i.test(value); }
function parseCsvLine(line) { const result = []; let current = ''; let quoted = false; for (let index = 0; index < line.length; index += 1) { const char = line[index]; const next = line[index + 1]; if (char === '"' && quoted && next === '"') { current += '"'; index += 1; } else if (char === '"') quoted = !quoted; else if (char === ',' && !quoted) { result.push(current); current = ''; } else current += char; } result.push(current); return result; }
