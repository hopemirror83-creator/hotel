import { generatedHotels } from '../src/data/generatedHotels.ts';

const terms = /신라|롯데|그랜드\s*조선|파르나스|해비치|메종\s*글래드|라마다|휘닉스|히든\s*클리프|제주\s*신화|그랜드\s*하얏트|드림타워|호텔\s*난타|유탑|골든\s*튤립|켄싱턴|서귀포|중문|제주공항|shilla|lotte|grand josun|parnas|haevichi|maison glad|ramada|phoenix|hidden cliff|shinhwa|grand hyatt|dream tower|nanta|utop|golden tulip|kensington/i;

const rows = generatedHotels
  .filter((hotel) => hotel.slug.startsWith('jeju-'))
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

console.log(JSON.stringify(rows.slice(0, 120), null, 2));
