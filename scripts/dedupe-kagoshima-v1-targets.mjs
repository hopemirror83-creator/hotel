import { readFile, writeFile } from 'node:fs/promises';
const targetPath = 'data/target-hotels-kagoshima-v1-quality.json';
const hotels = JSON.parse(await readFile(targetPath, 'utf8'));
const seen = new Set();
const normalized = (value) => String(value || '').toLowerCase().replace(/[^0-9a-z가-힣]/g, '');
const unique = hotels.filter((hotel) => {
  const key = normalized(hotel.hotelName);
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});
await writeFile(targetPath, `${JSON.stringify(unique, null, 2)}\n`);
await writeFile('data/target-slugs-kagoshima-v1-quality.json', `${JSON.stringify(unique.map((hotel) => hotel.slug), null, 2)}\n`);
console.log({ before: hotels.length, after: unique.length, removed: hotels.length - unique.length });
