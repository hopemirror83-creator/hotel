import { readFile, writeFile } from 'node:fs/promises';

const generatedPath = 'src/data/generatedHotels.ts';
const source = await readFile(generatedPath, 'utf8');
const match = source.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
const generated = JSON.parse(match[1]);
const ready = new Set(generated.filter((hotel) => hotel.slug?.startsWith('nhatrang-') && hotel.qualityStatus === 'ready').map((hotel) => hotel.slug));

const targetsPath = 'data/target-hotels-nhatrang-v1-quality.json';
const targets = JSON.parse(await readFile(targetsPath, 'utf8')).filter((hotel) => ready.has(hotel.slug));
await writeFile(targetsPath, `${JSON.stringify(targets, null, 2)}\n`);

const slugsPath = 'data/target-slugs-nhatrang-v1-quality.json';
const slugs = JSON.parse(await readFile(slugsPath, 'utf8')).filter((slug) => ready.has(slug));
await writeFile(slugsPath, `${JSON.stringify(slugs, null, 2)}\n`);

const collectedPath = 'data/generated/hotels.collected.json';
const collected = JSON.parse(await readFile(collectedPath, 'utf8'));
collected.hotels = collected.hotels.filter((hotel) => ready.has(hotel.slug));
await writeFile(collectedPath, `${JSON.stringify(collected, null, 2)}\n`);

const keptGenerated = generated.filter((hotel) => !hotel.slug?.startsWith('nhatrang-') || ready.has(hotel.slug));
await writeFile(generatedPath, `// @ts-nocheck\nexport const generatedHotels: any[] = ${JSON.stringify(keptGenerated, null, 2)};\n`);
console.log({ ready: ready.size, targets: targets.length, collected: collected.hotels.length });
