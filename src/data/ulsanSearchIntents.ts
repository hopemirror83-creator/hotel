import type { Hotel } from './hotels';

type IntentFaq = {
  question: string;
  answer: string;
  category: string;
};

type UlsanAreaProfile = {
  label: string;
  titleKeyword: string;
  terms: string[];
  recommendedFor: string[];
  notRecommendedFor: string[];
};

const areaProfiles: Record<string, UlsanAreaProfile> = {
  samsan: {
    label: '울산 삼산동',
    titleKeyword: '울산 삼산동',
    terms: ['출장', '체크인', '주차', '조식', '가성비'],
    recommendedFor: ['울산 출장', '삼산동 일정', '태화강역·시외버스터미널 이동', '주차가 필요한 여행자'],
    notRecommendedFor: ['조용한 해변 숙소를 찾는 여행자', '리조트형 부대시설을 기대하는 여행자']
  },
  ilsan: {
    label: '울산 일산해수욕장',
    titleKeyword: '울산 일산해수욕장',
    terms: ['오션뷰', '주차', '체크인', '커플', '가족'],
    recommendedFor: ['일산해수욕장 여행', '대왕암공원 일정', '바다 근처 숙박', '커플·가족 여행'],
    notRecommendedFor: ['도심 출장 동선을 우선하는 여행자', '울산역 접근성을 가장 중요하게 보는 여행자']
  },
  ktx: {
    label: '울산 KTX역',
    titleKeyword: '울산 KTX역',
    terms: ['교통', '체크인', '주차', '출장', '가성비'],
    recommendedFor: ['KTX 이동', '울산 단기 출장', '언양·울주 일정', '렌터카 이동 여행자'],
    notRecommendedFor: ['바다 전망을 기대하는 여행자', '삼산동 번화가 도보 접근을 원하는 여행자']
  },
  ganjeolgot: {
    label: '울산 간절곶',
    titleKeyword: '울산 간절곶',
    terms: ['오션뷰', '펜션', '가족', '주차', '일출'],
    recommendedFor: ['간절곶 일출 여행', '가족 펜션 숙박', '차량 이동 여행', '바다 근처 조용한 숙박'],
    notRecommendedFor: ['대중교통만으로 이동하는 여행자', '도심 식당·상권 접근성을 중시하는 여행자']
  },
  yeongnamAlps: {
    label: '울산 영남알프스',
    titleKeyword: '울산 영남알프스',
    terms: ['온천', '가족', '주차', '체크인', '가성비'],
    recommendedFor: ['영남알프스 산행', '온천·휴식 일정', '차량 이동 여행자', '가족 여행'],
    notRecommendedFor: ['도심 접근성을 우선하는 여행자', '바다 전망 숙소를 찾는 여행자']
  },
  ulsan: {
    label: '울산',
    titleKeyword: '울산',
    terms: ['위치', '체크인', '주차', '조식', '가성비'],
    recommendedFor: ['울산 여행', '울산 출장', '예약 전 조건을 비교하는 여행자'],
    notRecommendedFor: ['특정 해변·역 바로 앞 숙소만 찾는 여행자']
  }
};

export function getUlsanSearchIntent(hotel: Hotel) {
  if (!isUlsanHotel(hotel)) return undefined;

  const profile = pickUlsanArea(hotel);
  const hotelName = hotel.hotelName.trim();
  const title = composeTitle(hotelName, profile.titleKeyword, profile.terms);

  return {
    title,
    seoTitle: `${title} | 예약 전 FAQ`,
    metaDescription: `${hotelName} 후기를 ${profile.label} 위치, 체크인, 주차, 조식, 이동 동선 기준으로 정리했습니다.`,
    intentChips: profile.terms,
    faqs: buildFaqs(hotelName, profile),
    recommendedFor: profile.recommendedFor,
    notRecommendedFor: profile.notRecommendedFor
  };
}

export function isUlsanHotel(hotel: Hotel) {
  return hotel.slug.startsWith('ulsan-') || /울산|Ulsan|삼산|일산해수욕장|간절곶|영남알프스|태화강|장생포/.test(searchableText(hotel));
}

function pickUlsanArea(hotel: Hotel) {
  const text = searchableText(hotel);
  if (/삼산|달동|태화강|시외버스터미널|고속버스터미널|samsan/i.test(text)) return areaProfiles.samsan;
  if (/일산|대왕암|방어진|동구|정자해수욕장|강동|블루마시티|jinha|gangdong/i.test(text)) return areaProfiles.ilsan;
  if (/KTX|울산역|언양|울주|unyang/i.test(text)) return areaProfiles.ktx;
  if (/간절곶|서생|일출|ganjeolgot/i.test(text)) return areaProfiles.ganjeolgot;
  if (/영남알프스|간월재|배내골|온천|상북/i.test(text)) return areaProfiles.yeongnamAlps;
  return areaProfiles.ulsan;
}

function composeTitle(hotelName: string, titleKeyword: string, terms: string[]) {
  const base = `${hotelName} ${titleKeyword} 후기 모음`;
  const normalized = normalizeSearchText(base);
  const picked = terms
    .filter((term) => !normalized.includes(normalizeSearchText(term)))
    .slice(0, 4);
  return `${base} ${picked.join(' ')}`.trim();
}

function buildFaqs(hotelName: string, profile: UlsanAreaProfile): IntentFaq[] {
  return [
    {
      category: '위치',
      question: `${hotelName} 위치는 울산 여행 일정에 맞나요?`,
      answer: `${profile.label} 일정이라면 숙소와 실제 목적지 사이의 이동 시간을 먼저 확인하는 것이 좋습니다. 울산은 삼산동, 일산해수욕장, 간절곶, 영남알프스, 울산 KTX역처럼 목적지별 체감 동선이 크게 달라집니다.`
    },
    {
      category: '교통',
      question: `${hotelName} 예약 전 교통 동선은 무엇을 봐야 하나요?`,
      answer: 'KTX 이용자는 울산역 이동 시간, 도심 일정은 삼산동·태화강역 접근성, 바다 여행은 일산해수욕장·정자·간절곶까지의 차량 이동 시간을 함께 비교하는 편이 좋습니다.'
    },
    {
      category: '체크인',
      question: `${hotelName} 체크인 전에는 무엇을 확인해야 하나요?`,
      answer: '도착 시간이 늦거나 짐 보관이 필요한 일정이라면 체크인 가능 시간, 프런트 운영 방식, 짐 보관 가능 여부를 먼저 확인하세요. 주말이나 성수기에는 체크인 대기가 생길 수 있습니다.'
    },
    {
      category: '주차',
      question: `${hotelName} 주차는 예약 전에 확인해야 하나요?`,
      answer: '울산 여행은 차량 이동 비중이 높습니다. 무료 주차 여부, 객실당 차량 제한, 만차 시 대체 주차장, 기계식 주차 여부를 예약 전에 확인해두면 일정이 훨씬 편해집니다.'
    },
    {
      category: '조식',
      question: `${hotelName} 조식 포함 예약이 유리할까요?`,
      answer: '조식을 중요하게 본다면 포함 요금과 현장 결제 요금을 비교하세요. 출장이나 이른 이동 일정이라면 조식 시작 시간과 주변 아침 식사 선택지도 함께 확인하는 것이 좋습니다.'
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
