import { readFile, writeFile } from 'node:fs/promises';

const blocked = new Set(['gyeonggi-21582328', 'gyeonggi-23147380']);
const generatedPath = 'src/data/generatedHotels.ts';
const collectedPath = 'data/generated/hotels.collected.json';
const targetPath = 'data/target-hotels-gyeonggi-v4-200.json';
const candidatePath = 'data/target-hotels-gyeonggi-v4-candidates-202.json';
const replacementPath = 'data/target-hotels-gyeonggi-v4-replacements-2.json';

const generatedText = await readFile(generatedPath, 'utf8');
const arrayStart = generatedText.indexOf('[', generatedText.indexOf('=') + 1);
const generated = JSON.parse(generatedText.slice(arrayStart, generatedText.lastIndexOf(']') + 1));
const cleanedGenerated = generated.filter((hotel) => !blocked.has(hotel.slug));
await writeFile(
  generatedPath,
  `// @ts-nocheck\nexport const generatedHotels: any[] = ${JSON.stringify(cleanedGenerated, null, 2)};\n`,
  'utf8'
);

const collected = JSON.parse(await readFile(collectedPath, 'utf8'));
collected.hotels = collected.hotels.filter((hotel) => !blocked.has(hotel.slug));
collected.reports = (collected.reports || []).filter((report) => !blocked.has(report.slug));

const originalTarget = JSON.parse(await readFile(targetPath, 'utf8')).filter((hotel) => !blocked.has(hotel.slug));
const candidates = JSON.parse(await readFile(candidatePath, 'utf8'));
const known = new Set([...cleanedGenerated.map((hotel) => hotel.slug), ...originalTarget.map((hotel) => hotel.slug)]);
const replacements = candidates.filter((hotel) => !known.has(hotel.slug) && !blocked.has(hotel.slug)).slice(0, 2);
if (originalTarget.length !== 198 || replacements.length !== 2) {
  throw new Error(`Expected 198 retained and 2 replacements, got ${originalTarget.length} and ${replacements.length}`);
}

await writeFile(collectedPath, `${JSON.stringify(collected, null, 2)}\n`, 'utf8');
await writeFile(targetPath, `${JSON.stringify([...originalTarget, ...replacements], null, 2)}\n`, 'utf8');
await writeFile(replacementPath, `${JSON.stringify(replacements, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ removed: [...blocked], replacements: replacements.map((hotel) => hotel.slug) }, null, 2));
