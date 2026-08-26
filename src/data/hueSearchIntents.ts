import type { Hotel } from './hotels';

const profiles = {
  center: { label: '후에 시내·여행자거리', terms: ['위치', '도보관광', '조식', '소음'], focus: '후에 여행자거리와 레러이 거리, 향강 도보 접근 및 조식·야간 소음 조건' },
  citadel: { label: '후에 왕궁·황성', terms: ['왕궁접근', '관광동선', '조식', '이동'], focus: '후에 왕궁과 황성 관광 동선, 향강 횡단 및 조식·교통 조건' },
  river: { label: '향강 리버뷰', terms: ['리버뷰', '객실', '조식', '소음'], focus: '향강 전망과 객실 방향, 조식 및 강변·도로 소음 조건' },
  station: { label: '후에역', terms: ['기차이동', '짐보관', '체크인', '위치'], focus: '후에역 이동 시간과 짐 보관, 이른 도착·늦은 체크인 및 시내 접근 조건' },
  airport: { label: '푸바이국제공항', terms: ['공항이동', '픽업', '늦은체크인', '조식'], focus: '푸바이국제공항 이동 시간과 픽업, 늦은 체크인 및 조식 조건' },
  all: { label: '베트남 후에', terms: ['위치', '조식', '왕궁', '예약조건'], focus: '후에 위치와 객실·조식·왕궁 관광·공항 이동·예약 조건' },
};

export function getHueSearchIntent(hotel: Hotel) {
  if (!hotel.slug.startsWith('hue-')) return;
  const profile = pick(hotel);
  const name = hotel.hotelName.trim();
  const title = `${name} ${profile.label} 후기 모음 ${profile.terms.join(' ')}`;
  return {
    title,
    seoTitle: `${title} | 예약 전 FAQ`,
    metaDescription: `${name} 후기를 ${profile.focus} 중심으로 정리했습니다. 예약 전 최신 객실 조건과 요금을 확인하세요.`,
    intentChips: profile.terms,
    recommendedFor: ['후에 자유여행', '역사 유적 관광', '커플·가족 여행'],
    notRecommendedFor: ['관광 이동 시간과 객실·소음 조건을 확인하지 않는 여행자'],
    faqs: [
      { category: '위치', question: `${name} 위치는 ${profile.label} 일정에 맞나요?`, answer: `${profile.focus}을 먼저 확인하세요. 후에는 향강을 사이에 두고 왕궁과 신시가지가 나뉘므로 지도상 거리뿐 아니라 다리 이동 동선도 함께 살펴보는 편이 좋습니다.` },
      { category: '공항·체크인', question: `${name} 푸바이공항 이동과 체크인은 어떻게 확인하나요?`, answer: '푸바이국제공항까지 예상 이동 시간과 심야 체크인 가능 여부, 픽업·셔틀 및 짐 보관 조건을 확인하세요.' },
      { category: '관광', question: `${name}에서 후에 왕궁 관광은 편리한가요?`, answer: '왕궁까지 도보·택시 이동 시간과 향강을 건너는 경로, 투어 픽업 가능 여부를 지도와 숙소 안내에서 비교하세요.' },
      { category: '조식', question: `${name} 조식은 예약에 포함되나요?`, answer: '객실 상품별 조식 포함 여부와 이용 시간, 어린이 요금은 예약 화면에서 다시 확인하세요.' },
      { category: '예약', question: `${name} 객실과 예약 조건은 무엇을 비교할까요?`, answer: '침대 구성과 창문·전망, 무료 취소 기한, 세금·추가 요금 및 체크아웃 시간을 결제 전에 확인하세요.' },
    ],
  };
}

function pick(hotel: Hotel) {
  const value = [hotel.hotelName, hotel.address, hotel.analysis?.summary].filter(Boolean).join(' ');
  if (/Phu Bai|Phú Bài|푸바이|Airport|에어포트|HUI/i.test(value)) return profiles.airport;
  if (/Railway|Train Station|후에역|Ga Hue|Ga Huế|Bui Thi Xuan|Bùi Thị Xuân/i.test(value)) return profiles.station;
  if (/Citadel|Imperial City|Royal Palace|왕궁|황성|Kinh Thanh|Kinh Thành|Thuan Thanh|Thuận Thành|Kim Long/i.test(value)) return profiles.citadel;
  if (/Perfume River|Huong River|Hương River|향강|Riverside|River View|Le Loi|Lê Lợi/i.test(value)) return profiles.river;
  if (/Pham Ngu Lao|Phạm Ngũ Lão|Vo Thi Sau|Võ Thị Sáu|Chu Van An|Chu Văn An|Phu Hoi|Phú Hội|여행자거리/i.test(value)) return profiles.center;
  return profiles.all;
}
