import { readFile, writeFile } from 'node:fs/promises';

const remove = new Set(['saga-50117961']);

for (const path of [
  'data/target-hotels-saga-v1-quality.json',
  'data/generated/hotels.collected.json'
]) {
  const value = JSON.parse(await readFile(path, 'utf8'));
  if (Array.isArray(value)) {
    await writeFile(path, `${JSON.stringify(value.filter((hotel) => !remove.has(hotel.slug)), null, 2)}\n`);
  } else if (Array.isArray(value.hotels)) {
    value.hotels = value.hotels.filter((hotel) => !remove.has(hotel.slug));
    await writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
  }
}

const slugsPath = 'data/target-slugs-saga-v1-quality.json';
const slugs = JSON.parse(await readFile(slugsPath, 'utf8')).filter((slug) => !remove.has(slug));
await writeFile(slugsPath, `${JSON.stringify(slugs, null, 2)}\n`);

const generatedPath = 'src/data/generatedHotels.ts';
const text = await readFile(generatedPath, 'utf8');
const match = text.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
const hotels = JSON.parse(match[1]).filter((hotel) => !remove.has(hotel.slug));
await writeFile(generatedPath, `// @ts-nocheck\nexport const generatedHotels: any[] = ${JSON.stringify(hotels, null, 2)};\n`);

console.log({ removed: [...remove], finalTargets: slugs.length });
