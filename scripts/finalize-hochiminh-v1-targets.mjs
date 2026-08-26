import { readFile, writeFile } from 'node:fs/promises';

const candidates = JSON.parse(await readFile('data/candidates-hochiminh-v1-all.json', 'utf8'));
const manifest = JSON.parse(await readFile('deploy-data/generated-hotels/manifest.json', 'utf8'));
const existing = [];
for (const file of manifest.files) existing.push(...JSON.parse(await readFile(`deploy-data/generated-hotels/${file.filename}`, 'utf8')));
const ids = new Set(existing.map((hotel) => Number(String(hotel.slug).split('-').at(-1))).filter(Number.isFinite));
const names = new Set();
const selected = candidates
  .filter((hotel) => Number(hotel.agodaHotelId) !== 148730)
  .filter((hotel) => !/Vung Tau|Vũng Tàu|붕따우|Bien Hoa|Biên Hòa|비엔호아|Thu Dau Mot|Thủ Dầu Một|Long An|Dong Nai|Đồng Nai|Binh Duong|Bình Dương/i.test(`${hotel.hotelName} ${hotel.fallbackAddress || ''}`))
  .filter((hotel) => /^https?:\/\//i.test(hotel.imageUrl || ''))
  .filter((hotel) => Number(hotel.reviewCount) >= 20 && Number(hotel.reviewScore) >= 7.5 && !ids.has(Number(hotel.agodaHotelId)))
  .filter((hotel) => { const key = normalize(hotel.hotelName); if (!key || names.has(key)) return false; names.add(key); return true; })
  .slice(0, 200)
  .map((hotel) => ({ ...hotel, country: '베트남', skipMapMatch: true }));

await writeFile('data/target-hotels-hochiminh-v1-quality.json', `${JSON.stringify(selected, null, 2)}\n`);
await writeFile('data/target-slugs-hochiminh-v1-quality.json', `${JSON.stringify(selected.map((hotel) => hotel.slug), null, 2)}\n`);
console.log(`Selected ${selected.length} strict Ho Chi Minh candidates from ${candidates.length} ranked candidates`);
if (selected.length) {
  console.log(`Minimum reviews: ${Math.min(...selected.map((hotel) => Number(hotel.reviewCount)))}, minimum score: ${Math.min(...selected.map((hotel) => Number(hotel.reviewScore)))}`);
  console.log(selected.slice(0, 20).map((hotel) => `${hotel.hotelName} | ${hotel.reviewCount} | ${hotel.reviewScore} | ${hotel.fallbackAddress}`).join('\n'));
}
function normalize(value) { return String(value || '').toLowerCase().replace(/\([^)]*\)|\[[^\]]*\]/g, '').replace(/[^a-z0-9가-힣]/g, ''); }


