import type { Hotel } from './hotels';

const profiles = {
  izuhara: { label: '대마도 이즈하라', terms: ['항구근처', '조식', '쇼핑', '체크인'], focus: '이즈하라항과 시내 식당·쇼핑 이동, 조식과 체크인 조건' },
  hitakatsu: { label: '대마도 히타카츠', terms: ['항구근처', '미우다해변', '렌터카', '조식'], focus: '히타카츠항과 미우다해변 이동, 렌터카·조식 조건' },
  island: { label: '대마도', terms: ['배편', '렌터카', '주차', '예약조건'], focus: '대마도 항구와 관광지 이동, 렌터카·주차·예약 조건' }
};

export function getTsushimaSearchIntent(hotel: Hotel) {
  if (!hotel.slug.startsWith('tsushima-')) return;
  const profile = pick(hotel);
  const name = hotel.hotelName.trim();
  const title = `${name} ${profile.label} 후기 모음 ${profile.terms.join(' ')}`;
  return {
    title,
    seoTitle: `${title} | 예약 전 FAQ`,
    metaDescription: `${name} 후기를 ${profile.focus} 중심으로 정리했습니다. 예약 전에 최신 조건을 확인하세요.`,
    intentChips: profile.terms,
    recommendedFor: ['부산 출발 대마도 여행', '항구 중심 자유여행', '렌터카·도보 여행'],
    notRecommendedFor: ['배편과 현지 이동 조건을 확인하지 않는 여행자'],
    faqs: faq(name, profile)
  };
}

function pick(hotel: Hotel) {
  const text = [hotel.hotelName, hotel.address, hotel.analysis?.summary].filter(Boolean).join(' ');
  if (/히타카츠|Hitakatsu|比田勝|가미쓰시마|Kamitsushima|上対馬/i.test(text)) return profiles.hitakatsu;
  if (/이즈하라|Izuhara|厳原/i.test(text)) return profiles.izuhara;
  return profiles.island;
}

function faq(name: string, profile: (typeof profiles)[keyof typeof profiles]) {
  return [
    { category: '위치', question: `${name} 위치는 ${profile.label} 일정에 맞나요?`, answer: `${profile.focus}을 먼저 확인하세요. 대마도는 남북 이동 시간이 길어 도착 항구와 숙소 권역을 맞추는 것이 중요합니다.` },
    { category: '체크인', question: `${name} 체크인 전 무엇을 확인해야 하나요?`, answer: '배편 도착 시각과 프런트 운영 시간, 짐 보관 및 늦은 체크인 가능 여부를 예약 전에 확인하세요.' },
    { category: '조식', question: `${name} 조식 포함이 유리할까요?`, answer: '이른 배편이나 렌터카 일정이 있다면 조식 시작 시간을 확인하세요. 주변 식당의 영업일도 함께 보는 편이 좋습니다.' },
    { category: '교통·주차', question: `${name} 항구 이동과 주차는 무엇을 볼까요?`, answer: '항구에서 숙소까지 거리와 택시·버스 운행 시간을 확인하세요. 렌터카라면 무료 주차와 차량 인수·반납 장소도 중요합니다.' },
    { category: '예약', question: `${name} 객실 조건은 무엇을 비교할까요?`, answer: '침대 구성과 금연, 욕실, 취소 기한을 확인하고 패키지 상품과 자유여행의 포함 조건도 함께 비교하세요.' }
  ];
}
