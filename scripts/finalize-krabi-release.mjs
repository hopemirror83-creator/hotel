import { readFile, writeFile } from 'node:fs/promises';
const path = 'src/data/generatedHotels.ts';
const source = await readFile(path, 'utf8');
const match = source.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
if (!match) throw Error('Cannot parse hotel data');
const hotels = JSON.parse(match[1]);
const kept = [], excluded = [];
for (const hotel of hotels.filter(h => h.slug?.startsWith('krabi-'))) {
  const sections = hotel.analysis?.blogReview?.sections || [];
  const images = sections.filter(s => /^https?:\/\//i.test(String(s.image?.url || s.imageUrl || ''))).length;
  const body = sections.reduce((n, s) => n + (s.paragraphs || []).reduce((a, p) => a + String(p).length, 0), 0);
  const agodaImages = sections.filter(s => /^agoda_/i.test(String(s.image?.source || ''))).length;
  if (hotel.qualityStatus !== 'ready' || sections.length < 6 || images < 6 || agodaImages < 6 || body < 700) excluded.push({ slug: hotel.slug, status: hotel.qualityStatus, sections: sections.length, images, agodaImages, body });
  else kept.push(hotel);
}
await writeFile(path, `// @ts-nocheck\nexport const generatedHotels: any[] = ${JSON.stringify(kept, null, 2)};\n`);
await writeFile('data/target-hotels-krabi-v1-generated.json', JSON.stringify(kept, null, 2) + '\n');
await writeFile('data/target-slugs-krabi-v1-quality.json', JSON.stringify(kept.map(h => h.slug), null, 2) + '\n');
console.log({ generated: hotels.length, kept: kept.length, excluded });
