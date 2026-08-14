import type { Hotel } from './hotels';

type IntentFaq = {
  question: string;
  answer: string;
  category: string;
};

type GwangjuAreaProfile = {
  label: string;
  titleKeyword: string;
  terms: string[];
  recommendedFor: string[];
  notRecommendedFor: string[];
};

const areaProfiles: Record<string, GwangjuAreaProfile> = {
  sangmu: {
    label: '광주 상무지구',
    titleKeyword: '광주 상무지구',
    terms: ['상무지구', '출장', '체크인', '주차', '조식'],
    recommendedFor: ['광주 출장', '상무지구 일정', '광주공항·송정역 이동이 필요한 여행자'],
    notRecommendedFor: ['조용한 휴양형 숙소를 원하는 여행자']
  },
  chungjang: {
    label: '광주 충장로',
    titleKeyword: '광주 충장로',
    terms: ['충장로', '동명동', '위치', '체크인', '주차'],
    recommendedFor: ['충장로·동명동 여행', '도보 중심 광주 여행', '맛집과 카페 접근성을 보는 여행자'],
    notRecommendedFor: ['넓은 주차장과 조용한 외곽 숙소를 원하는 여행자']
  },
  songjeong: {
    label: '광주 송정역',
    titleKeyword: '광주 송정역',
    terms: ['송정역', '교통', '체크인', '주차', '조식'],
    recommendedFor: ['KTX·SRT 이동', '광주공항 이동', '짧은 광주 숙박'],
    notRecommendedFor: ['충장로·상무지구 도보 관광을 우선하는 여행자']
  },
  cheomdan: {
    label: '광주 첨단지구',
    titleKeyword: '광주 첨단지구',
    terms: ['첨단지구', '출장', '주차', '체크인', '가성비'],
    recommendedFor: ['첨단지구 출장', '차량 이동 여행', '가성비 숙소를 찾는 여행자'],
    notRecommendedFor: ['광주 구도심 도보 여행을 중심으로 보는 여행자']
  },
  gwangju: {
    label: '광주',
    titleKeyword: '광주',
    terms: ['위치', '체크인', '주차', '조식', '가성비'],
    recommendedFor: ['광주 여행', '광주 출장', '예약 전 조건을 비교하는 여행자'],
    notRecommendedFor: ['목적지가 전남 해안권인 여행자']
  }
};

export function getGwangjuSearchIntent(hotel: Hotel) {
  if (!isGwangjuHotel(hotel)) return undefined;

  const profile = pickGwangjuArea(hotel);
  const hotelName = hotel.hotelName.trim();
  const title = composeTitle(hotelName, profile.titleKeyword, profile.terms);
  const faqs = buildFaqs(hotelName, profile);

  return {
    title,
    seoTitle: `${title} | 예약 전 FAQ`,
    metaDescription: `${hotelName} 후기를 ${profile.label} 위치, 체크인, 주차, 조식, 이동 동선 기준으로 정리했습니다.`,
    intentChips: profile.terms.slice(0, 5),
    faqs,
    recommendedFor: profile.recommendedFor,
    notRecommendedFor: profile.notRecommendedFor
  };
}

export function isGwangjuHotel(hotel: Hotel) {
  return hotel.slug.startsWith('gwangju-') || /광주|gwangju/i.test(searchableText(hotel));
}

function pickGwangjuArea(hotel: Hotel) {
  const text = searchableText(hotel);
  if (/상무|운천|치평|김대중컨벤션|sangmu/i.test(text)) return areaProfiles.sangmu;
  if (/충장|동명|금남로|국립아시아문화전당|acc|chungjang/i.test(text)) return areaProfiles.chungjang;
  if (/송정|광주송정|광주공항|songjeong/i.test(text)) return areaProfiles.songjeong;
  if (/첨단|쌍암|수완|cheomdan/i.test(text)) return areaProfiles.cheomdan;
  return areaProfiles.gwangju;
}

function composeTitle(hotelName: string, titleKeyword: string, terms: string[]) {
  const base = `${hotelName} ${titleKeyword} 후기 모음`;
  const normalized = normalizeSearchText(base);
  const picked = terms
    .filter((term) => !normalized.includes(normalizeSearchText(term)))
    .slice(0, 4);
  return `${base} ${picked.join(' ')}`.trim();
}

function buildFaqs(hotelName: string, profile: GwangjuAreaProfile): IntentFaq[] {
  return [
    {
      category: '위치',
      question: `${hotelName} 위치는 광주 여행 일정에 맞나요?`,
      answer: `${profile.label} 일정이라면 실제 목적지와 숙소 사이의 이동 시간을 먼저 확인하는 것이 좋습니다. 광주는 상무지구, 충장로, 송정역, 첨단지구처럼 목적지별 체감 동선이 달라집니다.`
    },
    {
      category: '교통',
      question: `${hotelName} 예약 전 교통 동선은 무엇을 봐야 하나요?`,
      answer: 'KTX·SRT 이용자는 광주송정역 접근성, 항공편 이용자는 광주공항 이동 시간, 도심 여행자는 충장로·동명동 접근성을 함께 비교하는 편이 좋습니다.'
    },
    {
      category: '체크인',
      question: `${hotelName} 체크인 전에는 무엇을 확인해야 하나요?`,
      answer: '늦은 도착이나 짐 보관이 필요한 일정이라면 체크인 가능 시간, 프런트 운영 방식, 짐 보관 가능 여부를 먼저 확인하세요. 주말과 행사 기간에는 대기 시간이 달라질 수 있습니다.'
    },
    {
      category: '주차',
      question: `${hotelName} 주차는 예약 전에 확인해야 하나요?`,
      answer: '광주는 차량 이동 비중이 높은 편입니다. 무료 주차 여부, 객실당 차량 제한, 만차 시 대체 주차장, 기계식 주차 여부를 예약 전에 확인하면 일정이 훨씬 편해집니다.'
    },
    {
      category: '조식',
      question: `${hotelName} 조식 포함 예약이 유리할까요?`,
      answer: '조식을 중요하게 본다면 포함 요금과 현장 결제 요금을 비교하세요. 출장이나 이른 이동 일정이라면 조식 시작 시간과 주변 아침 식사 선택지도 함께 보는 것이 좋습니다.'
    }
  ];
}

function searchableText(hotel: Hotel) {
  return [
    hotel.slug,
    hotel.hotelName,
    hotel.region,
    hotel.address,
    hotel.analysis?.seoTitle,
    hotel.analysis?.metaDescription,
    hotel.analysis?.summary
  ]
    .filter(Boolean)
    .join(' ');
}

function normalizeSearchText(value: string) {
  return value.replace(/\s+/g, '').toLowerCase();
}
