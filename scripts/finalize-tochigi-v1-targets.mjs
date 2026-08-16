import { readFile, writeFile } from 'node:fs/promises';

const candidates = JSON.parse(await readFile('data/candidates-tochigi-v1-all.json', 'utf8'));
const source = await readFile('src/data/generatedHotels.ts', 'utf8');
const match = source.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
const existingIds = new Set((match ? JSON.parse(match[1]) : []).map((hotel) => Number(String(hotel.slug).split('-').at(-1))).filter(Number.isFinite));
const selected = candidates.filter((hotel) => {
  const latitude = Number(hotel.latitude || 0);
  const longitude = Number(hotel.longitude || 0);
  const address = String(hotel.fallbackAddress || '');
  return latitude >= 36.15 && latitude <= 37.20
    && longitude >= 139.25 && longitude <= 140.35
    && isLocal(address)
    && !/Gunma|Ibaraki|Saitama|Fukushima|군마|이바라키|사이타마|후쿠시마/i.test(address)
    && /^https?:\/\//i.test(String(hotel.imageUrl || ''))
    && Number(hotel.reviewCount || 0) >= 20
    && Number(hotel.reviewScore || 0) >= 7.5
    && !existingIds.has(Number(hotel.agodaHotelId));
}).sort((a, b) => Number(b.reviewCount || 0) * Number(b.reviewScore || 0) - Number(a.reviewCount || 0) * Number(a.reviewScore || 0))
  .slice(0, 200)
  .map((hotel) => ({ ...hotel, country: '일본', skipMapMatch: true }));

await writeFile('data/target-hotels-tochigi-v1-quality.json', `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
await writeFile('data/target-slugs-tochigi-v1-quality.json', `${JSON.stringify(selected.map((hotel) => hotel.slug), null, 2)}\n`, 'utf8');
console.log(`Selected ${selected.length} strict Tochigi candidates from ${candidates.length} ranked candidates`);
if (selected.length) console.log(`Minimum reviews: ${Math.min(...selected.map((hotel) => Number(hotel.reviewCount || 0)))}, minimum score: ${Math.min(...selected.map((hotel) => Number(hotel.reviewScore || 0)))}`);

function isLocal(value) {
  return /\b(?:Tochigi|Nikko|Kinugawa|Nasu|Utsunomiya|Oyama|Ashikaga|Sano|Mashiko|Moka|Shiobara|Yumoto Onsen|Itamuro)\b|栃木|日光|鬼怒川|那須|宇都宮|小山|足利|佐野|益子|真岡|塩原|湯元温泉|板室|도치기|닛코|기누가와|나스|우쓰노미야|오야마|아시카가|사노|마시코|모카|시오바라|유모토온천|이타무로/i.test(value);
}
