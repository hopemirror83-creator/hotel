import { readFile, writeFile } from 'node:fs/promises';

const sourcePath = 'data/target-hotels-jeonbuk-candidates-v3-expanded.json';
const targetPath = 'data/target-hotels-jeonbuk-v3-200.json';
const slugPath = 'data/target-slugs-jeonbuk-v3-200.json';

const candidates = JSON.parse(await readFile(sourcePath, 'utf8'));
const strict = candidates
  .filter((hotel) => Number(hotel.reviewScore) >= 7.5)
  .sort((a, b) => (b.reviewCount * b.reviewScore) - (a.reviewCount * a.reviewScore));
const supplemental = candidates
  .filter((hotel) => Number(hotel.reviewScore) >= 7 && Number(hotel.reviewScore) < 7.5)
  .sort((a, b) => (b.reviewCount * b.reviewScore) - (a.reviewCount * a.reviewScore));
const selected = [...strict, ...supplemental].slice(0, 200);

if (selected.length !== 200) throw new Error(`Expected 200 targets, got ${selected.length}`);

await writeFile(targetPath, `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
await writeFile(slugPath, `${JSON.stringify(selected.map((hotel) => hotel.slug), null, 2)}\n`, 'utf8');

console.log(JSON.stringify({
  selected: selected.length,
  strict: selected.filter((hotel) => hotel.reviewScore >= 7.5).length,
  supplemental: selected.filter((hotel) => hotel.reviewScore < 7.5).length,
  minReviews: Math.min(...selected.map((hotel) => hotel.reviewCount)),
  minScore: Math.min(...selected.map((hotel) => hotel.reviewScore))
}, null, 2));
