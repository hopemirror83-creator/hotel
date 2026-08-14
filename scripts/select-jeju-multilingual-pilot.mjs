import { writeFileSync } from 'node:fs';
import { generatedHotels } from '../src/data/generatedHotels.ts';

const selectedSlugs = [
  'jeju-567545',
  'jeju-18209350',
  'jeju-31451473',
  'jeju-42957',
  'jeju-18875336',
  'jeju-1199068',
  'jeju-178625',
  'jeju-302120'
];

const hotelBySlug = new Map(generatedHotels.map((hotel) => [hotel.slug, hotel]));
const selected = selectedSlugs.map((slug) => {
  const hotel = hotelBySlug.get(slug);
  if (!hotel) throw new Error(`Missing Jeju hotel: ${slug}`);
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

writeFileSync('data/multilingual-jeju-pilot.json', `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
console.log(`Selected ${selected.length} Jeju hotels.`);
console.table(selected);

function countImages(hotel) {
  return new Set([
    hotel.imageUrl,
    ...(hotel.analysis?.blogReview?.sections || []).map((section) => section.image?.url)
  ].filter(Boolean)).size;
}
