import { readFile, writeFile } from 'node:fs/promises';
const remove = new Set(['danang-35395451']);
for (const path of ['data/target-hotels-danang-v1-quality.json']) {
  const hotels = JSON.parse(await readFile(path, 'utf8')).filter((hotel) => !remove.has(hotel.slug));
  await writeFile(path, `${JSON.stringify(hotels, null, 2)}\n`);
}
const slugPath = 'data/target-slugs-danang-v1-quality.json';
const slugs = JSON.parse(await readFile(slugPath, 'utf8')).filter((slug) => !remove.has(slug));
await writeFile(slugPath, `${JSON.stringify(slugs, null, 2)}\n`);
const collectedPath = 'data/generated/hotels.collected.json';
const collected = JSON.parse(await readFile(collectedPath, 'utf8'));
collected.hotels = collected.hotels.filter((hotel) => !remove.has(hotel.slug));
await writeFile(collectedPath, `${JSON.stringify(collected, null, 2)}\n`);
const generatedPath = 'src/data/generatedHotels.ts';
const source = await readFile(generatedPath, 'utf8');
const match = source.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
const generated = JSON.parse(match[1]).filter((hotel) => !remove.has(hotel.slug));
await writeFile(generatedPath, `// @ts-nocheck\nexport const generatedHotels: any[] = ${JSON.stringify(generated, null, 2)};\n`);
console.log({ targets: slugs.length, collected: collected.hotels.length, generated: generated.filter((hotel) => hotel.slug.startsWith('danang-')).length });
