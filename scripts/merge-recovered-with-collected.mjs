import { readFile, writeFile } from 'node:fs/promises';

const moduleText = await readFile('src/data/generatedHotels.ts', 'utf8');
const match = moduleText.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
if (!match) throw new Error('generatedHotels.ts를 읽을 수 없습니다.');

const recovered = JSON.parse(match[1]);
const collected = JSON.parse(await readFile('data/generated/hotels.collected.json', 'utf8'));
const bySlug = new Map(recovered.map((hotel) => [hotel.slug, hotel]));
for (const hotel of collected.hotels || []) bySlug.set(hotel.slug, hotel);

const hotels = [...bySlug.values()];
await writeFile('data/generated/hotels.collected.json', `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  hotels,
  reports: collected.reports || []
}, null, 2)}\n`, 'utf8');

console.log(`Merged ${recovered.length} recovered + ${collected.hotels?.length || 0} collected = ${hotels.length} hotels.`);
