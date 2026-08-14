import { readFile, writeFile } from 'node:fs/promises';

const inputPath = 'data/candidates-gyeonggi-next-quality.json';
const targetPath = 'data/target-hotels-gyeonggi-v5-200.json';
const slugPath = 'data/target-slugs-gyeonggi-v5-200.json';

const candidates = JSON.parse(await readFile(inputPath, 'utf8'));
const otherRegionPattern = /서울|Seoul|인천|Incheon|강원|Gangwon|충북|Chungbuk|충남|Chungnam|경북|Gyeongbuk|전북|Jeonbuk|부산|Busan|제주|Jeju/i;
const privateStayPattern = /아파트먼트|프라이빗 하우스|스튜디오 아파트|빌라 \(|침실 \d+개|private house|apartment \(/i;

const selected = candidates.filter((hotel) => {
  const latitude = Number(hotel.latitude);
  const longitude = Number(hotel.longitude);
  const address = String(hotel.fallbackAddress || '');
  const addressWithoutRegion = address.replace(/경기|Gyeonggi/gi, '');

  return latitude >= 36.8
    && latitude <= 38.3
    && longitude >= 126
    && longitude <= 127.9
    && /경기|Gyeonggi/i.test(address)
    && !otherRegionPattern.test(addressWithoutRegion)
    && !privateStayPattern.test(String(hotel.hotelName || ''));
}).slice(0, 200);

if (selected.length !== 200) {
  throw new Error(`Expected 200 Gyeonggi targets, found ${selected.length}`);
}

await writeFile(targetPath, `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
await writeFile(slugPath, `${JSON.stringify(selected.map((hotel) => hotel.slug), null, 2)}\n`, 'utf8');

console.log(JSON.stringify({
  selected: selected.length,
  minReviewScore: Math.min(...selected.map((hotel) => Number(hotel.reviewScore || 0))),
  minReviewCount: Math.min(...selected.map((hotel) => Number(hotel.reviewCount || 0))),
  sample: selected.slice(0, 10).map((hotel) => ({
    slug: hotel.slug,
    hotelName: hotel.hotelName,
    reviewScore: hotel.reviewScore,
    reviewCount: hotel.reviewCount,
    address: hotel.fallbackAddress
  }))
}, null, 2));
