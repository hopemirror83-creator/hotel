import { readFile, writeFile } from 'node:fs/promises';

const candidates = JSON.parse(await readFile('data/candidates-hakone-v1-all.json', 'utf8'));
const existingText = await readFile('src/data/generatedHotels.ts', 'utf8');
const existingMatch = existingText.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
const existingIds = new Set((existingMatch ? JSON.parse(existingMatch[1]) : []).map((hotel) => Number(String(hotel.slug).split('-').at(-1))).filter(Number.isFinite));

const selected = candidates.filter((hotel) => {
  const latitude = Number(hotel.latitude || 0); const longitude = Number(hotel.longitude || 0); const imageUrl = String(hotel.imageUrl || ''); const address = String(hotel.fallbackAddress || '');
  return latitude >= 35.08 && latitude <= 35.45 && longitude >= 138.88 && longitude <= 139.25 && hasLocality(address) && !/Shizuoka|Yamanashi|시즈오카|야마나시/i.test(address) && /^https?:\/\//i.test(imageUrl) && Number(hotel.reviewCount || 0) >= 20 && Number(hotel.reviewScore || 0) >= 7.5 && !existingIds.has(Number(hotel.agodaHotelId));
}).sort((a, b) => Number(b.reviewCount || 0) * Number(b.reviewScore || 0) - Number(a.reviewCount || 0) * Number(a.reviewScore || 0)).slice(0, 200).map((hotel) => ({ ...hotel, country: '일본', skipMapMatch: true }));

await writeFile('data/target-hotels-hakone-v1-quality.json', `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
await writeFile('data/target-slugs-hakone-v1-quality.json', `${JSON.stringify(selected.map((hotel) => hotel.slug), null, 2)}\n`, 'utf8');
console.log(`Selected ${selected.length} strict Hakone candidates from ${candidates.length} ranked candidates`);
if (selected.length) console.log(`Minimum reviews: ${Math.min(...selected.map((hotel) => Number(hotel.reviewCount || 0)))}, minimum score: ${Math.min(...selected.map((hotel) => Number(hotel.reviewScore || 0)))}`);
function hasLocality(value) { return /\b(?:Hakone|Odawara|Yugawara|Manazuru|Gora|Sengokuhara|Miyanoshita|Kowakudani|Ashinoko|Moto-Hakone)\b|箱根|小田原|湯河原|真鶴|強羅|仙石原|宮ノ下|小涌谷|芦ノ湖|元箱根|하코네|오다와라|유가와라|마나즈루|고라|센고쿠하라/i.test(value); }
