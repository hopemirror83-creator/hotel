import { activeHotels as hotels } from './hotels';
import type { Hotel } from './hotels';

export type IncheonAreaGuide = {
  slug: string;
  path: string;
  title: string;
  eyebrow: string;
  intro: string;
  purpose: string;
  intentQuestion: string;
  metaDescription: string;
  criteria: string[];
  tableColumns: string[];
  keywords: string[];
  negativeKeywords?: string[];
};

export type IncheonAreaGuideHotel = {
  hotel: Hotel;
  guideScore: number;
  reasons: string[];
  caution: string;
  target: string;
  tags: string[];
  tableCells: string[];
};

export const incheonAreaGuides: IncheonAreaGuide[] = [
  {
    slug: 'songdo-hotels',
    path: '/incheon/songdo-hotels/',
    title: '송도 호텔 후기 모음',
    eyebrow: 'SONGDO HOTEL GUIDE',
    intro: '송도 호텔은 센트럴파크, 컨벤시아, 업무지구 이동을 함께 봐야 선택이 쉬워집니다. 후기에서는 위치 만족도와 객실 컨디션, 주차 편의성을 중심으로 비교했습니다.',
    purpose: '송도에서 출장·호캉스·가족 방문 일정에 맞는 호텔을 고르기 위한 페이지입니다.',
    intentQuestion: '송도에서 위치와 후기 만족도가 함께 괜찮은 호텔은 어디인가요?',
    metaDescription: '송도 호텔 후기를 위치, 평점, 가격, 주차, 객실 조건 기준으로 비교했습니다. 송도 센트럴파크와 컨벤시아 근처 숙소 선택 전 확인하세요.',
    criteria: ['송도 위치', '센트럴파크 접근', '객실 만족도', '주차', '출장·가족 방문'],
    tableColumns: ['위치 적합도', '객실', '주차', '가격대', '추천 대상'],
    keywords: ['송도', '연수구', '센트럴파크', '컨벤시아', '테크노파크', 'songdo', 'yeonsu']
  },
  {
    slug: 'unseo-airport-hotels',
    path: '/incheon/unseo-airport-hotels/',
    title: '운서역 인천공항 호텔 후기 모음',
    eyebrow: 'AIRPORT & UNSEO GUIDE',
    intro: '운서역과 인천공항 근처 호텔은 거리보다 실제 이동 방식이 중요합니다. 새벽 비행, 셔틀, 택시 이동, 짐보관 가능성을 기준으로 정리했습니다.',
    purpose: '인천공항 출국 전후 1박이나 운서역 주변 숙박을 찾는 여행자를 위한 페이지입니다.',
    intentQuestion: '새벽 비행 전후에 묵기 좋은 인천공항·운서역 호텔은 어디인가요?',
    metaDescription: '운서역 인천공항 호텔 후기를 공항 접근성, 체크인, 셔틀, 가격, 후기 수 기준으로 비교했습니다.',
    criteria: ['공항 접근성', '운서역', '새벽 체크아웃', '셔틀·택시', '짐보관'],
    tableColumns: ['공항 접근', '체크인', '주차', '가격대', '추천 대상'],
    keywords: ['공항', '운서', '영종', '에어포트', '터미널', 'airport', 'unseo', 'terminal', '흰바위로', '공항로'],
    negativeKeywords: ['월미', '차이나타운']
  },
  {
    slug: 'bupyeong-station-hotels',
    path: '/incheon/bupyeong-station-hotels/',
    title: '부평역 호텔 후기 모음',
    eyebrow: 'BUPYEONG STATION GUIDE',
    intro: '부평역 호텔은 대중교통 접근성과 상권 이용 편의가 장점입니다. 대신 번화가 소음과 주차 조건은 예약 전에 함께 확인하는 편이 좋습니다.',
    purpose: '부평역 주변에서 이동 편한 인천 숙소를 찾는 여행자를 위한 페이지입니다.',
    intentQuestion: '부평역 근처에서 후기와 위치가 괜찮은 호텔은 어디인가요?',
    metaDescription: '부평역 호텔 후기를 역 접근성, 가격, 소음, 주차, 객실 만족도 기준으로 비교했습니다.',
    criteria: ['부평역 접근', '대중교통', '상권', '주차', '소음'],
    tableColumns: ['역 접근', '객실', '소음 확인', '가격대', '추천 대상'],
    keywords: ['부평', '부평역', 'bupyeong']
  },
  {
    slug: 'guwol-dong-hotels',
    path: '/incheon/guwol-dong-hotels/',
    title: '구월동 호텔 후기 모음',
    eyebrow: 'GUWOL-DONG GUIDE',
    intro: '구월동 호텔은 인천터미널, 상권, 업무 이동을 함께 보는 경우가 많습니다. 주차와 주변 혼잡, 객실 컨디션을 중심으로 비교했습니다.',
    purpose: '구월동과 남동구 일정에 맞는 호텔을 찾는 여행자를 위한 페이지입니다.',
    intentQuestion: '구월동에서 이동과 가격 균형이 좋은 호텔은 어디인가요?',
    metaDescription: '구월동 인천 호텔 후기를 인천터미널, 주차, 가격, 객실, 후기 만족도 기준으로 비교했습니다.',
    criteria: ['구월동 상권', '인천터미널', '남동구 이동', '주차', '가격'],
    tableColumns: ['위치', '객실', '주차', '가격대', '추천 대상'],
    keywords: ['구월', '남동구', '인천터미널', '간석', '소래포구', 'guwol', 'namdong']
  },
  {
    slug: 'wolmido-chinatown-hotels',
    path: '/incheon/wolmido-chinatown-hotels/',
    title: '월미도 차이나타운 호텔 후기 모음',
    eyebrow: 'WOLMIDO & CHINATOWN GUIDE',
    intro: '월미도와 차이나타운 주변 호텔은 관광 동선이 핵심입니다. 개항장, 하버파크, 월미도 접근성과 주말 주차 부담을 함께 봤습니다.',
    purpose: '인천 시내 관광과 짧은 주말 여행에 맞는 호텔을 비교하는 페이지입니다.',
    intentQuestion: '월미도·차이나타운 여행에서 묵기 좋은 호텔은 어디인가요?',
    metaDescription: '월미도 차이나타운 호텔 후기를 관광 동선, 주차, 가격, 객실 조건 기준으로 비교했습니다.',
    criteria: ['월미도', '차이나타운', '개항장', '주차', '주말 혼잡'],
    tableColumns: ['관광 동선', '객실', '주차', '가격대', '추천 대상'],
    keywords: ['월미', '차이나타운', '제물포', '개항', '하버', 'wolmi', 'chinatown'],
    negativeKeywords: ['공항', '영종', '운서', '에어포트', 'airport', 'unseo', '공항로', '터미널대로']
  },
  {
    slug: 'ganghwa-hotels',
    path: '/incheon/ganghwa-hotels/',
    title: '강화도 호텔 펜션 후기 모음',
    eyebrow: 'GANGHWA GUIDE',
    intro: '강화도 숙소는 호텔보다 펜션형 숙소가 섞여 있어 차량 이동, 바다 전망, 바비큐, 가족 이용 조건을 같이 봐야 합니다.',
    purpose: '강화도 주말 여행에서 숙소를 고를 때 필요한 후기 기준을 정리한 페이지입니다.',
    intentQuestion: '강화도에서 가족·커플 여행에 맞는 숙소는 어디인가요?',
    metaDescription: '강화도 호텔 펜션 후기를 위치, 전망, 주차, 가족 여행, 가격 기준으로 비교했습니다.',
    criteria: ['강화도 위치', '차량 이동', '가족 여행', '전망', '바비큐'],
    tableColumns: ['위치', '가족 적합', '주차', '가격대', '추천 대상'],
    keywords: ['강화', 'ganghwa']
  },
  {
    slug: 'cheongna-hotels',
    path: '/incheon/cheongna-hotels/',
    title: '청라 서구 호텔 후기 모음',
    eyebrow: 'CHEONGNA & SEO-GU GUIDE',
    intro: '청라와 서구 호텔은 관광보다 업무, 가족 방문, 차량 이동 목적이 강합니다. 위치와 주차, 객실 컨디션을 중심으로 정리했습니다.',
    purpose: '청라·서구 일정에 맞는 인천 호텔을 찾는 여행자를 위한 페이지입니다.',
    intentQuestion: '청라와 인천 서구에서 묵기 좋은 호텔은 어디인가요?',
    metaDescription: '청라 서구 인천 호텔 후기를 위치, 주차, 객실, 가격, 이동 편의 기준으로 비교했습니다.',
    criteria: ['청라', '서구', '검단', '차량 이동', '주차'],
    tableColumns: ['위치', '객실', '주차', '가격대', '추천 대상'],
    keywords: ['청라', '서구', '검단', 'cheongna', 'seo-gu']
  },
  {
    slug: 'incheon-hotel-comparison',
    path: '/incheon/incheon-hotel-comparison/',
    title: '인천 호텔 비교',
    eyebrow: 'INCHEON HOTEL COMPARISON',
    intro: '인천 호텔은 공항권, 송도, 부평, 월미도, 강화도처럼 목적지가 달라지면 좋은 선택 기준도 달라집니다. 전체 인천 호텔을 후기 기반으로 한 번에 비교했습니다.',
    purpose: '인천 전체 호텔 중 어디를 먼저 비교해야 하는지 판단하기 위한 페이지입니다.',
    intentQuestion: '인천 호텔을 지역별로 비교하면 어떤 차이가 있나요?',
    metaDescription: '인천 호텔을 송도, 영종도, 인천공항, 부평, 구월동, 월미도, 강화도 기준으로 비교했습니다.',
    criteria: ['지역', '평점', '후기 수', '가격', '추천 목적'],
    tableColumns: ['지역', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['인천', 'incheon']
  }
];

export const incheonHotels = hotels
  .filter(isIncheonHotel)
  .sort((a, b) => popularity(b) - popularity(a));

export function getIncheonAreaGuide(slug: string) {
  return incheonAreaGuides.find((guide) => guide.slug === slug);
}

export function getIncheonAreaGuideHotels(guide: IncheonAreaGuide, limit = 20): IncheonAreaGuideHotel[] {
  return incheonHotels
    .map((hotel) => buildGuideHotel(hotel, guide))
    .filter((item) => item.guideScore > 0)
    .sort((a, b) => b.guideScore - a.guideScore)
    .slice(0, limit);
}

export function getRelatedIncheonAreaGuides(hotel: Hotel) {
  if (!isIncheonHotel(hotel)) return [];
  return incheonAreaGuides
    .map((guide) => ({
      guide,
      score: keywordScore(hotelText(hotel), guide.keywords) - keywordScore(hotelText(hotel), guide.negativeKeywords || [])
    }))
    .filter((item) => item.score > 0 || item.guide.slug === 'incheon-hotel-comparison')
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => item.guide);
}

