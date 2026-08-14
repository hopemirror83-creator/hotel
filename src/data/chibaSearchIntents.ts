import type { Hotel } from './hotels';

type ChibaProfile = {
  label: string;
  terms: string[];
  recommendedFor: string[];
  notRecommendedFor: string[];
};

const profiles: Record<string, ChibaProfile> = {
  narita: {
    label: '나리타공항', terms: ['공항 이동', '셔틀', '체크인', '조식'],
    recommendedFor: ['나리타공항 출도착 여행자', '이른 비행 또는 늦은 도착 일정', '공항 셔틀을 비교하는 여행자'],
    notRecommendedFor: ['도쿄 도심 관광 동선을 최우선으로 보는 여행자']
  },
  disney: {
    label: '디즈니·우라야스', terms: ['디즈니 접근', '가족', '셔틀', '조식'],
    recommendedFor: ['도쿄 디즈니리조트 일정', '아이 동반 가족 여행', '마이하마·우라야스 숙박'],
    notRecommendedFor: ['나리타공항 바로 앞 숙소를 찾는 여행자']
  },
  makuhari: {
    label: '마쿠하리', terms: ['마쿠하리 멧세', '출장', '교통', '조식'],
    recommendedFor: ['마쿠하리 멧세 행사·출장', '가이힌마쿠하리역 이동', '지바 도심 일정'],
    notRecommendedFor: ['공항 도보권 숙소만 찾는 여행자']
  },
  boso: {
    label: '보소반도', terms: ['온천', '오션뷰', '가족', '주차'],
    recommendedFor: ['가모가와·기사라즈·다테야마 여행', '온천과 바다 전망을 함께 보는 여행자', '렌터카 가족 여행'],
    notRecommendedFor: ['도쿄 도심 대중교통 접근을 우선하는 여행자']
  },
  chiba: {
    label: '지바', terms: ['위치', '체크인', '교통', '가성비'],
    recommendedFor: ['지바현 여행', '숙박 조건을 비교하는 여행자', '도쿄 동부와 지바를 함께 이동하는 일정'],
    notRecommendedFor: ['특정 관광지 바로 앞 숙소만 찾는 여행자']
  }
};

export function getChibaSearchIntent(hotel: Hotel) {
  if (!hotel.slug.startsWith('chiba-')) return undefined;
  const profile = pickProfile(hotel);
  const name = hotel.hotelName.trim();
  const title = `${name} ${profile.label} 후기 모음 ${profile.terms.slice(0, 4).join(' ')}`;
  return {
    title,
    seoTitle: `${title} | 예약 전 FAQ`,
    metaDescription: `${name} 후기를 ${profile.label} 위치, 교통, 체크인, 조식과 예약 조건 중심으로 정리했습니다.`,
    intentChips: profile.terms,
    faqs: buildFaqs(name, profile),
    recommendedFor: profile.recommendedFor,
    notRecommendedFor: profile.notRecommendedFor
  };
}

function pickProfile(hotel: Hotel) {
  const text = [hotel.hotelName, hotel.address, hotel.analysis?.summary].filter(Boolean).join(' ');
  if (/나리타|narita|공항|airport/i.test(text)) return profiles.narita;
  if (/디즈니|disney|우라야스|urayasu|마이하마|maihama/i.test(text)) return profiles.disney;
  if (/마쿠하리|makuhari|幕張|mihama/i.test(text)) return profiles.makuhari;
  if (/가모가와|kamogawa|기사라즈|kisarazu|다테야마|tateyama|가쓰우라|katsuura|온주쿠|onjuku/i.test(text)) return profiles.boso;
  return profiles.chiba;
}

function buildFaqs(name: string, profile: ChibaProfile) {
  return [
    { category: '위치', question: `${name} 위치는 여행 동선에 맞나요?`, answer: `${profile.label} 일정이라면 숙소에서 실제 목적지까지의 이동 시간을 확인하세요. 지바현은 나리타공항, 우라야스·마이하마, 마쿠하리와 보소반도 사이의 거리가 커서 같은 지바 숙소라도 체감 동선이 다릅니다.` },
    { category: '교통', question: `${name} 예약 전 교통편은 무엇을 확인해야 하나요?`, answer: '공항 셔틀과 운행 시간, 가까운 역까지의 도보 거리, 막차 시간을 함께 비교하는 편이 좋습니다. 렌터카 일정이라면 주차 요금과 차량 높이 제한도 확인하세요.' },
    { category: '체크인', question: `${name} 체크인 전에 확인할 점은 무엇인가요?`, answer: '늦은 도착이나 이른 출발 일정이라면 프런트 운영 시간, 짐 보관, 셀프 체크인 여부를 먼저 확인하세요. 성수기와 행사일에는 대기 가능성도 고려하는 것이 좋습니다.' },
    { category: '조식', question: `${name} 조식 포함 예약이 유리할까요?`, answer: '조식 시작 시간이 비행기·테마파크·행사 일정과 맞는지 먼저 확인하세요. 포함 요금과 현장 결제 요금, 주변 아침 식사 선택지를 함께 비교하면 판단하기 쉽습니다.' },
    { category: '예약', question: `${name} 예약 조건은 무엇을 비교해야 하나요?`, answer: '객실 크기와 침대 타입, 취소 가능 기한, 세금과 추가 요금, 셔틀·주차 포함 여부는 객실별로 다를 수 있습니다. 결제 전 아고다의 최신 객실 조건을 다시 확인하세요.' }
  ];
}
