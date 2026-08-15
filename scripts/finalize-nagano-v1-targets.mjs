import { readFile, writeFile } from 'node:fs/promises';

const candidates = JSON.parse(await readFile('data/candidates-nagano-v1-all.json', 'utf8'));
const source = await readFile('src/data/generatedHotels.ts', 'utf8');
const match = source.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
const existingIds = new Set((match ? JSON.parse(match[1]) : []).map((hotel) => Number(String(hotel.slug).split('-').at(-1))).filter(Number.isFinite));
const selected = candidates.filter((hotel) => {
  const latitude = Number(hotel.latitude || 0);
  const longitude = Number(hotel.longitude || 0);
  const address = String(hotel.fallbackAddress || '');
  return latitude >= 35.15 && latitude <= 37.05 && longitude >= 137.30 && longitude <= 139.00 && isLocal(address) && !/Niigata|Gunma|Toyama|Gifu|Yamanashi|Shizuoka|Aichi|니가타|군마|도야마|기후|야마나시|시즈오카|아이치/i.test(address) && /^https?:\/\//i.test(String(hotel.imageUrl || '')) && Number(hotel.reviewCount || 0) >= 20 && Number(hotel.reviewScore || 0) >= 7.5 && !existingIds.has(Number(hotel.agodaHotelId));
}).sort((a, b) => Number(b.reviewCount || 0) * Number(b.reviewScore || 0) - Number(a.reviewCount || 0) * Number(a.reviewScore || 0)).slice(0, 200).map((hotel) => ({ ...hotel, country: '일본', skipMapMatch: true }));

await writeFile('data/target-hotels-nagano-v1-quality.json', `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
await writeFile('data/target-slugs-nagano-v1-quality.json', `${JSON.stringify(selected.map((hotel) => hotel.slug), null, 2)}\n`, 'utf8');
console.log(`Selected ${selected.length} strict Nagano candidates from ${candidates.length} ranked candidates`);
if (selected.length) console.log(`Minimum reviews: ${Math.min(...selected.map((hotel) => Number(hotel.reviewCount || 0)))}, minimum score: ${Math.min(...selected.map((hotel) => Number(hotel.reviewScore || 0)))}`);

function isLocal(value) { return /\b(?:Nagano|Hakuba|Karuizawa|Matsumoto|Nozawa|Shiga Kogen|Yamanouchi|Yudanaka|Shibu|Kamikochi|Azumino|Suwa|Chino|Ueda|Komoro|Saku|Iiyama|Omachi|Kiso|Tateshina|Norikura|Madarao|Togakushi)\b|長野|白馬|軽井沢|松本|野沢|志賀高原|山ノ内|湯田中|渋温泉|上高地|安曇野|諏訪|茅野|上田|小諸|佐久|飯山|大町|木曽|蓼科|乗鞍|斑尾|戸隠|나가노|하쿠바|가루이자와|마쓰모토|노자와|시가고원|유다나카|시부온천|가미코치|아즈미노|스와|치노|우에다|고모로|사쿠|이야마|오마치|기소|다테시나|노리쿠라|마다라오|도가쿠시/i.test(value); }
