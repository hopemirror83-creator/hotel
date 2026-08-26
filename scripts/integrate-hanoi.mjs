import { readFile, writeFile } from 'node:fs/promises';

const hotelPath = 'src/pages/hotel/[slug].astro';
let hotel = await readFile(hotelPath, 'utf8');
hotel = once(hotel,
  "import { getHochiminhSearchIntent } from '../../data/hochiminhSearchIntents';",
  "import { getHochiminhSearchIntent } from '../../data/hochiminhSearchIntents';\nimport { getRelatedHanoiAreaGuides } from '../../data/hanoiAreaGuides';\nimport { getHanoiSearchIntent } from '../../data/hanoiSearchIntents';");
hotel = once(hotel,
  "const relatedHochiminhAreaGuides = hotel.slug.startsWith('hochiminh-') ? getRelatedHochiminhAreaGuides(hotel) : [];",
  "const relatedHochiminhAreaGuides = hotel.slug.startsWith('hochiminh-') ? getRelatedHochiminhAreaGuides(hotel) : [];\nconst relatedHanoiAreaGuides = hotel.slug.startsWith('hanoi-') ? getRelatedHanoiAreaGuides(hotel) : [];");
hotel = once(hotel,
  "  if (hotel.slug.startsWith('hochiminh-')) return getHochiminhSearchIntent(hotel);",
  "  if (hotel.slug.startsWith('hanoi-')) return getHanoiSearchIntent(hotel);\n  if (hotel.slug.startsWith('hochiminh-')) return getHochiminhSearchIntent(hotel);");
hotel = once(hotel,
  "function extractRegion(value = '') {",
  "function extractRegion(value = '') {\n  if (/베트남 하노이|하노이|hanoi|ha noi|hà nội|호안끼엠|hoan kiem|서호|west lake|노이바이|noi bai/i.test(value)) return '하노이';");
const relatedNeedle = `    {relatedHochiminhAreaGuides.length > 0 && (
      <section class="section related-guide-section">
        <div class="section-title"><span>RELATED GUIDE</span><h2>이 호텔과 함께 비교할 호치민 호텔 가이드</h2></div>
        <div class="related-guide-grid">{relatedHochiminhAreaGuides.map((guide) => <a href={guide.path}><span>{guide.eyebrow}</span><strong>{guide.title}</strong></a>)}</div>
      </section>
    )}`;
hotel = once(hotel, relatedNeedle, `${relatedNeedle}
    {relatedHanoiAreaGuides.length > 0 && (
      <section class="section related-guide-section">
        <div class="section-title"><span>RELATED GUIDE</span><h2>이 호텔과 함께 비교할 하노이 호텔 가이드</h2></div>
        <div class="related-guide-grid">{relatedHanoiAreaGuides.map((guide) => <a href={guide.path}><span>{guide.eyebrow}</span><strong>{guide.title}</strong></a>)}</div>
      </section>
    )}`);
await writeFile(hotelPath, hotel);

const sitemapPath = 'src/pages/sitemap.xml.ts';
let sitemap = await readFile(sitemapPath, 'utf8');
sitemap = once(sitemap,
  "import { hochiminhAreaGuides } from '../data/hochiminhAreaGuides';",
  "import { hochiminhAreaGuides } from '../data/hochiminhAreaGuides';\nimport { hanoiAreaGuides } from '../data/hanoiAreaGuides';");
sitemap = once(sitemap,
  '    ...hochiminhAreaGuides.map((guide) => guide.path),',
  '    ...hochiminhAreaGuides.map((guide) => guide.path),\n    ...hanoiAreaGuides.map((guide) => guide.path),');
await writeFile(sitemapPath, sitemap);

const indexPath = 'src/pages/index.astro';
let index = await readFile(indexPath, 'utf8');
index = once(index,
  "hotel.slug.startsWith('phuquoc-') || hotel.slug.startsWith('hochiminh-') ? '베트남'",
  "hotel.slug.startsWith('phuquoc-') || hotel.slug.startsWith('hochiminh-') || hotel.slug.startsWith('hanoi-') ? '베트남'");
await writeFile(indexPath, index);

function once(text, needle, replacement) {
  if (text.includes(replacement)) return text;
  if (!text.includes(needle)) throw new Error(`Integration needle not found: ${needle.slice(0, 100)}`);
  return text.replace(needle, replacement);
}
