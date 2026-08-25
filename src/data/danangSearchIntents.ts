import type { Hotel } from './hotels';

const profiles = {
  beach: { label: '미케비치·해변', terms: ['오션뷰', '수영장', '조식', '해변'], focus: '미케비치 도보 거리와 객실 전망, 수영장·조식 조건' },
  river: { label: '한강·다낭 시내', terms: ['한시장', '공항', '조식', '체크인'], focus: '한시장과 한강, 공항 이동 및 조식·체크인 조건' },
  nonnuoc: { label: '논누억', terms: ['리조트', '가족여행', '수영장', '오션뷰'], focus: '논누억 해변과 리조트 시설, 가족 객실·수영장 조건' },
  sontra: { label: '선짜', terms: ['해변', '오션뷰', '가성비', '교통'], focus: '선짜 해변 접근과 시내 이동, 객실 전망·가성비 조건' },
  airport: { label: '다낭 공항·시내', terms: ['공항근처', '픽업', '체크인', '짐보관'], focus: '다낭 공항 이동 시간과 픽업, 늦은 체크인·짐 보관 조건' },
  all: { label: '베트남 다낭', terms: ['위치', '조식', '수영장', '예약조건'], focus: '다낭 위치와 객실·조식·수영장·예약 조건' },
};

export function getDanangSearchIntent(hotel: Hotel) {
  if (!hotel.slug.startsWith('danang-')) return;
  const profile = pick(hotel);
  const name = hotel.hotelName.trim();
  const title = `${name} ${profile.label} 후기 모음 ${profile.terms.join(' ')}`;
  return {
    title,
    seoTitle: `${title} | 예약 전 FAQ`,
    metaDescription: `${name} 후기를 ${profile.focus} 중심으로 정리했습니다. 예약 전 최신 객실 조건과 요금을 확인하세요.`,
    intentChips: profile.terms,
    recommendedFor: ['다낭 자유여행', '해변·호캉스 여행', '가족·커플 여행'],
    notRecommendedFor: ['위치와 객실 조건을 확인하지 않는 여행자'],
    faqs: [
      { category: '위치', question: `${name} 위치는 ${profile.label} 일정에 맞나요?`, answer: `${profile.focus}을 먼저 확인하세요. 다낭은 해변과 시내 권역에 따라 이동 동선이 달라집니다.` },
      { category: '체크인', question: `${name} 체크인 전 무엇을 확인해야 하나요?`, answer: '프런트 운영 시간과 늦은 도착 가능 여부, 체크인 전후 짐 보관 조건을 확인하세요.' },
      { category: '조식', question: `${name} 조식은 예약에 포함되나요?`, answer: '객실 상품별 조식 포함 여부와 이용 시간, 어린이 요금은 예약 화면에서 다시 확인하세요.' },
      { category: '수영장·해변', question: `${name} 수영장과 해변 이용 시 무엇을 볼까요?`, answer: '수영장 운영 시간과 공사 여부, 해변까지 실제 도보 거리와 객실 전망 유형을 비교하세요.' },
      { category: '예약', question: `${name} 객실 조건은 무엇을 비교할까요?`, answer: '침대 구성과 금연 여부, 전망, 공항 픽업, 무료 취소 기한을 결제 전에 확인하세요.' },
    ],
  };
}

function pick(hotel: Hotel) {
  const value = [hotel.hotelName, hotel.address, hotel.analysis?.summary].filter(Boolean).join(' ');
  if (/Non Nuoc|Non Nước|논 누옥|논누억|Ngu Hanh Son|Ngũ Hành Sơn/i.test(value)) return profiles.nonnuoc;
  if (/Son Tra|Sơn Trà|선짜|페닌슐라/i.test(value)) return profiles.sontra;
  if (/My Khe|Mỹ Khê|미케|Beach|비치|Ocean|오션|해변/i.test(value)) return profiles.beach;
  if (/Airport|공항|Nguyen Van Linh|응우옌 반 린/i.test(value)) return profiles.airport;
  if (/Han River|한강|Han Market|한시장|Hai Chau|Hải Châu|Bach Dang|Tran Phu/i.test(value)) return profiles.river;
  return profiles.all;
}
