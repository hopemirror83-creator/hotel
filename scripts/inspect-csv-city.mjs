import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

const csvPath = process.env.AGODA_CSV_PATH || '56A3C1A2-0531-49F3-8720-D7D4B1410E41_KO.csv';
const needle = process.env.CITY_NEEDLE || '서울';
const limit = Number(process.env.SAMPLE_LIMIT || '12');

const rows = createInterface({
  input: createReadStream(csvPath, { encoding: 'utf8' }),
  crlfDelay: Infinity
});

let headers = null;
let count = 0;
const samples = [];
const cityCounts = new Map();
const stateCounts = new Map();

for await (const line of rows) {
  if (!headers) {
    headers = parseCsvLine(line).map((value) => value.replace(/^\uFEFF/, ''));
    continue;
  }
  const values = parseCsvLine(line);
  if (values.length < headers.length) continue;
  const row = Object.fromEntries(headers.map((header, index) => [header, values[index] || '']));
  const text = `${row.country} ${row.city} ${row.state} ${row.hotel_name} ${row.hotel_translated_name} ${row.addressline1}`;
  if (!text.includes(needle)) continue;
  if (row.country !== '대한민국') continue;

  count += 1;
  cityCounts.set(row.city, (cityCounts.get(row.city) || 0) + 1);
  stateCounts.set(row.state, (stateCounts.get(row.state) || 0) + 1);
  if (samples.length < limit) {
    samples.push({
      hotel_id: row.hotel_id,
      hotel_name: row.hotel_translated_name || row.hotel_name,
      city: row.city,
      state: row.state,
      reviews: Number(row.number_of_reviews || 0),
      rating: Number(row.rating_average || 0),
      address: row.addressline1
    });
  }
}

console.log(JSON.stringify({
  needle,
  count,
  cityCounts: Object.fromEntries([...cityCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15)),
  stateCounts: Object.fromEntries([...stateCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15)),
  samples
}, null, 2));

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
