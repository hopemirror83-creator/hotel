import { readFile, writeFile } from 'node:fs/promises';
const candidates = JSON.parse(await readFile('data/candidates-yamagata-v1-all.json', 'utf8'));
const source = await readFile('src/data/generatedHotels.ts', 'utf8'); const match = source.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
const existingIds = new Set((match ? JSON.parse(match[1]) : []).map((hotel) => Number(String(hotel.slug).split('-').at(-1))).filter(Number.isFinite));
const selected = candidates.filter((hotel) => !/Miyagi|Fukushima|Niigata|Akita|Iwate|宮城|福島|新潟|秋田|岩手|미야기|후쿠시마|니가타|아키타|이와테/i.test(String(hotel.fallbackAddress || '')) && /^https?:\/\//i.test(String(hotel.imageUrl || '')) && Number(hotel.reviewCount || 0) >= 20 && Number(hotel.reviewScore || 0) >= 7.5 && !existingIds.has(Number(hotel.agodaHotelId))).slice(0, 200).map((hotel) => ({ ...hotel, country: '일본', skipMapMatch: true }));
await writeFile('data/target-hotels-yamagata-v1-quality.json', `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
await writeFile('data/target-slugs-yamagata-v1-quality.json', `${JSON.stringify(selected.map((hotel) => hotel.slug), null, 2)}\n`, 'utf8');
console.log(`Selected ${selected.length} strict Yamagata candidates from ${candidates.length} ranked candidates`); if (selected.length) console.log(`Minimum reviews: ${Math.min(...selected.map((hotel) => Number(hotel.reviewCount || 0)))}, minimum score: ${Math.min(...selected.map((hotel) => Number(hotel.reviewScore || 0)))}`);
