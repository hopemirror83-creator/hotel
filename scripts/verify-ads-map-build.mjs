import { readFile } from 'node:fs/promises';

const html = await readFile('dist/hotel/incheon-50405896/index.html', 'utf8');

console.log(JSON.stringify({
  adsScript: html.includes('pagead2.googlesyndication.com'),
  displaySlot: (html.match(/5476608409/g) || []).length,
  multiplexSlot: (html.match(/8304886068/g) || []).length,
  adPushes: (html.match(/adsbygoogle/g) || []).length,
  naverMap: html.includes('oapi.map.naver.com'),
  naverKey: html.includes('w90ehbsu50'),
  hotelMap: html.includes('id="hotel-map"')
}, null, 2));
