import { activeHotels as hotels } from './hotels';
import type { Hotel } from './hotels';
import { isChungnamHotel } from './chungnamSearchIntents';

export type ChungnamAreaGuide = {
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

export type ChungnamAreaGuideHotel = {
  hotel: Hotel;
  guideScore: number;
  reasons: string[];
  caution: string;
  target: string;
  tags: string[];
  tableCells: string[];
};

export const chungnamAreaGuides: ChungnamAreaGuide[] = [
  {
    slug: 'cheonan-asan-hotels',
    path: '/chungnam/cheonan-asan-hotels/',
    title: '천안 아산 호텔 후기 모음',
    eyebrow: 'CHEONAN ASAN HOTEL GUIDE',
    intro: '천안·아산 호텔은 천안아산역, 불당, 두정, 온양온천, 도고온천처럼 이동 목적지에 따라 선택 기준이 달라집니다. 출장과 여행 관점에서 후기 신호를 나눠 비교했습니다.',
    purpose: '천안·아산 출장, KTX 이동, 온천 일정을 준비하는 사용자를 위한 페이지입니다.',
    intentQuestion: '천안·아산에서는 역 접근성, 주차, 조식 중 무엇을 먼저 봐야 할까요?',
    metaDescription: '천안 아산 호텔 후기를 천안아산역, 불당, 온양온천, 출장, 주차, 조식 기준으로 비교했습니다.',
    criteria: ['천안아산역', '출장', '주차', '조식', '객실'],
    tableColumns: ['주요 동선', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['천안', '아산', '불당', '두정', '성정', '신부', '온양', '도고', 'cheonan', 'asan']
  },
  {
    slug: 'boryeong-daecheon-hotels',
    path: '/chungnam/boryeong-daecheon-hotels/',
    title: '보령 대천 호텔 후기 모음',
    eyebrow: 'BORYEONG DAECHON HOTEL GUIDE',
    intro: '보령·대천 숙소는 해수욕장 접근성, 바다 전망, 성수기 주차, 가족 동반 편의성이 중요합니다. 대천해수욕장과 머드광장 일정을 기준으로 정리했습니다.',
    purpose: '대천해수욕장, 보령 머드축제, 바다 여행 숙소를 찾는 사용자를 위한 페이지입니다.',
    intentQuestion: '대천해수욕장 근처 숙소는 오션뷰와 주차 중 무엇을 먼저 확인해야 할까요?',
    metaDescription: '보령 대천 호텔 후기를 대천해수욕장, 오션뷰, 가족 여행, 주차, 체크인 기준으로 비교했습니다.',
    criteria: ['대천해수욕장', '오션뷰', '가족', '주차', '성수기'],
    tableColumns: ['해변 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['보령', '대천', '머드', '무창포', '해수욕장', 'boryeong', 'daecheon']
  },
  {
    slug: 'taean-anmyeondo-hotels',
    path: '/chungnam/taean-anmyeondo-hotels/',
    title: '태안 안면도 호텔 후기 모음',
    eyebrow: 'TAEAN ANMYEONDO HOTEL GUIDE',
    intro: '태안·안면도 숙소는 만리포, 몽산포, 꽃지, 안면도 해변 중 어느 곳을 중심으로 움직이는지가 중요합니다. 오션뷰와 스파, 바비큐 조건을 함께 봅니다.',
    purpose: '태안 바다 여행, 안면도 가족 여행, 오션뷰 펜션을 비교하려는 사용자를 위한 페이지입니다.',
    intentQuestion: '태안·안면도 숙소는 해변 거리, 오션뷰, 스파 중 무엇이 더 중요할까요?',
    metaDescription: '태안 안면도 호텔 후기를 오션뷰, 만리포, 몽산포, 꽃지, 가족 여행, 스파 기준으로 비교했습니다.',
    criteria: ['오션뷰', '해변 접근', '가족', '스파', '주차'],
    tableColumns: ['해변/전망', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['태안', '안면도', '만리포', '몽산포', '꽃지', '오션', '바다', 'taean']
  },
  {
    slug: 'gongju-buyeo-hotels',
    path: '/chungnam/gongju-buyeo-hotels/',
    title: '공주 부여 호텔 후기 모음',
    eyebrow: 'GONGJU BUYEO HOTEL GUIDE',
    intro: '공주·부여 숙소는 공산성, 동학사, 백제문화단지, 구드래 일정을 기준으로 위치를 확인해야 합니다. 한옥형 숙소는 방음과 욕실 구조도 함께 봅니다.',
    purpose: '백제문화 여행, 공주·부여 주말 여행, 한옥 숙소를 비교하는 사용자를 위한 페이지입니다.',
    intentQuestion: '공주·부여 여행에서는 관광지 접근성과 숙소 형태 중 무엇을 먼저 봐야 할까요?',
    metaDescription: '공주 부여 호텔 후기를 백제문화단지, 공산성, 동학사, 한옥, 주차 기준으로 비교했습니다.',
    criteria: ['백제문화', '관광지 접근', '한옥', '주차', '조용함'],
    tableColumns: ['관광 동선', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['공주', '부여', '백제', '동학사', '공산성', '구드래', '한옥', 'gongju', 'buyeo']
  },
  {
    slug: 'seosan-dangjin-hotels',
    path: '/chungnam/seosan-dangjin-hotels/',
    title: '서산 당진 호텔 후기 모음',
    eyebrow: 'SEOSAN DANGJIN HOTEL GUIDE',
    intro: '서산·당진 호텔은 대산 산업단지, 당진터미널, 삽교호, 한진포구처럼 차량 이동 목적지가 분산되어 있습니다. 출장과 주차 편의성을 중심으로 비교했습니다.',
    purpose: '서산·당진 출장, 터미널 근처 숙박, 차량 이동 숙소를 찾는 사용자를 위한 페이지입니다.',
    intentQuestion: '서산·당진 숙소는 출장 동선과 주차 조건 중 무엇을 먼저 봐야 할까요?',
    metaDescription: '서산 당진 호텔 후기를 출장, 대산, 당진터미널, 삽교호, 주차, 가성비 기준으로 비교했습니다.',
    criteria: ['출장', '주차', '터미널', '가성비', '객실'],
    tableColumns: ['출장 동선', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['서산', '당진', '대산', '삽교', '한진포구', '터미널', 'seosan', 'dangjin']
  },
  {
    slug: 'yesan-deoksan-hotels',
    path: '/chungnam/yesan-deoksan-hotels/',
    title: '예산 덕산 온천 호텔 후기 모음',
    eyebrow: 'YESAN DEOKSAN HOTEL GUIDE',
    intro: '예산·덕산 숙소는 온천, 스파, 리조트 부대시설, 가족 동반 편의성이 핵심입니다. 포함 요금과 부대시설 이용 조건을 함께 봐야 합니다.',
    purpose: '덕산온천, 스플라스 리솜, 예산 가족 여행 숙소를 비교하는 사용자를 위한 페이지입니다.',
    intentQuestion: '예산·덕산 숙소는 온천 포함 여부와 가족 편의성 중 무엇을 먼저 봐야 할까요?',
    metaDescription: '예산 덕산 온천 호텔 후기를 스파, 리조트, 가족 여행, 조식, 주차 기준으로 비교했습니다.',
    criteria: ['온천', '스파', '가족', '조식', '주차'],
    tableColumns: ['온천/스파', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['예산', '덕산', '온천', '스파', '리솜', '스플라스', 'yesan', 'deoksan']
  },
  {
    slug: 'chungnam-family-hotels',
    path: '/chungnam/chungnam-family-hotels/',
    title: '충남 가족 호텔 추천',
    eyebrow: 'CHUNGNAM FAMILY GUIDE',
    intro: '충남 가족 숙소는 객실 넓이, 주차, 주변 식당, 해변이나 온천 접근성이 중요합니다. 바다 여행과 온천 여행을 나눠 후기 신호를 정리했습니다.',
    purpose: '아이와 충남 여행을 준비하는 사용자가 숙소 후보를 빠르게 비교할 수 있는 페이지입니다.',
    intentQuestion: '아이와 충남 여행을 갈 때 가장 덜 불편한 숙소는 어디일까요?',
    metaDescription: '충남 가족 호텔 추천을 태안, 대천, 예산, 부여, 천안 숙소 후기 기반으로 비교했습니다.',
    criteria: ['가족', '객실', '주차', '조식', '주변 편의'],
    tableColumns: ['가족 적합도', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['가족', '리조트', '펜션', '온천', '스파', '대천', '태안', '예산', '부여']
  },
  {
    slug: 'chungnam-hotel-comparison',
    path: '/chungnam/chungnam-hotel-comparison/',
    title: '충남 호텔 비교',
    eyebrow: 'CHUNGNAM COMPARISON',
    intro: '충남 호텔은 천안·아산, 보령·대천, 태안·안면도, 공주·부여, 서산·당진처럼 목적지별 선택 기준이 크게 다릅니다. 단순 순위보다 여행 목적에 맞춰 비교합니다.',
    purpose: '충남 전체 숙소를 한 번에 보고 목적지별 후보를 좁히는 페이지입니다.',
    intentQuestion: '충남 호텔은 지역별로 어떤 기준을 다르게 봐야 할까요?',
    metaDescription: '충남 호텔 비교 페이지입니다. 천안, 아산, 보령, 태안, 공주, 부여, 서산, 당진 숙소를 후기 기반으로 정리했습니다.',
    criteria: ['위치', '후기 수', '평점', '가격대', '추천 대상'],
    tableColumns: ['주요 목적지', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['충남', '천안', '아산', '보령', '태안', '공주', '부여', '서산', '당진', '논산', '예산']
  }
];

export const chungnamHotels = hotels.filter(isChungnamHotel);

export function getChungnamAreaGuideHotels(guide: ChungnamAreaGuide, limit = 20): ChungnamAreaGuideHotel[] {
  return chungnamHotels
    .map((hotel) => buildGuideHotel(guide, hotel))
    .filter((item) => item.guideScore > 0)
    .sort((a, b) => b.guideScore - a.guideScore)
    .slice(0, limit);
}

export function getRelatedChungnamAreaGuides(hotel: Hotel) {
  if (!isChungnamHotel(hotel)) return [];
  return chungnamAreaGuides
    .map((guide) => ({ guide, score: scoreGuide(guide, hotel) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => item.guide);
}

function buildGuideHotel(guide: ChungnamAreaGuide, hotel: Hotel): ChungnamAreaGuideHotel {
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

function scoreGuide(guide: ChungnamAreaGuide, hotel: Hotel) {
  return buildGuideHotel(guide, hotel).guideScore;
}

function buildReasons(guide: ChungnamAreaGuide, hotel: Hotel) {
  const reasons = [
    `${guide.criteria[0]} 기준으로 비교 후보에 넣기 좋은 숙소입니다.`,
    hotel.reviewCount ? `${hotel.reviewCount.toLocaleString('ko-KR')}건 이상의 후기 신호가 있어 판단 근거가 비교적 충분합니다.` : '후기 수가 많지 않아 위치와 가격 조건을 함께 봐야 합니다.',
    hotel.reviewScore ? `평점 ${hotel.reviewScore}점대로 기본 만족도를 가늠할 수 있습니다.` : '평점 정보가 제한적이라 상세 조건 확인이 필요합니다.'
  ];
  return reasons.slice(0, 3);
}

function buildCaution(guide: ChungnamAreaGuide, hotel: Hotel) {
  const text = searchableText(hotel);
  if (/태안|안면도|대천|보령|만리포|몽산포|오션|바다/.test(text)) return '해변 숙소는 객실 타입별 전망과 성수기 주차 조건이 달라질 수 있습니다.';
  if (/천안|아산|서산|당진|출장|비즈니스/.test(text)) return '출장 목적이라면 목적지까지의 실제 이동 시간과 조식 운영 시간을 먼저 확인하세요.';
  if (/공주|부여|한옥|게스트하우스/.test(text)) return '한옥·게스트하우스형 숙소는 방음, 욕실 구조, 주차 조건을 미리 확인하는 편이 좋습니다.';
  if (/온천|스파|리솜|덕산/.test(text)) return '스파와 온천은 운영 시간, 포함 요금, 아이 동반 가능 여부를 확인해야 합니다.';
  return `${guide.criteria[0]} 기준으로 고른 숙소라도 성수기에는 체크인 대기와 가격 변동이 생길 수 있습니다.`;
}

function pickTarget(guide: ChungnamAreaGuide, hotel: Hotel) {
  const text = searchableText(hotel);
  if (/태안|안면도|대천|보령|오션|바다|펜션/.test(text)) return '바다 여행';
  if (/천안|아산|서산|당진|출장|비즈니스/.test(text)) return '출장·차량 이동';
  if (/공주|부여|백제|한옥/.test(text)) return '역사 여행';
  if (/예산|덕산|온천|스파|리솜/.test(text)) return '온천·가족 여행';
  return guide.criteria[0];
}

function buildTags(guide: ChungnamAreaGuide, hotel: Hotel) {
  const tags = [guide.criteria[0], guide.criteria[1], pickTarget(guide, hotel)];
  if (hotel.reviewScore && hotel.reviewScore >= 8.8) tags.push('평점 우수');
  if (hotel.reviewCount && hotel.reviewCount >= 1000) tags.push('후기 많음');
  return [...new Set(tags)].slice(0, 5);
}

function buildTableCells(guide: ChungnamAreaGuide, hotel: Hotel) {
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
