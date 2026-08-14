import { writeFileSync } from 'node:fs';
import { generatedHotels } from '../src/data/generatedHotels.ts';
import { manualHotels } from '../src/data/manualHotels.ts';

const generatedSlugs = new Set(generatedHotels.map((hotel) => hotel.slug));
const activeHotels = [...generatedHotels, ...manualHotels.filter((hotel) => !generatedSlugs.has(hotel.slug))];

const selectedSlugs = [
  'nest-hotel-incheon',
  'incheon-2070028',
  'incheon-3155645',
  'incheon-49124',
  'incheon-50405896',
  'incheon-1194169',
  'incheon-35614450',
  'incheon-74232024'
];

const hotelBySlug = new Map(activeHotels.map((hotel) => [hotel.slug, hotel]));
const selected = selectedSlugs.map((slug) => {
  const hotel = hotelBySlug.get(slug);
  if (!hotel) throw new Error(`Missing Incheon Airport hotel: ${slug}`);
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

writeFileSync('data/multilingual-incheon-airport-pilot.json', `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
console.log(`Selected ${selected.length} Incheon Airport hotels.`);
console.table(selected);

function countImages(hotel) {
  return new Set([
    hotel.imageUrl,
    ...(hotel.analysis?.blogReview?.sections || []).map((section) => section.image?.url)
  ].filter(Boolean)).size;
}
