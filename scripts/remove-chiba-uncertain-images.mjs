import { readFile, writeFile } from 'node:fs/promises';

const publicPath = 'src/data/generatedHotels.ts';
const text = await readFile(publicPath, 'utf8');
const match = text.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
if (!match) throw new Error('Could not parse generatedHotels.ts');

const hotels = JSON.parse(match[1]);
let removed = 0;

for (const hotel of hotels) {
  if (hotel.slug !== 'chiba-5901835') continue;
  for (const section of hotel.analysis?.blogReview?.sections || []) {
    if (section.image?.url?.includes('muscache.com')) {
      delete section.image;
      removed += 1;
    }
  }
}

await writeFile(publicPath, `// @ts-nocheck\nexport const generatedHotels: any[] = ${JSON.stringify(hotels, null, 2)};\n`, 'utf8');
console.log(JSON.stringify({ removed }, null, 2));
