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
  if (latitude < 41.30 || latitude > 45.70 || longitude < 139.30 || longitude > 145.90 || !local(address)) continue;
  const id = Number(row.hotel_id);
  const name = clean(row.hotel_translated_name || row.hotel_name);
  if (!Number.isInteger(id) || id <= 0 || !name) continue;
  candidates.push({ slug: `hokkaido-${id}`, hotelName: name, region: '홋카이도', searchName: name, naverName: name, agodaHotelId: id, fallbackAddress: address, latitude, longitude, starRating: Number(row.star_rating || 0) || undefined, reviewScore: Number(row.rating_average || 0), reviewCount: Number(row.number_of_reviews || 0), imageUrl: clean(row.photo1), landingUrl: `https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1927566&hid=${id}` });
}
candidates.sort((a, b) => rank(b) - rank(a));
await writeFile('data/candidates-hokkaido-v1-all.json', `${JSON.stringify(candidates.slice(0, 3000), null, 2)}\n`);
console.log(`Selected ${Math.min(3000, candidates.length)} Hokkaido candidates from ${candidates.length} coordinate and address matches`);
function rank(hotel) { return (hotel.reviewCount || 0) * Math.max(0.1, hotel.reviewScore || 0); }
function clean(value) { return String(value || '').replace(/\s+/g, ' ').trim(); }
function local(value) { return /\b(?:Hokkaido|Otaru|Hakodate|Furano|Biei|Asahikawa|Niseko|Kutchan|Noboribetsu|Toyako|Obihiro|Kushiro|Abashiri|Shiretoko|Wakkanai|Chitose|Tomakomai|Rusutsu|Kiroro)\b|北海道|小樽|函館|富良野|美瑛|旭川|ニセコ|倶知安|登別|洞爺|帯広|釧路|網走|知床|稚内|千歳|苫小牧|留寿都|キロロ|홋카이도|오타루|하코다테|후라노|비에이|아사히카와|니세코|굿찬|노보리베츠|도야|오비히로|구시로|아바시리|시레토코|왓카나이|치토세|도마코마이|루스츠|키로로/i.test(value); }
function parse(line) { const result = []; let cell = ''; let quoted = false; for (let index = 0; index < line.length; index++) { const character = line[index], next = line[index + 1]; if (character === '"' && quoted && next === '"') { cell += '"'; index++; } else if (character === '"') quoted = !quoted; else if (character === ',' && !quoted) { result.push(cell); cell = ''; } else cell += character; } result.push(cell); return result; }
