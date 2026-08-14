import { readFile, writeFile } from 'node:fs/promises';

const candidates = JSON.parse(await readFile('data/candidates-sapporo-v1-all.json', 'utf8'));

const excludedPlaces = /Chitose|Otaru|Niseko|Kutchan|Rusutsu|Furano|Asahikawa|Noboribetsu|Hakodate|Tomakomai|Ebetsu|Kitahiroshima|Ishikari|Yoichi|치토세|오타루|니세코|굿찬|루스츠|후라노|아사히카와|노보리베츠|하코다테|도마코마이|에베쓰|기타히로시마|이시카리|요이치/i;

const selected = candidates
  .filter((hotel) => {
    const latitude = Number(hotel.latitude || 0);
    const longitude = Number(hotel.longitude || 0);
    const address = [hotel.fallbackAddress, hotel.addressLine1, hotel.addressLine2, hotel.city, hotel.state]
      .filter(Boolean)
      .join(' ');
    const imageUrl = String(hotel.imageUrl || hotel.imageURL || '');

    return latitude >= 42.90
      && latitude <= 43.22
      && longitude >= 141.15
      && longitude <= 141.55
      && !excludedPlaces.test(address)
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

await writeFile('data/target-hotels-sapporo-v1-quality.json', `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
await writeFile('data/target-slugs-sapporo-v1-quality.json', `${JSON.stringify(selected.map((hotel) => hotel.slug), null, 2)}\n`, 'utf8');

console.log(`Selected ${selected.length} strict Sapporo candidates from ${candidates.length} ranked candidates`);
console.log(`Minimum reviews: ${Math.min(...selected.map((hotel) => Number(hotel.reviewCount || 0)))}`);
console.log(`Minimum score: ${Math.min(...selected.map((hotel) => Number(hotel.reviewScore || 0)))}`);
console.table(selected.slice(0, 20).map((hotel, index) => ({ rank: index + 1, slug: hotel.slug, hotelName: hotel.hotelName, reviewScore: hotel.reviewScore, reviewCount: hotel.reviewCount })));
