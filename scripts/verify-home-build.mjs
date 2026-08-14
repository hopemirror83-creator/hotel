import { readFile } from 'node:fs/promises';

const html = await readFile('dist/index.html', 'utf8');

console.log(JSON.stringify({
  national: html.includes('전국 호텔'),
  adminStaticLink: html.includes('href="/admin/"'),
  status: html.includes('수집 상태'),
  search: html.includes('hotel-search-input'),
  regionTree: html.includes('region-tree'),
  districts: ['중구', '연수구', '남동구', '부평구', '서구'].filter((name) => html.includes(name)),
  hotelCards: (html.match(/class="hotel-card"/g) || []).length
}, null, 2));
