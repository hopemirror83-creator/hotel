import { readFile, writeFile } from 'node:fs/promises';

const input = JSON.parse(await readFile('data/target-hotels-gyeongbuk-v4-candidates.json', 'utf8'));
const lowValueName = /아파트먼트|프라이빗\s*(하우스|빌라)|스튜디오\s*아파트|침실\s*\d+개|프라이빗\s*욕실|문자로\s*문의|통화안됨|Netflix|넷플릭스|자가격리|장기숙박|한달살기|♡|#|최대\s*\d+인|Room\s*\d+/i;

const selected = input
  .filter((hotel) => {
    const lat = Number(hotel.latitude);
    const lng = Number(hotel.longitude);
    const inGyeongbuk = lat >= 35.50 && lat <= 37.65 && lng >= 127.95 && lng <= 131.00;
    const usefulScore = Number(hotel.reviewScore || 0) >= 6.5;
    const conciseName = String(hotel.hotelName || '').length <= 52;
    return inGyeongbuk && usefulScore && conciseName && !lowValueName.test(hotel.hotelName || '');
  })
  .slice(0, 200)
  .map((hotel) => ({ ...hotel, region: '경북' }));

if (selected.length < 200) {
  throw new Error(`Gyeongbuk v4 has only ${selected.length} qualified candidates.`);
}

await writeFile('data/target-hotels-gyeongbuk-v4-200.json', `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
await writeFile('data/target-slugs-gyeongbuk-v4-200.json', `${JSON.stringify(selected.map((hotel) => hotel.slug), null, 2)}\n`, 'utf8');
console.log(`Finalized ${selected.length} Gyeongbuk v4 hotels.`);
console.table(selected.slice(0, 20).map((hotel, index) => ({
  rank: index + 1,
  slug: hotel.slug,
  hotelName: hotel.hotelName,
  reviewScore: hotel.reviewScore,
  reviewCount: hotel.reviewCount
})));
