import { readFile, writeFile } from 'node:fs/promises';
const source = await readFile('src/data/generatedHotels.ts', 'utf8');
const match = source.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
const hotels = JSON.parse(match[1]).filter((hotel) => hotel.slug?.startsWith('phuquoc-'));
const retry = hotels.filter((hotel) => hotel.qualityStatus !== 'ready').map((hotel) => hotel.slug);
await writeFile('data/target-slugs-phuquoc-v1-retry.json', `${JSON.stringify(retry, null, 2)}\n`);
console.log({ total: hotels.length, ready: hotels.length - retry.length, retry: retry.length });
