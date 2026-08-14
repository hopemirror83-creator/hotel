import { readFile, writeFile } from 'node:fs/promises';

const targetFile = process.argv[2];
const outputFile = process.argv[3];
if (!targetFile || !outputFile) {
  throw new Error('Usage: node scripts/create-quality-retry-list.mjs <target-file> <output-file>');
}

const text = await readFile('src/data/generatedHotels.ts', 'utf8');
const match = text.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
if (!match) throw new Error('Unable to parse generatedHotels.ts');

const hotels = JSON.parse(match[1]);
const bySlug = new Map(hotels.map((hotel) => [hotel.slug, hotel]));
const targets = JSON.parse(await readFile(targetFile, 'utf8'));
const retry = targets.filter((slug) => {
  const hotel = bySlug.get(slug);
  return hotel?.qualityStatus !== 'ready' || hotel?.analysis?.blogReview?.sections?.length !== 6;
});

await writeFile(outputFile, `${JSON.stringify(retry, null, 2)}\n`, 'utf8');
console.log(`Retry targets: ${retry.length}`);
