import { readFile,writeFile } from 'node:fs/promises';
const candidates=JSON.parse(await readFile('data/candidates-haiphong-v1-all.json','utf8'));
const manifest=JSON.parse(await readFile('deploy-data/generated-hotels/manifest.json','utf8'));const existing=[];
for(const file of manifest.files)existing.push(...JSON.parse(await readFile(`deploy-data/generated-hotels/${file.filename}`,'utf8')));
const ids=new Set(existing.map(h=>Number(String(h.slug).split('-').at(-1))).filter(Number.isFinite)),names=new Set();
const outlier=/Ha Long|Hạ Long|Halong|하롱|Quang Ninh|Quảng Ninh|꽝닌|Hanoi|Ha Noi|Hà Nội|하노이|Ninh Binh|Ninh Bình|닌빈/i;
const selected=candidates.filter(h=>!outlier.test(`${h.hotelName} ${h.fallbackAddress||''}`)).filter(h=>/^https?:\/\//i.test(h.imageUrl||'')).filter(h=>Number(h.reviewCount)>=20&&Number(h.reviewScore)>=7.5&&!ids.has(Number(h.agodaHotelId))).filter(h=>{const k=normalize(h.hotelName);if(!k||names.has(k))return false;names.add(k);return true}).slice(0,200).map(h=>({...h,country:'베트남',skipMapMatch:true}));
await writeFile('data/target-hotels-haiphong-v1-quality.json',`${JSON.stringify(selected,null,2)}\n`);await writeFile('data/target-slugs-haiphong-v1-quality.json',`${JSON.stringify(selected.map(h=>h.slug),null,2)}\n`);
console.log(`Selected ${selected.length} strict Hai Phong candidates from ${candidates.length}`);if(selected.length)console.log(`Minimum reviews: ${Math.min(...selected.map(h=>Number(h.reviewCount)))}, minimum score: ${Math.min(...selected.map(h=>Number(h.reviewScore)))}`);
function normalize(v){return String(v||'').toLowerCase().replace(/\([^)]*\)|\[[^\]]*\]/g,'').replace(/[^a-z0-9가-힣]/g,'')}
