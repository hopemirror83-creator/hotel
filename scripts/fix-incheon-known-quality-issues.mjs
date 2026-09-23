import { readFile, writeFile } from 'node:fs/promises';

const sourcePath = 'src/data/generatedHotels.ts';
const source = await readFile(sourcePath, 'utf8');
const match = source.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
if (!match) throw new Error('Could not parse generatedHotels.ts');

const hotels = JSON.parse(match[1]);
const corrections = new Map([
  ['incheon-10555532', {
    summary: '골든 호텔 인천은 인천 남동구 간석동에 있는 2성급 숙소입니다. 아고다에 공개된 137개 후기와 7.5점 평점을 참고하되, 조식·Wi-Fi·주차 등 현재 이용 조건은 예약 화면이나 숙소의 최신 안내를 함께 확인하는 편이 안전합니다.'
  }],
  ['incheon-10572909', {
    summary: '강화도 썬하우스펜션은 인천 강화군 내가면에 있는 펜션형 숙소입니다. 공개 후기 수가 많지 않고 태안의 동명 펜션과 혼동될 수 있으므로, 예약 전 주소와 객실 조건을 확인하는 것이 중요합니다.'
  }]
]);

let changed = 0;
for (const hotel of hotels) {
  const correction = corrections.get(hotel.slug);
  if (!correction || !hotel.analysis) continue;
  Object.assign(hotel.analysis, correction);
  changed += 1;
}

await writeFile(
  sourcePath,
  `// @ts-nocheck\nexport const generatedHotels: any[] = ${JSON.stringify(hotels, null, 2)};\n`,
  'utf8'
);
console.log(`Applied ${changed} known Incheon quality corrections.`);
