import { readFile, writeFile } from 'node:fs/promises';

const publicModulePath = 'src/data/generatedHotels.ts';
const slugPrefix = process.env.SANITIZE_SLUG_PREFIX || 'jeonnam-';

const text = await readFile(publicModulePath, 'utf8');
const match = text.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
if (!match) throw new Error('Could not parse generatedHotels module.');

const hotels = JSON.parse(match[1]);
let changed = 0;

for (const hotel of hotels) {
  if (!hotel.slug?.startsWith(slugPrefix)) continue;
  const before = JSON.stringify(hotel.analysis);
  const area = pickAreaLabel(hotel);
  hotel.analysis = walk(hotel.analysis, area);
  if (JSON.stringify(hotel.analysis) !== before) changed += 1;
}

await writeFile(
  publicModulePath,
  `// @ts-nocheck\nexport const generatedHotels: any[] = ${JSON.stringify(hotels, null, 2)};\n`,
  'utf8'
);

console.log({ slugPrefix, changed });

function walk(value, area) {
  if (Array.isArray(value)) return value.map((item) => walk(item, area));
  if (value && typeof value === 'object') {
    for (const key of Object.keys(value)) value[key] = walk(value[key], area);
    return value;
  }
  return replaceText(value, area);
}

function replaceText(value, area) {
  if (typeof value !== 'string') return value;
  return value
    .replace(/인천 영종도\/공항권 호텔/g, `${area} 지역 호텔`)
    .replace(/인천 영종도나 공항권 호텔/g, `${area} 지역의 다른 숙소`)
    .replace(/인천 영종도나 공항권/g, `${area} 지역`)
    .replace(/[가-힣]+\/공항권/g, `${area} 지역`)
    .replace(/영종도\/[가-힣]+ 지역 호텔/g, `${area} 지역 호텔`)
    .replace(/영종도\/[가-힣]+/g, area)
    .replace(/영종도 호텔들/g, `${area} 지역 숙소들`)
    .replace(/영종도 호텔/g, `${area} 호텔`)
    .replace(/공항권 호텔/g, `${area} 지역 호텔`)
    .replace(/공항권/g, `${area} 지역`)
    .replace(/인천 공항 호텔/g, `${area} 도심형 호텔`)
    .replace(/인천 공항 인근/g, `${area} 지역`)
    .replace(/인천 공항 근처/g, `${area} 지역`)
    .replace(/인천 공항 이용객/g, `${area} 방문객`)
    .replace(/인천 공항/g, `${area} 지역`)
    .replace(/인천 순천/g, '순천')
    .replace(/인천 지역의/g, `${area} 지역의`)
    .replace(/인천 영종도/g, area)
    .replace(/영종도/g, area)
    .replace(/공항 접근성/g, `${area} 이동 편의성`)
    .replace(/공항 환승/g, `${area} 이동`)
    .replace(/환승객/g, '단기 체류 여행객')
    .replace(/출국 전후/g, '여행 전후')
    .replace(/이른 출국/g, '이른 일정')
    .replace(/공항 이용객/g, '이동 일정이 있는 여행객')
    .replace(/공항 호텔/g, `${area} 지역 호텔`);
}

function pickAreaLabel(hotel) {
  const text = [hotel.hotelName, hotel.address, hotel.analysis?.summary].join(' ');
  if (/여수|돌산|오동도|엑스포|여천/.test(text)) return '여수';
  if (/목포|평화광장|갓바위|하당|남악/.test(text)) return '목포';
  if (/순천|순천만|국가정원/.test(text)) return '순천';
  if (/담양|죽녹원|메타/.test(text)) return '담양';
  if (/완도|해남|신안|자은도|무안|진도/.test(text)) return '전남 해안권';
  if (/광양|나주|화순|구례|보성|고흥|강진|장흥/.test(text)) return '전남 내륙권';
  return '전남';
}
