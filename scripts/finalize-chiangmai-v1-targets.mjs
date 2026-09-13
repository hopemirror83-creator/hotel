import { readFile, writeFile } from 'node:fs/promises';

const candidates = JSON.parse(await readFile('data/candidates-chiangmai-v1-all.json', 'utf8'));
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
  if (lat < 18.775 && lon >= 98.94 && lon < 98.995) return 'airport';
  if (lat >= 18.75 && lat < 18.825 && lon >= 99.003) return 'riverside';
  if (lat >= 18.785 && lon >= 98.94 && lon < 98.975) return 'nimman';
  if (lat >= 18.775 && lat < 18.8 && lon >= 98.978 && lon < 98.995) return 'oldcity';
  if (lat >= 18.775 && lat < 18.8 && lon >= 98.995 && lon < 99.003) return 'nightbazaar';
  return 'other';
}
const groups = ['oldcity', 'nimman', 'nightbazaar', 'riverside', 'airport'];
const selectedIds = new Set();
for (const group of groups) for (const hotel of eligible.filter(h => area(h) === group).slice(0, 4)) selectedIds.add(hotel.agodaHotelId);
const selected = eligible.filter(h => selectedIds.has(h.agodaHotelId)).map(h => ({ ...h, country: '태국', skipMapMatch: true }));
await writeFile('data/target-hotels-chiangmai-v1-quality.json', JSON.stringify(selected, null, 2) + '\n');
await writeFile('data/target-slugs-chiangmai-v1-quality.json', JSON.stringify(selected.map(h => h.slug), null, 2) + '\n');
console.log({ candidates: candidates.length, eligible: eligible.length, selected: selected.length, groups: Object.fromEntries(groups.map(group => [group, selected.filter(h => area(h) === group).length])) });
