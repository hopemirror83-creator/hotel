import type { Hotel } from './hotels';

const profiles = {
  oldquarter: { label: '호이안 올드타운·야시장', terms: ['위치', '도보관광', '조식', '소음'], focus: '호이안 올드타운과 야시장, 투본강 도보 접근 및 조식·야간 소음 조건' },
  tayho: { label: '안방비치', terms: ['해변', '수영장', '조식', '셔틀'], focus: '안방비치 접근과 수영장, 조식 및 호이안 올드타운 셔틀 조건' },
  badinh: { label: '끄어다이비치', terms: ['해변', '객실', '조식', '이동'], focus: '끄어다이비치 접근과 객실 전망, 조식 및 올드타운 이동 조건' },
  caugiay: { label: '깜탄·코코넛빌리지', terms: ['자연체험', '수영장', '가족여행', '이동'], focus: '깜탄 코코넛빌리지 체험과 수영장, 가족 객실 및 올드타운 이동 조건' },
  airport: { label: '다낭국제공항', terms: ['공항이동', '픽업', '늦은체크인', '조식'], focus: '다낭국제공항 이동 시간과 픽업, 늦은 체크인 및 조식 조건' },
  all: { label: '베트남 호이안', terms: ['위치', '조식', '공항', '예약조건'], focus: '호이안 위치와 객실·조식·공항 이동·예약 조건' },
};

export function getHoianSearchIntent(hotel: Hotel) {
  if (!hotel.slug.startsWith('hoian-')) return;
  const profile = pick(hotel);
  const name = hotel.hotelName.trim();
  const title = `${name} ${profile.label} 후기 모음 ${profile.terms.join(' ')}`;
  return {
    title,
    seoTitle: `${title} | 예약 전 FAQ`,
    metaDescription: `${name} 후기를 ${profile.focus} 중심으로 정리했습니다. 예약 전 최신 객실 조건과 요금을 확인하세요.`,
    intentChips: profile.terms,
    recommendedFor: ['호이안 자유여행', '도심 관광 여행', '커플·가족 여행'],
    notRecommendedFor: ['교통 시간과 주변 소음, 객실 조건을 확인하지 않는 여행자'],
    faqs: [
      { category: '위치', question: `${name} 위치는 ${profile.label} 일정에 맞나요?`, answer: `${profile.focus}을 먼저 확인하세요. 호이안은 주말과 관광 성수기에 이동 시간이 길어질 수 있어 지도상 거리와 실제 이동 시간이 다를 수 있습니다.` },
      { category: '공항·체크인', question: `${name} 다낭국제공항 이동과 체크인은 어떻게 확인하나요?`, answer: '공항까지 예상 이동 시간과 심야 체크인 가능 여부, 픽업·셔틀 및 짐 보관 조건을 확인하세요.' },
      { category: '조식', question: `${name} 조식은 예약에 포함되나요?`, answer: '객실 상품별 조식 포함 여부와 이용 시간, 어린이 요금은 예약 화면에서 다시 확인하세요.' },
      { category: '객실·소음', question: `${name} 객실과 소음은 무엇을 살펴볼까요?`, answer: '창문 유무와 객실 크기, 도로·올드타운·해변 방향, 고층 객실 가능 여부를 공개 후기와 객실 설명에서 비교하세요.' },
      { category: '예약', question: `${name} 예약 조건은 무엇을 비교할까요?`, answer: '침대 구성과 전망, 무료 취소 기한, 세금·추가 요금 및 체크아웃 시간을 결제 전에 확인하세요.' },
    ],
  };
}

function pick(hotel: Hotel) {
  const value = [hotel.hotelName, hotel.address, hotel.analysis?.summary].filter(Boolean).join(' ');
  if (/Airport|에어포트|Da Nang International|다낭국제공항|DAD/i.test(value)) return profiles.airport;
  if (/Cam Thanh|Cẩm Thanh|깜탄|Coconut|코코넛/i.test(value)) return profiles.caugiay;
  if (/An Bang|An Bàng|안방|Ha My|Hà My/i.test(value)) return profiles.tayho;
  if (/Cua Dai|Cửa Đại|끄어다이|쿠아다이/i.test(value)) return profiles.badinh;
  if (/Old Town|Ancient Town|올드타운|고대도시|Minh An|Cẩm Phô|Cam Pho|An Hoi|안호이|야시장/i.test(value)) return profiles.oldquarter;
  return profiles.all;
}
