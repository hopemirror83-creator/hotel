import { readFile, writeFile } from 'node:fs/promises';

const prefix = process.argv[2];
if (!prefix || !/^[a-z0-9-]+-$/.test(prefix)) {
  throw new Error('Pass a safe slug prefix ending with a hyphen.');
}

const path = 'data/generated/hotels.collected.json';
const data = JSON.parse(await readFile(path, 'utf8'));
const before = data.hotels.length;
data.hotels = data.hotels.filter((hotel) => !String(hotel.slug || '').startsWith(prefix));
data.reports = (data.reports || []).filter((report) => !String(report.slug || '').startsWith(prefix));
await writeFile(path, JSON.stringify(data, null, 2), 'utf8');
console.log(`Removed ${before - data.hotels.length} records with prefix ${prefix}`);
