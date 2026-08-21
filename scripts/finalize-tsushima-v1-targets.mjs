import { readFile, writeFile } from 'node:fs/promises';

const candidates = JSON.parse(await readFile('data/candidates-tsushima-v1-all.json', 'utf8'));
const manifest = JSON.parse(await readFile('deploy-data/generated-hotels/manifest.json', 'utf8'));
const existing = [];
for (const file of manifest.files) {
  existing.push(...JSON.parse(await readFile(`deploy-data/generated-hotels/${file.filename}`, 'utf8')));
}
const existingIds = new Set(existing.map((hotel) => Number(String(hotel.slug).split('-').at(-1))).filter(Number.isFinite));
const selected = candidates
  .filter((hotel) => (
    /^https?:\/\//i.test(String(hotel.imageUrl || ''))
    && Number(hotel.reviewCount || 0) >= 20
    && Number(hotel.reviewScore || 0) >= 7.5
    && !existingIds.has(Number(hotel.agodaHotelId))
  ))
  .map((hotel) => ({ ...hotel, country: '일본', skipMapMatch: true }));

await writeFile('data/target-hotels-tsushima-v1-quality.json', `${JSON.stringify(selected, null, 2)}\n`);
await writeFile('data/target-slugs-tsushima-v1-quality.json', `${JSON.stringify(selected.map((hotel) => hotel.slug), null, 2)}\n`);
console.log(`Selected ${selected.length} strict Tsushima candidates from ${candidates.length} candidates`);
if (selected.length) {
  console.log(`Minimum reviews: ${Math.min(...selected.map((hotel) => Number(hotel.reviewCount || 0)))}`);
}
