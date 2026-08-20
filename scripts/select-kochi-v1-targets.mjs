import { createReadStream } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { createInterface } from 'node:readline';

const csvPath=process.env.AGODA_CSV_PATH||'56A3C1A2-0531-49F3-8720-D7D4B1410E41_KO.csv';
const rows=createInterface({input:createReadStream(csvPath,{encoding:'utf8'}),crlfDelay:Infinity});
let headers=null;const candidates=[];
for await(const line of rows){
  if(!headers){headers=parse(line).map(v=>v.replace(/^\uFEFF/,''));continue}
  const values=parse(line);if(values.length<headers.length)continue;
  const row=Object.fromEntries(headers.map((h,i)=>[h,values[i]||'']));if(row.country!=='일본')continue;
  const latitude=Number(row.latitude||0),longitude=Number(row.longitude||0),address=clean([row.addressline1,row.addressline2,row.city,row.state].filter(Boolean).join(' '));
  if(latitude<32.65||latitude>34.05||longitude<132.45||longitude>134.35||!isKochi(address))continue;
  const id=Number(row.hotel_id),name=clean(row.hotel_translated_name||row.hotel_name);if(!Number.isInteger(id)||id<=0||!name)continue;
  candidates.push({slug:`kochi-${id}`,hotelName:name,region:'고치현',searchName:name,naverName:name,agodaHotelId:id,fallbackAddress:address,latitude,longitude,starRating:Number(row.star_rating||0)||undefined,reviewScore:Number(row.rating_average||0),reviewCount:Number(row.number_of_reviews||0),imageUrl:clean(row.photo1),landingUrl:`https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1927566&hid=${id}`});
}
candidates.sort((a,b)=>rank(b)-rank(a));
await writeFile('data/candidates-kochi-v1-all.json',`${JSON.stringify(candidates.slice(0,1500),null,2)}\n`);
console.log(`Selected ${Math.min(1500,candidates.length)} Kochi candidates from ${candidates.length} coordinate and address matches`);
function rank(h){return(h.reviewCount||0)*Math.max(.1,h.reviewScore||0)}
function clean(v){return String(v||'').replace(/\s+/g,' ').trim()}
function isKochi(v){return/Kochi|Nankoku|Shimanto|Nakamura|Sukumo|Tosashimizu|Ashizuri|Muroto|Aki|Kami|Konan|Tosa|Susaki|Ino|Otoyo|Yusuhara|高知|南国|四万十|中村|宿毛|土佐清水|足摺|室戸|安芸|香美|香南|土佐|須崎|いの|大豊|梼原|고치|난코쿠|시만토|나카무라|스쿠모|도사시미즈|아시즈리|무로토|아키|가미|고난|도사|스사키|이노|오토요|유스하라/i.test(v)}
function parse(line){const r=[];let c='',q=false;for(let i=0;i<line.length;i++){const ch=line[i],n=line[i+1];if(ch==='"'&&q&&n==='"'){c+='"';i++}else if(ch==='"')q=!q;else if(ch===','&&!q){r.push(c);c=''}else c+=ch}r.push(c);return r}
