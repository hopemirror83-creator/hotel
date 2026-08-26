import type { Hotel } from './hotels';

const profiles = {
  oldquarter: { label: '올드쿼터·호안끼엠', terms: ['위치', '조식', '도보관광', '소음'], focus: '호안끼엠호수와 올드쿼터 도보 접근, 조식·객실 소음 조건' },
  tayho: { label: '서호·떠이호', terms: ['레이크뷰', '수영장', '가족여행', '이동'], focus: '서호 전망과 수영장, 가족 객실·도심 이동 조건' },
  badinh: { label: '바딘', terms: ['출장', '관광', '조식', '교통'], focus: '바딘 업무지구와 주요 관광지 접근, 조식·교통 조건' },
  caugiay: { label: '꺼우저이·미딩', terms: ['출장', '한인타운', '공항이동', '장기숙박'], focus: '꺼우저이와 미딩 업무 동선, 한인타운·공항 이동 조건' },
  airport: { label: '노이바이 공항', terms: ['공항이동', '셔틀', '새벽체크인', '조식'], focus: '노이바이공항 이동 시간과 셔틀, 심야 체크인·조식 조건' },
  all: { label: '베트남 하노이', terms: ['위치', '조식', '공항', '예약조건'], focus: '하노이 위치와 객실·조식·공항 이동·예약 조건' },
};

export function getHanoiSearchIntent(hotel: Hotel) {
  if (!hotel.slug.startsWith('hanoi-')) return;
  const profile = pick(hotel);
  const name = hotel.hotelName.trim();
  const title = `${name} ${profile.label} 후기 모음 ${profile.terms.join(' ')}`;
  return {
    title,
    seoTitle: `${title} | 예약 전 FAQ`,
    metaDescription: `${name} 후기를 ${profile.focus} 중심으로 정리했습니다. 예약 전 최신 객실 조건과 요금을 확인하세요.`,
    intentChips: profile.terms,
    recommendedFor: ['하노이 자유여행', '도심 관광 여행', '출장·가족 여행'],
    notRecommendedFor: ['교통 시간과 주변 소음, 객실 조건을 확인하지 않는 여행자'],
    faqs: [
      { category: '위치', question: `${name} 위치는 ${profile.label} 일정에 맞나요?`, answer: `${profile.focus}을 먼저 확인하세요. 하노이는 출퇴근 시간 교통 정체가 있어 지도상 거리와 실제 이동 시간이 다를 수 있습니다.` },
      { category: '공항·체크인', question: `${name} 노이바이공항 이동과 체크인은 어떻게 확인하나요?`, answer: '공항까지 예상 이동 시간과 심야 체크인 가능 여부, 픽업·셔틀 및 짐 보관 조건을 확인하세요.' },
      { category: '조식', question: `${name} 조식은 예약에 포함되나요?`, answer: '객실 상품별 조식 포함 여부와 이용 시간, 어린이 요금은 예약 화면에서 다시 확인하세요.' },
      { category: '객실·소음', question: `${name} 객실과 소음은 무엇을 살펴볼까요?`, answer: '창문 유무와 객실 크기, 도로·올드쿼터 방향, 고층 객실 가능 여부를 공개 후기와 객실 설명에서 비교하세요.' },
      { category: '예약', question: `${name} 예약 조건은 무엇을 비교할까요?`, answer: '침대 구성과 전망, 무료 취소 기한, 세금·추가 요금 및 체크아웃 시간을 결제 전에 확인하세요.' },
    ],
  };
}

function pick(hotel: Hotel) {
  const value = [hotel.hotelName, hotel.address, hotel.analysis?.summary].filter(Boolean).join(' ');
  if (/Airport|에어포트|Noi Bai|Nội Bài|노이바이|VATC/i.test(value)) return profiles.airport;
  if (/Cau Giay|Cầu Giấy|꺼우저이|My Dinh|Mỹ Đình|미딩|Landmark72|랜드마크72/i.test(value)) return profiles.caugiay;
  if (/Tay Ho|Tây Hồ|떠이호|West Lake|웨스트레이크|서호/i.test(value)) return profiles.tayho;
  if (/Ba Dinh|Ba Đình|바딘|Lieu Giai|Liễu Giai|Kim Ma|Kim Mã/i.test(value)) return profiles.badinh;
  if (/Hoan Kiem|Hoàn Kiếm|호안끼엠|Old Quarter|올드 쿼터|항가이|Hang Gai|Hang Bong|Hàng Bông/i.test(value)) return profiles.oldquarter;
  return profiles.all;
}
