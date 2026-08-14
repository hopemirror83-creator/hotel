import { readFile, writeFile } from 'node:fs/promises';

const candidates = JSON.parse(await readFile('data/candidates-yokohama-v1-all.json', 'utf8'));

const selected = candidates
  .filter((hotel) => {
    const latitude = Number(hotel.latitude || 0);
    const longitude = Number(hotel.longitude || 0);
    const imageUrl = String(hotel.imageUrl || '');
    const address = String(hotel.fallbackAddress || '');
    const name = String(hotel.hotelName || '');

    // Yokohama city proper. Exclude Tokyo, Kawasaki, Kamakura, and Yokosuka
    // properties that can be grouped into broad Yokohama search results.
    const inYokohama = latitude >= 35.30
      && latitude <= 35.61
      && longitude >= 139.46
      && longitude <= 139.75;

    return inYokohama
      && /Yokohama|요코하마|横浜/i.test(address)
      && !/Tokyo|Kawasaki|Kamakura|Yokosuka|도쿄|가와사키|가마쿠라|요코스카/i.test(address)
      && !/Kawasaki|Musashi|Mizonokuchi|가와사키|카와사키|무사시|미조노구치/i.test(name)
      && !(latitude >= 35.52 && longitude >= 139.68)
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

await writeFile('data/target-hotels-yokohama-v1-quality.json', `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
await writeFile('data/target-slugs-yokohama-v1-quality.json', `${JSON.stringify(selected.map((hotel) => hotel.slug), null, 2)}\n`, 'utf8');

console.log(`Selected ${selected.length} strict Yokohama candidates from ${candidates.length} ranked candidates`);
if (selected.length > 0) {
  console.log(`Minimum reviews: ${Math.min(...selected.map((hotel) => Number(hotel.reviewCount || 0)))}`);
  console.log(`Minimum score: ${Math.min(...selected.map((hotel) => Number(hotel.reviewScore || 0)))}`);
}
