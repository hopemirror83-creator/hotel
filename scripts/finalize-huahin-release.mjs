import { readFile, writeFile } from 'node:fs/promises';
const path = 'src/data/generatedHotels.ts';
const source = await readFile(path, 'utf8');
const match = source.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
if (!match) throw new Error('Cannot parse hotel data');
const hotels = JSON.parse(match[1]);
const kept = [], excluded = [];
for (const hotel of hotels.filter(item => item.slug?.startsWith('huahin-'))) {
  const sections = hotel.analysis?.blogReview?.sections || [];
  const images = sections.filter(section => /^https?:\/\//i.test(String(section.image?.url || section.imageUrl || ''))).length;
  const agodaImages = sections.filter(section => /^agoda_/i.test(String(section.image?.source || ''))).length;
  const body = sections.reduce((total, section) => total + (section.paragraphs || []).reduce((sum, paragraph) => sum + String(paragraph).length, 0), 0);
  if (hotel.qualityStatus !== 'ready' || sections.length < 6 || images < 6 || agodaImages < 6 || body < 700) excluded.push({ slug: hotel.slug, status: hotel.qualityStatus, sections: sections.length, images, agodaImages, body });
  else kept.push(hotel);
}
await writeFile(path, `// @ts-nocheck\nexport const generatedHotels: any[] = ${JSON.stringify(kept, null, 2)};\n`);
await writeFile('data/target-hotels-huahin-v1-generated.json', `${JSON.stringify(kept, null, 2)}\n`);
await writeFile('data/target-slugs-huahin-v1-quality.json', `${JSON.stringify(kept.map(hotel => hotel.slug), null, 2)}\n`);
console.log({ generated: hotels.length, kept: kept.length, excluded });
