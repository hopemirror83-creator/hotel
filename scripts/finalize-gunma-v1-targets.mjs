import { readFile, writeFile } from 'node:fs/promises';

const candidates = JSON.parse(await readFile('data/candidates-gunma-v1-all.json', 'utf8'));
const source = await readFile('src/data/generatedHotels.ts', 'utf8');
const match = source.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
const existingIds = new Set((match ? JSON.parse(match[1]) : []).map((hotel) => Number(String(hotel.slug).split('-').at(-1))).filter(Number.isFinite));
const selected = candidates.filter((hotel) => {
  const latitude = Number(hotel.latitude || 0);
  const longitude = Number(hotel.longitude || 0);
  const address = String(hotel.fallbackAddress || '');
  return latitude >= 35.95 && latitude <= 37.15
    && longitude >= 138.35 && longitude <= 139.75
    && isLocal(address)
    && !/Nagano|Niigata|Saitama|Tochigi|Fukushima|나가노|니가타|사이타마|도치기|후쿠시마/i.test(address)
    && /^https?:\/\//i.test(String(hotel.imageUrl || ''))
    && Number(hotel.reviewCount || 0) >= 20
    && Number(hotel.reviewScore || 0) >= 7.5
    && !existingIds.has(Number(hotel.agodaHotelId));
}).sort((a, b) => Number(b.reviewCount || 0) * Number(b.reviewScore || 0) - Number(a.reviewCount || 0) * Number(a.reviewScore || 0))
  .slice(0, 200)
  .map((hotel) => ({ ...hotel, country: '일본', skipMapMatch: true }));

await writeFile('data/target-hotels-gunma-v1-quality.json', `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
await writeFile('data/target-slugs-gunma-v1-quality.json', `${JSON.stringify(selected.map((hotel) => hotel.slug), null, 2)}\n`, 'utf8');
console.log(`Selected ${selected.length} strict Gunma candidates from ${candidates.length} ranked candidates`);
if (selected.length) console.log(`Minimum reviews: ${Math.min(...selected.map((hotel) => Number(hotel.reviewCount || 0)))}, minimum score: ${Math.min(...selected.map((hotel) => Number(hotel.reviewScore || 0)))}`);

function isLocal(value) {
  return /\b(?:Gunma|Kusatsu|Takasaki|Maebashi|Minakami|Ikaho|Shibukawa|Tsumagoi|Ota|Kiryu|Tomioka|Numata|Tatebayashi|Isesaki|Nakanojo|Shima Onsen)\b|群馬|草津|高崎|前橋|みなかみ|水上|伊香保|渋川|嬬恋|太田|桐生|富岡|沼田|館林|伊勢崎|中之条|四万温泉|군마|구사쓰|다카사키|마에바시|미나카미|이카호|시부카와|쓰마고이|오타|기류|도미오카|누마타|다테바야시|이세사키|나카노조|시마온천/i.test(value);
}
