import { createReadStream } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { createInterface } from 'node:readline';

const csv=process.env.AGODA_CSV_PATH||'56A3C1A2-0531-49F3-8720-D7D4B1410E41_KO.csv';
const rows=createInterface({input:createReadStream(csv,{encoding:'utf8'}),crlfDelay:Infinity});
let headers=null;const candidates=[];
for await(const line of rows){
 if(!headers){headers=parse(line).map(v=>v.replace(/^\uFEFF/,''));continue}
 const values=parse(line);if(values.length<headers.length)continue;
 const row=Object.fromEntries(headers.map((h,i)=>[h,values[i]||'']));if(row.country!=='베트남')continue;
 const latitude=Number(row.latitude)||0,longitude=Number(row.longitude)||0;
 const address=clean([row.addressline1,row.addressline2,row.city,row.state].filter(Boolean).join(' '));
 if(latitude<20.55||latitude>21.08||longitude<106.35||longitude>107.18||!isHaiphong(address)||isOutlier(address))continue;
 const id=Number(row.hotel_id),name=clean(row.hotel_translated_name||row.hotel_name);if(!Number.isInteger(id)||id<=0||!name)continue;
 candidates.push({slug:`haiphong-${id}`,hotelName:name,region:'베트남 하이퐁·깟바',searchName:name,naverName:name,agodaHotelId:id,fallbackAddress:address,latitude,longitude,starRating:Number(row.star_rating)||undefined,reviewScore:Number(row.rating_average)||0,reviewCount:Number(row.number_of_reviews)||0,imageUrl:clean(row.photo1),landingUrl:`https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1927566&hid=${id}`});
}
candidates.sort((a,b)=>(b.reviewCount*b.reviewScore)-(a.reviewCount*a.reviewScore));
await writeFile('data/candidates-haiphong-v1-all.json',`${JSON.stringify(candidates.slice(0,2500),null,2)}\n`);
console.log(`Selected ${Math.min(2500,candidates.length)} Hai Phong candidates from ${candidates.length} matches`);
function clean(v){return String(v||'').replace(/\s+/g,' ').trim()}
function isHaiphong(v){return/Hai Phong|Hải Phòng|하이퐁|Cat Ba|Cát Bà|깟바|Do Son|Đồ Sơn|도선|Lan Ha|Lan Hạ|란하|Thuy Nguyen|Thủy Nguyên/i.test(v)}
function isOutlier(v){return/Ha Long|Hạ Long|Halong|하롱|Quang Ninh|Quảng Ninh|꽝닌|Hanoi|Ha Noi|Hà Nội|하노이|Ninh Binh|Ninh Bình|닌빈/i.test(v)}
function parse(line){const result=[];let cell='',quoted=false;for(let i=0;i<line.length;i+=1){const char=line[i],next=line[i+1];if(char==='"'&&quoted&&next==='"'){cell+='"';i+=1}else if(char==='"')quoted=!quoted;else if(char===','&&!quoted){result.push(cell);cell=''}else cell+=char}result.push(cell);return result}
