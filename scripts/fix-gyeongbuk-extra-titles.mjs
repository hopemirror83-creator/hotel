import fs from 'node:fs';
import { generatedHotels } from '../src/data/generatedHotels.ts';

const K = {
  gyeongbuk: '\uACBD\uBD81',
  gyeongju: '\uACBD\uC8FC',
  pohang: '\uD3EC\uD56D',
  andong: '\uC548\uB3D9',
  gumi: '\uAD6C\uBBF8',
  yeongdeok: '\uC601\uB355',
  uljin: '\uC6B8\uC9C4',
  mungyeong: '\uBB38\uACBD',
  yeongju: '\uC601\uC8FC',
  gimcheon: '\uAE40\uCC9C',
  sangju: '\uC0C1\uC8FC',
  cheongsong: '\uCCAD\uC1A1',
  yeongcheon: '\uC601\uCC9C',
  gyeongsan: '\uACBD\uC0B0',
  yecheon: '\uC608\uCC9C',
  bonghwa: '\uBD09\uD654',
  ulleung: '\uC6B8\uB989',
  review: '\uD6C4\uAE30',
  collection: '\uBAA8\uC74C',
  parking: '\uC8FC\uCC28',
  checkin: '\uCCB4\uD06C\uC778',
  breakfast: '\uC870\uC2DD',
  value: '\uAC00\uC131\uBE44',
  location: '\uC704\uCE58',
  business: '\uCD9C\uC7A5',
  family: '\uAC00\uC871\uC5EC\uD589',
  oceanView: '\uC624\uC158\uBDF0',
  port: '\uD56D\uAD6C \uADFC\uCC98',
  bomun: '\uBCF4\uBB38\uB2E8\uC9C0',
  gamphoSea: '\uAC10\uD3EC \uBC14\uB2E4',
  yeongildaeOcean: '\uC601\uC77C\uB300 \uC624\uC158\uBDF0',
  jukdoMarket: '\uC8FD\uB3C4\uC2DC\uC7A5',
  hanokStay: '\uD55C\uC625\uC2A4\uD14C\uC774',
  andongDowntown: '\uC548\uB3D9 \uC2DC\uB0B4'
};

const cityRules = [
  [K.gyeongju, [K.gyeongju, 'Gyeongju', '\uBCF4\uBB38', '\uD669\uB9AC\uB2E8\uAE38', '\uBD88\uAD6D', '\uCCA8\uC131\uB300', '\uAC10\uD3EC', '\uCC9C\uBD81']],
  [K.pohang, [K.pohang, 'Pohang', '\uC601\uC77C\uB300', '\uC8FD\uB3C4', '\uD638\uBBF8\uACF6', '\uC591\uD3EC', '\uB300\uC7A0', '\uC0C1\uB3C4\uB3D9']],
  [K.andong, [K.andong, 'Andong', '\uD558\uD68C', '\uC6D4\uC601\uAD50', '\uD0DC\uD654']],
  [K.gumi, [K.gumi, 'Gumi', '\uC6D0\uD3C9', '\uD615\uACE1', '\uBD09\uACE1']],
  [K.yeongdeok, [K.yeongdeok, 'Yeongdeok', '\uAC15\uAD6C\uD56D']],
  [K.uljin, [K.uljin, 'Uljin', '\uBC31\uC554', '\uD6C4\uD3EC', '\uC8FD\uBCC0']],
  [K.mungyeong, [K.mungyeong, 'Mungyeong', '\uC810\uCD0C']],
  [K.yeongju, [K.yeongju, 'Yeongju', '\uD48D\uAE30']],
  [K.gimcheon, [K.gimcheon, 'Gimcheon']],
  [K.sangju, [K.sangju, 'Sangju']],
  [K.cheongsong, [K.cheongsong, 'Cheongsong', '\uC8FC\uC655\uC0B0']],
  [K.yeongcheon, [K.yeongcheon, 'Yeongcheon']],
  [K.gyeongsan, [K.gyeongsan, 'Gyeongsan', '\uD558\uC591']],
  [K.yecheon, [K.yecheon, 'Yecheon']],
  [K.bonghwa, [K.bonghwa, 'Bonghwa']],
  [K.ulleung, [K.ulleung, 'Ulleung']]
];

