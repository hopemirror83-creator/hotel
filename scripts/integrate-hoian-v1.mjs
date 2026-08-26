import { readFile, writeFile } from 'node:fs/promises';
const path='src/pages/hotel/[slug].astro'; let t=await readFile(path,'utf8');
t=add(t,"import { getDalatSearchIntent } from '../../data/dalatSearchIntents';","\nimport { getRelatedHoianAreaGuides } from '../../data/hoianAreaGuides';\nimport { getHoianSearchIntent } from '../../data/hoianSearchIntents';");
t=add(t,"const relatedDalatAreaGuides = hotel.slug.startsWith('dalat-') ? getRelatedDalatAreaGuides(hotel) : [];","\nconst relatedHoianAreaGuides = hotel.slug.startsWith('hoian-') ? getRelatedHoianAreaGuides(hotel) : [];");
t=add(t,"  if (hotel.slug.startsWith('dalat-')) return getDalatSearchIntent(hotel);","\n  if (hotel.slug.startsWith('hoian-')) return getHoianSearchIntent(hotel);");
t=add(t,"function extractRegion(value = '') {","\n  if (/베트남 호이안|호이안|hoi an|hội an|안방|an bang|끄어다이|cua dai|깜탄|cam thanh/i.test(value)) return '호이안';");
const marker='    <section class="section bottom-booking-section" aria-label="아고다 예약 확인">';
const block=`    {relatedHoianAreaGuides.length > 0 && (
      <section class="section related-guide-section">
        <div class="section-title"><span>RELATED GUIDE</span><h2>이 호텔과 함께 비교할 호이안 호텔 가이드</h2></div>
        <div class="related-guide-grid">{relatedHoianAreaGuides.map((guide) => <a href={guide.path}><span>{guide.eyebrow}</span><strong>{guide.title}</strong></a>)}</div>
      </section>
    )}\n\n`;
if(!t.includes('relatedHoianAreaGuides.map')) t=t.replace(marker,block+marker); await writeFile(path,t);
let s=await readFile('src/pages/sitemap.xml.ts','utf8'); s=add(s,"import { dalatAreaGuides } from '../data/dalatAreaGuides';","\nimport { hoianAreaGuides } from '../data/hoianAreaGuides';"); s=add(s,'    ...dalatAreaGuides.map((guide) => guide.path),','\n    ...hoianAreaGuides.map((guide) => guide.path),'); await writeFile('src/pages/sitemap.xml.ts',s);
let i=await readFile('src/pages/index.astro','utf8'); i=i.replace("hotel.slug.startsWith('dalat-') ? '베트남'","hotel.slug.startsWith('dalat-') || hotel.slug.startsWith('hoian-') ? '베트남'"); await writeFile('src/pages/index.astro',i);
function add(text,needle,extra){if(text.includes(extra.trim()))return text;if(!text.includes(needle))throw new Error('missing '+needle);return text.replace(needle,needle+extra)}
