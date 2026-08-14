import { activeHotels as hotels } from './hotels';
import type { Hotel } from './hotels';
import { isGangwonHotel } from './gangwonSearchIntents';

export type GangwonAreaGuide = {
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

export type GangwonAreaGuideHotel = {
  hotel: Hotel;
  guideScore: number;
  reasons: string[];
  caution: string;
  target: string;
  tags: string[];
  tableCells: string[];
};

export const gangwonAreaGuides: GangwonAreaGuide[] = [
  {
    slug: 'sokcho-hotels',
    path: '/gangwon/sokcho-hotels/',
    title: '속초 호텔 후기 모음',
    eyebrow: 'SOKCHO HOTEL GUIDE',
    intro: '속초 호텔은 해변, 중앙시장, 청초호, 대포항, 설악산 중 어디를 중심으로 움직일지에 따라 만족도가 달라집니다. 바다 접근성과 차량 이동, 주차 조건을 함께 비교합니다.',
    purpose: '속초 해변 여행이나 설악산·대포항 일정을 준비하는 사용자가 숙소를 고르기 위한 페이지입니다.',
    intentQuestion: '속초에서 해변과 이동 동선의 균형이 좋은 호텔은 어디일까?',
    metaDescription: '속초 호텔 후기를 해변 접근, 중앙시장, 청초호, 대포항, 설악산, 주차 기준으로 비교했습니다.',
    criteria: ['속초 위치', '해변 접근', '중앙시장', '설악산·대포항', '주차'],
    tableColumns: ['속초 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['속초', 'sokcho', '청초호', '대포항', '설악', '속초해변', '중앙시장']
  },
  {
    slug: 'gangneung-hotels',
    path: '/gangwon/gangneung-hotels/',
    title: '강릉 호텔 후기 모음',
    eyebrow: 'GANGNEUNG HOTEL GUIDE',
    intro: '강릉 호텔은 경포, 안목, 주문진, 강릉역처럼 목적지가 나뉩니다. 바다 전망 기대치, 카페거리 접근성, 주차와 성수기 혼잡을 함께 봐야 합니다.',
    purpose: '강릉 바다 여행, 카페거리, 강릉역 이동을 준비하는 사용자를 위한 호텔 선택 가이드입니다.',
    intentQuestion: '강릉에서 바다와 카페거리 동선에 맞는 호텔은 어디일까?',
    metaDescription: '강릉 호텔 후기를 경포, 안목, 주문진, 강릉역, 오션뷰, 주차 기준으로 비교했습니다.',
    criteria: ['강릉 위치', '경포·안목', '오션뷰 기대', '강릉역', '주차'],
    tableColumns: ['강릉 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['강릉', 'gangneung', '경포', '안목', '주문진', '정동진', '강릉역']
  },
  {
    slug: 'goseong-hotels',
    path: '/gangwon/goseong-hotels/',
    title: '고성 호텔 펜션 후기 모음',
    eyebrow: 'GOSEONG STAY GUIDE',
    intro: '고성 숙소는 조용한 해변, 가족 단위 펜션, 차량 이동 중심 일정과 잘 맞는 경우가 많습니다. 주변 편의시설과 바다 접근성을 함께 확인해야 합니다.',
    purpose: '강원 고성에서 조용한 바다 여행이나 가족 숙소를 찾는 사용자를 위한 페이지입니다.',
    intentQuestion: '고성에서 조용한 해변 여행에 맞는 숙소는 어디일까?',
    metaDescription: '고성 호텔과 펜션 후기를 해변 접근, 조용함, 가족 여행, 차량 이동, 주변 편의시설 기준으로 비교했습니다.',
    criteria: ['고성 위치', '해변 접근', '조용함', '가족 여행', '차량 이동'],
    tableColumns: ['고성 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['고성', 'goseong', '삼포', '화진포', '거진', '죽왕', '현내']
  },
  {
    slug: 'yangyang-hotels',
    path: '/gangwon/yangyang-hotels/',
    title: '양양 호텔 후기 모음',
    eyebrow: 'YANGYANG HOTEL GUIDE',
    intro: '양양 호텔은 낙산, 하조대, 서피비치처럼 해변 목적지가 분명합니다. 서핑이나 해변 일정이라면 거리, 주차, 샤워 동선, 성수기 혼잡을 함께 보는 것이 좋습니다.',
    purpose: '양양 해변 여행과 서핑 일정을 준비하는 사용자를 위한 호텔 선택 페이지입니다.',
    intentQuestion: '양양에서 해변과 서핑 일정에 맞는 호텔은 어디일까?',
    metaDescription: '양양 호텔 후기를 낙산, 하조대, 서피비치, 해변 접근, 주차, 성수기 혼잡 기준으로 비교했습니다.',
    criteria: ['양양 위치', '낙산·하조대', '서핑', '해변 접근', '주차'],
    tableColumns: ['양양 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['양양', 'yangyang', '낙산', '하조대', '서피비치', 'surfyy', '서핑']
  },
  {
    slug: 'chuncheon-hotels',
    path: '/gangwon/chuncheon-hotels/',
    title: '춘천 호텔 후기 모음',
    eyebrow: 'CHUNCHEON HOTEL GUIDE',
    intro: '춘천 호텔은 도심, 호수, 남이섬 방향에 따라 선택 기준이 달라집니다. 주변 식당, 차량 이동, 주차, 조용함을 함께 비교합니다.',
    purpose: '춘천 도심 일정, 남이섬 근교 여행, 커플·가족 1박을 준비하는 사용자를 위한 페이지입니다.',
    intentQuestion: '춘천에서 도심과 근교 이동에 맞는 호텔은 어디일까?',
    metaDescription: '춘천 호텔 후기를 도심 위치, 남이섬 방향, 호수, 차량 이동, 주차 기준으로 비교했습니다.',
    criteria: ['춘천 위치', '도심 접근', '남이섬 방향', '주차', '조용함'],
    tableColumns: ['춘천 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['춘천', 'chuncheon', '남이섬', '소양강', '공지천', '춘천역']
  },
  {
    slug: 'wonju-hotels',
    path: '/gangwon/wonju-hotels/',
    title: '원주 호텔 후기 모음',
    eyebrow: 'WONJU HOTEL GUIDE',
    intro: '원주 호텔은 관광보다 출장, 병원, 도심 업무 일정에 맞춰 비교하는 경우가 많습니다. 주차, 주변 식당, 객실 컨디션, 체크인 편의성을 함께 봅니다.',
    purpose: '원주 출장이나 단기 체류 숙소를 찾는 사용자를 위한 호텔 선택 가이드입니다.',
    intentQuestion: '원주에서 출장과 도심 이동에 맞는 호텔은 어디일까?',
    metaDescription: '원주 호텔 후기를 출장, 도심 접근, 주차, 객실 컨디션, 체크인 기준으로 비교했습니다.',
    criteria: ['원주 위치', '출장', '도심 접근', '주차', '객실 컨디션'],
    tableColumns: ['원주 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['원주', 'wonju', '무실동', '단계동', '혁신도시', '기업도시']
  },
  {
    slug: 'pyeongchang-hotels',
    path: '/gangwon/pyeongchang-hotels/',
    title: '평창 리조트 호텔 후기 모음',
    eyebrow: 'PYEONGCHANG RESORT GUIDE',
    intro: '평창 숙소는 리조트, 스키장, 가족 휴양 목적에 따라 만족도가 갈립니다. 부대시설 운영, 셔틀, 주차, 성수기 가격을 함께 확인해야 합니다.',
    purpose: '평창 스키장이나 리조트 휴양을 준비하는 사용자를 위한 비교 페이지입니다.',
    intentQuestion: '평창에서 리조트와 스키장 일정에 맞는 숙소는 어디일까?',
    metaDescription: '평창 리조트 호텔 후기를 스키장, 부대시설, 셔틀, 주차, 가족 여행 기준으로 비교했습니다.',
    criteria: ['평창 위치', '스키장', '리조트 시설', '셔틀·주차', '가족 여행'],
    tableColumns: ['평창 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['평창', 'pyeongchang', '휘닉스', '용평', '알펜시아', '스키', '리조트']
  },
  {
    slug: 'hongcheon-hotels',
    path: '/gangwon/hongcheon-hotels/',
    title: '홍천 리조트 호텔 후기 모음',
    eyebrow: 'HONGCHEON RESORT GUIDE',
    intro: '홍천 숙소는 리조트형 휴양과 차량 이동 중심 일정이 많습니다. 가족 여행이라면 부대시설, 객실 구성, 주차, 주변 식당 조건을 함께 비교해야 합니다.',
    purpose: '홍천 리조트 휴양이나 드라이브 여행을 준비하는 사용자를 위한 페이지입니다.',
    intentQuestion: '홍천에서 가족 휴양과 차량 이동에 맞는 숙소는 어디일까?',
    metaDescription: '홍천 리조트 호텔 후기를 가족 여행, 부대시설, 차량 이동, 주차, 객실 구성 기준으로 비교했습니다.',
    criteria: ['홍천 위치', '리조트 휴양', '가족 여행', '차량 이동', '주차'],
    tableColumns: ['홍천 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['홍천', 'hongcheon', '비발디', '소노', '리조트', '오션월드']
  },
  {
    slug: 'gangwon-hotel-comparison',
    path: '/gangwon/gangwon-hotel-comparison/',
    title: '강원 호텔 비교',
    eyebrow: 'GANGWON HOTEL COMPARISON',
    intro: '강원 호텔은 바다, 산, 스키장, 도심 출장처럼 목적이 넓습니다. 속초, 강릉, 고성, 양양, 춘천, 원주, 평창, 홍천 중 목적지부터 좁히는 것이 좋습니다.',
    purpose: '강원 호텔을 지역별로 먼저 좁힌 뒤 개별 호텔 후기를 비교하기 위한 페이지입니다.',
    intentQuestion: '강원 호텔은 어느 지역부터 비교해야 할까?',
    metaDescription: '강원 호텔을 속초, 강릉, 고성, 양양, 춘천, 원주, 평창, 홍천 권역으로 비교했습니다.',
    criteria: ['강원 권역', '평점', '후기 수', '가격대', '추천 목적'],
    tableColumns: ['권역', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['강원', '강원도', 'gangwon', '속초', '강릉', '고성', '양양', '춘천', '원주', '평창', '홍천']
  }
];

export const gangwonHotels = hotels
  .filter((hotel) => isGangwonHotel(hotel) && /^gangwon-/.test(hotel.slug) && !hasNonGangwonAddress(hotel))
  .sort((a, b) => popularity(b) - popularity(a));

export function getGangwonAreaGuideHotels(guide: GangwonAreaGuide, limit = 20): GangwonAreaGuideHotel[] {
  return gangwonHotels
    .map((hotel) => buildGuideHotel(hotel, guide))
    .filter((item) => item.guideScore > 0)
    .sort((a, b) => b.guideScore - a.guideScore)
    .slice(0, limit);
}

export function getRelatedGangwonAreaGuides(hotel: Hotel) {
  if (!isGangwonHotel(hotel)) return [];
  const text = hotelText(hotel);
  return gangwonAreaGuides
    .map((guide) => ({
      guide,
      score: guide.slug === 'gangwon-hotel-comparison' ? 1 : keywordScore(text, guide.keywords)
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => item.guide);
}

function buildGuideHotel(hotel: Hotel, guide: GangwonAreaGuide): GangwonAreaGuideHotel {
  const text = hotelText(hotel);
  const area = pickAreaLabel(hotel);
  const directScore =
    guide.slug === 'gangwon-hotel-comparison'
      ? 1
      : matchesGuideArea(guide, area)
        ? keywordScore(text, guide.keywords)
        : 0;
  const guideScore = directScore > 0 ? directScore * 10 + popularity(hotel) : 0;
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

function buildReasons(hotel: Hotel, guide: GangwonAreaGuide, area: string) {
  const reasons = [
    `${area} 일정에서 실제 이동 동선과 주차 조건을 함께 비교하기 좋은 후보입니다.`,
    hotel.reviewScore && hotel.reviewScore >= 8.5
      ? '평점이 높은 편이라 후기 기반으로 우선 검토할 만합니다.'
      : '평점과 후기 수를 함께 보며 기대치를 조정하기 좋습니다.',
    hotel.reviewCount && hotel.reviewCount >= 100
      ? '후기 수가 있어 반복되는 장단점을 비교하기 좋습니다.'
      : '후기 수가 많지 않아 객실 타입과 최신 조건을 추가 확인하는 편이 좋습니다.'
  ];

  if (guide.slug.includes('sokcho')) reasons[0] = '속초 해변, 중앙시장, 설악산 동선을 함께 비교하기 좋은 후보입니다.';
  if (guide.slug.includes('gangneung')) reasons[0] = '강릉 해변, 카페거리, 강릉역 이동을 함께 보기 좋은 후보입니다.';
  if (guide.slug.includes('goseong')) reasons[0] = '고성 해변과 조용한 휴식 조건을 함께 보기 좋은 후보입니다.';
  if (guide.slug.includes('yangyang')) reasons[0] = '양양 해변과 서핑 일정, 성수기 주차를 함께 보기 좋은 후보입니다.';
  if (guide.slug.includes('pyeongchang')) reasons[0] = '평창 리조트와 스키장 일정, 부대시설 조건을 함께 보기 좋은 후보입니다.';
  if (guide.slug.includes('hongcheon')) reasons[0] = '홍천 리조트 휴양과 차량 이동 조건을 함께 보기 좋은 후보입니다.';
  return reasons;
}

function buildCaution(hotel: Hotel, guide: GangwonAreaGuide) {
  const firstCon = hotel.analysis.cons[0];
  if (firstCon) return firstCon;
  if (guide.slug.includes('sokcho') || guide.slug.includes('gangneung') || guide.slug.includes('yangyang')) {
    return '해변권 숙소는 성수기 가격, 주차, 객실 전망 보장 여부를 예약 전에 다시 확인하는 것이 좋습니다.';
  }
  if (guide.slug.includes('pyeongchang') || guide.slug.includes('hongcheon')) {
    return '리조트형 숙소는 부대시설 운영 시간과 셔틀, 객실 타입별 포함 혜택을 확인해야 합니다.';
  }
  return '강원 지역은 차량 이동이 중요한 곳이 많아 목적지까지 실제 이동 시간과 주차 조건을 다시 확인해야 합니다.';
}

function buildTarget(guide: GangwonAreaGuide, area: string) {
  if (guide.slug.includes('sokcho')) return '속초 해변·설악산 여행';
  if (guide.slug.includes('gangneung')) return '강릉 바다·카페거리 여행';
  if (guide.slug.includes('goseong')) return '고성 조용한 바다 여행';
  if (guide.slug.includes('yangyang')) return '양양 해변·서핑 여행';
  if (guide.slug.includes('chuncheon')) return '춘천 도심·근교 여행';
  if (guide.slug.includes('wonju')) return '원주 출장·단기 체류';
  if (guide.slug.includes('pyeongchang')) return '평창 리조트·스키 여행';
  if (guide.slug.includes('hongcheon')) return '홍천 가족 리조트 여행';
  return `${area} 호텔 비교`;
}

function buildTableCells(guide: GangwonAreaGuide, area: string, score: string, reviews: string, price: string) {
  if (guide.slug === 'gangwon-hotel-comparison') return [area, score, reviews, price, buildTarget(guide, area)];
  return [`${area} 중심`, score, reviews, price, buildTarget(guide, area)];
}

function pickAreaLabel(hotel: Hotel) {
  const locationText = [hotel.region, hotel.address].join(' ').toLowerCase();
  const locationArea = pickAreaFromText(locationText);
  if (locationArea) return locationArea;

  const text = hotelText(hotel);
  const textArea = pickAreaFromText(text);
  if (textArea) return textArea;
  return '강원';
}

function pickAreaFromText(text: string) {
  if (/강릉|gangneung|경포|안목|주문진|정동진/.test(text)) return '강릉';
  if (/고성|goseong|삼포|화진포|거진|죽왕|현내/.test(text)) return '고성';
  if (/홍천|hongcheon|비발디|오션월드/.test(text)) return '홍천';
  if (/속초|sokcho|청초호|대포항/.test(text)) return '속초';
  if (/양양|yangyang|낙산|하조대|서피비치|서핑/.test(text)) return '양양';
  if (/춘천|chuncheon|남이섬|소양강|공지천/.test(text)) return '춘천';
  if (/원주|wonju|무실동|단계동|혁신도시|기업도시/.test(text)) return '원주';
  if (/평창|pyeongchang|휘닉스|용평|알펜시아|스키/.test(text)) return '평창';
  if (/인제|inje|내린천/.test(text)) return '인제';
  return '';
}

function matchesGuideArea(guide: GangwonAreaGuide, area: string) {
  const guideArea: Record<string, string> = {
    'sokcho-hotels': '속초',
    'gangneung-hotels': '강릉',
    'goseong-hotels': '고성',
    'yangyang-hotels': '양양',
    'chuncheon-hotels': '춘천',
    'wonju-hotels': '원주',
    'pyeongchang-hotels': '평창',
    'hongcheon-hotels': '홍천'
  };
  return guideArea[guide.slug] === area;
}

function keywordScore(text: string, keywords: string[]) {
  return keywords.reduce((sum, keyword) => sum + (text.includes(keyword.toLowerCase()) ? 1 : 0), 0);
}

function hasNonGangwonAddress(hotel: Hotel) {
  return /서울|부산|제주|인천|경기|대구|대전|광주|울산|세종|충청|전라|경상/.test(hotel.address);
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
    ...(analysis?.checkPoints || [])
  ]
    .join(' ')
    .toLowerCase();
}
