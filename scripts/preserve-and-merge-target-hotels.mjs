import { readFile, writeFile } from 'node:fs/promises';

const mode = process.argv[2];
const targetFile = process.argv[3];
const backupFile = process.argv[4];
const modulePath = 'src/data/generatedHotels.ts';

if (!['preserve', 'merge'].includes(mode) || !targetFile || !backupFile) {
  throw new Error('Usage: node scripts/preserve-and-merge-target-hotels.mjs <preserve|merge> <target-file> <backup-file>');
}

const targets = new Set(JSON.parse(await readFile(targetFile, 'utf8')));

if (mode === 'preserve') {
  const hotels = await readHotels();
  const selected = hotels.filter((hotel) => targets.has(hotel.slug));
  if (selected.length !== targets.size) {
    throw new Error(`Target preservation failed: expected ${targets.size}, found ${selected.length}`);
  }
  await writeFile(backupFile, `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
  console.log(`Preserved ${selected.length} target hotels.`);
} else {
  const recovered = await readHotels();
  const selected = JSON.parse(await readFile(backupFile, 'utf8'));
  const bySlug = new Map(recovered.map((hotel) => [hotel.slug, hotel]));
  for (const hotel of selected) bySlug.set(hotel.slug, hotel);
  const merged = [...bySlug.values()];
  await writeFile(modulePath, `// @ts-nocheck\nexport const generatedHotels: any[] = ${JSON.stringify(merged, null, 2)};\n`, 'utf8');
  console.log(`Merged ${recovered.length} recovered + ${selected.length} targets = ${merged.length} hotels.`);
}

async function readHotels() {
  const text = await readFile(modulePath, 'utf8');
  const match = text.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
  if (!match) throw new Error('Unable to parse generatedHotels.ts');
  return JSON.parse(match[1]);
}
