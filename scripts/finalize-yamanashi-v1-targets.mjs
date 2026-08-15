import { readFile, writeFile } from 'node:fs/promises';
const candidates = JSON.parse(await readFile('data/candidates-yamanashi-v1-all.json', 'utf8'));
const source = await readFile('src/data/generatedHotels.ts', 'utf8');
const match = source.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
const existingIds = new Set((match ? JSON.parse(match[1]) : []).map((hotel) => Number(String(hotel.slug).split('-').at(-1))).filter(Number.isFinite));
const selected = candidates.filter((hotel) => {
  const latitude = Number(hotel.latitude || 0); const longitude = Number(hotel.longitude || 0); const address = String(hotel.fallbackAddress || '');
  return latitude >= 35.15 && latitude <= 35.95 && longitude >= 138.15 && longitude <= 139.15 && isLocal(address) && !/Shizuoka|Kanagawa|Nagano|Tokyo|Saitama|Hakone|시즈오카|카나가와|나가노|도쿄|사이타마|하코네/i.test(address) && /^https?:\/\//i.test(String(hotel.imageUrl || '')) && Number(hotel.reviewCount || 0) >= 20 && Number(hotel.reviewScore || 0) >= 7.5 && !existingIds.has(Number(hotel.agodaHotelId));
}).sort((a, b) => Number(b.reviewCount || 0) * Number(b.reviewScore || 0) - Number(a.reviewCount || 0) * Number(a.reviewScore || 0)).slice(0, 200).map((hotel) => ({ ...hotel, country: '일본', skipMapMatch: true }));
await writeFile('data/target-hotels-yamanashi-v1-quality.json', `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
await writeFile('data/target-slugs-yamanashi-v1-quality.json', `${JSON.stringify(selected.map((hotel) => hotel.slug), null, 2)}\n`, 'utf8');
console.log(`Selected ${selected.length} strict Yamanashi candidates from ${candidates.length} ranked candidates`);
if (selected.length) console.log(`Minimum reviews: ${Math.min(...selected.map((hotel) => Number(hotel.reviewCount || 0)))}, minimum score: ${Math.min(...selected.map((hotel) => Number(hotel.reviewScore || 0)))}`);
function isLocal(value) { return /\b(?:Yamanashi|Kofu|Fujikawaguchiko|Kawaguchiko|Yamanakako|Fuefuki|Isawa|Hokuto|Kiyosato|Minobu|Otsuki|Koshu|Narusawa|Fujiyoshida|Fuji Five Lakes)\b|山梨|甲府|富士河口湖|河口湖|山中湖|笛吹|石和|北杜|清里|身延|大月|甲州|鳴沢|富士吉田|야마나시|고후|후지카와구치코|가와구치코|야마나카코|후에후키|이사와|호쿠토|기요사토|미노부|오쓰키|고슈|나루사와|후지요시다/i.test(value); }
