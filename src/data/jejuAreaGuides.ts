import { activeHotels as hotels } from './hotels';
import type { Hotel } from './hotels';
import { isJejuHotel } from './jejuSearchIntents';

export type JejuAreaGuide = {
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

export type JejuAreaGuideHotel = {
  hotel: Hotel;
  guideScore: number;
  reasons: string[];
  caution: string;
  target: string;
  tags: string[];
  tableCells: string[];
};

export const jejuAreaGuides: JejuAreaGuide[] = [
  {
    slug: 'jeju-airport-hotels',
    path: '/jeju/jeju-airport-hotels/',
    title: '제주공항 근처 호텔 후기 모음',
    eyebrow: 'JEJU AIRPORT HOTEL GUIDE',
    intro: '제주공항 근처 호텔은 늦은 도착, 이른 출발, 렌터카 인수 전후 일정에서 선택지가 됩니다. 공항 거리만 보지 말고 주차, 체크인, 주변 식당까지 함께 비교해야 합니다.',
    purpose: '제주 첫날 또는 마지막 날 숙소를 찾는 여행자가 예약 전에 빠르게 비교할 수 있도록 정리한 페이지입니다.',
    intentQuestion: '제주공항 근처에서 1박하기 좋은 호텔은 어디일까?',
    metaDescription: '제주공항 근처 호텔 후기를 공항 접근성, 주차, 체크인, 가격대, 주변 편의시설 기준으로 비교했습니다.',
    criteria: ['공항 접근성', '렌터카 동선', '주차', '늦은 체크인', '짧은 숙박'],
    tableColumns: ['공항 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['제주공항', '공항', '연동', '노형', '도령로', '신대로', 'airport', 'yeondong', 'nohyeong']
  },
  {
    slug: 'jeju-city-hotels',
    path: '/jeju/jeju-city-hotels/',
    title: '제주시 호텔 후기 모음',
    eyebrow: 'JEJU CITY HOTEL GUIDE',
    intro: '제주시 호텔은 공항, 동문시장, 탑동, 시내 식당 접근성이 강점입니다. 짧은 제주 여행이나 첫날 숙박에서는 이동 효율을 중심으로 비교하는 편이 좋습니다.',
    purpose: '제주시 중심 일정과 공항 접근을 함께 고려하는 여행자를 위한 선택 가이드입니다.',
    intentQuestion: '제주시에서 위치와 이동이 좋은 호텔은 어디일까?',
    metaDescription: '제주시 호텔 후기를 공항 접근, 동문시장, 탑동, 주차, 객실 컨디션 기준으로 비교했습니다.',
    criteria: ['제주시 위치', '시장 접근', '공항 접근', '주차', '주변 식당'],
    tableColumns: ['제주시 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['제주시', '탑동', '동문', '서부두', '용담', '삼도', '건입', 'jeju-si', 'topdong']
  },
  {
    slug: 'seogwipo-hotels',
    path: '/jeju/seogwipo-hotels/',
    title: '서귀포 호텔 후기 모음',
    eyebrow: 'SEOGWIPO HOTEL GUIDE',
    intro: '서귀포 호텔은 올레시장, 천지연폭포, 남쪽 해안 일정과 함께 보기 좋습니다. 공항과 거리가 있으므로 렌터카 이동 시간과 일정 배치를 함께 확인해야 합니다.',
    purpose: '제주 남부 여행을 준비하는 사용자가 서귀포 숙소를 비교할 수 있도록 정리했습니다.',
    intentQuestion: '서귀포 여행에서 위치와 후기 균형이 좋은 호텔은 어디일까?',
    metaDescription: '서귀포 호텔 후기를 올레시장, 천지연, 주차, 객실, 조식 기준으로 비교했습니다.',
    criteria: ['서귀포 위치', '올레시장', '남쪽 관광지', '주차', '객실 컨디션'],
    tableColumns: ['서귀포 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['서귀포', '서귀동', '동홍', '천지연', '올레시장', '이중섭', 'seogwipo']
  },
  {
    slug: 'jungmun-hotels',
    path: '/jeju/jungmun-hotels/',
    title: '제주 중문 호텔 후기 모음',
    eyebrow: 'JUNGMUN HOTEL GUIDE',
    intro: '중문 호텔은 리조트형 휴식, 가족 여행, 기념일 숙박에서 자주 비교됩니다. 가격대가 높아질 수 있어 조식, 수영장, 전망 포함 여부를 함께 봐야 합니다.',
    purpose: '중문 관광단지와 제주 리조트형 숙소를 비교하려는 사용자를 위한 페이지입니다.',
    intentQuestion: '중문에서 가족이나 커플 여행에 맞는 호텔은 어디일까?',
    metaDescription: '제주 중문 호텔 후기를 가족 여행, 커플 여행, 조식, 수영장, 전망 기준으로 비교했습니다.',
    criteria: ['중문 위치', '가족 여행', '커플 여행', '조식', '부대시설'],
    tableColumns: ['중문 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['중문', '색달', '예래', '중문관광', 'jungmun']
  },
  {
    slug: 'aewol-hotels',
    path: '/jeju/aewol-hotels/',
    title: '제주 애월 호텔 후기 모음',
    eyebrow: 'AEWOL HOTEL GUIDE',
    intro: '애월 숙소는 해안도로, 카페, 서쪽 바다 일정과 잘 맞습니다. 렌터카 이동이 중요하기 때문에 주차와 주변 식당 접근성을 함께 확인하는 편이 좋습니다.',
    purpose: '애월과 제주 서쪽 해안 여행을 준비하는 사용자를 위한 후기 기반 비교 페이지입니다.',
    intentQuestion: '애월에서 바다와 이동 편의가 괜찮은 숙소는 어디일까?',
    metaDescription: '제주 애월 호텔 후기를 바다 접근, 렌터카 이동, 주차, 커플 여행, 주변 카페 기준으로 비교했습니다.',
    criteria: ['애월 위치', '해안도로', '렌터카 이동', '주차', '커플 여행'],
    tableColumns: ['애월 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['애월', '곽지', '한담', 'aewol', 'gwakji']
  },
  {
    slug: 'hamdeok-hotels',
    path: '/jeju/hamdeok-hotels/',
    title: '제주 함덕 호텔 후기 모음',
    eyebrow: 'HAMDEOK HOTEL GUIDE',
    intro: '함덕 호텔은 해변 접근성과 제주 동쪽 일정의 출발점으로 많이 비교됩니다. 성수기 혼잡, 주차, 객실 전망 차이를 함께 확인해야 합니다.',
    purpose: '함덕 해수욕장과 제주 동쪽 여행을 준비하는 사용자를 위한 비교 페이지입니다.',
    intentQuestion: '함덕 해수욕장 근처에서 후기 좋은 호텔은 어디일까?',
    metaDescription: '제주 함덕 호텔 후기를 해변 접근, 오션뷰, 가족 여행, 주차, 동쪽 여행 기준으로 비교했습니다.',
    criteria: ['함덕 해변', '오션뷰', '동쪽 여행', '가족 여행', '주차'],
    tableColumns: ['함덕 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['함덕', '조천', '조함해안', 'hamdeok', 'jocheon']
  },
  {
    slug: 'seongsan-hotels',
    path: '/jeju/seongsan-hotels/',
    title: '제주 성산 호텔 후기 모음',
    eyebrow: 'SEONGSAN HOTEL GUIDE',
    intro: '성산 호텔은 성산일출봉, 섭지코지, 우도 일정과 묶기 좋습니다. 제주시나 중문과는 거리가 있어 동쪽 일정이 확실할 때 선택하는 편이 좋습니다.',
    purpose: '성산과 우도, 제주 동쪽 관광지를 중심으로 숙소를 찾는 사용자를 위한 페이지입니다.',
    intentQuestion: '성산일출봉과 우도 일정에 맞는 호텔은 어디일까?',
    metaDescription: '제주 성산 호텔 후기를 성산일출봉, 우도, 섭지코지, 주차, 객실 컨디션 기준으로 비교했습니다.',
    criteria: ['성산 위치', '우도 일정', '일출봉', '주차', '동쪽 여행'],
    tableColumns: ['성산 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['성산', '일출봉', '섭지코지', '성산읍', 'seongsan', 'seopjikoji']
  },
  {
    slug: 'jeju-ocean-view-hotels',
    path: '/jeju/jeju-ocean-view-hotels/',
    title: '제주 오션뷰 호텔 후기 모음',
    eyebrow: 'JEJU OCEAN VIEW GUIDE',
    intro: '제주 오션뷰 호텔은 객실 타입과 층수에 따라 만족도가 크게 달라집니다. 바다 전망이 중요하다면 전망 보장 여부와 부분 전망인지까지 확인해야 합니다.',
    purpose: '바다 전망을 중시하는 여행자가 예약 전 기대치를 조정할 수 있도록 정리한 페이지입니다.',
    intentQuestion: '제주에서 오션뷰 기대가 가능한 호텔은 어디일까?',
    metaDescription: '제주 오션뷰 호텔 후기를 바다 전망, 객실 타입, 위치, 가격대, 주의점 기준으로 비교했습니다.',
    criteria: ['오션뷰 가능성', '객실 타입', '해안 접근', '가격대', '주의점'],
    tableColumns: ['전망 기대', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['오션', '바다', '해안', '뷰', '항', 'beach', 'ocean', 'sea']
  },
  {
    slug: 'jeju-hotel-comparison',
    path: '/jeju/jeju-hotel-comparison/',
    title: '제주 호텔 비교',
    eyebrow: 'JEJU HOTEL COMPARISON',
    intro: '제주 호텔은 지역 선택이 예약 만족도를 크게 좌우합니다. 제주시, 서귀포, 중문, 애월, 함덕, 성산처럼 일정별로 먼저 나누어 비교하는 것이 좋습니다.',
    purpose: '제주 호텔을 지역과 목적별로 먼저 좁힌 뒤 개별 호텔 후기를 비교하기 위한 페이지입니다.',
    intentQuestion: '제주 호텔은 어느 지역부터 비교해야 할까?',
    metaDescription: '제주 호텔을 제주시, 서귀포, 중문, 애월, 함덕, 성산, 오션뷰 기준으로 비교했습니다.',
    criteria: ['제주 지역', '평점', '후기 수', '가격대', '추천 목적'],
    tableColumns: ['지역', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['제주', '서귀포', '중문', '애월', '함덕', '성산', 'jeju']
  }
];

export const jejuHotels = hotels
  .filter(isJejuHotel)
  .sort((a, b) => popularity(b) - popularity(a));

export function getJejuAreaGuide(slug: string) {
  return jejuAreaGuides.find((guide) => guide.slug === slug);
}

export function getJejuAreaGuideHotels(guide: JejuAreaGuide, limit = 20): JejuAreaGuideHotel[] {
  return jejuHotels
    .map((hotel) => buildGuideHotel(hotel, guide))
    .filter((item) => item.guideScore > 0)
    .sort((a, b) => b.guideScore - a.guideScore)
    .slice(0, limit);
}

export function getRelatedJejuAreaGuides(hotel: Hotel) {
  if (!isJejuHotel(hotel)) return [];
  const text = hotelText(hotel);
  return jejuAreaGuides
    .map((guide) => ({
      guide,
      score: guide.slug === 'jeju-hotel-comparison' ? 1 : keywordScore(text, guide.keywords)
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => item.guide);
}

function buildGuideHotel(hotel: Hotel, guide: JejuAreaGuide): JejuAreaGuideHotel {
  const text = hotelText(hotel);
  const directScore = guide.slug === 'jeju-hotel-comparison' ? 1 : keywordScore(text, guide.keywords);
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

function buildReasons(hotel: Hotel, guide: JejuAreaGuide, area: string) {
  const reasons = [
    `${area} 일정에서 실제 이동 동선과 주차 조건을 함께 비교하기 좋은 후보입니다.`,
    hotel.reviewScore && hotel.reviewScore >= 8.6
      ? '평점이 높은 편이라 후기 기반으로 우선 검토할 만합니다.'
      : '평점과 후기 수를 함께 보면서 기대치를 조정하기 좋습니다.',
    hotel.reviewCount && hotel.reviewCount >= 1000
      ? '후기 수가 충분해 반복되는 장단점을 비교하기 좋습니다.'
      : '후기 수가 많지 않아 객실 타입과 최신 조건을 추가 확인하는 편이 좋습니다.'
  ];

  if (guide.slug.includes('airport')) reasons[0] = '제주공항 도착 전후 1박과 렌터카 동선을 함께 보기 좋은 후보입니다.';
  if (guide.slug.includes('jungmun')) reasons[0] = '중문 관광단지와 리조트형 휴식 조건을 함께 비교하기 좋은 후보입니다.';
  if (guide.slug.includes('ocean')) reasons[0] = '바다 접근이나 전망 기대치를 확인하며 비교하기 좋은 후보입니다.';
  if (guide.slug.includes('seongsan')) reasons[0] = '성산일출봉, 우도, 제주 동쪽 일정과 함께 보기 좋은 후보입니다.';
  return reasons;
}

function buildCaution(hotel: Hotel, guide: JejuAreaGuide) {
  if (guide.slug.includes('airport')) return '바다 전망보다 이동 편의 중심 숙소인지 확인하세요.';
  if (guide.slug.includes('ocean')) return '오션뷰는 객실 타입과 층수에 따라 체감이 달라질 수 있습니다.';
  if (guide.slug.includes('jungmun')) return '성수기에는 가격대와 체크인 대기 후기를 함께 확인하세요.';
  if (guide.slug.includes('seogwipo')) return '공항 이동 시간이 길 수 있어 첫날과 마지막 날 일정에는 주의가 필요합니다.';
  if (hotel.reviewCount && hotel.reviewCount < 100) return '후기 데이터가 적어 최신 객실 상태를 추가 확인하는 편이 좋습니다.';
  return '제주 숙소는 렌터카 이동 시간과 주차 조건을 함께 확인하는 것이 좋습니다.';
}

function buildTarget(guide: JejuAreaGuide, area: string) {
  if (guide.slug.includes('airport')) return '늦은 도착·이른 출발 여행자';
  if (guide.slug.includes('jungmun')) return '가족·커플 휴양 여행자';
  if (guide.slug.includes('ocean')) return '바다 전망을 중시하는 여행자';
  if (guide.slug.includes('seongsan')) return '성산·우도 중심 여행자';
  if (guide.slug.includes('aewol')) return '서쪽 해안 드라이브 여행자';
  return `${area} 일정 여행자`;
}

function buildTableCells(guide: JejuAreaGuide, area: string, score: string, reviews: string, price: string) {
  const first = guide.slug.includes('comparison') ? area : `${area} 중심`;
  return [first, score, reviews, price, buildTarget(guide, area)];
}

function pickAreaLabel(hotel: Hotel) {
  const text = hotelText(hotel);
  if (/제주공항|연동|노형|도령로|신대로|airport|yeondong|nohyeong/i.test(text)) return '제주공항';
  if (/중문|색달|예래|jungmun/i.test(text)) return '중문';
  if (/서귀포|서귀동|동홍|천지연|seogwipo/i.test(text)) return '서귀포';
  if (/애월|곽지|한담|aewol/i.test(text)) return '애월';
  if (/함덕|조천|hamdeok|jocheon/i.test(text)) return '함덕';
  if (/성산|일출봉|섭지코지|seongsan/i.test(text)) return '성산';
  if (/협재|한림|금능|hyeopjae|hallim/i.test(text)) return '협재·한림';
  if (/제주시|탑동|동문|서부두|jeju-si/i.test(text)) return '제주시';
  return '제주';
}

function priceText(hotel: Hotel) {
  const price = hotel.averageNightlyRate ?? hotel.dailyRate;
  return price ? `${price.toLocaleString('ko-KR')}원~` : '가격 확인';
}

function popularity(hotel: Hotel) {
  return (hotel.reviewScore || 0) * 1000 + Math.min(hotel.reviewCount || 0, 20000);
}

function keywordScore(text: string, keywords: string[]) {
  const lower = text.toLowerCase();
  return keywords.reduce((score, keyword) => score + (lower.includes(keyword.toLowerCase()) ? 1 : 0), 0);
}

function hotelText(hotel: Hotel) {
  return [
    hotel.slug,
    hotel.hotelName,
    hotel.region,
    hotel.address,
    hotel.analysis?.summary,
    hotel.analysis?.seoTitle,
    hotel.analysis?.metaDescription,
    ...(hotel.analysis?.pros || []),
    ...(hotel.analysis?.cons || [])
  ]
    .filter(Boolean)
    .join(' ');
}
