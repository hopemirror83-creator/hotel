import { readFile, writeFile } from 'node:fs/promises';

const sourcePath = 'data/candidates-ulsan-next-all.json';
const outputHotelsPath = 'data/target-hotels-ulsan-v3-quality.json';
const outputSlugsPath = 'data/target-slugs-ulsan-v3-quality.json';

const candidates = JSON.parse(await readFile(sourcePath, 'utf8'));
const excludedText = /(Sokcho|Gangwon|속초|강원|Nohak|하이디울산바위|양산|Yangsan)/i;

const selected = candidates
  .filter((hotel) => {
    const name = String(hotel.hotelName || '');
    const address = String(hotel.fallbackAddress || '');
    const latitude = Number(hotel.latitude || 0);
    const longitude = Number(hotel.longitude || 0);
    const combined = `${name} ${address}`;

    return /Ulsan|울산/i.test(address)
      && !excludedText.test(combined)
      && latitude >= 35.30
      && latitude <= 35.75
      && longitude >= 128.95
      && longitude <= 129.55
      && Number(hotel.reviewCount || 0) >= 5
      && Number(hotel.reviewScore || 0) >= 6.5;
  })
  .sort((a, b) => {
    const scoreA = Number(a.reviewCount || 0) * Math.max(0.1, Number(a.reviewScore || 0));
    const scoreB = Number(b.reviewCount || 0) * Math.max(0.1, Number(b.reviewScore || 0));
    return scoreB - scoreA;
  });

await writeFile(outputHotelsPath, `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
await writeFile(outputSlugsPath, `${JSON.stringify(selected.map((hotel) => hotel.slug), null, 2)}\n`, 'utf8');

console.log(`Selected ${selected.length} strict Ulsan candidates from ${candidates.length} candidates`);
