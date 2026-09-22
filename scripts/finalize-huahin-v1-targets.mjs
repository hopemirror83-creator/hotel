import { readFile, writeFile } from 'node:fs/promises';

const candidates = JSON.parse(await readFile('data/candidates-huahin-v1-all.json', 'utf8'));
const manifest = JSON.parse(await readFile('deploy-data/generated-hotels/manifest.json', 'utf8'));
const existing = [];
for (const file of manifest.files) existing.push(...JSON.parse(await readFile(`deploy-data/generated-hotels/${file.filename}`, 'utf8')));
const ids = new Set(existing.map(hotel => Number(String(hotel.slug).split('-').at(-1))).filter(Number.isFinite));
const names = new Set();
const eligible = candidates
  .filter(hotel => /^https?:\/\//i.test(hotel.imageUrl || '') && hotel.reviewCount >= 300 && hotel.reviewScore >= 8 && !ids.has(hotel.agodaHotelId))
  .filter(hotel => !/(?:아파트먼트|방갈로|빌라)\s*\(|\bApartment\b|private room|프라이빗 룸/i.test(hotel.hotelName))
  .filter(hotel => {
    const key = String(hotel.hotelName).toLowerCase().replace(/\([^)]*\)|\[[^\]]*\]/g, '').replace(/[^a-z0-9가-힣]/g, '');
    if (!key || names.has(key)) return false;
    names.add(key);
    return true;
  });

function area(hotel) {
  if (hotel.latitude >= 12.65) return 'chaam';
  if (hotel.latitude < 12.45) return 'pranburi';
  if (hotel.latitude < 12.53) return 'takiab';
  return 'central';
}

const groups = ['central', 'takiab', 'chaam', 'pranburi'];
const selectedIds = new Set();
for (const group of groups) {
  for (const hotel of eligible.filter(candidate => area(candidate) === group).slice(0, 5)) selectedIds.add(hotel.agodaHotelId);
}
const selected = eligible.filter(hotel => selectedIds.has(hotel.agodaHotelId)).map(hotel => ({ ...hotel, country: '태국', skipMapMatch: true }));
await writeFile('data/target-hotels-huahin-v1-quality.json', `${JSON.stringify(selected, null, 2)}\n`);
await writeFile('data/target-slugs-huahin-v1-quality.json', `${JSON.stringify(selected.map(hotel => hotel.slug), null, 2)}\n`);
console.log({ candidates: candidates.length, eligible: eligible.length, selected: selected.length, groups: Object.fromEntries(groups.map(group => [group, selected.filter(hotel => area(hotel) === group).length])) });
