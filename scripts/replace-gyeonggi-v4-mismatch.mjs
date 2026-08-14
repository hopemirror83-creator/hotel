import { readFile, writeFile } from 'node:fs/promises';

const removedSlug = 'gyeonggi-31214580';
const replacementSlug = 'gyeonggi-30990066';
const generatedPath = 'src/data/generatedHotels.ts';
const collectedPath = 'data/generated/hotels.collected.json';
const targetPath = 'data/target-hotels-gyeonggi-v4-200.json';
const candidatePath = 'data/target-hotels-gyeonggi-v4-candidates-202.json';
const replacementPath = 'data/target-hotels-gyeonggi-v4-replacement-1.json';
const slugPath = 'data/target-slugs-gyeonggi-v4-200.json';
const replacementSlugPath = 'data/target-slugs-gyeonggi-v4-replacement-1.json';

const generatedText = await readFile(generatedPath, 'utf8');
const arrayStart = generatedText.indexOf('[', generatedText.indexOf('=') + 1);
const generated = JSON.parse(generatedText.slice(arrayStart, generatedText.lastIndexOf(']') + 1));
const cleanedGenerated = generated.filter((hotel) => hotel.slug !== removedSlug && hotel.slug !== replacementSlug);

const collected = JSON.parse(await readFile(collectedPath, 'utf8'));
collected.hotels = collected.hotels.filter((hotel) => hotel.slug !== removedSlug && hotel.slug !== replacementSlug);
collected.reports = (collected.reports || []).filter((report) => report.slug !== removedSlug && report.slug !== replacementSlug);

const targets = JSON.parse(await readFile(targetPath, 'utf8')).filter(
  (hotel) => hotel.slug !== removedSlug && hotel.slug !== replacementSlug
);
const candidates = JSON.parse(await readFile(candidatePath, 'utf8'));
const replacement = candidates.find((hotel) => hotel.slug === replacementSlug);
if (!replacement) throw new Error(`Replacement not found: ${replacementSlug}`);
if (targets.length !== 199) throw new Error(`Expected 199 retained targets, got ${targets.length}`);

await writeFile(
  generatedPath,
  `// @ts-nocheck\nexport const generatedHotels: any[] = ${JSON.stringify(cleanedGenerated, null, 2)};\n`,
  'utf8'
);
await writeFile(collectedPath, `${JSON.stringify(collected, null, 2)}\n`, 'utf8');
await writeFile(targetPath, `${JSON.stringify([...targets, replacement], null, 2)}\n`, 'utf8');
await writeFile(replacementPath, `${JSON.stringify([replacement], null, 2)}\n`, 'utf8');
await writeFile(slugPath, `${JSON.stringify([...targets, replacement].map((hotel) => hotel.slug), null, 2)}\n`, 'utf8');
await writeFile(replacementSlugPath, `${JSON.stringify([replacementSlug], null, 2)}\n`, 'utf8');

console.log(JSON.stringify({ removedSlug, replacementSlug, targetCount: targets.length + 1 }, null, 2));
