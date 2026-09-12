import { readFile, writeFile } from 'node:fs/promises';
const path = 'src/data/generatedHotels.ts';
const source = await readFile(path, 'utf8');
const match = source.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
if (!match) throw Error('Cannot parse hotel data');
const hotels = JSON.parse(match[1]);
for (const hotel of hotels.filter(h => h.slug?.startsWith('soctrang-'))) {
  const sections = hotel.analysis?.blogReview?.sections || [];
  const agoda = sections.map(s => s.image).filter(image => /^agoda_/i.test(String(image?.source || '')) && /^https?:\/\//i.test(String(image?.url || '')));
  if (!agoda.length) continue;
  for (let i = 0; i < sections.length; i++) {
    if (!/^agoda_/i.test(String(sections[i].image?.source || ''))) sections[i].image = { ...agoda[i % agoda.length], alt: `${hotel.hotelName} ${sections[i].heading} 이미지` };
  }
}
await writeFile(path, `// @ts-nocheck\nexport const generatedHotels: any[] = ${JSON.stringify(hotels, null, 2)};\n`);
console.log({ sanitized: hotels.filter(h => h.slug?.startsWith('soctrang-')).length });