function buildGuideHotel(hotel: Hotel, guide: IncheonAreaGuide): IncheonAreaGuideHotel {
  const text = hotelText(hotel);
  const directScore = guide.slug === 'incheon-hotel-comparison' ? 1 : keywordScore(text, guide.keywords) - keywordScore(text, guide.negativeKeywords || []);
  const guideScore = directScore > 0 ? directScore * 10 + popularity(hotel) : 0;
  const area = pickAreaLabel(hotel);
  const price = priceText(hotel);
  const score = hotel.reviewScore ? `${hotel.reviewScore}` : '확인 필요';
  const reviews = hotel.reviewCount ? `${hotel.reviewCount.toLocaleString('ko-KR')}건` : '후기 부족';

  return {
    hotel,
    guideScore,
    reasons: buildReasons(hotel, guide, area),
    caution: buildCaution(hotel, guide),
    target: buildTarget(guide, area),
    tags: [...new Set([area, ...guide.criteria.slice(0, 3)])].slice(0, 5),
    tableCells: buildTableCells(guide, area, score, reviews, price)
  };
}

function buildReasons(hotel: Hotel, guide: IncheonAreaGuide, area: string) {
  const reasons = [
    `${area} 일정에서 위치를 먼저 비교하기 좋은 후보입니다.`,
    hotel.reviewScore && hotel.reviewScore >= 8.5 ? '평점이 높은 편이라 후기 기반 후보로 검토할 만합니다.' : '평점과 후기 수를 함께 보고 기대치를 조정하기 좋습니다.',
    hotel.reviewCount && hotel.reviewCount >= 3000 ? '후기 수가 많아 장단점 패턴을 비교하기 쉽습니다.' : '후기 수가 아주 많지는 않아 객실 조건 확인이 필요합니다.'
  ];

  if (guide.slug.includes('airport')) reasons[0] = '공항 이동, 체크인 시간, 새벽 출발 일정을 함께 보기 좋은 후보입니다.';
  if (guide.slug.includes('songdo')) reasons[0] = '송도 센트럴파크·컨벤시아 동선과 함께 비교하기 좋은 후보입니다.';
  if (guide.slug.includes('ganghwa')) reasons[0] = '강화도 차량 이동과 주말 숙박 조건을 함께 보기 좋은 후보입니다.';

  return reasons;
}

