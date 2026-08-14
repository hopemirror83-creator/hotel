import { readFile, writeFile } from 'node:fs/promises';

const input = JSON.parse(await readFile('data/target-hotels-jeonbuk-v4-candidates-all.json', 'utf8'));

const regionSignal = /전주|군산|익산|부안|고창|남원|무주|완주|정읍|진안|장수|임실|김제|순창|Jeollabuk|Jeonju|Gunsan|Iksan|Buan|Gochang|Namwon|Muju|Wanju|Jeongeup|Jinan|Jangsu|Imsil|Gimje|Sunchang/i;
const outsideRegion = /서천|옥천|논산|공주|대전|충남|충북|광주광역|전남|경남|경북|Seocheon|Okcheon|Nonsan|Gongju|Daejeon|Chungcheong|Gwangju|Jeollanam|Gyeongsang/i;
const lowValueName = /오피스텔|아파트|원룸|고시원|자가격리|한달살기|문자로\s*문의|전화\s*문의|Room\s*\d+|객실\s*\d+|입실\s*\d*시/i;
const lodgingSignal = /호텔|리조트|펜션|풀빌라|게스트하우스|모텔|스테이|민박|한옥|캠핑|카라반|빌라|하우스|콘도|Hotel|Resort|Pension|Stay|Villa|Guest|Motel|Condo/i;

const qualified = input
  .filter((hotel) => {
    const lat = Number(hotel.latitude);
    const lng = Number(hotel.longitude);
    const address = String(hotel.fallbackAddress || '');
    const name = String(hotel.hotelName || '');
    const inJeonbukBounds = lat >= 35.25 && lat <= 36.18 && lng >= 126.25 && lng <= 127.95;
    return inJeonbukBounds
      && regionSignal.test(address)
      && !outsideRegion.test(address)
      && !lowValueName.test(name)
      && name.length >= 2
      && name.length <= 52;
  })
  .sort((a, b) => qualityScore(b) - qualityScore(a));

const selected = qualified.slice(0, 200).map((hotel) => ({ ...hotel, region: '전북' }));
if (selected.length < 200) throw new Error(`Jeonbuk v4 has only ${selected.length} qualified candidates.`);

await writeFile('data/target-hotels-jeonbuk-v4-200.json', `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
await writeFile('data/target-slugs-jeonbuk-v4-200.json', `${JSON.stringify(selected.map((hotel) => hotel.slug), null, 2)}\n`, 'utf8');

console.log(`Finalized ${selected.length} Jeonbuk v4 hotels from ${qualified.length} qualified candidates.`);
console.table(selected.slice(0, 30).map((hotel, index) => ({
  rank: index + 1,
  slug: hotel.slug,
  hotelName: hotel.hotelName,
  reviewScore: hotel.reviewScore,
  reviewCount: hotel.reviewCount,
  address: hotel.fallbackAddress
})));

function qualityScore(hotel) {
  const reviews = Math.log10(Number(hotel.reviewCount || 0) + 1) * 130;
  const rating = Number(hotel.reviewScore || 0) * 18;
  const lodgingBonus = lodgingSignal.test(String(hotel.hotelName || '')) ? 24 : 0;
  const imageBonus = String(hotel.imageUrl || '').trim() ? 55 : 0;
  return reviews + rating + lodgingBonus + imageBonus;
}
