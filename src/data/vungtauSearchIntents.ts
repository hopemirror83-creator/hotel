import type { Hotel } from './hotels';

const profiles = {
  backBeach: { label: '붕따우 백비치', terms: ['해변', '수영장', '조식', '소음'], focus: '백비치 도보 거리와 수영장·조식, 해변 및 도로 소음 조건' },
  frontBeach: { label: '붕따우 프런트비치', terms: ['시내위치', '야시장', '조식', '주차'], focus: '프런트비치와 시내 식당·야시장 접근, 조식 및 주차 조건' },
  longHai: { label: '롱하이 해변', terms: ['가족여행', '해변', '수영장', '이동'], focus: '롱하이 해변 접근과 가족 객실·수영장, 붕따우 시내 이동 조건' },
  hoTram: { label: '호짬·호꼭', terms: ['리조트', '오션뷰', '수영장', '교통'], focus: '호짬·호꼭 해변과 리조트 시설, 오션뷰 객실 및 교통 조건' },
  transfer: { label: '호찌민 출발', terms: ['호찌민이동', '픽업', '체크인', '조식'], focus: '호찌민에서 이동 시간과 픽업·버스, 늦은 체크인 및 조식 조건' },
  all: { label: '베트남 붕따우', terms: ['위치', '조식', '해변', '예약조건'], focus: '붕따우 위치와 객실·조식·해변 접근·호찌민 이동·예약 조건' },
};

export function getVungtauSearchIntent(hotel: Hotel) {
  if (!hotel.slug.startsWith('vungtau-')) return;
  const profile = pick(hotel);
  const name = hotel.hotelName.trim();
  const title = `${name} ${profile.label} 후기 모음 ${profile.terms.join(' ')}`;
  return {
    title,
    seoTitle: `${title} | 예약 전 FAQ`,
    metaDescription: `${name} 후기를 ${profile.focus} 중심으로 정리했습니다. 예약 전 최신 객실 조건과 요금을 확인하세요.`,
    intentChips: profile.terms,
    recommendedFor: ['붕따우 자유여행', '해변 휴양', '커플·가족 여행'],
    notRecommendedFor: ['해변·시내 이동과 객실 조건을 확인하지 않는 여행자'],
    faqs: [
      { category: '위치', question: `${name} 위치는 ${profile.label} 일정에 맞나요?`, answer: `${profile.focus}을 먼저 확인하세요. 붕따우는 해변과 시내, 롱하이·호짬 권역에 따라 차량 이동 시간이 달라 실제 동선을 함께 살펴보는 편이 좋습니다.` },
      { category: '교통·체크인', question: `${name} 호찌민에서 이동과 체크인은 어떻게 확인하나요?`, answer: '호찌민에서 숙소까지 버스·리무진 이동 시간과 하차 지점, 늦은 체크인 및 짐 보관 조건을 확인하세요.' },
      { category: '해변', question: `${name}에서 해변 이용은 편리한가요?`, answer: '백비치·프런트비치·롱하이 등 실제 이용할 해변까지 도보 또는 차량 이동 시간과 해변 출입 동선을 지도에서 비교하세요.' },
      { category: '조식', question: `${name} 조식은 예약에 포함되나요?`, answer: '객실 상품별 조식 포함 여부와 이용 시간, 어린이 요금은 예약 화면에서 다시 확인하세요.' },
      { category: '예약', question: `${name} 객실과 예약 조건은 무엇을 비교할까요?`, answer: '침대 구성과 창문·전망, 무료 취소 기한, 세금·추가 요금 및 체크아웃 시간을 결제 전에 확인하세요.' },
    ],
  };
}

function pick(hotel: Hotel) {
  const value = [hotel.hotelName, hotel.address, hotel.analysis?.summary].filter(Boolean).join(' ');
  if (/Ho Tram|Hồ Tràm|Ho Coc|Hồ Cốc|호짬|호꼭/i.test(value)) return profiles.hoTram;
  if (/Long Hai|Long Hải|롱하이/i.test(value)) return profiles.longHai;
  if (/Back Beach|Bai Sau|Bãi Sau|바이싸우|백비치|Thuy Van|Thùy Vân/i.test(value)) return profiles.backBeach;
  if (/Front Beach|Bai Truoc|Bãi Trước|바이쯔억|프런트비치|Tran Phu|Trần Phú/i.test(value)) return profiles.frontBeach;
  if (/Ho Chi Minh|Hồ Chí Minh|호찌민|호치민|Saigon|사이공|버스|리무진/i.test(value)) return profiles.transfer;
  return profiles.all;
}