function cityOf(hotel) {
  const text = [hotel.hotelName, hotel.address, hotel.slug].join(' ');
  return cityRules.find(([, keys]) => keys.some((key) => text.includes(key)))?.[0] || K.gyeongbuk;
}

function hasAny(text, keys) {
  return keys.some((key) => text.includes(key));
}

function termsFor(city, hotel) {
  const text = [hotel.hotelName, hotel.address, JSON.stringify(hotel.analysis || {})].join(' ');
  const terms = [];
  const add = (value) => {
    if (!terms.includes(value)) terms.push(value);
  };

  if (city === K.gyeongju) {
    add(hasAny(text, ['\uAC10\uD3EC']) ? K.gamphoSea : K.bomun);
    add(K.parking);
    add(K.checkin);
  } else if (city === K.pohang) {
    add(hasAny(text, ['\uC601\uC77C\uB300', '\uBC14\uB2E4', '\uC624\uC158', 'beach', '\uC2A4\uD30C', '\uC591\uD3EC']) ? K.yeongildaeOcean : K.jukdoMarket);
    add(K.parking);
    add(K.breakfast);
  } else if (city === K.andong) {
    add(hasAny(text, ['\uD55C\uC625', '\uACE0\uD0DD', '\uC885\uD0DD', '\uD558\uD68C', '\uC6D4\uC601']) ? K.hanokStay : K.andongDowntown);
    add(K.parking);
    add(K.checkin);
  } else if (city === K.gumi) {
    add(K.business);
    add(K.parking);
    add(K.breakfast);
  } else if ([K.yeongdeok, K.uljin, K.ulleung].includes(city)) {
    add(K.oceanView);
    add(K.port);
    add(K.parking);
  } else if ([K.mungyeong, K.yeongju, K.cheongsong, K.bonghwa].includes(city)) {
    add(K.family);
    add(K.parking);
    add(K.checkin);
  } else {
    add(K.location);
    add(K.parking);
    add(K.checkin);
  }

  if (hasAny(text, [K.breakfast, 'breakfast']) && !terms.includes(K.breakfast)) add(K.breakfast);
  if (hasAny(text, [K.value, '\uBAA8\uD154', '\uBB34\uC778\uD154', '\uD39C\uC158', '\uAC8C\uC2A4\uD2B8']) && !terms.includes(K.value)) add(K.value);
  return terms.slice(0, 4);
}

let changed = 0;
for (let index = 4000; index < Math.min(generatedHotels.length, 4200); index += 1) {
  const hotel = generatedHotels[index];
  if (!hotel) continue;
  const city = cityOf(hotel);
  const safeName = hotel.hotelName.replace(/\s*\((?:\uC81C\uC8FC|\uBD80\uC0B0|\uC11C\uC6B8|\uC778\uCC9C).*?\)\s*/g, ' ').trim();
  const terms = termsFor(city, hotel);
  const title = `${safeName} ${city} ${K.review} ${K.collection} ${terms.join(' ')}`;
  hotel.analysis ||= {};
  hotel.analysis.seoTitle = title;
  hotel.analysis.seo_title = title;
  hotel.analysis.metaDescription = `${safeName} ${K.review}\uB97C ${city} ${K.location}, ${terms.join(', ')} \uAE30\uC900\uC73C\uB85C \uC815\uB9AC\uD588\uC2B5\uB2C8\uB2E4. \uC608\uC57D \uC804 \uCCB4\uD06C\uD560 \uC810\uACFC \uCC38\uACE0 \uB9C1\uD06C\uB97C \uD568\uAED8 \uD655\uC778\uD558\uC138\uC694.`;
  hotel.qualityStatus = 'ready';
  changed += 1;
}

fs.writeFileSync(
  'src/data/generatedHotels.ts',
  `// @ts-nocheck\nexport const generatedHotels: any[] = ${JSON.stringify(generatedHotels, null, 2)};\n`,
  'utf8'
);

console.log(JSON.stringify({ changed }, null, 2));
