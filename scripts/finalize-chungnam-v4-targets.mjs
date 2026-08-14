import { readFile, writeFile } from 'node:fs/promises';

const input = JSON.parse(await readFile('data/target-hotels-chungnam-v4-candidates-strict.json', 'utf8'));

const regionSignal = /천안|공주|보령|아산|서산|논산|계룡|당진|금산|부여|서천|청양|홍성|예산|태안|Cheonan|Gongju|Boryeong|Asan|Seosan|Nonsan|Gyeryong|Dangjin|Geumsan|Buyeo|Seocheon|Cheongyang|Hongseong|Yesan|Taean/i;
const outsideRegion = /세종시|세종특별|Sejong-si|Sejong City/i;
const lowValueName = /오피스텔|아파트|원룸|고시원|자가격리|한달살기|문자로\s*문의|전화\s*문의|Room\s*\d+|객실\s*\d+|입실\s*\d*시/i;
const lodgingSignal = /호텔|리조트|펜션|풀빌라|게스트하우스|모텔|스테이|민박|한옥|캠핑|카라반|빌라|하우스|콘도|Hotel|Resort|Pension|Stay|Villa|Guest|Motel|Condo/i;

const qualified = input
  .filter((hotel) => {
    const lat = Number(hotel.latitude);
    const lng = Number(hotel.longitude);
    const address = String(hotel.fallbackAddress || '');
    const name = String(hotel.hotelName || '');
    const inChungnamBounds = lat >= 35.85 && lat <= 37.15 && lng >= 125.75 && lng <= 127.65;
    return inChungnamBounds
      && regionSignal.test(address)
      && !outsideRegion.test(address)
      && !lowValueName.test(name)
      && name.length >= 2
      && name.length <= 52;
  })
  .sort((a, b) => qualityScore(b) - qualityScore(a));

const selected = qualified.slice(0, 200).map((hotel) => ({ ...hotel, region: '충남' }));
if (selected.length < 200) throw new Error(`Chungnam v4 has only ${selected.length} qualified candidates.`);

await writeFile('data/target-hotels-chungnam-v4-200.json', `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
await writeFile('data/target-slugs-chungnam-v4-200.json', `${JSON.stringify(selected.map((hotel) => hotel.slug), null, 2)}\n`, 'utf8');

console.log(`Finalized ${selected.length} Chungnam v4 hotels from ${qualified.length} qualified candidates.`);
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
