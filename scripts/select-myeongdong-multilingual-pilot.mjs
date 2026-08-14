import { mkdirSync, writeFileSync } from 'node:fs';
import { generatedHotels } from '../src/data/generatedHotels.ts';

const targetCount = Number(process.env.TARGET_COUNT || '8');
const exactArea = /명동|을지로|남대문|회현|충무로|myeongdong|euljiro|namdaemun/i;
const centralJungGu = /서울특별시\s*중구|서울\s*중구/i;
const excluded = /동대문|신당|약수|장충|청구/i;

const candidates = generatedHotels
  .filter((hotel) => {
    const text = [hotel.hotelName, hotel.region, hotel.address].join(' ');
    const isSeoul = hotel.slug.startsWith('seoul-') || /서울|seoul/i.test([hotel.region, hotel.address].join(' '));
    return isSeoul && (exactArea.test(text) || centralJungGu.test(text)) && !excluded.test(text);
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

mkdirSync('data', { recursive: true });
writeFileSync('data/multilingual-myeongdong-pilot.json', `${JSON.stringify(selected, null, 2)}\n`, 'utf8');

console.log(`Selected ${selected.length} Myeongdong hotels from ${candidates.length} qualified candidates.`);
console.table(selected);

function countImages(hotel) {
  return new Set([
    hotel.imageUrl,
    ...(hotel.analysis?.blogReview?.sections || []).map((section) => section.image?.url)
  ].filter(Boolean)).size;
}

function pilotScore(hotel) {
  const reviews = Math.log10(Math.max(10, hotel.reviewCount || 0));
  const references = Math.min(5, hotel.referenceLinks?.length || 0);
  const exactBonus = exactArea.test([hotel.hotelName, hotel.address].join(' ')) ? 30 : 0;
  return reviews * 100 + (hotel.reviewScore || 0) * 12 + references * 4 + exactBonus;
}
