import { readFile, writeFile } from 'node:fs/promises';
const path='src/pages/hotel/[slug].astro'; let t=await readFile(path,'utf8');
t=add(t,"import { getHanoiSearchIntent } from '../../data/hanoiSearchIntents';","\nimport { getRelatedDalatAreaGuides } from '../../data/dalatAreaGuides';\nimport { getDalatSearchIntent } from '../../data/dalatSearchIntents';");
t=add(t,"const relatedHanoiAreaGuides = hotel.slug.startsWith('hanoi-') ? getRelatedHanoiAreaGuides(hotel) : [];","\nconst relatedDalatAreaGuides = hotel.slug.startsWith('dalat-') ? getRelatedDalatAreaGuides(hotel) : [];");
t=add(t,"  if (hotel.slug.startsWith('hanoi-')) return getHanoiSearchIntent(hotel);","\n  if (hotel.slug.startsWith('dalat-')) return getDalatSearchIntent(hotel);");
t=add(t,"function extractRegion(value = '') {","\n  if (/베트남 달랏|달랏|달라트|dalat|da lat|đà lạt|뚜옌람|tuyen lam|쑤언흐엉|xuan huong/i.test(value)) return '달랏';");
const marker='    <section class="section bottom-booking-section" aria-label="아고다 예약 확인">';
const block=`    {relatedDalatAreaGuides.length > 0 && (
      <section class="section related-guide-section">
        <div class="section-title"><span>RELATED GUIDE</span><h2>이 호텔과 함께 비교할 달랏 호텔 가이드</h2></div>
        <div class="related-guide-grid">{relatedDalatAreaGuides.map((guide) => <a href={guide.path}><span>{guide.eyebrow}</span><strong>{guide.title}</strong></a>)}</div>
      </section>
    )}\n\n`;
if(!t.includes('relatedDalatAreaGuides.map')) t=t.replace(marker,block+marker); await writeFile(path,t);
let s=await readFile('src/pages/sitemap.xml.ts','utf8'); s=add(s,"import { hanoiAreaGuides } from '../data/hanoiAreaGuides';","\nimport { dalatAreaGuides } from '../data/dalatAreaGuides';"); s=add(s,'    ...hanoiAreaGuides.map((guide) => guide.path),','\n    ...dalatAreaGuides.map((guide) => guide.path),'); await writeFile('src/pages/sitemap.xml.ts',s);
let i=await readFile('src/pages/index.astro','utf8'); i=i.replace("hotel.slug.startsWith('hanoi-') ? '베트남'","hotel.slug.startsWith('hanoi-') || hotel.slug.startsWith('dalat-') ? '베트남'"); await writeFile('src/pages/index.astro',i);
function add(text,needle,extra){if(text.includes(extra.trim()))return text;if(!text.includes(needle))throw new Error('missing '+needle);return text.replace(needle,needle+extra)}
