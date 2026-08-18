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
  if (latitude < 35.72 || latitude > 36.30 || longitude < 138.70 || longitude > 140.02 || !isLocal(address)) continue;
  const id = Number(row.hotel_id);
  const name = clean(row.hotel_translated_name || row.hotel_name);
  if (!Number.isInteger(id) || id <= 0 || !name) continue;
  candidates.push({
    slug: `saitama-${id}`, hotelName: name, region: '사이타마현', searchName: name, naverName: name,
    agodaHotelId: id, fallbackAddress: address, latitude, longitude,
    starRating: Number(row.star_rating || 0) || undefined,
    reviewScore: Number(row.rating_average || 0), reviewCount: Number(row.number_of_reviews || 0),
    imageUrl: clean(row.photo1), landingUrl: `https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1927566&hid=${id}`,
  });
}

candidates.sort((a, b) => rank(b) - rank(a));
await writeFile('data/candidates-saitama-v1-all.json', `${JSON.stringify(candidates.slice(0, 1500), null, 2)}\n`, 'utf8');
console.log(`Selected ${Math.min(1500, candidates.length)} Saitama candidates from ${candidates.length} coordinate and address matches`);

function rank(hotel) { return (hotel.reviewCount || 0) * Math.max(0.1, hotel.reviewScore || 0); }
function clean(value) { return String(value || '').replace(/\s+/g, ' ').trim(); }
function isLocal(value) { return /\b(?:Saitama|Omiya|Urawa|Kawagoe|Tokorozawa|Chichibu|Kumagaya|Kawaguchi|Koshigaya|Kasukabe|Hanno|Wako|Asaka|Niiza|Honjo|Fukaya|Toda|Warabi|Ageo|Soka|Gyoda|Higashimatsuyama)\b|埼玉|大宮|浦和|川越|所沢|秩父|熊谷|川口|越谷|春日部|飯能|和光|朝霞|新座|本庄|深谷|戸田|蕨|上尾|草加|行田|東松山|사이타마|오미야|우라와|가와고에|도코로자와|지치부|구마가야|가와구치|고시가야|가스카베|한노|와코|아사카|니자|혼조|후카야/i.test(value); }
function parse(line) { const result = []; let current = ''; let quoted = false; for (let i = 0; i < line.length; i += 1) { const char = line[i]; const next = line[i + 1]; if (char === '"' && quoted && next === '"') { current += '"'; i += 1; } else if (char === '"') quoted = !quoted; else if (char === ',' && !quoted) { result.push(current); current = ''; } else current += char; } result.push(current); return result; }
