import { readFile, writeFile } from 'node:fs/promises';

const candidates = JSON.parse(await readFile('data/candidates-samui-v1-all.json', 'utf8'));
const manifest = JSON.parse(await readFile('deploy-data/generated-hotels/manifest.json', 'utf8'));
const existing = [];
for (const file of manifest.files) existing.push(...JSON.parse(await readFile(`deploy-data/generated-hotels/${file.filename}`, 'utf8')));
const ids = new Set(existing.map(h => Number(String(h.slug).split('-').at(-1))).filter(Number.isFinite));
const names = new Set();
const eligible = candidates.filter(h => /^https?:\/\//i.test(h.imageUrl || '') && h.reviewCount >= 200 && h.reviewScore >= 8 && !ids.has(h.agodaHotelId))
  .filter(h => !/(?:아파트먼트|방갈로)\s*\(|\bApartment\b|private room|프라이빗 룸/i.test(h.hotelName))
  .filter(h => { const key = String(h.hotelName).toLowerCase().replace(/\([^)]*\)|\[[^\]]*\]/g, '').replace(/[^a-z0-9가-힣]/g, ''); if (!key || names.has(key)) return false; names.add(key); return true; });
function area(h) {
  if (h.longitude < 99.98 || (h.latitude >= 9.56 && h.longitude >= 100.06)) return 'other';
  if (h.latitude < 9.51) return 'lamai';
  if (h.latitude < 9.55 && h.longitude >= 100.04) return 'chaweng';
  if (h.latitude >= 9.55 && h.longitude >= 100.02) return 'bophut';
  return 'maenam';
}
const groups = [
  { max: 4, accepts: h => area(h) === 'chaweng' },
  { max: 4, accepts: h => area(h) === 'bophut' },
  { max: 4, accepts: h => area(h) === 'lamai' },
  { max: 4, accepts: h => area(h) === 'maenam' },
  { max: 4, accepts: h => area(h) === 'other' }
];
const selectedIds = new Set();
for (const group of groups) for (const hotel of eligible.filter(h => group.accepts(h) && !selectedIds.has(h.agodaHotelId)).slice(0, group.max)) selectedIds.add(hotel.agodaHotelId);
const selected = eligible.filter(h => selectedIds.has(h.agodaHotelId)).map(h => ({ ...h, country: '태국', skipMapMatch: true }));
await writeFile('data/target-hotels-samui-v1-quality.json', JSON.stringify(selected, null, 2) + '\n');
await writeFile('data/target-slugs-samui-v1-quality.json', JSON.stringify(selected.map(h => h.slug), null, 2) + '\n');
console.log({ candidates: candidates.length, eligible: eligible.length, selected: selected.length, groups: groups.map(g => selected.filter(g.accepts).length) });
