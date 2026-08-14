import { readFile, writeFile } from 'node:fs/promises';

const blocked = new Set([
  'chungnam-33425846',
  'chungnam-23167396',
  'chungnam-36836987',
  'chungnam-23167433',
  'chungnam-18951419',
  'chungnam-23167398'
]);
const generatedPath = 'src/data/generatedHotels.ts';
const collectedPath = 'data/generated/hotels.collected.json';
const targetPath = 'data/target-hotels-chungnam-v3-200.json';
const candidatePath = 'data/target-hotels-chungnam-candidates-v3-expanded.json';
const replacementPath = 'data/target-hotels-chungnam-v3-replacements-6.json';
const slugPath = 'data/target-slugs-chungnam-v3-200.json';
const replacementSlugPath = 'data/target-slugs-chungnam-v3-replacements-6.json';

const generatedText = await readFile(generatedPath, 'utf8');
const arrayStart = generatedText.indexOf('[', generatedText.indexOf('=') + 1);
const generated = JSON.parse(generatedText.slice(arrayStart, generatedText.lastIndexOf(']') + 1));
const cleanedGenerated = generated.filter((hotel) => !blocked.has(hotel.slug));

const collected = JSON.parse(await readFile(collectedPath, 'utf8'));
collected.hotels = collected.hotels.filter((hotel) => !blocked.has(hotel.slug));
collected.reports = (collected.reports || []).filter((report) => !blocked.has(report.slug));

const retained = JSON.parse(await readFile(targetPath, 'utf8')).filter((hotel) => !blocked.has(hotel.slug));
const candidates = JSON.parse(await readFile(candidatePath, 'utf8'));
const known = new Set([...cleanedGenerated.map((hotel) => hotel.slug), ...retained.map((hotel) => hotel.slug)]);
const replacements = candidates.filter((hotel) => !known.has(hotel.slug) && !blocked.has(hotel.slug)).slice(0, 6);
if (retained.length !== 194 || replacements.length !== 6) {
  throw new Error(`Expected 194 retained and 6 replacements, got ${retained.length} and ${replacements.length}`);
}

const finalTargets = [...retained, ...replacements];
await writeFile(generatedPath, `// @ts-nocheck\nexport const generatedHotels: any[] = ${JSON.stringify(cleanedGenerated, null, 2)};\n`, 'utf8');
await writeFile(collectedPath, `${JSON.stringify(collected, null, 2)}\n`, 'utf8');
await writeFile(targetPath, `${JSON.stringify(finalTargets, null, 2)}\n`, 'utf8');
await writeFile(replacementPath, `${JSON.stringify(replacements, null, 2)}\n`, 'utf8');
await writeFile(slugPath, `${JSON.stringify(finalTargets.map((hotel) => hotel.slug), null, 2)}\n`, 'utf8');
await writeFile(replacementSlugPath, `${JSON.stringify(replacements.map((hotel) => hotel.slug), null, 2)}\n`, 'utf8');

console.log(JSON.stringify({ removed: [...blocked], replacements: replacements.map((hotel) => hotel.slug) }, null, 2));
