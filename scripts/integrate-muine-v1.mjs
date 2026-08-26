import { readFile, writeFile } from 'node:fs/promises';
const path='src/pages/hotel/[slug].astro'; let t=await readFile(path,'utf8');
t=add(t,"import { getDalatSearchIntent } from '../../data/dalatSearchIntents';","\nimport { getRelatedMuineAreaGuides } from '../../data/muineAreaGuides';\nimport { getMuineSearchIntent } from '../../data/muineSearchIntents';");
t=add(t,"const relatedDalatAreaGuides = hotel.slug.startsWith('dalat-') ? getRelatedDalatAreaGuides(hotel) : [];","\nconst relatedMuineAreaGuides = hotel.slug.startsWith('muine-') ? getRelatedMuineAreaGuides(hotel) : [];");
t=add(t,"  if (hotel.slug.startsWith('dalat-')) return getDalatSearchIntent(hotel);","\n  if (hotel.slug.startsWith('muine-')) return getMuineSearchIntent(hotel);");
t=add(t,"function extractRegion(value = '') {","\n  if (/베트남 무이네|무이네|mui ne|mũi né|판티엣|phan thiet|phan thiết|함띠엔|ham tien/i.test(value)) return '무이네';");
const marker='    <section class="section bottom-booking-section" aria-label="아고다 예약 확인">';
const block=`    {relatedMuineAreaGuides.length > 0 && (
      <section class="section related-guide-section">
        <div class="section-title"><span>RELATED GUIDE</span><h2>이 호텔과 함께 비교할 무이네 호텔 가이드</h2></div>
        <div class="related-guide-grid">{relatedMuineAreaGuides.map((guide) => <a href={guide.path}><span>{guide.eyebrow}</span><strong>{guide.title}</strong></a>)}</div>
      </section>
    )}\n\n`;
if(!t.includes('relatedMuineAreaGuides.map')) t=t.replace(marker,block+marker); await writeFile(path,t);
let s=await readFile('src/pages/sitemap.xml.ts','utf8'); s=add(s,"import { dalatAreaGuides } from '../data/dalatAreaGuides';","\nimport { muineAreaGuides } from '../data/muineAreaGuides';"); s=add(s,'    ...dalatAreaGuides.map((guide) => guide.path),','\n    ...muineAreaGuides.map((guide) => guide.path),'); await writeFile('src/pages/sitemap.xml.ts',s);
let i=await readFile('src/pages/index.astro','utf8'); i=i.replace("hotel.slug.startsWith('dalat-') ? '베트남'","hotel.slug.startsWith('dalat-') || hotel.slug.startsWith('muine-') ? '베트남'"); await writeFile('src/pages/index.astro',i);
function add(text,needle,extra){if(text.includes(extra.trim()))return text;if(!text.includes(needle))throw new Error('missing '+needle);return text.replace(needle,needle+extra)}
