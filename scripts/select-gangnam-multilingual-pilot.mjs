import { writeFileSync } from 'node:fs';
import { generatedHotels } from '../src/data/generatedHotels.ts';

const targetCount = Number(process.env.TARGET_COUNT || '8');
const gangnamArea = /강남구|서초구|강남역|역삼|삼성동|코엑스|논현|신사동|청담|선릉|양재|gangnam|yeoksam|samseong|coex|nonhyeon|sinsa|cheongdam/i;
const excluded = /부산|제주|인천|수원|용인|강릉|강남면/i;

const candidates = generatedHotels
  .filter((hotel) => {
    const text = [hotel.hotelName, hotel.region, hotel.address].join(' ');
    const isSeoul = hotel.slug.startsWith('seoul-');
    return isSeoul && gangnamArea.test(text) && !excluded.test(text);
  })
  .filter((hotel) => (
    (hotel.reviewCount || 0) >= 100 &&
    (hotel.reviewScore || 0) >= 7.5 &&
    (hotel.analysis?.blogReview?.sections?.length || 0) >= 6 &&
    countImages(hotel) >= 6
  ))
  .sort((a, b) => pilotScore(b) - pilotScore(a));

const selected = candidates.slice(0, targetCount).map((hotel) => ({
  slug: hotel.slug,
  hotelName: hotel.hotelName,
  region: hotel.region,
  address: hotel.address,
  reviewScore: hotel.reviewScore,
  reviewCount: hotel.reviewCount,
  imageCount: countImages(hotel),
  referenceCount: hotel.referenceLinks?.length || 0
}));

writeFileSync('data/multilingual-gangnam-pilot.json', `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
console.log(`Selected ${selected.length} Gangnam hotels from ${candidates.length} qualified candidates.`);
console.table(selected);

function countImages(hotel) {
  return new Set([hotel.imageUrl, ...(hotel.analysis?.blogReview?.sections || []).map((section) => section.image?.url)].filter(Boolean)).size;
}

function pilotScore(hotel) {
  return Math.log10(Math.max(10, hotel.reviewCount || 0)) * 100 + (hotel.reviewScore || 0) * 12 + Math.min(5, hotel.referenceLinks?.length || 0) * 4;
}
