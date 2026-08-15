import { readFile, writeFile } from 'node:fs/promises';

const candidates = JSON.parse(await readFile('data/candidates-gifu-v1-all.json', 'utf8'));
const source = await readFile('src/data/generatedHotels.ts', 'utf8');
const match = source.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
const existingIds = new Set((match ? JSON.parse(match[1]) : []).map((hotel) => Number(String(hotel.slug).split('-').at(-1))).filter(Number.isFinite));
const selected = candidates.filter((hotel) => {
  const latitude = Number(hotel.latitude || 0);
  const longitude = Number(hotel.longitude || 0);
  const address = String(hotel.fallbackAddress || '');
  return latitude >= 35.10 && latitude <= 36.55 && longitude >= 136.20 && longitude <= 137.75 && isLocal(address) && !/Nagano|Toyama|Ishikawa|Fukui|Aichi|Shiga|Mie|Yamanashi|나가노|도야마|이시카와|후쿠이|아이치|시가|미에|야마나시/i.test(address) && /^https?:\/\//i.test(String(hotel.imageUrl || '')) && Number(hotel.reviewCount || 0) >= 20 && Number(hotel.reviewScore || 0) >= 7.5 && !existingIds.has(Number(hotel.agodaHotelId));
}).sort((a, b) => Number(b.reviewCount || 0) * Number(b.reviewScore || 0) - Number(a.reviewCount || 0) * Number(a.reviewScore || 0)).slice(0, 200).map((hotel) => ({ ...hotel, country: '일본', skipMapMatch: true }));

await writeFile('data/target-hotels-gifu-v1-quality.json', `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
await writeFile('data/target-slugs-gifu-v1-quality.json', `${JSON.stringify(selected.map((hotel) => hotel.slug), null, 2)}\n`, 'utf8');
console.log(`Selected ${selected.length} strict Gifu candidates from ${candidates.length} ranked candidates`);
if (selected.length) console.log(`Minimum reviews: ${Math.min(...selected.map((hotel) => Number(hotel.reviewCount || 0)))}, minimum score: ${Math.min(...selected.map((hotel) => Number(hotel.reviewScore || 0)))}`);

function isLocal(value) { return /\b(?:Gifu|Takayama|Hida|Shirakawa|Gero|Gujo|Okuhida|Hirayu|Shin-?Hotaka|Magome|Nakatsugawa|Ena|Ogaki|Minokamo|Seki|Mino|Kakamigahara)\b|岐阜|高山|飛騨|白川|下呂|郡上|奥飛騨|平湯|新穂高|馬籠|中津川|恵那|大垣|美濃加茂|関市|美濃市|各務原|기후|다카야마|히다|시라카와|게로|구조|오쿠히다|히라유|신호타카|마고메|나카쓰가와|에나|오가키|미노카모|세키|미노|가카미가하라/i.test(value); }