function buildCaution(hotel: Hotel, guide: IncheonAreaGuide) {
  const firstCon = hotel.analysis.cons[0];
  if (firstCon) return firstCon;
  if (guide.slug.includes('airport')) return '셔틀이나 택시 이동 시간은 예약 전에 다시 확인하는 편이 좋습니다.';
  if (guide.slug.includes('wolmido')) return '주말에는 주변 도로와 주차가 혼잡할 수 있습니다.';
  if (guide.slug.includes('ganghwa')) return '대중교통 이동보다는 차량 이동 기준으로 보는 편이 좋습니다.';
  return '객실 타입별 전망, 크기, 조식 포함 여부는 예약 단계에서 확인해야 합니다.';
}

function buildTarget(guide: IncheonAreaGuide, area: string) {
  if (guide.slug.includes('airport')) return '새벽 비행·공항 이동';
  if (guide.slug.includes('songdo')) return '송도 출장·호캉스';
  if (guide.slug.includes('bupyeong')) return '부평역 대중교통';
  if (guide.slug.includes('guwol')) return '구월동 상권·출장';
  if (guide.slug.includes('wolmido')) return '월미도·차이나타운 관광';
  if (guide.slug.includes('ganghwa')) return '강화도 주말 여행';
  if (guide.slug.includes('cheongna')) return '청라·서구 일정';
  return `${area} 호텔 비교`;
}

