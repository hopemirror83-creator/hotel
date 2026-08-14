import { createReadStream } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { createInterface } from 'node:readline';

const csvPath = process.env.AGODA_CSV_PATH || '56A3C1A2-0531-49F3-8720-D7D4B1410E41_KO.csv';
const rows = createInterface({ input: createReadStream(csvPath, { encoding: 'utf8' }), crlfDelay: Infinity });
let headers = null;
const candidates = [];

for await (const line of rows) {
  if (!headers) {
    headers = parseCsvLine(line).map((value) => value.replace(/^\uFEFF/, ''));
    continue;
  }
  const values = parseCsvLine(line);
  if (values.length < headers.length) continue;
  const row = Object.fromEntries(headers.map((header, index) => [header, values[index] || '']));
  if (row.country !== '일본') continue;

  const latitude = Number(row.latitude || 0);
  const longitude = Number(row.longitude || 0);
  const address = clean([row.addressline1, row.addressline2, row.city, row.state].filter(Boolean).join(' '));
  const inChiba = latitude >= 34.88 && latitude <= 36.12
    && longitude >= 139.72 && longitude <= 140.88;
  const mentionsChiba = hasChibaLocality(address);
  if (!inChiba || !mentionsChiba) continue;

  const hotelId = Number(row.hotel_id);
  const hotelName = clean(row.hotel_translated_name || row.hotel_name);
  if (!Number.isInteger(hotelId) || hotelId <= 0 || !hotelName) continue;

  candidates.push({
    slug: `chiba-${hotelId}`,
    hotelName,
    region: '지바·나리타',
    searchName: hotelName,
    naverName: hotelName,
    agodaHotelId: hotelId,
    fallbackAddress: address,
    latitude,
    longitude,
    starRating: Number(row.star_rating || 0) || undefined,
    reviewScore: Number(row.rating_average || 0),
    reviewCount: Number(row.number_of_reviews || 0),
    imageUrl: clean(row.photo1),
    landingUrl: `https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1927566&hid=${hotelId}`
  });
}

candidates.sort((a, b) => scoreHotel(b) - scoreHotel(a));
await writeFile('data/candidates-chiba-v1-all.json', `${JSON.stringify(candidates.slice(0, 500), null, 2)}\n`, 'utf8');
console.log(`Selected ${Math.min(500, candidates.length)} Chiba candidates from ${candidates.length} coordinate and address matches`);

function scoreHotel(hotel) {
  return (hotel.reviewCount || 0) * Math.max(0.1, hotel.reviewScore || 0);
}

function clean(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function hasChibaLocality(value) {
  return /\b(?:Chiba|Narita|Urayasu|Maihama|Makuhari|Kashiwa|Funabashi|Ichikawa|Kisarazu|Tateyama|Kamogawa)\b|千葉|成田|浦安|舞浜|幕張|치바|나리타|우라야스|마이하마|마쿠하리/i.test(value);
}

function parseCsvLine(line) {
  const result = [];
  let current = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];
    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}
