import { readFile, writeFile } from 'node:fs/promises';
const candidates = JSON.parse(await readFile('data/candidates-soctrang-v1-all.json', 'utf8'));
const manifest = JSON.parse(await readFile('deploy-data/generated-hotels/manifest.json', 'utf8'));
const existing = [];
for (const file of manifest.files) existing.push(...JSON.parse(await readFile(`deploy-data/generated-hotels/${file.filename}`, 'utf8')));
const ids = new Set(existing.map(h => Number(String(h.slug).split('-').at(-1))).filter(Number.isFinite));
const names = new Set();
const selected = candidates.filter(h => /^https?:\/\//i.test(h.imageUrl || '') && h.reviewCount >= 15 && h.reviewScore >= 7.5 && !ids.has(h.agodaHotelId))
  .filter(h => !/(?:아파트먼트|방갈로)\s*\(|\bApartment\b/i.test(h.hotelName))
  .filter(h => { const k = String(h.hotelName).toLowerCase().replace(/\([^)]*\)|\[[^\]]*\]/g, '').replace(/[^a-z0-9가-힣]/g, ''); if (!k || names.has(k)) return false; names.add(k); return true; })
  .slice(0, 200).map(h => ({ ...h, country: '베트남', skipMapMatch: true }));
await writeFile('data/target-hotels-soctrang-v1-quality.json', JSON.stringify(selected, null, 2) + '\n');
await writeFile('data/target-slugs-soctrang-v1-quality.json', JSON.stringify(selected.map(h => h.slug), null, 2) + '\n');
console.log(`Selected ${selected.length} strict Soc Trang candidates from ${candidates.length}`);
