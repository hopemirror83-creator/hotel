import { readFileSync, writeFileSync } from 'node:fs';

const sourcePath = 'data/target-hotels-gyeonggi-v6-candidates-all.json';
const hotelsPath = 'data/target-hotels-gyeonggi-v6-200.json';
const slugsPath = 'data/target-slugs-gyeonggi-v6-200.json';

const hotels = JSON.parse(readFileSync(sourcePath, 'utf8'));
const regionSignal = /(Gyeonggi(?:-do)?|경기도|경기|수원|성남|고양|용인|부천|안산|안양|남양주|화성|평택|의정부|시흥|파주|광명|김포|군포|광주|이천|양주|오산|구리|안성|포천|의왕|하남|여주|동두천|과천|가평|양평|Suwon|Seongnam|Goyang|Yongin|Bucheon|Ansan|Anyang|Namyangju|Hwaseong|Pyeongtaek|Uijeongbu|Siheung|Paju|Gwangmyeong|Gimpo|Gunpo|Gwangju|Icheon|Yangju|Osan|Guri|Anseong|Pocheon|Uiwang|Hanam|Yeoju|Dongducheon|Gwacheon|Gapyeong|Yangpyeong)/i;
const wrongRegion = /(전주|Jeonju|부산|Busan|제주|Jeju|강릉|Gangneung|춘천|Chuncheon|대전|Daejeon|세종|Sejong|충주|Chungju|청주|Cheongju|여수|Yeosu|경주|Gyeongju)/i;

const selected = hotels
  .filter((hotel) => {
    const address = String(hotel.fallbackAddress || '');
    const latitude = Number(hotel.latitude);
    const longitude = Number(hotel.longitude);
    const inBounds = latitude >= 36.75 && latitude <= 38.3 && longitude >= 126.3 && longitude <= 127.85;
    return inBounds && regionSignal.test(address) && !wrongRegion.test(address);
  })
  .sort((a, b) => qualityScore(b) - qualityScore(a))
  .slice(0, 200);

writeFileSync(hotelsPath, `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
writeFileSync(slugsPath, `${JSON.stringify(selected.map((hotel) => hotel.slug), null, 2)}\n`, 'utf8');

console.log(`Finalized ${selected.length} Gyeonggi v6 hotels`);
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
