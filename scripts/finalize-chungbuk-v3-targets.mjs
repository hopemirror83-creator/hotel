import { readFileSync, writeFileSync } from 'node:fs';

const sourcePath = 'data/target-hotels-chungbuk-v3-candidates-all.json';
const hotelsPath = 'data/target-hotels-chungbuk-v3-188.json';
const slugsPath = 'data/target-slugs-chungbuk-v3-188.json';

const hotels = JSON.parse(readFileSync(sourcePath, 'utf8'));
const regionSignal = /(Chungcheongbuk(?:-do)?|충청북도|충북|청주|충주|제천|단양|음성|진천|괴산|증평|보은|옥천|영동|Cheongju|Chungju|Jecheon|Danyang|Eumseong|Jincheon|Goesan|Jeungpyeong|Boeun|Okcheon|Yeongdong)/i;
const wrongRegion = /(서울|Seoul|강릉|Gangneung|춘천|Chuncheon|여수|Yeosu|양평|Yangpyeong|부산|Busan|제주|Jeju|경주|Gyeongju|전주|Jeonju|대전|Daejeon|세종|Sejong)/i;

const selected = hotels
  .filter((hotel) => {
    const address = String(hotel.fallbackAddress || '');
    const latitude = Number(hotel.latitude);
    const longitude = Number(hotel.longitude);
    const inBounds = latitude >= 36 && latitude <= 37.25 && longitude >= 127.25 && longitude <= 128.65;
    return inBounds && regionSignal.test(address) && !wrongRegion.test(address);
  })
  .sort((a, b) => qualityScore(b) - qualityScore(a));

writeFileSync(hotelsPath, `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
writeFileSync(slugsPath, `${JSON.stringify(selected.map((hotel) => hotel.slug), null, 2)}\n`, 'utf8');

console.log(`Finalized ${selected.length} Chungbuk v3 hotels`);
console.table(selected.slice(0, 20).map((hotel, index) => ({
  rank: index + 1,
  slug: hotel.slug,
  hotelName: hotel.hotelName,
  reviewScore: hotel.reviewScore,
  reviewCount: hotel.reviewCount,
  address: hotel.fallbackAddress
})));

function qualityScore(hotel) {
  return Math.log10(Number(hotel.reviewCount || 0) + 1) * 130
    + Number(hotel.reviewScore || 0) * 18
    + (hotel.imageUrl ? 55 : 0);
}
