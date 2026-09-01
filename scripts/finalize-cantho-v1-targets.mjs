import { readFile, writeFile } from 'node:fs/promises';

const candidates = JSON.parse(await readFile('data/candidates-cantho-v1-all.json', 'utf8'));
const manifest = JSON.parse(await readFile('deploy-data/generated-hotels/manifest.json', 'utf8'));
const existing = [];
for (const file of manifest.files) existing.push(...JSON.parse(await readFile(`deploy-data/generated-hotels/${file.filename}`, 'utf8')));
const ids = new Set(existing.map((hotel) => Number(String(hotel.slug).split('-').at(-1))).filter(Number.isFinite));
const names = new Set();
const outlier = /Ho Chi Minh|Hồ Chí Minh|호찌민|Vung Tau|Vũng Tàu|붕따우|Phu Quoc|Phú Quốc|푸꾸옥|Con Dao|Côn Đảo|콘다오/i;
const selected = candidates
  .filter((hotel) => !outlier.test(`${hotel.hotelName} ${hotel.fallbackAddress || ''}`))
  .filter((hotel) => /^https?:\/\//i.test(hotel.imageUrl || ''))
  .filter((hotel) => Number(hotel.reviewCount) >= 20 && Number(hotel.reviewScore) >= 7.5 && !ids.has(Number(hotel.agodaHotelId)))
  .filter((hotel) => { const key = normalize(hotel.hotelName); if (!key || names.has(key)) return false; names.add(key); return true; })
  .slice(0, 200)
  .map((hotel) => ({ ...hotel, country: '베트남', skipMapMatch: true }));
await writeFile('data/target-hotels-cantho-v1-quality.json', `${JSON.stringify(selected, null, 2)}\n`);
await writeFile('data/target-slugs-cantho-v1-quality.json', `${JSON.stringify(selected.map((hotel) => hotel.slug), null, 2)}\n`);
console.log(`Selected ${selected.length} strict Can Tho/Mekong candidates from ${candidates.length}`);
if (selected.length) console.log(`Minimum reviews: ${Math.min(...selected.map((hotel) => Number(hotel.reviewCount)))}, minimum score: ${Math.min(...selected.map((hotel) => Number(hotel.reviewScore)))}`);
function normalize(value) { return String(value || '').toLowerCase().replace(/\([^)]*\)|\[[^\]]*\]/g, '').replace(/[^a-z0-9가-힣]/g, ''); }
