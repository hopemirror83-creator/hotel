import { generatedHotels } from '../src/data/generatedHotels.ts';

const terms = /파라다이스|네스트|하얏트|오라|골든\s*튤립|데이즈|베스트\s*웨스턴|하워드|인스파이어|에어\s*스카이|인천공항|영종|운서|에어포트|airport|paradise|nest|hyatt|ora|golden tulip|days|best western|howard|inspire/i;

const rows = generatedHotels
  .filter((hotel) => hotel.slug.startsWith('incheon-'))
  .filter((hotel) => terms.test([hotel.hotelName, hotel.address].join(' ')))
  .map((hotel) => ({
    slug: hotel.slug,
    hotelName: hotel.hotelName,
    address: hotel.address,
    score: hotel.reviewScore || 0,
    reviews: hotel.reviewCount || 0,
    images: new Set([
      hotel.imageUrl,
      ...(hotel.analysis?.blogReview?.sections || []).map((section) => section.image?.url)
    ].filter(Boolean)).size,
    sections: hotel.analysis?.blogReview?.sections?.length || 0,
    references: hotel.referenceLinks?.length || 0
  }))
  .sort((a, b) => b.reviews - a.reviews);

console.log(JSON.stringify(rows.slice(0, 80), null, 2));
