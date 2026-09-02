import { readFile, writeFile } from 'node:fs/promises';

const candidates = JSON.parse(await readFile('data/candidates-quangtri-v1-all.json', 'utf8'));
const manifest = JSON.parse(await readFile('deploy-data/generated-hotels/manifest.json', 'utf8'));
const existing = [];
for (const file of manifest.files) existing.push(...JSON.parse(await readFile(`deploy-data/generated-hotels/${file.filename}`, 'utf8')));
const ids = new Set(existing.map((hotel) => Number(String(hotel.slug).split('-').at(-1))).filter(Number.isFinite));
const names = new Set();
const selected = candidates
  .filter((hotel) => /^https?:\/\//i.test(hotel.imageUrl || ''))
  .filter((hotel) => Number(hotel.reviewCount) >= 20 && Number(hotel.reviewScore) >= 7.5 && !ids.has(Number(hotel.agodaHotelId)))
  .filter((hotel) => { const key = normalize(hotel.hotelName); if (!key || names.has(key)) return false; names.add(key); return true; })
  .slice(0, 200)
  .map((hotel) => ({ ...hotel, country: '베트남', skipMapMatch: true }));

await writeFile('data/target-hotels-quangtri-v1-quality.json', `${JSON.stringify(selected, null, 2)}\n`);
await writeFile('data/target-slugs-quangtri-v1-quality.json', `${JSON.stringify(selected.map((hotel) => hotel.slug), null, 2)}\n`);
console.log(`Selected ${selected.length} strict Quang Tri candidates from ${candidates.length}`);
if (selected.length) console.log(`Minimum reviews: ${Math.min(...selected.map((hotel) => Number(hotel.reviewCount)))}, minimum score: ${Math.min(...selected.map((hotel) => Number(hotel.reviewScore)))}`);

function normalize(value) { return String(value || '').toLowerCase().replace(/\([^)]*\)|\[[^\]]*\]/g, '').replace(/[^a-z0-9가-힣]/g, ''); }
