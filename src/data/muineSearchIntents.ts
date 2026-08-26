import type { Hotel } from './hotels';

const profiles = {
  center: { label: '함띠엔·응우옌딘찌에우', terms: ['위치', '도보관광', '조식', '소음'], focus: '함띠엔 해변과 응우옌딘찌에우 거리 식당·카페 접근 및 조식·야간 소음 조건' },
  citadel: { label: '무이네 화이트·레드샌듄', terms: ['사막투어', '투어동선', '조식', '이동'], focus: '무이네 화이트샌듄과 레드샌듄 투어 동선, 사막투어 픽업 및 조식·교통 조건' },
  river: { label: '무이네 비치', terms: ['오션뷰', '객실', '조식', '소음'], focus: '해변 접근과 객실 방향, 조식 및 해변·도로 소음 조건' },
  station: { label: '판티엣역', terms: ['판티엣이동', '짐보관', '체크인', '위치'], focus: '판티엣역 이동 시간과 짐 보관, 이른 도착·늦은 체크인 및 시내 접근 조건' },
  airport: { label: '호치민 출발', terms: ['공항이동', '픽업', '늦은체크인', '조식'], focus: '호치민 출발 이동 시간과 픽업, 늦은 체크인 및 조식 조건' },
  all: { label: '베트남 무이네', terms: ['위치', '조식', '사막투어', '예약조건'], focus: '무이네 위치와 객실·조식·사막투어·공항 이동·예약 조건' },
};

export function getMuineSearchIntent(hotel: Hotel) {
  if (!hotel.slug.startsWith('muine-')) return;
  const profile = pick(hotel);
  const name = hotel.hotelName.trim();
  const title = `${name} ${profile.label} 후기 모음 ${profile.terms.join(' ')}`;
  return {
    title,
    seoTitle: `${title} | 예약 전 FAQ`,
    metaDescription: `${name} 후기를 ${profile.focus} 중심으로 정리했습니다. 예약 전 최신 객실 조건과 요금을 확인하세요.`,
    intentChips: profile.terms,
    recommendedFor: ['무이네 자유여행', '해변·사막 관광', '커플·가족 여행'],
    notRecommendedFor: ['관광 이동 시간과 객실·소음 조건을 확인하지 않는 여행자'],
    faqs: [
      { category: '위치', question: `${name} 위치는 ${profile.label} 일정에 맞나요?`, answer: `${profile.focus}을 먼저 확인하세요. 무이네는 무이네 해변과 판티엣 시내의 이동 거리가 있으므로 지도상 거리뿐 아니라 실제 차량 이동 시간도 함께 살펴보는 편이 좋습니다.` },
      { category: '공항·체크인', question: `${name} 호치민에서 이동과 체크인은 어떻게 확인하나요?`, answer: '호치민에서 숙소까지 예상 이동 시간과 심야 체크인 가능 여부, 픽업·셔틀 및 짐 보관 조건을 확인하세요.' },
      { category: '관광', question: `${name}에서 무이네 사막투어는 편리한가요?`, answer: '화이트샌듄과 레드샌듄까지 차량 이동 시간과 투어 픽업 경로, 투어 픽업 가능 여부를 지도와 숙소 안내에서 비교하세요.' },
      { category: '조식', question: `${name} 조식은 예약에 포함되나요?`, answer: '객실 상품별 조식 포함 여부와 이용 시간, 어린이 요금은 예약 화면에서 다시 확인하세요.' },
      { category: '예약', question: `${name} 객실과 예약 조건은 무엇을 비교할까요?`, answer: '침대 구성과 창문·전망, 무료 취소 기한, 세금·추가 요금 및 체크아웃 시간을 결제 전에 확인하세요.' },
    ],
  };
}

function pick(hotel: Hotel) {
  const value = [hotel.hotelName, hotel.address, hotel.analysis?.summary].filter(Boolean).join(' ');
  if (/Ho Chi Minh|호치민|Saigon|사이공|버스|리무진/i.test(value)) return profiles.airport;
  if (/Railway|Train Station|판티엣역|Ga Phan Thiet/i.test(value)) return profiles.station;
  if (/White Sand|Red Sand|Sand Dune|화이트샌듄|레드샌듄|사막/i.test(value)) return profiles.citadel;
  if (/Beach|Ocean|Sea View|비치|오션|해변/i.test(value)) return profiles.river;
  if (/Ham Tien|Hàm Tiến|Nguyen Dinh Chieu|Nguyễn Đình Chiểu|함띠엔/i.test(value)) return profiles.center;
  return profiles.all;
}
