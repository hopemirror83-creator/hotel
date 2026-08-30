import type { Hotel } from './hotels';

const profiles = {
  baichay: { label: '바이짜이', terms: ['해변', '썬월드', '조식', '체크인'], focus: '바이짜이 해변과 썬월드 이동, 조식 및 체크인 조건' },
  tuanchau: { label: '뚜언쩌우', terms: ['크루즈선착장', '픽업', '조식', '이동'], focus: '뚜언쩌우 크루즈 선착장과 픽업, 조식 및 이동 조건' },
  hongai: { label: '혼가이', terms: ['시내위치', '시장', '주차', '베이뷰'], focus: '혼가이 시내와 시장 접근, 주차 및 하롱베이 전망 조건' },
  cruise: { label: '하롱베이 크루즈', terms: ['승선장소', '객실', '식사', '일정'], focus: '승선 장소와 선실 구성, 포함 식사 및 크루즈 일정' },
  vandon: { label: '반돈·꽌란', terms: ['공항이동', '해변', '픽업', '조식'], focus: '반돈공항과 섬·해변 이동, 픽업 및 조식 조건' },
  all: { label: '베트남 하롱베이', terms: ['위치', '조식', '베이뷰', '예약조건'], focus: '하롱베이 위치와 객실·조식·전망·교통·예약 조건' },
};

export function getHalongSearchIntent(hotel: Hotel) {
  if (!hotel.slug.startsWith('halong-')) return;
  const profile = pick(hotel);
  const name = hotel.hotelName.trim();
  const title = `${name} ${profile.label} 후기 모음 ${profile.terms.join(' ')}`;
  return {
    title,
    seoTitle: `${title} | 예약 전 FAQ`,
    metaDescription: `${name} 후기를 ${profile.focus} 중심으로 정리했습니다. 예약 전 최신 객실 조건과 요금을 확인하세요.`,
    intentChips: profile.terms,
    recommendedFor: ['하롱베이 자유여행', '크루즈·해변 일정', '커플·가족 여행'],
    notRecommendedFor: ['선착장과 육상 호텔 위치를 구분하지 않고 예약하는 여행자'],
    faqs: [
      { category: '위치', question: `${name} 위치는 ${profile.label} 일정에 맞나요?`, answer: `${profile.focus}을 먼저 확인하세요. 하롱베이는 바이짜이·혼가이·뚜언쩌우의 이동 동선이 달라 지도상 거리와 차량 시간을 함께 살펴보는 편이 좋습니다.` },
      { category: '크루즈·교통', question: `${name} 크루즈 선착장과 하노이 이동은 어떻게 확인하나요?`, answer: '승선 항구와 집결 장소, 하노이 왕복 셔틀 포함 여부, 호텔 픽업 시간과 추가 요금을 확인하세요.' },
      { category: '객실', question: `${name} 베이뷰 객실은 어떻게 확인하나요?`, answer: '객실명에 바다 또는 베이 전망이 명시됐는지 확인하고, 전망 방향과 발코니·창문 조건을 예약 화면에서 비교하세요.' },
      { category: '조식·식사', question: `${name} 조식이나 크루즈 식사가 포함되나요?`, answer: '육상 호텔은 조식 포함 상품을, 크루즈는 일정별 포함 식사와 음료·추가 메뉴 조건을 결제 전에 확인하세요.' },
      { category: '예약', question: `${name} 예약 조건은 무엇을 비교할까요?`, answer: '침대 구성과 조식·식사 포함 여부, 무료 취소 기한, 세금·항만비·셔틀 등 추가 요금을 확인하세요.' },
    ],
  };
}

function pick(hotel: Hotel) {
  const value = [hotel.hotelName, hotel.address, hotel.analysis?.summary].filter(Boolean).join(' ');
  if (/Cruise|크루즈|Sails|Junk|선박/i.test(value)) return profiles.cruise;
  if (/Tuan Chau|Tuần Châu|뚜언쩌우/i.test(value)) return profiles.tuanchau;
  if (/Van Don|Vân Đồn|반돈|Quan Lan|Quảng? Lan|꽌란/i.test(value)) return profiles.vandon;
  if (/Hon Gai|Hòn Gai|혼가이/i.test(value)) return profiles.hongai;
  if (/Bai Chay|Bãi Cháy|바이짜이|Sun World|썬월드/i.test(value)) return profiles.baichay;
  return profiles.all;
}
