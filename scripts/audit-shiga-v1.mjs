import { readFile, writeFile } from 'node:fs/promises';

const targets = new Set(JSON.parse(await readFile('data/target-slugs-shiga-v1-quality.json', 'utf8')));
const text = await readFile('src/data/generatedHotels.ts', 'utf8');
const match = text.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
const hotels = JSON.parse(match[1]).filter((hotel) => targets.has(hotel.slug));
const failures = [];
const imageShortfalls = [];
const retrySlugs = [];

for (const hotel of hotels) {
  const sections = hotel.analysis?.blogReview?.sections || [];
  const images = sections.filter((section) => /^https?:\/\//i.test(String(section.image?.url || section.imageUrl || ''))).length;
  const bodyLength = sections.reduce((total, section) => total + (section.paragraphs || []).reduce((sum, paragraph) => sum + String(paragraph).length, 0), 0);
  if (sections.length < 6) failures.push({ slug: hotel.slug, issue: `sections:${sections.length}` });
  if (images < 6) imageShortfalls.push({ slug: hotel.slug, images });
  if (images < 3) failures.push({ slug: hotel.slug, issue: `images:${images}` });
  if (bodyLength < 700) failures.push({ slug: hotel.slug, issue: `body:${bodyLength}` });
  if (!/^https?:\/\//i.test(String(hotel.imageUrl || ''))) failures.push({ slug: hotel.slug, issue: 'hero' });
  if (/Kyoto|Gifu|Mie|Fukui|京都|岐阜|三重|福井|교토|기후|미에|후쿠이/i.test(String(hotel.address || ''))) failures.push({ slug: hotel.slug, issue: 'region_outlier' });
  if (hotel.qualityStatus === 'review_required' || bodyLength < 700 || sections.length < 6) retrySlugs.push(hotel.slug);
}

await writeFile('data/target-hotels-shiga-v1-generated.json', `${JSON.stringify(hotels, null, 2)}\n`);
await writeFile('data/target-slugs-shiga-v1-retry.json', `${JSON.stringify([...new Set(retrySlugs)], null, 2)}\n`);
const summary = { count: hotels.length, withSixSections: hotels.filter((hotel) => (hotel.analysis?.blogReview?.sections || []).length >= 6).length, withSixImages: hotels.filter((hotel) => (hotel.analysis?.blogReview?.sections || []).filter((section) => /^https?:\/\//i.test(String(section.image?.url || section.imageUrl || ''))).length >= 6).length, withReferenceLinks: hotels.filter((hotel) => (hotel.referenceLinks || []).length > 0).length, retrySlugs: [...new Set(retrySlugs)], imageShortfalls, failures };
console.log(JSON.stringify(summary, null, 2));
if (failures.length) process.exitCode = 1;
