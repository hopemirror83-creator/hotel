import { readFile, writeFile } from 'node:fs/promises';

const rejected = new Set(['ibaraki-60748510']);
const modulePath = 'src/data/generatedHotels.ts';
const moduleText = await readFile(modulePath, 'utf8');
const match = moduleText.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
if (!match) throw new Error('Could not parse generatedHotels.ts');
const hotels = JSON.parse(match[1]).filter((hotel) => !rejected.has(hotel.slug));
await writeFile(modulePath, `// @ts-nocheck\nexport const generatedHotels: any[] = ${JSON.stringify(hotels, null, 2)};\n`, 'utf8');

const collectedPath = 'data/generated/hotels.collected.json';
const collected = JSON.parse(await readFile(collectedPath, 'utf8'));
collected.hotels = (collected.hotels || []).filter((hotel) => !rejected.has(hotel.slug));
collected.reports = (collected.reports || []).filter((report) => !rejected.has(report.slug));
await writeFile(collectedPath, `${JSON.stringify(collected, null, 2)}\n`, 'utf8');
console.log(`Removed ${[...rejected].join(', ')}; public hotels=${hotels.length}, collected hotels=${collected.hotels.length}`);
