import { readFile, writeFile } from 'node:fs/promises';

const candidates = JSON.parse(await readFile('data/candidates-okinawa-v1-all.json', 'utf8'));
const excluded = /Ishigaki|Miyakojima|Miyako-jima|Taketomi|Yonaguni|Kumejima|Zamami|Tokashiki|이시가키|미야코지마|다케토미|요나구니|구메지마|자마미|도카시키/i;

const selected = candidates.filter((hotel) => {
  const lat = Number(hotel.latitude || 0);
  const lon = Number(hotel.longitude || 0);
  const text = [hotel.hotelName, hotel.fallbackAddress, hotel.addressLine1, hotel.addressLine2, hotel.city, hotel.state].filter(Boolean).join(' ');
  const image = String(hotel.imageUrl || hotel.imageURL || '');
  return lat >= 25.95 && lat <= 26.90 && lon >= 127.55 && lon <= 128.40
    && !excluded.test(text) && /^https?:\/\//i.test(image)
    && Number(hotel.reviewCount || 0) >= 100 && Number(hotel.reviewScore || 0) >= 7.5;
}).sort((a, b) => Number(b.reviewCount || 0) * Number(b.reviewScore || 0) - Number(a.reviewCount || 0) * Number(a.reviewScore || 0))
  .slice(0, 200).map((hotel) => ({ ...hotel, country: '일본', skipMapMatch: true }));

await writeFile('data/target-hotels-okinawa-v1-quality.json', `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
await writeFile('data/target-slugs-okinawa-v1-quality.json', `${JSON.stringify(selected.map((hotel) => hotel.slug), null, 2)}\n`, 'utf8');
console.log(`Selected ${selected.length} Okinawa main-island hotels from ${candidates.length} candidates`);
console.log(`Minimum reviews: ${Math.min(...selected.map((hotel) => Number(hotel.reviewCount || 0)))}`);
console.log(`Minimum score: ${Math.min(...selected.map((hotel) => Number(hotel.reviewScore || 0)))}`);
console.table(selected.slice(0, 20).map((hotel, index) => ({ rank: index + 1, slug: hotel.slug, hotelName: hotel.hotelName, reviewScore: hotel.reviewScore, reviewCount: hotel.reviewCount })));
