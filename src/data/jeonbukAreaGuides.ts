import { activeHotels as hotels } from './hotels';
import type { Hotel } from './hotels';
import { isJeonbukHotel } from './jeonbukSearchIntents';

export type JeonbukAreaGuide = {
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
};

export type JeonbukAreaGuideHotel = {
  hotel: Hotel;
  guideScore: number;
  reasons: string[];
  caution: string;
  target: string;
  tags: string[];
  tableCells: string[];
};

export const jeonbukAreaGuides: JeonbukAreaGuide[] = [
  {
    slug: 'jeonju-hanok-village-hotels',
    path: '/jeonbuk/jeonju-hanok-village-hotels/',
    title: '전주 한옥마을 호텔 후기 모음',
    eyebrow: 'JEONJU HOTEL GUIDE',
    intro: '전주 한옥마을 숙소는 도보권, 주차, 방음, 한옥 분위기 기대치가 선택 기준입니다. 후기 신호를 바탕으로 전주 여행에 맞는 숙소를 비교했습니다.',
    purpose: '전주 한옥마을, 객리단길, 전동성당 일정을 준비하는 여행자를 위한 페이지입니다.',
    intentQuestion: '전주 한옥마을 여행에서는 도보권과 주차 중 무엇을 먼저 봐야 할까요?',
    metaDescription: '전주 한옥마을 호텔 후기를 위치, 체크인, 주차, 조식, 한옥 숙박 기준으로 비교했습니다.',
    criteria: ['한옥마을 접근', '주차', '방음', '체크인', '조식'],
    tableColumns: ['한옥마을 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['전주', '한옥마을', '객리단길', '전동성당', '경기전', 'jeonju']
  },
  {
    slug: 'gunsan-hotels',
    path: '/jeonbuk/gunsan-hotels/',
    title: '군산 호텔 후기 모음',
    eyebrow: 'GUNSAN HOTEL GUIDE',
    intro: '군산 호텔은 근대화거리, 은파호수공원, 터미널 접근성과 주차 조건이 중요합니다. 여행과 출장 관점에서 함께 비교했습니다.',
    purpose: '군산 근대화거리 여행이나 출장 숙박을 준비하는 사용자를 위한 페이지입니다.',
    intentQuestion: '군산에서는 근대화거리 접근성과 주차 편의 중 무엇이 더 중요할까요?',
    metaDescription: '군산 호텔 후기를 근대화거리, 은파호수공원, 출장, 주차, 조식 기준으로 비교했습니다.',
    criteria: ['근대화거리', '은파호수', '출장', '주차', '조식'],
    tableColumns: ['군산 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['군산', '근대화', '은파', '나운', '장미', 'gunsan']
  },
  {
    slug: 'buan-byeonsan-hotels',
    path: '/jeonbuk/buan-byeonsan-hotels/',
    title: '부안 변산 호텔 후기 모음',
    eyebrow: 'BUAN BYEONSAN HOTEL GUIDE',
    intro: '부안과 변산 숙소는 채석강, 격포항, 바다 전망, 가족 여행 동선이 핵심입니다. 오션뷰 기대치와 차량 이동 조건을 함께 봅니다.',
    purpose: '변산반도, 채석강, 격포항 여행을 준비하는 사용자를 위한 페이지입니다.',
    intentQuestion: '부안·변산 숙소는 오션뷰와 가족 편의 중 무엇을 먼저 확인해야 할까요?',
    metaDescription: '부안 변산 호텔 후기를 오션뷰, 채석강, 가족 여행, 주차, 체크인 기준으로 비교했습니다.',
    criteria: ['오션뷰', '채석강', '가족', '주차', '객실'],
    tableColumns: ['변산 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['부안', '변산', '채석강', '격포', '모항', 'buan', 'byeonsan']
  },
  {
    slug: 'namwon-muju-hotels',
    path: '/jeonbuk/namwon-muju-hotels/',
    title: '남원 무주 호텔 후기 모음',
    eyebrow: 'NAMWON MUJU HOTEL GUIDE',
    intro: '남원과 무주 숙소는 지리산, 덕유산, 스키장, 가족 휴양 목적에 따라 선택 기준이 달라집니다. 리조트형 숙소와 시내 숙소를 함께 비교했습니다.',
    purpose: '남원·무주 자연 여행과 가족 휴양 숙소를 찾는 사용자를 위한 페이지입니다.',
    intentQuestion: '남원·무주 여행에서는 관광지 접근성과 리조트 편의 중 무엇을 먼저 봐야 할까요?',
    metaDescription: '남원 무주 호텔 후기를 덕유산, 지리산, 가족 여행, 조식, 주차 기준으로 비교했습니다.',
    criteria: ['덕유산', '지리산', '가족', '리조트', '조식'],
    tableColumns: ['자연 관광 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['남원', '무주', '덕유산', '지리산', '춘향', 'namwon', 'muju']
  },
  {
    slug: 'iksan-wanju-hotels',
    path: '/jeonbuk/iksan-wanju-hotels/',
    title: '익산 완주 호텔 후기 모음',
    eyebrow: 'IKSAN WANJU HOTEL GUIDE',
    intro: '익산과 완주 숙소는 익산역, 산업단지, 전주 이동 동선, 출장 편의성이 중요합니다. 주차와 조식 후기를 중심으로 정리했습니다.',
    purpose: '익산역 이용, 완주 출장, 전주 근교 숙박을 준비하는 사용자를 위한 페이지입니다.',
    intentQuestion: '익산·완주 숙소는 출장 동선과 가성비 중 무엇을 먼저 비교해야 할까요?',
    metaDescription: '익산 완주 호텔 후기를 출장, 익산역, 주차, 조식, 가성비 기준으로 비교했습니다.',
    criteria: ['출장', '익산역', '완주', '주차', '가성비'],
    tableColumns: ['출장 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['익산', '완주', '김제', '익산역', '산업단지', 'iksan', 'wanju']
  },
  {
    slug: 'gochang-jeongeup-hotels',
    path: '/jeonbuk/gochang-jeongeup-hotels/',
    title: '고창 정읍 호텔 후기 모음',
    eyebrow: 'GOCHANG JEONGEUP HOTEL GUIDE',
    intro: '고창과 정읍 숙소는 선운산, 내장산, 읍내 식당 접근성, 차량 이동 조건을 함께 확인해야 합니다. 조용한 여행 관점에서 비교했습니다.',
    purpose: '고창 선운산, 정읍 내장산 여행을 준비하는 사용자를 위한 페이지입니다.',
    intentQuestion: '고창·정읍 여행에서는 산 관광 접근성과 시내 편의 중 무엇이 더 중요할까요?',
    metaDescription: '고창 정읍 호텔 후기를 선운산, 내장산, 가족 여행, 주차, 체크인 기준으로 비교했습니다.',
    criteria: ['선운산', '내장산', '가족', '주차', '조용함'],
    tableColumns: ['관광지 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['고창', '정읍', '선운산', '내장산', 'gochang', 'jeongeup']
  },
  {
    slug: 'jeonbuk-family-hotels',
    path: '/jeonbuk/jeonbuk-family-hotels/',
    title: '전북 가족 호텔 추천',
    eyebrow: 'JEONBUK FAMILY GUIDE',
    intro: '전북 가족 숙소는 객실 넓이, 주차, 이동 거리, 조식과 주변 식당 접근성이 중요합니다. 아이 동반 관점에서 후기 신호를 다시 정리했습니다.',
    purpose: '전북 가족 여행에서 숙소 선택을 빠르게 비교하려는 사용자를 위한 페이지입니다.',
    intentQuestion: '아이와 전북 여행을 갈 때 어떤 숙소가 덜 불편할까요?',
    metaDescription: '전북 가족 호텔을 객실, 주차, 조식, 이동 동선, 주변 편의 기준으로 비교했습니다.',
    criteria: ['가족', '객실', '주차', '조식', '주변 편의'],
    tableColumns: ['가족 적합도', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['가족', '리조트', '펜션', '한옥', '변산', '무주', '남원']
  },
  {
    slug: 'jeonbuk-hotel-comparison',
    path: '/jeonbuk/jeonbuk-hotel-comparison/',
    title: '전북 호텔 비교',
    eyebrow: 'JEONBUK COMPARISON',
    intro: '전북 호텔을 전주, 군산, 부안, 남원, 무주, 익산 등 주요 목적지별로 비교합니다. 단순 순위보다 여행 목적에 맞는 선택 기준을 보여줍니다.',
    purpose: '전북 전체 숙소를 한 번에 훑고 목적지별 후보를 좁히는 페이지입니다.',
    intentQuestion: '전북 호텔은 도시별로 어떤 기준을 다르게 봐야 할까요?',
    metaDescription: '전북 호텔 비교 페이지입니다. 전주, 군산, 부안, 남원, 무주, 익산 숙소를 후기 기반으로 정리했습니다.',
    criteria: ['위치', '후기 수', '평점', '가격대', '추천 대상'],
    tableColumns: ['주요 목적지', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['전북', '전주', '군산', '부안', '남원', '무주', '익산', '고창', '정읍']
  }
];

export const jeonbukHotels = hotels.filter(isJeonbukHotel);

export function getJeonbukAreaGuideHotels(guide: JeonbukAreaGuide, limit = 20): JeonbukAreaGuideHotel[] {
  return jeonbukHotels
    .map((hotel) => buildGuideHotel(guide, hotel))
    .filter((item) => item.guideScore > 0)
    .sort((a, b) => b.guideScore - a.guideScore)
    .slice(0, limit);
}

export function getRelatedJeonbukAreaGuides(hotel: Hotel) {
  if (!isJeonbukHotel(hotel)) return [];
  return jeonbukAreaGuides
    .map((guide) => ({ guide, score: scoreGuide(guide, hotel) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => item.guide);
}

function buildGuideHotel(guide: JeonbukAreaGuide, hotel: Hotel): JeonbukAreaGuideHotel {
  const text = searchableText(hotel);
  const keywordScore = guide.keywords.reduce((sum, keyword) => sum + (new RegExp(escapeRegExp(keyword), 'i').test(text) ? 14 : 0), 0);
  const reviewScore = Math.min(30, Math.log10((hotel.reviewCount || 1) + 1) * 9);
  const ratingScore = Math.max(0, (hotel.reviewScore || 0) - 7) * 8;
  const guideScore = keywordScore + reviewScore + ratingScore;

  return {
    hotel,
    guideScore,
    reasons: buildReasons(guide, hotel),
    caution: buildCaution(guide, hotel),
    target: pickTarget(guide, hotel),
    tags: buildTags(guide, hotel),
    tableCells: buildTableCells(guide, hotel)
  };
}

function scoreGuide(guide: JeonbukAreaGuide, hotel: Hotel) {
  return buildGuideHotel(guide, hotel).guideScore;
}

function buildReasons(guide: JeonbukAreaGuide, hotel: Hotel) {
  const reasons = [
    `${guide.criteria[0]} 기준으로 비교 후보에 넣기 좋습니다.`,
    hotel.reviewCount ? `${hotel.reviewCount.toLocaleString('ko-KR')}건 이상의 후기 신호가 있어 판단 근거가 비교적 충분합니다.` : '후기 수는 많지 않아 위치와 가격 조건을 함께 봐야 합니다.',
    hotel.reviewScore ? `평점 ${hotel.reviewScore}점대로 기본 만족도를 가늠할 수 있습니다.` : '평점 정보는 제한적이어서 상세 조건 확인이 필요합니다.'
  ];
  return reasons.slice(0, 3);
}

function buildCaution(guide: JeonbukAreaGuide, hotel: Hotel) {
  const text = searchableText(hotel);
  if (/한옥|게스트하우스|펜션/.test(text)) return '한옥·게스트하우스형 숙소는 방음, 욕실 구조, 주차 조건을 미리 확인하는 편이 좋습니다.';
  if (/변산|부안|고창|무주|남원/.test(text)) return '관광지 간 이동 시간이 길 수 있으니 실제 방문지와 숙소 위치를 지도에서 함께 확인하세요.';
  if (/군산|익산|완주/.test(text)) return '출장 목적이라면 조식 시작 시간과 주차장 위치를 먼저 확인하는 것이 좋습니다.';
  return `${guide.criteria[0]} 기준으로 고른 숙소라도 성수기에는 체크인 대기와 주차 상황이 달라질 수 있습니다.`;
}

function pickTarget(guide: JeonbukAreaGuide, hotel: Hotel) {
  if (/가족|리조트|변산|무주|남원/.test(searchableText(hotel))) return '가족 여행';
  if (/군산|익산|완주|비즈니스|출장/.test(searchableText(hotel))) return '출장·차량 이동';
  if (/한옥|전주/.test(searchableText(hotel))) return '전주 여행';
  return guide.criteria[0];
}

function buildTags(guide: JeonbukAreaGuide, hotel: Hotel) {
  const tags = [guide.criteria[0], guide.criteria[1], pickTarget(guide, hotel)];
  if (hotel.reviewScore && hotel.reviewScore >= 8.8) tags.push('평점 우수');
  if (hotel.reviewCount && hotel.reviewCount >= 1000) tags.push('후기 많음');
  return [...new Set(tags)].slice(0, 5);
}

function buildTableCells(guide: JeonbukAreaGuide, hotel: Hotel) {
  const price = hotel.averageNightlyRate ?? hotel.dailyRate;
  return [
    guide.criteria[0],
    hotel.reviewScore ? String(hotel.reviewScore) : '확인 필요',
    hotel.reviewCount ? `${hotel.reviewCount.toLocaleString('ko-KR')}건` : '후기 부족',
    price ? `${price.toLocaleString('ko-KR')}원~` : '가격 확인',
    pickTarget(guide, hotel)
  ];
}

function searchableText(hotel: Hotel) {
  return [
    hotel.slug,
    hotel.hotelName,
    hotel.region,
    hotel.address,
    hotel.analysis?.summary,
    hotel.analysis?.seoTitle,
    ...(hotel.analysis?.pros ?? []),
    ...(hotel.analysis?.checkPoints ?? [])
  ]
    .filter(Boolean)
    .join(' ');
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
