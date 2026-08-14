import { readFile, writeFile } from 'node:fs/promises';

const modulePath = 'src/data/generatedHotels.ts';
const source = await readFile(modulePath, 'utf8');
const arrayStart = source.indexOf('= [') + 2;
const arrayEnd = source.lastIndexOf(']') + 1;
const hotels = JSON.parse(source.slice(arrayStart, arrayEnd));
const hotel = hotels.find((item) => item.slug === 'gyeonggi-10589333');

if (!hotel) throw new Error('Pocheon Hwajeogyeon Pension was not found');
const sections = hotel.analysis?.blogReview?.sections || [];
const target = sections.find((section) => section.heading === '이런 분들 추천해요');
const safeSource = sections.find((section) => section.heading === '이 호텔 선택 이유')?.image;

if (!target || !safeSource?.url) throw new Error('Replacement image source was not found');

target.image = {
  ...safeSource,
  heading: target.heading,
  alt: `${hotel.hotelName} ${target.heading} 이미지`,
  query: `${hotel.hotelName} 숙소 외관`,
  reason: 'manual-person-image-replacement'
};

const output = `${source.slice(0, arrayStart)}${JSON.stringify(hotels, null, 2)}${source.slice(arrayEnd)}`;
await writeFile(modulePath, output, 'utf8');

console.log(JSON.stringify({
  slug: hotel.slug,
  heading: target.heading,
  replacementUrl: target.image.url
}, null, 2));
