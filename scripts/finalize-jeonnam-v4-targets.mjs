import { readFile, writeFile } from 'node:fs/promises';

const input = JSON.parse(await readFile('data/target-hotels-jeonnam-v4-candidates-wide.json', 'utf8'));

const outsideRegion = /전북|전라북|광주광역|경남|경상남|제주|Jeollabuk|Gwangju|Gyeongsangnam|Jeju/i;
const lowValueName = /오피스텔|아파트|원룸|고시원|무인텔.*Netflix|넷플릭스|자가격리|한달살기|문자로\s*문의|전화\s*문의|Room\s*\d+|객실\s*\d+|입실\s*\d*시/i;
const lodgingSignal = /호텔|리조트|펜션|풀빌라|게스트하우스|모텔|스테이|민박|한옥|캠핑|카라반|빌라|하우스|Hotel|Resort|Pension|Stay|Villa|Guest|Motel/i;

const qualified = input
  .filter((hotel) => {
    const lat = Number(hotel.latitude);
    const lng = Number(hotel.longitude);
    const address = String(hotel.fallbackAddress || '');
    const name = String(hotel.hotelName || '');
    const inJeonnamBounds = lat >= 33.85 && lat <= 35.55 && lng >= 125.75 && lng <= 128.05;
    return inJeonnamBounds
      && !outsideRegion.test(address)
      && !lowValueName.test(name)
      && Number(hotel.reviewCount || 0) >= 1
      && name.length >= 2
      && name.length <= 52;
  })
  .sort((a, b) => qualityScore(b) - qualityScore(a));

const selected = qualified.slice(0, 200).map((hotel) => ({ ...hotel, region: '전남' }));

if (selected.length < 200) {
  throw new Error(`Jeonnam v4 has only ${selected.length} qualified candidates.`);
}

await writeFile('data/target-hotels-jeonnam-v4-200.json', `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
await writeFile('data/target-slugs-jeonnam-v4-200.json', `${JSON.stringify(selected.map((hotel) => hotel.slug), null, 2)}\n`, 'utf8');

console.log(`Finalized ${selected.length} Jeonnam v4 hotels from ${qualified.length} qualified candidates.`);
console.table(selected.slice(0, 30).map((hotel, index) => ({
  rank: index + 1,
  slug: hotel.slug,
  hotelName: hotel.hotelName,
  reviewScore: hotel.reviewScore,
  reviewCount: hotel.reviewCount,
  address: hotel.fallbackAddress
})));

function qualityScore(hotel) {
  const reviews = Math.log10(Number(hotel.reviewCount || 0) + 1) * 120;
  const rating = Number(hotel.reviewScore || 0) * 18;
  const lodgingBonus = lodgingSignal.test(String(hotel.hotelName || '')) ? 22 : 0;
  const fullImageBonus = /[?&]s=|hotelimages|hotelImages/.test(String(hotel.imageUrl || '')) ? 35 : 0;
  return reviews + rating + lodgingBonus + fullImageBonus;
}
