import { readFile, writeFile } from 'node:fs/promises';
const path = 'src/data/generatedHotels.ts';
const source = await readFile(path, 'utf8');
const match = source.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
if (!match) throw new Error('Cannot parse hotel data');
const hotels = JSON.parse(match[1]);
for (const hotel of hotels.filter(item => item.slug?.startsWith('chiangrai-'))) {
  const sections = hotel.analysis?.blogReview?.sections || [];
  const agoda = sections.map(section => section.image).filter(image => /^agoda_/i.test(String(image?.source || '')) && /^https?:\/\//i.test(String(image?.url || '')));
  if (!agoda.length) continue;
  for (let index = 0; index < sections.length; index++) {
    if (!/^agoda_/i.test(String(sections[index].image?.source || ''))) sections[index].image = { ...agoda[index % agoda.length], alt: `${hotel.hotelName} ${sections[index].heading} 이미지` };
  }
}
await writeFile(path, `// @ts-nocheck\nexport const generatedHotels: any[] = ${JSON.stringify(hotels, null, 2)};\n`);
console.log({ sanitized: hotels.filter(hotel => hotel.slug?.startsWith('chiangrai-')).length });
