import { readFile, writeFile } from 'node:fs/promises';

const modulePath = 'src/data/generatedHotels.ts';
const text = await readFile(modulePath, 'utf8');
const match = text.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
if (!match) throw new Error('Could not parse generatedHotels.ts');

const hotels = JSON.parse(match[1]);
const hotel = hotels.find((item) => item.slug === 'fukushima-5780637');
if (!hotel) throw new Error('Hotel Sankyo Fukushima was not found.');
const section = hotel.analysis?.blogReview?.sections?.find((item) => item.heading === '경쟁 제품과 비교');
if (!section?.image) throw new Error('Comparison section image was not found.');

const blockedUrl = 'https://pix8.agoda.net/hotelImages/5780637/0/901289f6293188d5eafa73c540274869.jpeg?ce=2&s=1024x768';
if (section.image.url !== blockedUrl) throw new Error(`Unexpected source image: ${section.image.url}`);

section.image = {
  ...section.image,
  url: 'https://pix8.agoda.net/hotelImages/5780637/-1/694b13459c52c91a1c9551216a5d53a2.jpg?ca=9&ce=1&s=1024x768',
  alt: '호텔 산쿄 후쿠시마 조식당과 공용 시설 이미지',
  source: 'agoda_secondary_api',
  query: '호텔 산쿄 후쿠시마 조식당 공용 시설',
  reason: 'manual-safe-replacement-no-people'
};

await writeFile(modulePath, `// @ts-nocheck\nexport const generatedHotels: any[] = ${JSON.stringify(hotels, null, 2)};\n`, 'utf8');
console.log(`Replaced the comparison image for ${hotel.hotelName}.`);
