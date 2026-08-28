import { readFile, writeFile } from 'node:fs/promises';

const path = 'src/data/generatedHotels.ts';
const text = await readFile(path, 'utf8');
const match = text.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
if (!match) throw new Error('Unable to parse generatedHotels.ts');
const hotels = JSON.parse(match[1]);
const regionHotels = hotels.filter((hotel) => hotel.slug?.startsWith('vungtau-'));
const kept = [];
const excluded = [];

for (const hotel of regionHotels) {
  const sections = hotel.analysis?.blogReview?.sections || [];
  const imageCount = sections.filter((section) => /^https?:\/\//i.test(String(section.image?.url || section.imageUrl || ''))).length;
  const bodyLength = sections.reduce((total, section) => total + (section.paragraphs || []).reduce((sum, paragraph) => sum + String(paragraph).length, 0), 0);
  const valid = hotel.qualityStatus === 'ready' && sections.length >= 6 && imageCount >= 6 && bodyLength >= 700;
  (valid ? kept : excluded).push(valid ? hotel : { slug: hotel.slug, status: hotel.qualityStatus, sections: sections.length, images: imageCount, body: bodyLength });
}

const keptSlugs = new Set(kept.map((hotel) => hotel.slug));
const finalHotels = hotels.filter((hotel) => !hotel.slug?.startsWith('vungtau-') || keptSlugs.has(hotel.slug));
await writeFile(path, `// @ts-nocheck\nexport const generatedHotels: any[] = ${JSON.stringify(finalHotels, null, 2)};\n`);
await writeFile('data/target-hotels-vungtau-v1-generated.json', `${JSON.stringify(kept, null, 2)}\n`);
await writeFile('data/target-slugs-vungtau-v1-quality.json', `${JSON.stringify(kept.map((hotel) => hotel.slug), null, 2)}\n`);
console.log({ generated: regionHotels.length, kept: kept.length, excluded });
