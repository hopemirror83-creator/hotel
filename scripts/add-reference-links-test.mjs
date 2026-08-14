import { readFile, writeFile } from 'node:fs/promises';

const PUBLIC_MODULE = 'src/data/generatedHotels.ts';
const COLLECTED_JSON = 'data/generated/hotels.collected.json';

const publicHotels = await readPublicHotels();
const collected = JSON.parse(await readFile(COLLECTED_JSON, 'utf8'));
const collectedBySlug = new Map(collected.hotels.map((hotel) => [hotel.slug, hotel]));

const outputHotels = publicHotels.map((hotel) => {
  const collectedHotel = collectedBySlug.get(hotel.slug);
  const links = buildReferenceLinks(collectedHotel);
  if (links.length === 0) {
    delete hotel.referenceLinks;
    return hotel;
  }
  return { ...hotel, referenceLinks: links };
});

await writeFile(PUBLIC_MODULE, `// @ts-nocheck\nexport const generatedHotels: any[] = ${JSON.stringify(outputHotels, null, 2)};\n`, 'utf8');

const linkedHotels = outputHotels.filter((hotel) => hotel.referenceLinks?.length);
console.table({
  publicHotels: outputHotels.length,
  linkedHotels: linkedHotels.length,
  totalLinks: linkedHotels.reduce((sum, hotel) => sum + hotel.referenceLinks.length, 0),
  minLinks: Math.min(...linkedHotels.map((hotel) => hotel.referenceLinks.length)),
  maxLinks: Math.max(...linkedHotels.map((hotel) => hotel.referenceLinks.length))
});

async function readPublicHotels() {
  const text = await readFile(PUBLIC_MODULE, 'utf8');
  const match = text.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
  if (!match) throw new Error('Could not parse generatedHotels module.');
  return JSON.parse(match[1]);
}

function buildReferenceLinks(hotel) {
  const seen = new Set();
  const links = [];
  for (const signal of hotel?.sourceSignals || []) {
    for (const item of signal.items || []) {
      const url = item.link;
      const title = item.title;
      if (!url || !title || seen.has(url)) continue;
      seen.add(url);
      links.push({
        title: trimTitle(title),
        url,
        query: signal.query,
        source: 'naver_blog'
      });
      if (links.length >= 5) return links;
    }
  }
  return links;
}

function trimTitle(value) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  return text.length > 58 ? `${text.slice(0, 57)}...` : text;
}
