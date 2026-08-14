import { readFile, writeFile } from 'node:fs/promises';

const input = JSON.parse(await readFile('data/target-hotels-seoul-v5-candidates.json', 'utf8'));

const excludedName = /속초|부산|제주|서귀포|강릉|인천|대전|대구|광주|울산|경주|여수|김해|전주|춘천|평창|양양|포천|가평|남양주|수원|용인|고양|파주|김포(?!공항)|의정부|성남|분당|안양|부천|시흥|화성|평택|오산|안산|군포|광명|하남|이천|여주|양평|구리/;
const lowValueName = /아파트먼트|프라이빗|침실\s*\d+개|Netflix|넷플릭스|문자로 문의|자가격리|한달살기|장기숙박|여성전용.*고시원/i;

const selected = input
  .filter((hotel) => {
    const lat = Number(hotel.latitude);
    const lng = Number(hotel.longitude);
    const inSeoul = lat >= 37.41 && lat <= 37.72 && lng >= 126.76 && lng <= 127.19;
    return inSeoul && !excludedName.test(hotel.hotelName) && !lowValueName.test(hotel.hotelName);
  })
  .slice(0, 200)
  .map((hotel) => ({ ...hotel, region: '서울' }));

if (selected.length < 200) {
  throw new Error(`서울 최종 후보가 ${selected.length}개뿐입니다.`);
}

await writeFile('data/target-hotels-seoul-v5-200.json', `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
await writeFile('data/target-slugs-seoul-v5-200.json', `${JSON.stringify(selected.map((hotel) => hotel.slug), null, 2)}\n`, 'utf8');

console.log(`Finalized ${selected.length} Seoul v5 hotels.`);
console.table(selected.slice(0, 20).map((hotel, index) => ({
  rank: index + 1,
  slug: hotel.slug,
  hotelName: hotel.hotelName,
  reviewScore: hotel.reviewScore,
  reviewCount: hotel.reviewCount
})));
