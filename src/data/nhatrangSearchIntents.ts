import type { Hotel } from './hotels';

const profiles = {
  beach: { label: '쩐푸비치·해변', terms: ['오션뷰', '수영장', '조식', '해변'], focus: '쩐푸 해변까지 실제 거리와 객실 전망, 수영장·조식 조건' },
  city: { label: '나트랑 시내', terms: ['야시장', '조식', '체크인', '교통'], focus: '야시장과 해변, 식당가 이동 및 조식·체크인 조건' },
  island: { label: '혼째섬·리조트', terms: ['가족여행', '수영장', '오션뷰', '이동'], focus: '혼째섬 이동 방식과 리조트 시설, 가족 객실·수영장 조건' },
  north: { label: '북부 해변', terms: ['오션뷰', '가성비', '수영장', '교통'], focus: '북부 해변 접근과 시내 이동, 객실 전망·가성비 조건' },
  all: { label: '베트남 나트랑', terms: ['위치', '조식', '수영장', '예약조건'], focus: '나트랑 위치와 객실·조식·수영장·예약 조건' },
};

export function getNhatrangSearchIntent(hotel: Hotel) {
  if (!hotel.slug.startsWith('nhatrang-')) return;
  const profile = pick(hotel);
  const name = hotel.hotelName.trim();
  const title = `${name} ${profile.label} 후기 모음 ${profile.terms.join(' ')}`;
  return {
    title,
    seoTitle: `${title} | 예약 전 FAQ`,
    metaDescription: `${name} 후기를 ${profile.focus} 중심으로 정리했습니다. 예약 전 최신 객실 조건과 요금을 확인하세요.`,
    intentChips: profile.terms,
    recommendedFor: ['나트랑 자유여행', '해변·호캉스 여행', '가족·커플 여행'],
    notRecommendedFor: ['위치와 객실 조건을 확인하지 않는 여행자'],
    faqs: [
      { category: '위치', question: `${name} 위치는 ${profile.label} 일정에 맞나요?`, answer: `${profile.focus}을 먼저 확인하세요. 나트랑은 시내·해변·섬 권역에 따라 이동 동선이 달라집니다.` },
      { category: '체크인', question: `${name} 체크인 전 무엇을 확인해야 하나요?`, answer: '프런트 운영 시간과 늦은 도착 가능 여부, 체크인 전후 짐 보관 조건을 확인하세요.' },
      { category: '조식', question: `${name} 조식은 예약에 포함되나요?`, answer: '객실 상품별 조식 포함 여부와 이용 시간, 어린이 요금은 예약 화면에서 다시 확인하세요.' },
      { category: '수영장·해변', question: `${name} 수영장과 해변 이용 시 무엇을 볼까요?`, answer: '수영장 운영 시간과 공사 여부, 해변까지 실제 이동 거리와 객실 전망 유형을 비교하세요.' },
      { category: '예약', question: `${name} 객실 조건은 무엇을 비교할까요?`, answer: '침대 구성과 금연 여부, 전망, 공항 이동, 무료 취소 기한을 결제 전에 확인하세요.' },
    ],
  };
}

function pick(hotel: Hotel) {
  const value = [hotel.hotelName, hotel.address, hotel.analysis?.summary].filter(Boolean).join(' ');
  if (/Hon Tre|Hòn Tre|혼째|Vinpearl|빈펄|Island|아일랜드/i.test(value)) return profiles.island;
  if (/Pham Van Dong|Vĩnh Hải|Vinh Hai|북부|Boma|Amiana/i.test(value)) return profiles.north;
  if (/Tran Phu|Trần Phú|쩐푸|Beach|비치|Ocean|오션|해변/i.test(value)) return profiles.beach;
  if (/Nha Trang|나트랑|냐짱|Market|시장|Lộc Thọ|Loc Tho/i.test(value)) return profiles.city;
  return profiles.all;
}
