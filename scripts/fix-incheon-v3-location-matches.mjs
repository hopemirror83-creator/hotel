import { readFile, writeFile } from 'node:fs/promises';

const targetPath = 'data/target-hotels-incheon-v3-200.json';
const slugPath = 'data/target-slugs-incheon-v3-200.json';
const collectedPath = 'data/generated/hotels.collected.json';
const broadPath = 'data/target-hotels-incheon-v3-candidates-broad.json';
const replacementPath = 'data/target-hotels-incheon-v3-replacements-5.json';
const replacementSlugPath = 'data/target-slugs-incheon-v3-replacements-5.json';

const badSlugs = new Set([
  'incheon-8634420',
  'incheon-263615',
  'incheon-411859',
  'incheon-640480',
  'incheon-860705'
]);

const targets = JSON.parse(await readFile(targetPath, 'utf8')).filter((hotel) => !badSlugs.has(hotel.slug));
const broad = JSON.parse(await readFile(broadPath, 'utf8'));
const used = new Set(targets.map((hotel) => hotel.slug));
const replacements = broad.filter((hotel) => {
  if (used.has(hotel.slug) || badSlugs.has(hotel.slug) || hotel.slug === 'incheon-10583318') return false;
  const lat = Number(hotel.latitude);
  const lon = Number(hotel.longitude);
  return lat >= 37 && lat <= 38.1 && lon >= 124.4 && lon <= 127;
}).slice(0, 5);

if (replacements.length !== 5) throw new Error(`Expected 5 replacements, found ${replacements.length}`);
const finalTargets = [...targets, ...replacements];
if (finalTargets.length !== 200) throw new Error(`Expected 200 targets, found ${finalTargets.length}`);

const collected = JSON.parse(await readFile(collectedPath, 'utf8'));
collected.hotels = collected.hotels.filter((hotel) => !badSlugs.has(hotel.slug));

await writeFile(targetPath, `${JSON.stringify(finalTargets, null, 2)}\n`, 'utf8');
await writeFile(slugPath, `${JSON.stringify(finalTargets.map((hotel) => hotel.slug), null, 2)}\n`, 'utf8');
await writeFile(replacementPath, `${JSON.stringify(replacements, null, 2)}\n`, 'utf8');
await writeFile(replacementSlugPath, `${JSON.stringify(replacements.map((hotel) => hotel.slug), null, 2)}\n`, 'utf8');
await writeFile(collectedPath, `${JSON.stringify(collected, null, 2)}\n`, 'utf8');

console.log(JSON.stringify({ removed: [...badSlugs], replacements }, null, 2));
