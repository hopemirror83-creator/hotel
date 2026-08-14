import { readFileSync, writeFileSync } from 'node:fs';

const sourcePath = 'data/target-hotels-gyeongnam-v5-candidates-all.json';
const hotelsPath = 'data/target-hotels-gyeongnam-v5-200.json';
const slugsPath = 'data/target-slugs-gyeongnam-v5-200.json';

const hotels = JSON.parse(readFileSync(sourcePath, 'utf8'));
const regionSignal = /(Gyeongsangnam(?:-do)?|경상남도|경남|창원|김해|양산|진주|거제|통영|사천|밀양|함안|거창|창녕|고성|하동|합천|남해|함양|산청|의령|Changwon|Gimhae|Yangsan|Jinju|Geoje|Tongyeong|Sacheon|Miryang|Haman|Geochang|Changnyeong|Goseong|Hadong|Hapcheon|Namhae|Hamyang|Sancheong|Uiryeong)/i;
const wrongRegion = /(부산|Busan|대구|Daegu|울산|Ulsan|경주|Gyeongju|포항|Pohang|여수|Yeosu|순천|Suncheon|전주|Jeonju|제주|Jeju|Gyeongsangbuk|경상북도|경북|성주|Seongju|청도|Cheongdo)/i;

const selected = hotels
  .filter((hotel) => {
    const address = String(hotel.fallbackAddress || '');
    const latitude = Number(hotel.latitude);
    const longitude = Number(hotel.longitude);
    const inBounds = latitude >= 34.5 && latitude <= 35.9 && longitude >= 127.5 && longitude <= 129.3;
    return inBounds && regionSignal.test(address) && !wrongRegion.test(address);
  })
  .sort((a, b) => qualityScore(b) - qualityScore(a))
  .slice(0, 200);

writeFileSync(hotelsPath, `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
writeFileSync(slugsPath, `${JSON.stringify(selected.map((hotel) => hotel.slug), null, 2)}\n`, 'utf8');

console.log(`Finalized ${selected.length} Gyeongnam v5 hotels`);
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
