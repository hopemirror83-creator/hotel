import { readFile, writeFile } from 'node:fs/promises';

const candidates = JSON.parse(await readFile('data/candidates-kobe-v1-all.json', 'utf8'));

const selected = candidates
  .filter((hotel) => {
    const latitude = Number(hotel.latitude || 0);
    const longitude = Number(hotel.longitude || 0);
    const imageUrl = String(hotel.imageUrl || '');

    // Kobe city, including Rokko and Arima Onsen. This deliberately excludes
    // Awaji Island and neighboring cities that Agoda groups under Kobe.
    const inKobe = latitude >= 34.58
      && latitude <= 34.91
      && longitude >= 134.98
      && longitude <= 135.34;

    return inKobe
      && /^https?:\/\//i.test(imageUrl)
      && Number(hotel.reviewCount || 0) >= 20
      && Number(hotel.reviewScore || 0) >= 7.5;
  })
  .sort((a, b) => {
    const scoreA = Number(a.reviewCount || 0) * Math.max(0.1, Number(a.reviewScore || 0));
    const scoreB = Number(b.reviewCount || 0) * Math.max(0.1, Number(b.reviewScore || 0));
    return scoreB - scoreA;
  })
  .slice(0, 200)
  .map((hotel) => ({ ...hotel, country: '일본', skipMapMatch: true }));

await writeFile('data/target-hotels-kobe-v1-quality.json', `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
await writeFile('data/target-slugs-kobe-v1-quality.json', `${JSON.stringify(selected.map((hotel) => hotel.slug), null, 2)}\n`, 'utf8');

console.log(`Selected ${selected.length} strict Kobe candidates from ${candidates.length} ranked candidates`);
console.log(`Minimum reviews: ${Math.min(...selected.map((hotel) => Number(hotel.reviewCount || 0)))}`);
console.log(`Minimum score: ${Math.min(...selected.map((hotel) => Number(hotel.reviewScore || 0)))}`);