function buildTableCells(guide: IncheonAreaGuide, area: string, score: string, reviews: string, price: string) {
  if (guide.slug === 'incheon-hotel-comparison') return [area, score, reviews, price, buildTarget(guide, area)];
  return ['높음', score, guide.slug.includes('airport') ? '체크 필요' : '확인 필요', price, buildTarget(guide, area)];
}

function isIncheonHotel(hotel: Hotel) {
  return /^incheon-/.test(hotel.slug) || /인천|incheon/i.test(hotelText(hotel));
}

function pickAreaLabel(hotel: Hotel) {
  const text = hotelText(hotel);
  if (/송도|연수구|센트럴파크|컨벤시아|songdo/i.test(text)) return '송도';
  if (/공항|운서|영종|에어포트|airport|unseo/i.test(text)) return '인천공항·영종도';
  if (/부평|bupyeong/i.test(text)) return '부평';
  if (/구월|남동구|소래포구|guwol|namdong/i.test(text)) return '구월동·남동구';
  if (/월미|차이나타운|제물포|하버|wolmi|chinatown/i.test(text)) return '월미도·차이나타운';
  if (/강화|ganghwa/i.test(text)) return '강화도';
  if (/청라|서구|검단|cheongna|seo-gu/i.test(text)) return '청라·서구';
  return '인천';
}

function keywordScore(text: string, keywords: string[]) {
  return keywords.reduce((sum, keyword) => sum + (text.includes(keyword.toLowerCase()) ? 1 : 0), 0);
}

function popularity(hotel: Hotel) {
  return (hotel.reviewScore || 0) * 2 + Math.log10((hotel.reviewCount || 0) + 10);
}

function priceText(hotel: Hotel) {
  const price = hotel.averageNightlyRate ?? hotel.dailyRate;
  return price ? `${price.toLocaleString('ko-KR')}원~` : '가격 확인';
}

function hotelText(hotel: Hotel) {
  const analysis = hotel.analysis;
  return [
    hotel.hotelName,
    hotel.region,
    hotel.address,
    analysis?.summary,
    analysis?.seoTitle,
    analysis?.metaDescription,
    ...(analysis?.pros || []),
    ...(analysis?.cons || []),
    ...(analysis?.recommendedFor || []),
    ...(analysis?.notRecommendedFor || []),
    ...(analysis?.checkPoints || [])
  ]
    .join(' ')
    .toLowerCase();
}
