import { readFile, writeFile } from 'node:fs/promises';

const candidates = JSON.parse(await readFile('data/candidates-fukuoka-v1-all.json', 'utf8'));

const selected = candidates
  .filter((hotel) => {
    const latitude = Number(hotel.latitude || 0);
    const longitude = Number(hotel.longitude || 0);
    const address = String(hotel.fallbackAddress || '');
    const imageUrl = String(hotel.imageUrl || '');

    return latitude >= 33.50
      && latitude <= 33.72
      && longitude >= 130.28
      && longitude <= 130.52
      && /Fukuoka|후쿠오카|福岡/i.test(address)
      && !/Kitakyushu|Kokura|Kurume|Dazaifu|Itoshima|Iizuka|Munakata|Saga|Yamaguchi|기타큐슈|고쿠라|구루메|다자이후|이토시마|사가|야마구치/i.test(address)
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
  .map((hotel) => ({ ...hotel, country: '일본', skipMapMatch: true }));

await writeFile('data/target-hotels-fukuoka-v1-quality.json', `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
await writeFile('data/target-slugs-fukuoka-v1-quality.json', `${JSON.stringify(selected.map((hotel) => hotel.slug), null, 2)}\n`, 'utf8');

console.log(`Selected ${selected.length} strict Fukuoka candidates from ${candidates.length} ranked candidates`);
console.log(`Minimum reviews: ${Math.min(...selected.map((hotel) => Number(hotel.reviewCount || 0)))}`);
console.log(`Minimum score: ${Math.min(...selected.map((hotel) => Number(hotel.reviewScore || 0)))}`);
console.table(selected.slice(0, 20).map((hotel, index) => ({ rank: index + 1, slug: hotel.slug, hotelName: hotel.hotelName, reviewScore: hotel.reviewScore, reviewCount: hotel.reviewCount })));
