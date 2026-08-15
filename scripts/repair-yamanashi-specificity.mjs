import { readFile, writeFile } from 'node:fs/promises';

const file = 'src/data/generatedHotels.ts';
const source = await readFile(file, 'utf8');
const match = source.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
if (!match) throw new Error('Unable to parse generatedHotels.ts');

const hotels = JSON.parse(match[1]);
const repairs = new Map([
  ['yamanashi-296213', '프라자 인 카와구치코는 가와구치코역에서 도보 이동이 쉬운 위치가 핵심인 숙소입니다.'],
  ['yamanashi-1195449', '와푸 게스트하우스 카시와야는 가와구치코역과 가까운 다다미형 게스트하우스입니다.']
]);

for (const hotel of hotels) {
  const sentence = repairs.get(hotel.slug);
  if (!sentence) continue;
  hotel.analysis.summary = `${sentence} ${hotel.analysis.summary}`;
  hotel.analysis.blogReview.intro[0] = sentence;
  hotel.qualityStatus = 'ready';
}

await writeFile(file, `export const generatedHotels = ${JSON.stringify(hotels, null, 2)};\n`, 'utf8');
console.log(`Repaired ${repairs.size} Yamanashi hotel pages`);
