import { writeFileSync } from 'node:fs';
import { generatedHotels } from '../src/data/generatedHotels.ts';

const selectedSlugs = [
  'busan-13870752',
  'busan-65460',
  'busan-16933389',
  'busan-1974844',
  'busan-52027642',
  'busan-42958',
  'busan-9079659',
  'busan-4576021'
];

const hotelBySlug = new Map(generatedHotels.map((hotel) => [hotel.slug, hotel]));
const selected = selectedSlugs.map((slug) => {
  const hotel = hotelBySlug.get(slug);
  if (!hotel) throw new Error(`Missing Busan hotel: ${slug}`);
  return {
    slug: hotel.slug,
    hotelName: hotel.hotelName,
    region: hotel.region,
    address: hotel.address,
    reviewScore: hotel.reviewScore,
    reviewCount: hotel.reviewCount,
    imageCount: countImages(hotel),
    referenceCount: hotel.referenceLinks?.length || 0
  };
});

writeFileSync('data/multilingual-busan-pilot.json', `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
console.log(`Selected ${selected.length} Busan hotels.`);
console.table(selected);

function countImages(hotel) {
  return new Set([
    hotel.imageUrl,
    ...(hotel.analysis?.blogReview?.sections || []).map((section) => section.image?.url)
  ].filter(Boolean)).size;
}
