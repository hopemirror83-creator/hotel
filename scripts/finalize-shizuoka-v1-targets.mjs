import { readFile, writeFile } from 'node:fs/promises';

const candidates = JSON.parse(await readFile('data/candidates-shizuoka-v1-all.json', 'utf8'));
const source = await readFile('src/data/generatedHotels.ts', 'utf8');
const match = source.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
const existingIds = new Set((match ? JSON.parse(match[1]) : []).map((hotel) => Number(String(hotel.slug).split('-').at(-1))).filter(Number.isFinite));
const selected = candidates.filter((hotel) => {
  const latitude = Number(hotel.latitude || 0);
  const longitude = Number(hotel.longitude || 0);
  const address = String(hotel.fallbackAddress || '');
  return latitude >= 34.50 && latitude <= 35.65 && longitude >= 137.45 && longitude <= 139.25 && isLocal(address) && !/Kanagawa|Yamanashi|Aichi|Nagano|Hakone|Odawara|카나가와|야마나시|아이치|나가노|하코네|오다와라/i.test(address) && /^https?:\/\//i.test(String(hotel.imageUrl || '')) && Number(hotel.reviewCount || 0) >= 20 && Number(hotel.reviewScore || 0) >= 7.5 && !existingIds.has(Number(hotel.agodaHotelId));
}).sort((a, b) => Number(b.reviewCount || 0) * Number(b.reviewScore || 0) - Number(a.reviewCount || 0) * Number(a.reviewScore || 0)).slice(0, 200).map((hotel) => ({ ...hotel, country: '일본', skipMapMatch: true }));

await writeFile('data/target-hotels-shizuoka-v1-quality.json', `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
await writeFile('data/target-slugs-shizuoka-v1-quality.json', `${JSON.stringify(selected.map((hotel) => hotel.slug), null, 2)}\n`, 'utf8');
console.log(`Selected ${selected.length} strict Shizuoka candidates from ${candidates.length} ranked candidates`);
if (selected.length) console.log(`Minimum reviews: ${Math.min(...selected.map((hotel) => Number(hotel.reviewCount || 0)))}, minimum score: ${Math.min(...selected.map((hotel) => Number(hotel.reviewScore || 0)))}`);

function isLocal(value) { return /\b(?:Shizuoka|Hamamatsu|Atami|Izu|Ito|Shimoda|Fuji|Fujinomiya|Gotemba|Numazu|Mishima|Yaizu|Kakegawa|Kawazu|Higashiizu|Nishiizu|Omaezaki|Makinohara|Shuzenji|Dogashima|Toi|Izunokuni)\b|静岡|浜松|熱海|伊豆|伊東|下田|富士|富士宮|御殿場|沼津|三島|焼津|掛川|河津|東伊豆|西伊豆|御前崎|牧之原|修善寺|堂ヶ島|土肥|伊豆の国|시즈오카|하마마쓰|아타미|이즈|이토|시모다|후지|후지노미야|고텐바|누마즈|미시마|야이즈|가케가와|가와즈|히가시이즈|니시이즈|오마에자키|마키노하라|슈젠지|도가시마|토이/i.test(value); }
