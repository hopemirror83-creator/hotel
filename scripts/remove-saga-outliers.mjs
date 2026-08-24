import { readFile, writeFile } from 'node:fs/promises';

const blocked = new Set(['saga-203245', 'saga-68202974']);
const targetPath = 'data/target-hotels-saga-v1-quality.json';
const slugPath = 'data/target-slugs-saga-v1-quality.json';
const collectedPath = 'data/generated/hotels.collected.json';
const publicPath = 'src/data/generatedHotels.ts';

const targets = JSON.parse(await readFile(targetPath, 'utf8')).filter((hotel) => !blocked.has(hotel.slug));
const collected = JSON.parse(await readFile(collectedPath, 'utf8'));
collected.hotels = (collected.hotels || []).filter((hotel) => !blocked.has(hotel.slug));
const text = await readFile(publicPath, 'utf8');
const match = text.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
const hotels = JSON.parse(match[1]).filter((hotel) => !blocked.has(hotel.slug));

await writeFile(targetPath, `${JSON.stringify(targets, null, 2)}\n`);
await writeFile(slugPath, `${JSON.stringify(targets.map((hotel) => hotel.slug), null, 2)}\n`);
await writeFile(collectedPath, `${JSON.stringify(collected, null, 2)}\n`);
await writeFile(publicPath, `// @ts-nocheck\nexport const generatedHotels: any[] = ${JSON.stringify(hotels, null, 2)};\n`);
console.log({ removed: [...blocked], remaining: targets.length });
