import { readFile, writeFile } from 'node:fs/promises';

const candidates = JSON.parse(await readFile('data/candidates-pattaya-v1-all.json', 'utf8'));
const manifest = JSON.parse(await readFile('deploy-data/generated-hotels/manifest.json', 'utf8'));
const existing = [];
for (const file of manifest.files) existing.push(...JSON.parse(await readFile(`deploy-data/generated-hotels/${file.filename}`, 'utf8')));
const ids = new Set(existing.map(h => Number(String(h.slug).split('-').at(-1))).filter(Number.isFinite));
const names = new Set();
const eligible = candidates.filter(h => /^https?:\/\//i.test(h.imageUrl || '') && h.reviewCount >= 300 && h.reviewScore >= 8 && !ids.has(h.agodaHotelId))
  .filter(h => !/(?:아파트먼트|방갈로)\s*\(|\bApartment\b|private room|프라이빗 룸/i.test(h.hotelName))
  .filter(h => { const key = String(h.hotelName).toLowerCase().replace(/\([^)]*\)|\[[^\]]*\]/g, '').replace(/[^a-z0-9가-힣]/g, ''); if (!key || names.has(key)) return false; names.add(key); return true; });
function area(h) {
  if (h.latitude >= 12.948) return 'north';
  if (h.latitude >= 12.928) return 'central';
  if (h.latitude >= 12.91) return 'south';
  if (h.latitude >= 12.87) return 'jomtien';
  return 'najomtien';
}
const groups = ['north', 'central', 'south', 'jomtien', 'najomtien'];
const selectedIds = new Set();
for (const group of groups) for (const hotel of eligible.filter(h => area(h) === group).slice(0, 4)) selectedIds.add(hotel.agodaHotelId);
const selected = eligible.filter(h => selectedIds.has(h.agodaHotelId)).map(h => ({ ...h, country: '태국', skipMapMatch: true }));
await writeFile('data/target-hotels-pattaya-v1-quality.json', JSON.stringify(selected, null, 2) + '\n');
await writeFile('data/target-slugs-pattaya-v1-quality.json', JSON.stringify(selected.map(h => h.slug), null, 2) + '\n');
console.log({ candidates: candidates.length, eligible: eligible.length, selected: selected.length, groups: Object.fromEntries(groups.map(group => [group, selected.filter(h => area(h) === group).length])) });
