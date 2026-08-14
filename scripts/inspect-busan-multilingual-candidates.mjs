import { generatedHotels } from '../src/data/generatedHotels.ts';

const terms = /시그니엘|파라다이스|그랜드\s*조선|파크\s*하얏트|L7|엘세븐|신라스테이|아난티|웨스틴|롯데|라발스|토요코인|아스티|코모도|센텀|해운대|광안리|부산역|signiel|paradise|grand josun|park hyatt|shilla|ananti|westin|lotte|lavalse|toyoko|asti|commodore/i;

const rows = generatedHotels
  .filter((hotel) => hotel.slug.startsWith('busan-'))
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

console.log(JSON.stringify(rows.slice(0, 100), null, 2));
