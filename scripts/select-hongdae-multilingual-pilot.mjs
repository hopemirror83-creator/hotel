import { writeFileSync } from 'node:fs';
import { generatedHotels } from '../src/data/generatedHotels.ts';

const targetCount = Number(process.env.TARGET_COUNT || '8');
const hongdaeArea = /홍대|홍익대|홍대입구|연남|합정|상수|신촌|hongdae|hongik|yeonnam|hapjeong|sangsu|sinchon/i;
const excluded = /공덕|마포역|여의도|영등포|김포|부산|제주|인천/i;

const candidates = generatedHotels
  .filter((hotel) => {
    const text = [hotel.hotelName, hotel.region, hotel.address].join(' ');
    return hotel.slug.startsWith('seoul-') && hongdaeArea.test(text) && !excluded.test(text);
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

writeFileSync('data/multilingual-hongdae-pilot.json', `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
console.log(`Selected ${selected.length} Hongdae hotels from ${candidates.length} qualified candidates.`);
console.table(selected);

function countImages(hotel) {
  return new Set([hotel.imageUrl, ...(hotel.analysis?.blogReview?.sections || []).map((section) => section.image?.url)].filter(Boolean)).size;
}

function pilotScore(hotel) {
  const exact = /홍대|홍익대|홍대입구|연남|합정|상수|hongdae|hongik|yeonnam|hapjeong|sangsu/i.test([hotel.hotelName, hotel.address].join(' ')) ? 35 : 0;
  return Math.log10(Math.max(10, hotel.reviewCount || 0)) * 100 + (hotel.reviewScore || 0) * 12 + Math.min(5, hotel.referenceLinks?.length || 0) * 4 + exact;
}
