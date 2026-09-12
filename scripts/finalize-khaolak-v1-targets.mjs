import { readFile, writeFile } from 'node:fs/promises';

const candidates = JSON.parse(await readFile('data/candidates-khaolak-v1-all.json', 'utf8'));
const manifest = JSON.parse(await readFile('deploy-data/generated-hotels/manifest.json', 'utf8'));
const existing = [];
for (const file of manifest.files) existing.push(...JSON.parse(await readFile(`deploy-data/generated-hotels/${file.filename}`, 'utf8')));
const ids = new Set(existing.map(h => Number(String(h.slug).split('-').at(-1))).filter(Number.isFinite));
const names = new Set();
const eligible = candidates.filter(h => /^https?:\/\//i.test(h.imageUrl || '') && h.reviewCount >= 200 && h.reviewScore >= 8 && !ids.has(h.agodaHotelId))
  .filter(h => !/(?:아파트먼트|방갈로)\s*\(|\bApartment\b|private room|프라이빗 룸/i.test(h.hotelName))
  .filter(h => { const key = String(h.hotelName).toLowerCase().replace(/\([^)]*\)|\[[^\]]*\]/g, '').replace(/[^a-z0-9가-힣]/g, ''); if (!key || names.has(key)) return false; names.add(key); return true; });
const groups = [
  { max: 4, accepts: h => h.latitude < 8.635 },
  { max: 4, accepts: h => h.latitude >= 8.635 && h.latitude < 8.66 },
  { max: 4, accepts: h => h.latitude >= 8.66 && h.latitude < 8.69 },
  { max: 4, accepts: h => h.latitude >= 8.69 && h.latitude < 8.745 },
  { max: 4, accepts: h => h.latitude >= 8.745 }
];
const selectedIds = new Set();
for (const group of groups) {
  for (const hotel of eligible.filter(h => group.accepts(h) && !selectedIds.has(h.agodaHotelId)).slice(0, group.max)) selectedIds.add(hotel.agodaHotelId);
}
const selected = eligible.filter(h => selectedIds.has(h.agodaHotelId)).map(h => ({ ...h, country: '태국', skipMapMatch: true }));
await writeFile('data/target-hotels-khaolak-v1-quality.json', JSON.stringify(selected, null, 2) + '\n');
await writeFile('data/target-slugs-khaolak-v1-quality.json', JSON.stringify(selected.map(h => h.slug), null, 2) + '\n');
console.log({ candidates: candidates.length, eligible: eligible.length, selected: selected.length });
