import { readFile, writeFile } from 'node:fs/promises';

const candidates = JSON.parse(await readFile('data/candidates-ibaraki-v1-all.json', 'utf8'));
const source = await readFile('src/data/generatedHotels.ts', 'utf8');
const match = source.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
const existingIds = new Set((match ? JSON.parse(match[1]) : [])
  .filter((hotel) => !String(hotel.slug || '').startsWith('ibaraki-'))
  .map((hotel) => Number(String(hotel.slug).split('-').at(-1))).filter(Number.isFinite));
const selected = candidates.filter((hotel) => {
  const address = String(hotel.fallbackAddress || '');
  return isLocal(address)
    && !/Chiba|Tochigi|Saitama|Fukushima|Iwaki|Onahama|千葉|栃木|埼玉|福島|いわき|小名浜|치바|도치기|사이타마|후쿠시마|이와키|오나하마/i.test(address)
    && /^https?:\/\//i.test(String(hotel.imageUrl || ''))
    && Number(hotel.reviewCount || 0) >= 20
    && Number(hotel.reviewScore || 0) >= 7.5
    && !existingIds.has(Number(hotel.agodaHotelId));
}).sort((a, b) => Number(b.reviewCount || 0) * Number(b.reviewScore || 0) - Number(a.reviewCount || 0) * Number(a.reviewScore || 0))
  .slice(0, 200).map((hotel) => ({ ...hotel, country: '일본', skipMapMatch: true }));

await writeFile('data/target-hotels-ibaraki-v1-quality.json', `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
await writeFile('data/target-slugs-ibaraki-v1-quality.json', `${JSON.stringify(selected.map((hotel) => hotel.slug), null, 2)}\n`, 'utf8');
console.log(`Selected ${selected.length} strict Ibaraki candidates from ${candidates.length} ranked candidates`);
if (selected.length) console.log(`Minimum reviews: ${Math.min(...selected.map((hotel) => Number(hotel.reviewCount || 0)))}, minimum score: ${Math.min(...selected.map((hotel) => Number(hotel.reviewScore || 0)))}`);

function isLocal(value) { return /\b(?:Ibaraki|Mito|Tsukuba|Tsuchiura|Hitachi|Hitachinaka|Oarai|Kashima|Kamisu|Kasama|Ishioka|Ushiku|Ryugasaki|Koga|Daigo|Hokota|Yuki)\b|茨城|水戸|つくば|土浦|日立|ひたちなか|大洗|鹿嶋|神栖|笠間|石岡|牛久|龍ケ崎|古河|大子|鉾田|結城|이바라키|미토|쓰쿠바|츠치우라|히타치|오아라이|가시마|가미스|가사마|이시오카|우시쿠|고가|다이고/i.test(value); }
