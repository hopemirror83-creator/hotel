import { readFile, writeFile } from 'node:fs/promises';

const slugFile = process.argv[2];
if (!slugFile) throw new Error('Pass a JSON file containing hotel slugs.');

const removeSlugs = new Set(JSON.parse(await readFile(slugFile, 'utf8')));
const collectedPath = 'data/generated/hotels.collected.json';
const modulePath = 'src/data/generatedHotels.ts';
const collected = JSON.parse(await readFile(collectedPath, 'utf8'));
const moduleText = await readFile(modulePath, 'utf8');
const match = moduleText.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
if (!match) throw new Error('Unable to parse generatedHotels.ts.');
const publicHotels = JSON.parse(match[1]);

const nextCollected = collected.hotels.filter((hotel) => !removeSlugs.has(hotel.slug));
const nextReports = (collected.reports || []).filter((report) => !removeSlugs.has(report.slug));
const nextPublic = publicHotels.filter((hotel) => !removeSlugs.has(hotel.slug));

await writeFile(collectedPath, `${JSON.stringify({ ...collected, hotels: nextCollected, reports: nextReports }, null, 2)}\n`, 'utf8');
await writeFile(modulePath, `// @ts-nocheck\nexport const generatedHotels: any[] = ${JSON.stringify(nextPublic, null, 2)};\n`, 'utf8');
console.log(`Removed ${publicHotels.length - nextPublic.length} public hotels and ${collected.hotels.length - nextCollected.length} collected hotels.`);
