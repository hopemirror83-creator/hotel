import { readFile, writeFile } from 'node:fs/promises';

const hotelPath = 'src/pages/hotel/[slug].astro';
let hotelPage = await readFile(hotelPath, 'utf8');
hotelPage = add(hotelPage, "import { getMuineSearchIntent } from '../../data/muineSearchIntents';", "\nimport { getRelatedSapaAreaGuides } from '../../data/sapaAreaGuides';\nimport { getSapaSearchIntent } from '../../data/sapaSearchIntents';");
hotelPage = add(hotelPage, "const relatedMuineAreaGuides = hotel.slug.startsWith('muine-') ? getRelatedMuineAreaGuides(hotel) : [];", "\nconst relatedSapaAreaGuides = hotel.slug.startsWith('sapa-') ? getRelatedSapaAreaGuides(hotel) : [];");
hotelPage = add(hotelPage, "  if (hotel.slug.startsWith('muine-')) return getMuineSearchIntent(hotel);", "\n  if (hotel.slug.startsWith('sapa-')) return getSapaSearchIntent(hotel);");
hotelPage = add(hotelPage, "function extractRegion(value = '') {", "\n  if (/베트남 사파|사파|sa pa|sapa|라오까이|lao cai|lào cai|판시판|fansipan|깟깟|cat cat/i.test(value)) return '사파';");
const marker = '    <section class="section bottom-booking-section" aria-label="아고다 예약 확인">';
const block = `    {relatedSapaAreaGuides.length > 0 && (\n      <section class="section related-guide-section">\n        <div class="section-title"><span>RELATED GUIDE</span><h2>이 호텔과 함께 비교할 사파 호텔 가이드</h2></div>\n        <div class="related-guide-grid">{relatedSapaAreaGuides.map((guide) => <a href={guide.path}><span>{guide.eyebrow}</span><strong>{guide.title}</strong></a>)}</div>\n      </section>\n    )}\n\n`;
if (!hotelPage.includes('relatedSapaAreaGuides.map')) hotelPage = hotelPage.replace(marker, block + marker);
await writeFile(hotelPath, hotelPage);

let sitemap = await readFile('src/pages/sitemap.xml.ts', 'utf8');
sitemap = add(sitemap, "import { muineAreaGuides } from '../data/muineAreaGuides';", "\nimport { sapaAreaGuides } from '../data/sapaAreaGuides';");
sitemap = add(sitemap, '    ...muineAreaGuides.map((guide) => guide.path),', '\n    ...sapaAreaGuides.map((guide) => guide.path),');
await writeFile('src/pages/sitemap.xml.ts', sitemap);

let index = await readFile('src/pages/index.astro', 'utf8');
index = index.replace("hotel.slug.startsWith('muine-') || hotel.slug.startsWith('vungtau-') ? '베트남'", "hotel.slug.startsWith('muine-') || hotel.slug.startsWith('vungtau-') || hotel.slug.startsWith('sapa-') ? '베트남'");
await writeFile('src/pages/index.astro', index);

function add(text, needle, extra) {
  if (text.includes(extra.trim())) return text;
  if (!text.includes(needle)) throw new Error(`Missing integration marker: ${needle}`);
  return text.replace(needle, needle + extra);
}
