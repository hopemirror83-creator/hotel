import { readFile, writeFile } from 'node:fs/promises';

const source = await readFile('src/data/generatedHotels.ts', 'utf8');
const match = source.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
const hotels = JSON.parse(match[1]).filter((hotel) => hotel.slug?.startsWith('nhatrang-'));
const retry = hotels.filter((hotel) => hotel.qualityStatus !== 'ready').map((hotel) => hotel.slug);
const counts = hotels.reduce((result, hotel) => {
  result[hotel.qualityStatus] = (result[hotel.qualityStatus] || 0) + 1;
  return result;
}, {});
await writeFile('data/target-slugs-nhatrang-v1-retry.json', `${JSON.stringify(retry, null, 2)}\n`);
console.log(counts);
console.log(`Retry targets: ${retry.length}`);
console.log(hotels.filter((hotel) => hotel.qualityStatus !== 'ready').map((hotel) => `${hotel.slug} | ${hotel.hotelName} | ${hotel.qualityStatus} | ${hotel.qualityNotes || ''}`).join('\n'));
