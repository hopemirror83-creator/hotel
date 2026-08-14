import { readFile, writeFile } from 'node:fs/promises';

const collectedPath = 'data/generated/hotels.collected.json';
const backupPath = 'data/generated/hotels.collected.full.json';
const publicModulePath = 'src/data/generatedHotels.ts';

const collected = JSON.parse(await readFile(collectedPath, 'utf8'));
const publicHotels = await readPublicHotels();
const existingPublicBySlug = new Map(publicHotels.map((hotel) => [hotel.slug, hotel]));

const scopedHotels = [
  ...collected.hotels.filter((hotel) => hotel.slug.startsWith('incheon-')).slice(0, 100),
  ...collected.hotels.filter((hotel) => hotel.slug.startsWith('seoul-')).slice(0, 200),
  ...collected.hotels.filter((hotel) => hotel.slug.startsWith('busan-')).slice(0, 200)
];

await writeFile(backupPath, JSON.stringify(collected, null, 2), 'utf8');
await writeFile(collectedPath, JSON.stringify({
  ...collected,
  publishScopeUpdatedAt: new Date().toISOString(),
  hotels: scopedHotels
}, null, 2), 'utf8');

await writeFile(publicModulePath, `// @ts-nocheck\nexport const generatedHotels: any[] = ${JSON.stringify(scopedHotels.map(toPublicHotel), null, 2)};\n`, 'utf8');

const counts = scopedHotels.reduce((acc, hotel) => {
  const prefix = hotel.slug.split('-')[0];
  acc[prefix] = (acc[prefix] || 0) + 1;
  return acc;
}, {});

console.log(JSON.stringify({ total: scopedHotels.length, counts }, null, 2));

async function readPublicHotels() {
  try {
    const text = await readFile(publicModulePath, 'utf8');
    const match = text.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
    return match ? JSON.parse(match[1]) : [];
  } catch {
    return [];
  }
}

function toPublicHotel(hotel) {
  const { sourceSignals, ...publicHotel } = hotel;
  const existing = existingPublicBySlug.get(hotel.slug);
  if (existing?.analysis?.blogReview) {
    return {
      ...publicHotel,
      analysis: existing.analysis,
      qualityStatus: existing.qualityStatus,
      referenceLinks: existing.referenceLinks,
      averageNightlyRate: existing.averageNightlyRate,
      averageNightlyRateSampleCount: existing.averageNightlyRateSampleCount
    };
  }
  return publicHotel;
}
