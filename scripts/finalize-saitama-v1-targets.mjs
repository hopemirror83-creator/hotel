import { readFile, writeFile } from 'node:fs/promises';

const candidates = JSON.parse(await readFile('data/candidates-saitama-v1-all.json', 'utf8'));
const source = await readFile('src/data/generatedHotels.ts', 'utf8');
const match = source.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
const existingIds = new Set((match ? JSON.parse(match[1]) : [])
  .filter((hotel) => !String(hotel.slug || '').startsWith('saitama-'))
  .map((hotel) => Number(String(hotel.slug).split('-').at(-1))).filter(Number.isFinite));
const selected = candidates.filter((hotel) => {
  const address = String(hotel.fallbackAddress || '');
  return isLocal(address)
    && !/Tokyo|Chiba|Gunma|Tochigi|Ibaraki|Yamanashi|東京|千葉|群馬|栃木|茨城|山梨|도쿄|치바|군마|도치기|이바라키|야마나시/i.test(address)
    && /^https?:\/\//i.test(String(hotel.imageUrl || ''))
    && Number(hotel.reviewCount || 0) >= 20
    && Number(hotel.reviewScore || 0) >= 7.5
    && !existingIds.has(Number(hotel.agodaHotelId));
}).sort((a, b) => Number(b.reviewCount || 0) * Number(b.reviewScore || 0) - Number(a.reviewCount || 0) * Number(a.reviewScore || 0))
  .slice(0, 200).map((hotel) => ({ ...hotel, country: '일본', skipMapMatch: true }));

await writeFile('data/target-hotels-saitama-v1-quality.json', `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
await writeFile('data/target-slugs-saitama-v1-quality.json', `${JSON.stringify(selected.map((hotel) => hotel.slug), null, 2)}\n`, 'utf8');
console.log(`Selected ${selected.length} strict Saitama candidates from ${candidates.length} ranked candidates`);
if (selected.length) console.log(`Minimum reviews: ${Math.min(...selected.map((hotel) => Number(hotel.reviewCount || 0)))}, minimum score: ${Math.min(...selected.map((hotel) => Number(hotel.reviewScore || 0)))}`);

function isLocal(value) { return /\b(?:Saitama|Omiya|Urawa|Kawagoe|Tokorozawa|Chichibu|Kumagaya|Kawaguchi|Koshigaya|Kasukabe|Hanno|Wako|Asaka|Niiza|Honjo|Fukaya|Toda|Warabi|Ageo|Soka|Gyoda|Higashimatsuyama)\b|埼玉|大宮|浦和|川越|所沢|秩父|熊谷|川口|越谷|春日部|飯能|和光|朝霞|新座|本庄|深谷|戸田|蕨|上尾|草加|行田|東松山|사이타마|오미야|우라와|가와고에|도코로자와|지치부|구마가야|가와구치|고시가야|가스카베|한노|와코|아사카|니자|혼조|후카야/i.test(value); }
