import { readFile, writeFile } from 'node:fs/promises';

const candidates = JSON.parse(await readFile('data/candidates-osaka-v1-all.json', 'utf8'));

const selected = candidates
  .filter((hotel) => {
    const latitude = Number(hotel.latitude || 0);
    const longitude = Number(hotel.longitude || 0);
    const address = String(hotel.fallbackAddress || '');
    const imageUrl = String(hotel.imageUrl || '');

    return latitude >= 34.20
      && latitude <= 35.10
      && longitude >= 134.90
      && longitude <= 136.10
      && /Osaka|오사카|大阪/i.test(address)
      && /^https?:\/\//i.test(imageUrl)
      && Number(hotel.reviewCount || 0) >= 100
      && Number(hotel.reviewScore || 0) >= 7.5;
  })
  .sort((a, b) => {
    const scoreA = Number(a.reviewCount || 0) * Math.max(0.1, Number(a.reviewScore || 0));
    const scoreB = Number(b.reviewCount || 0) * Math.max(0.1, Number(b.reviewScore || 0));
    return scoreB - scoreA;
  })
  .slice(0, 200)
  .map((hotel) => ({
    ...hotel,
    country: '일본',
    skipMapMatch: true
  }));

await writeFile('data/target-hotels-osaka-v1-quality.json', `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
await writeFile('data/target-slugs-osaka-v1-quality.json', `${JSON.stringify(selected.map((hotel) => hotel.slug), null, 2)}\n`, 'utf8');

console.log(`Selected ${selected.length} strict Osaka candidates from ${candidates.length} ranked candidates`);
console.log(`Minimum reviews: ${Math.min(...selected.map((hotel) => Number(hotel.reviewCount || 0)))}`);
console.log(`Minimum score: ${Math.min(...selected.map((hotel) => Number(hotel.reviewScore || 0)))}`);
