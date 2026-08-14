import { readFile, writeFile } from 'node:fs/promises';

const input = JSON.parse(await readFile('data/target-hotels-gangwon-v4-candidates.json', 'utf8'));
const excludedName = /서울|부산|제주|서귀포|인천|대전|대구|광주|울산|경주|여수|전주|청주|충주|수원|용인|고양|파주|김포|의정부|성남|분당|안양|부천|시흥|화성|평택|오산|안산|군포|광명|하남|이천|포천|가평|남양주|양평/;
const lowValueName = /아파트먼트|프라이빗|침실\s*\d+개|Netflix|넷플릭스|문자로 문의|자가격리|한달살기|장기숙박/i;

const selected = input
  .filter((hotel) => {
    const lat = Number(hotel.latitude);
    const lng = Number(hotel.longitude);
    const inGangwon = lat >= 37.02 && lat <= 38.62 && lng >= 127.05 && lng <= 129.40;
    return inGangwon && !excludedName.test(hotel.hotelName) && !lowValueName.test(hotel.hotelName);
  })
  .slice(0, 200)
  .map((hotel) => ({ ...hotel, region: '강원' }));

if (selected.length < 200) throw new Error(`강원 최종 후보가 ${selected.length}개뿐입니다.`);

await writeFile('data/target-hotels-gangwon-v4-200.json', `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
await writeFile('data/target-slugs-gangwon-v4-200.json', `${JSON.stringify(selected.map((hotel) => hotel.slug), null, 2)}\n`, 'utf8');
console.log(`Finalized ${selected.length} Gangwon v4 hotels.`);
console.table(selected.slice(0, 20).map((hotel, index) => ({ rank: index + 1, slug: hotel.slug, hotelName: hotel.hotelName, reviewScore: hotel.reviewScore, reviewCount: hotel.reviewCount })));
