import { readFile, writeFile } from 'node:fs/promises';

const hotelPath = 'src/pages/hotel/[slug].astro';
let hotelPage = await readFile(hotelPath, 'utf8');
hotelPage = add(hotelPage, "import { getMuineSearchIntent } from '../../data/muineSearchIntents';", "\nimport { getRelatedVungtauAreaGuides } from '../../data/vungtauAreaGuides';\nimport { getVungtauSearchIntent } from '../../data/vungtauSearchIntents';");
hotelPage = add(hotelPage, "const relatedMuineAreaGuides = hotel.slug.startsWith('muine-') ? getRelatedMuineAreaGuides(hotel) : [];", "\nconst relatedVungtauAreaGuides = hotel.slug.startsWith('vungtau-') ? getRelatedVungtauAreaGuides(hotel) : [];");
hotelPage = add(hotelPage, "  if (hotel.slug.startsWith('muine-')) return getMuineSearchIntent(hotel);", "\n  if (hotel.slug.startsWith('vungtau-')) return getVungtauSearchIntent(hotel);");
hotelPage = add(hotelPage, "function extractRegion(value = '') {", "\n  if (/베트남 붕따우|붕따우|붕타우|vung tau|vũng tàu|롱하이|long hai|호짬|ho tram/i.test(value)) return '붕따우';");
const marker = '    <section class="section bottom-booking-section" aria-label="아고다 예약 확인">';
const block = `    {relatedVungtauAreaGuides.length > 0 && (\n      <section class="section related-guide-section">\n        <div class="section-title"><span>RELATED GUIDE</span><h2>이 호텔과 함께 비교할 붕따우 호텔 가이드</h2></div>\n        <div class="related-guide-grid">{relatedVungtauAreaGuides.map((guide) => <a href={guide.path}><span>{guide.eyebrow}</span><strong>{guide.title}</strong></a>)}</div>\n      </section>\n    )}\n\n`;
if (!hotelPage.includes('relatedVungtauAreaGuides.map')) hotelPage = hotelPage.replace(marker, block + marker);
await writeFile(hotelPath, hotelPage);

let sitemap = await readFile('src/pages/sitemap.xml.ts', 'utf8');
sitemap = add(sitemap, "import { muineAreaGuides } from '../data/muineAreaGuides';", "\nimport { vungtauAreaGuides } from '../data/vungtauAreaGuides';");
sitemap = add(sitemap, '    ...muineAreaGuides.map((guide) => guide.path),', '\n    ...vungtauAreaGuides.map((guide) => guide.path),');
await writeFile('src/pages/sitemap.xml.ts', sitemap);

let index = await readFile('src/pages/index.astro', 'utf8');
index = index.replace("hotel.slug.startsWith('dalat-') || hotel.slug.startsWith('muine-') ? '베트남'", "hotel.slug.startsWith('dalat-') || hotel.slug.startsWith('muine-') || hotel.slug.startsWith('vungtau-') ? '베트남'");
await writeFile('src/pages/index.astro', index);

function add(text, needle, extra) {
  if (text.includes(extra.trim())) return text;
  if (!text.includes(needle)) throw new Error(`Missing integration marker: ${needle}`);
  return text.replace(needle, needle + extra);
}
