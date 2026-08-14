import { readFile, writeFile } from 'node:fs/promises';

const strict = JSON.parse(await readFile('data/target-hotels-incheon-v3-candidates-expanded.json', 'utf8'));
const broad = JSON.parse(await readFile('data/target-hotels-incheon-v3-candidates-broad.json', 'utf8'));
const seen = new Set();
const selected = [];
const excludedSlugs = new Set(['incheon-10583318']);

for (const hotel of [...strict, ...broad]) {
  if (excludedSlugs.has(hotel.slug)) continue;
  if (seen.has(hotel.slug)) continue;
  seen.add(hotel.slug);
  selected.push(hotel);
  if (selected.length === 200) break;
}

if (selected.length !== 200) {
  throw new Error(`Expected 200 Incheon targets, found ${selected.length}`);
}

await writeFile('data/target-hotels-incheon-v3-200.json', `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
await writeFile('data/target-slugs-incheon-v3-200.json', `${JSON.stringify(selected.map((hotel) => hotel.slug), null, 2)}\n`, 'utf8');

console.log(JSON.stringify({
  selected: selected.length,
  strict: selected.filter((hotel) => hotel.reviewScore >= 7).length,
  supplemental: selected.filter((hotel) => hotel.reviewScore < 7).length,
  minScore: Math.min(...selected.map((hotel) => hotel.reviewScore)),
  minReviews: Math.min(...selected.map((hotel) => hotel.reviewCount))
}, null, 2));
