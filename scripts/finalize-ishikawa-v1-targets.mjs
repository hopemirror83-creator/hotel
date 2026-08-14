import { readFile, writeFile } from 'node:fs/promises';

const candidates = JSON.parse(await readFile('data/candidates-ishikawa-v1-all.json', 'utf8'));
const existingText = await readFile('src/data/generatedHotels.ts', 'utf8');
const existingMatch = existingText.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
const existingIds = new Set((existingMatch ? JSON.parse(existingMatch[1]) : []).map((hotel) => Number(String(hotel.slug).split('-').at(-1))).filter(Number.isFinite));

const selected = candidates.filter((hotel) => {
  const latitude = Number(hotel.latitude || 0); const longitude = Number(hotel.longitude || 0); const imageUrl = String(hotel.imageUrl || ''); const address = String(hotel.fallbackAddress || '');
  return latitude >= 36.02 && latitude <= 37.58 && longitude >= 136.18 && longitude <= 137.42 && hasLocality(address) && !/Toyama|Fukui|Gifu|도야마|후쿠이|기후/i.test(address) && /^https?:\/\//i.test(imageUrl) && Number(hotel.reviewCount || 0) >= 20 && Number(hotel.reviewScore || 0) >= 7.5 && !existingIds.has(Number(hotel.agodaHotelId));
}).sort((a, b) => Number(b.reviewCount || 0) * Number(b.reviewScore || 0) - Number(a.reviewCount || 0) * Number(a.reviewScore || 0)).slice(0, 200).map((hotel) => ({ ...hotel, country: '일본', skipMapMatch: true }));

await writeFile('data/target-hotels-ishikawa-v1-quality.json', `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
await writeFile('data/target-slugs-ishikawa-v1-quality.json', `${JSON.stringify(selected.map((hotel) => hotel.slug), null, 2)}\n`, 'utf8');
console.log(`Selected ${selected.length} strict Ishikawa candidates from ${candidates.length} ranked candidates`);
if (selected.length) console.log(`Minimum reviews: ${Math.min(...selected.map((hotel) => Number(hotel.reviewCount || 0)))}, minimum score: ${Math.min(...selected.map((hotel) => Number(hotel.reviewScore || 0)))}`);
function hasLocality(value) { return /\b(?:Ishikawa|Kanazawa|Kaga|Komatsu|Nanao|Wakura|Wajima|Hakusan|Noto|Suzu|Anamizu|Uchinada)\b|石川|金沢|加賀|小松|七尾|和倉|輪島|白山|能登|珠洲|穴水|内灘|이시카와|가나자와|가가|고마쓰|나나오|와쿠라|와지마|하쿠산|노토/i.test(value); }
