import { readFile, writeFile } from 'node:fs/promises';

const strictPath = 'data/target-hotels-chungnam-candidates-v3-strict.json';
const expandedPath = 'data/target-hotels-chungnam-candidates-v3-expanded.json';
const targetPath = 'data/target-hotels-chungnam-v3-200.json';
const slugPath = 'data/target-slugs-chungnam-v3-200.json';

const strict = JSON.parse(await readFile(strictPath, 'utf8'));
const expanded = JSON.parse(await readFile(expandedPath, 'utf8'));
const strictSlugs = new Set(strict.map((hotel) => hotel.slug));
const supplemental = expanded
  .filter((hotel) => !strictSlugs.has(hotel.slug))
  .sort((a, b) => (b.reviewCount * b.reviewScore) - (a.reviewCount * a.reviewScore));
const selected = [...strict, ...supplemental].slice(0, 200);

if (selected.length !== 200) throw new Error(`Expected 200 targets, got ${selected.length}`);

await writeFile(targetPath, `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
await writeFile(slugPath, `${JSON.stringify(selected.map((hotel) => hotel.slug), null, 2)}\n`, 'utf8');

console.log(JSON.stringify({
  selected: selected.length,
  strict: selected.filter((hotel) => strictSlugs.has(hotel.slug)).length,
  supplemental: selected.filter((hotel) => !strictSlugs.has(hotel.slug)).length,
  minReviews: Math.min(...selected.map((hotel) => hotel.reviewCount)),
  minScore: Math.min(...selected.map((hotel) => hotel.reviewScore))
}, null, 2));
