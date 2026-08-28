import type { Hotel } from './hotels';

const profiles = {
  center: { label: '사파 시내', terms: ['위치', '조식', '야시장', '체크인'], focus: '사파 광장과 야시장 도보 거리, 조식 및 체크인 조건' },
  fansipan: { label: '판시판 케이블카', terms: ['판시판', '케이블카', '조식', '이동'], focus: '판시판 케이블카와 선플라자 이동, 조식 및 교통 조건' },
  catcat: { label: '깟깟마을', terms: ['깟깟마을', '산악전망', '트레킹', '이동'], focus: '깟깟마을 트레킹 동선과 산악 전망, 경사로 및 시내 이동 조건' },
  valley: { label: '므엉호아·따반', terms: ['계단식논', '트레킹', '전망', '픽업'], focus: '므엉호아 계곡과 따반 트레킹, 계단식 논 전망 및 픽업 조건' },
  laocai: { label: '라오까이역', terms: ['기차이동', '짐보관', '체크인', '사파이동'], focus: '라오까이역과 사파 시내 이동 시간, 짐 보관 및 이른 체크인 조건' },
  all: { label: '베트남 사파', terms: ['위치', '조식', '전망', '예약조건'], focus: '사파 위치와 객실·조식·산악 전망·교통·예약 조건' },
};

export function getSapaSearchIntent(hotel: Hotel) {
  if (!hotel.slug.startsWith('sapa-')) return;
  const profile = pick(hotel);
  const name = hotel.hotelName.trim();
  const title = `${name} ${profile.label} 후기 모음 ${profile.terms.join(' ')}`;
  return {
    title,
    seoTitle: `${title} | 예약 전 FAQ`,
    metaDescription: `${name} 후기를 ${profile.focus} 중심으로 정리했습니다. 예약 전 최신 객실 조건과 요금을 확인하세요.`,
    intentChips: profile.terms,
    recommendedFor: ['사파 자유여행', '산악 전망·트레킹', '커플·가족 여행'],
    notRecommendedFor: ['경사와 이동 시간, 객실 난방 조건을 확인하지 않는 여행자'],
    faqs: [
      { category: '위치', question: `${name} 위치는 ${profile.label} 일정에 맞나요?`, answer: `${profile.focus}을 먼저 확인하세요. 사파는 경사가 많아 지도상 거리보다 실제 도보 시간이 길 수 있으므로 차량 이동과 픽업 조건도 함께 살펴보는 편이 좋습니다.` },
      { category: '교통·체크인', question: `${name} 하노이·라오까이에서 이동과 체크인은 어떻게 확인하나요?`, answer: '하노이 슬리핑버스 또는 라오까이역에서 숙소까지 이동 시간과 픽업, 이른 체크인·짐 보관 조건을 확인하세요.' },
      { category: '관광', question: `${name}에서 판시판과 마을 트레킹은 편리한가요?`, answer: '판시판 케이블카, 깟깟마을, 므엉호아 계곡까지 차량 또는 도보 이동 시간과 숙소 픽업 가능 여부를 비교하세요.' },
      { category: '객실', question: `${name} 난방과 산악 전망 객실은 어떻게 확인하나요?`, answer: '사파는 계절과 날씨에 따라 체감온도가 낮으므로 객실 난방·온수 조건과 전망 객실의 정확한 명칭을 예약 화면에서 확인하세요.' },
      { category: '예약', question: `${name} 객실과 예약 조건은 무엇을 비교할까요?`, answer: '침대 구성과 조식 포함 여부, 무료 취소 기한, 세금·추가 요금 및 체크아웃 시간을 결제 전에 확인하세요.' },
    ],
  };
}

function pick(hotel: Hotel) {
  const value = [hotel.hotelName, hotel.address, hotel.analysis?.summary].filter(Boolean).join(' ');
  if (/Lao Cai|Lào Cai|라오까이|Railway|Train Station|기차역/i.test(value)) return profiles.laocai;
  if (/Muong Hoa|Mường Hoa|므엉호아|Ta Van|Tả Van|따반|Lao Chai|라오짜이/i.test(value)) return profiles.valley;
  if (/Cat Cat|Cát Cát|깟깟/i.test(value)) return profiles.catcat;
  if (/Fansipan|판시판|Sun Plaza|선플라자|Cable Car|케이블카/i.test(value)) return profiles.fansipan;
  if (/Center|Central|Square|Town|사파 시내|광장|야시장/i.test(value)) return profiles.center;
  return profiles.all;
}
