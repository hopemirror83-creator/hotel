import { readFile, writeFile } from 'node:fs/promises';
const candidates = JSON.parse(await readFile('data/candidates-phuket-v1-all.json', 'utf8'));
const manifest = JSON.parse(await readFile('deploy-data/generated-hotels/manifest.json', 'utf8'));
const existing = [];
for (const file of manifest.files) existing.push(...JSON.parse(await readFile(`deploy-data/generated-hotels/${file.filename}`, 'utf8')));
const ids = new Set(existing.map(h => Number(String(h.slug).split('-').at(-1))).filter(Number.isFinite));
const names = new Set();
const eligible = candidates.filter(h => /^https?:\/\//i.test(h.imageUrl || '') && h.reviewCount >= 300 && h.reviewScore >= 8.0 && !ids.has(h.agodaHotelId))
  .filter(h => !/(?:아파트먼트|방갈로)\s*\(|\bApartment\b/i.test(h.hotelName))
  .filter(h => { const k = String(h.hotelName).toLowerCase().replace(/\([^)]*\)|\[[^\]]*\]/g, '').replace(/[^a-z0-9가-힣]/g, ''); if (!k || names.has(k)) return false; names.add(k); return true; });
const groups = [
  { max: 6, pattern: /Patong|빠통|파통/i },
  { max: 3, pattern: /Kata|카타|Karon|카론/i },
  { max: 2, pattern: /Mai Khao|마이카오|Naiyang|Nai Yang|나이양/i },
  { max: 2, pattern: /Kamala|카말라|Kalim|칼림/i },
  { max: 2, pattern: /Panwa|판와|Ao Yon|아오욘/i },
  { max: 2, pattern: /Rawai|라와이|Nai Harn|나이한/i },
  { max: 2, pattern: /Bang Tao|방타오|Cherngtalay|쳉탈레이/i }
];
const selectedIds = new Set();
for (const group of groups) {
  const matches = eligible.filter(h => group.pattern.test(`${h.hotelName} ${h.fallbackAddress}`) && !selectedIds.has(h.agodaHotelId)).slice(0, group.max);
  for (const hotel of matches) selectedIds.add(hotel.agodaHotelId);
}
for (const hotel of eligible) { if (selectedIds.size >= 20) break; selectedIds.add(hotel.agodaHotelId); }
const selected = eligible.filter(h => selectedIds.has(h.agodaHotelId)).map(h => ({ ...h, country: '태국', skipMapMatch: true }));
await writeFile('data/target-hotels-phuket-v1-quality.json', JSON.stringify(selected, null, 2) + '\n');
await writeFile('data/target-slugs-phuket-v1-quality.json', JSON.stringify(selected.map(h => h.slug), null, 2) + '\n');
console.log(`Selected ${selected.length} strict Phuket candidates from ${candidates.length}`);
