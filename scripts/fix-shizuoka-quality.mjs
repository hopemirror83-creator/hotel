import { readFile, writeFile } from 'node:fs/promises';

const path = 'src/data/generatedHotels.ts';
const source = await readFile(path, 'utf8');
const match = source.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
if (!match) throw new Error('Could not parse generatedHotels.ts');
const hotels = JSON.parse(match[1]);
const hotel = hotels.find((item) => item.slug === 'shizuoka-1199219');
if (!hotel) throw new Error('Target hotel not found');

hotel.analysis.blogReview.sections = [
  { heading: '이 호텔 선택 이유', paragraphs: ['공개 후기에서는 JR 후지역 남쪽 출구와 가까워 철도 이동이 편리하다는 의견이 반복됩니다. 짐이 있는 여행자나 후지노미야·시즈오카를 오가는 일정에서 위치가 선택 이유가 될 수 있습니다.', '숙박 요금에 조식이 포함된 상품이 있어 교통과 아침 식사를 함께 챙기려는 여행자가 비교하기 좋습니다. 다만 조식 포함 여부는 객실 상품별로 달라질 수 있으니 예약 화면에서 확인해야 합니다.'] },
  { heading: '호텔 구성 및 특징', paragraphs: ['실용적인 객실과 기본 편의시설을 갖춘 비즈니스 호텔 유형입니다. 공개 정보에서는 로비의 커피와 전자레인지, 체크인 전후 짐 보관 서비스가 편리하다는 내용이 확인됩니다.', '객실은 일본 도심형 비즈니스 호텔에 가까운 구성으로, 넓은 부대시설보다 역 접근성과 기본적인 숙박 기능을 중요하게 보는 일정에 맞습니다.'] },
  { heading: '주요 장점', paragraphs: ['후지역과 가까운 위치가 가장 자주 확인되는 장점입니다. 철도를 이용해 후지산 주변이나 시즈오카 시내를 이동할 계획이라면 환승과 도보 시간을 줄이는 데 도움이 될 수 있습니다.', '객실과 공용 공간의 청결 상태, 직원 응대에 대한 긍정적인 의견도 보입니다. 무료 조식은 숙박비와 식비를 함께 비교하는 여행자에게 실용적인 조건입니다.'] },
  { heading: '경쟁 제품과 비교', paragraphs: ['후지역 주변 숙소와 비교할 때 이 호텔은 역 출구까지의 짧은 동선과 조식 포함 상품이 강점으로 꼽힙니다. 반면 넓은 객실이나 온천·리조트 시설을 원하는 경우에는 다른 유형의 숙소가 더 잘 맞을 수 있습니다.', '가격만 비교하기보다 객실 크기, 조식 포함 여부, 체크인 가능 시간과 이동 계획을 함께 살펴보는 편이 좋습니다.'] },
  { heading: '팁 & 고려사항', paragraphs: ['객실이 크지 않다는 의견이 있어 큰 캐리어를 여러 개 사용하는 여행자는 객실 면적과 침대 구성을 먼저 확인하는 편이 안전합니다. 체크아웃 시간과 야간 프런트 운영 시간도 예약 전에 살펴봐야 합니다.', '후지산 전망은 날씨와 객실 방향에 따라 달라질 수 있습니다. 전망이 중요하다면 객실명과 전망 보장 여부를 예약 화면이나 호텔 안내에서 다시 확인하세요.'] },
  { heading: '이런 분들 추천해요', paragraphs: ['후지역을 기준으로 시즈오카와 후지산 주변을 철도로 이동하는 여행자, 조식 포함 비즈니스 호텔을 찾는 여행자에게 우선 비교할 만한 숙소입니다.', '넓은 객실이나 다양한 부대시설보다 위치와 청결, 기본적인 숙박 편의성을 중요하게 보는 짧은 일정에도 잘 맞는 편입니다.'] },
];
hotel.qualityStatus = 'ready';
hotel.qualityReason = '';
await writeFile(path, `// @ts-nocheck\nexport const generatedHotels: any[] = ${JSON.stringify(hotels, null, 2)};\n`, 'utf8');
console.log('Fixed shizuoka-1199219');
