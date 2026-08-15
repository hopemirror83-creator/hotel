import { readFile, writeFile } from 'node:fs/promises';

const candidates = JSON.parse(await readFile('data/candidates-niigata-v1-all.json', 'utf8'));
const source = await readFile('src/data/generatedHotels.ts', 'utf8');
const match = source.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
const existingIds = new Set((match ? JSON.parse(match[1]) : []).map((hotel) => Number(String(hotel.slug).split('-').at(-1))).filter(Number.isFinite));
const selected = candidates.filter((hotel) => {
  const latitude = Number(hotel.latitude || 0);
  const longitude = Number(hotel.longitude || 0);
  const address = String(hotel.fallbackAddress || '');
  return latitude >= 36.65 && latitude <= 38.65 && longitude >= 137.55 && longitude <= 139.95 && isLocal(address) && !/Nagano|Gunma|Fukushima|Toyama|Yamagata|나가노|군마|후쿠시마|도야마|야마가타/i.test(address) && /^https?:\/\//i.test(String(hotel.imageUrl || '')) && Number(hotel.reviewCount || 0) >= 20 && Number(hotel.reviewScore || 0) >= 7.5 && !existingIds.has(Number(hotel.agodaHotelId));
}).sort((a, b) => Number(b.reviewCount || 0) * Number(b.reviewScore || 0) - Number(a.reviewCount || 0) * Number(a.reviewScore || 0)).slice(0, 200).map((hotel) => ({ ...hotel, country: '일본', skipMapMatch: true }));

await writeFile('data/target-hotels-niigata-v1-quality.json', `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
await writeFile('data/target-slugs-niigata-v1-quality.json', `${JSON.stringify(selected.map((hotel) => hotel.slug), null, 2)}\n`, 'utf8');
console.log(`Selected ${selected.length} strict Niigata candidates from ${candidates.length} ranked candidates`);
if (selected.length) console.log(`Minimum reviews: ${Math.min(...selected.map((hotel) => Number(hotel.reviewCount || 0)))}, minimum score: ${Math.min(...selected.map((hotel) => Number(hotel.reviewScore || 0)))}`);

function isLocal(value) { return /\b(?:Niigata|Yuzawa|Myoko|Nagaoka|Sado|Joetsu|Murakami|Shibata|Minamiuonuma|Uonuma|Tokamachi|Kashiwazaki|Tsubame|Sanjo|Naeba|Akakura|Iwamuro|Echigo)\b|新潟|湯沢|妙高|長岡|佐渡|上越|村上|新発田|南魚沼|魚沼|十日町|柏崎|燕|三条|苗場|赤倉|岩室|越後|니가타|유자와|묘코|나가오카|사도|조에쓰|무라카미|시바타|미나미우오누마|우오누마|토카마치|카시와자키|나에바|아카카라|이와무로|에치고/i.test(value); }
