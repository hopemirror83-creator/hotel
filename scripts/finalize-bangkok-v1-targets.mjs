import { readFile, writeFile } from 'node:fs/promises';

const candidates = JSON.parse(await readFile('data/candidates-bangkok-v1-all.json', 'utf8'));
const manifest = JSON.parse(await readFile('deploy-data/generated-hotels/manifest.json', 'utf8'));
const existing = [];
for (const file of manifest.files) existing.push(...JSON.parse(await readFile(`deploy-data/generated-hotels/${file.filename}`, 'utf8')));
const ids = new Set(existing.map(h => Number(String(h.slug).split('-').at(-1))).filter(Number.isFinite));
const names = new Set();
const eligible = candidates.filter(h => /^https?:\/\//i.test(h.imageUrl || '') && h.reviewCount >= 300 && h.reviewScore >= 8 && !ids.has(h.agodaHotelId))
  .filter(h => !/(?:아파트먼트|방갈로)\s*\(|\bApartment\b|private room|프라이빗 룸/i.test(h.hotelName))
  .filter(h => { const key = String(h.hotelName).toLowerCase().replace(/\([^)]*\)|\[[^\]]*\]/g, '').replace(/[^a-z0-9가-힣]/g, ''); if (!key || names.has(key)) return false; names.add(key); return true; });
function area(h) {
  const lat = h.latitude, lon = h.longitude;
  if (lat >= 13.75 && lat < 13.775 && lon < 100.515) return 'oldtown';
  if (lat < 13.75 && lon < 100.515) return 'riverside';
  if (lat < 13.735 && lon >= 100.515 && lon < 100.55) return 'silom';
  if (lat >= 13.735 && lat < 13.77 && lon >= 100.525 && lon < 100.55) return 'siam';
  if (lat >= 13.72 && lat < 13.77 && lon >= 100.55) return 'sukhumvit';
  return 'other';
}
const groups = ['sukhumvit', 'siam', 'silom', 'riverside', 'oldtown'];
const selectedIds = new Set();
for (const group of groups) for (const hotel of eligible.filter(h => area(h) === group).slice(0, 4)) selectedIds.add(hotel.agodaHotelId);
const selected = eligible.filter(h => selectedIds.has(h.agodaHotelId)).map(h => ({ ...h, country: '태국', skipMapMatch: true }));
await writeFile('data/target-hotels-bangkok-v1-quality.json', JSON.stringify(selected, null, 2) + '\n');
await writeFile('data/target-slugs-bangkok-v1-quality.json', JSON.stringify(selected.map(h => h.slug), null, 2) + '\n');
console.log({ candidates: candidates.length, eligible: eligible.length, selected: selected.length, groups: Object.fromEntries(groups.map(group => [group, selected.filter(h => area(h) === group).length])) });
