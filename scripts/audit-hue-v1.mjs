import { readFile, writeFile } from 'node:fs/promises';
const targets = new Set(JSON.parse(await readFile('data/target-slugs-hue-v1-quality.json', 'utf8')));
const text = await readFile('src/data/generatedHotels.ts', 'utf8');
const match = text.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
const hotels = JSON.parse(match[1]).filter((hotel) => targets.has(hotel.slug));
const failures = [];
for (const hotel of hotels) {
  const sections = hotel.analysis?.blogReview?.sections || [];
  const images = sections.filter((section) => /^https?:\/\//i.test(String(section.image?.url || section.imageUrl || ''))).length;
  const body = sections.reduce((total, section) => total + (section.paragraphs || []).reduce((sum, paragraph) => sum + String(paragraph).length, 0), 0);
  if (sections.length < 6 || images < 6 || body < 700 || hotel.qualityStatus !== 'ready') failures.push({ slug: hotel.slug, sections: sections.length, images, body, status: hotel.qualityStatus });
  if (/Da Nang|Danang|Đà Nẵng|다낭|Hoi An|Hội An|호이안|Quang Tri|Quảng Trị|꽝찌|Dong Ha|Đông Hà|동하/i.test(`${hotel.hotelName} ${hotel.address || ''}`)) failures.push({ slug: hotel.slug, issue: 'region_outlier' });
  if (sections.some((section) => /search\.pstatic|blogfiles|postfiles|naver\.net/i.test(String(section.image?.url || section.imageUrl || '')))) failures.push({ slug: hotel.slug, issue: 'non_agoda_section_image' });
}
await writeFile('data/target-hotels-hue-v1-generated.json', `${JSON.stringify(hotels, null, 2)}\n`);
console.log({ count: hotels.length, withSixSections: hotels.filter((hotel) => (hotel.analysis?.blogReview?.sections || []).length >= 6).length, withSixImages: hotels.filter((hotel) => (hotel.analysis?.blogReview?.sections || []).filter((section) => /^https?:\/\//i.test(String(section.image?.url || section.imageUrl || ''))).length >= 6).length, withReferenceLinks: hotels.filter((hotel) => (hotel.referenceLinks || []).length > 0).length, failures });
if (failures.length) process.exitCode = 1;




