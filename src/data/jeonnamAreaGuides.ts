import { activeHotels as hotels } from './hotels';
import type { Hotel } from './hotels';
import { isJeonnamHotel } from './jeonnamSearchIntents';

export type JeonnamAreaGuide = {
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

export type JeonnamAreaGuideHotel = {
  hotel: Hotel;
  guideScore: number;
  reasons: string[];
  caution: string;
  target: string;
  tags: string[];
  tableCells: string[];
};

export const jeonnamAreaGuides: JeonnamAreaGuide[] = [
  {
    slug: 'yeosu-hotels',
    path: '/jeonnam/yeosu-hotels/',
    title: '여수 호텔 후기 모음',
    eyebrow: 'YEOSU HOTEL GUIDE',
    intro: '여수 호텔은 엑스포역, 오동도, 돌산, 해상케이블카 동선에 따라 만족도가 달라집니다. 오션뷰 기대치, 주차, 체크인, 조식 조건을 함께 비교합니다.',
    purpose: '여수 여행에서 바다 전망과 관광지 접근성을 함께 보고 숙소를 고르려는 사용자를 위한 페이지입니다.',
    intentQuestion: '여수에서 오션뷰와 이동 동선이 좋은 호텔은 어디일까?',
    metaDescription: '여수 호텔 후기를 오션뷰, 엑스포역, 오동도, 돌산, 주차, 조식 기준으로 비교했습니다.',
    criteria: ['여수 위치', '오션뷰', '엑스포역', '주차', '조식'],
    tableColumns: ['여수 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['여수', '돌산', '오동도', '엑스포', '여천', '해상케이블카', 'yeosu']
  },
  {
    slug: 'mokpo-hotels',
    path: '/jeonnam/mokpo-hotels/',
    title: '목포 호텔 후기 모음',
    eyebrow: 'MOKPO HOTEL GUIDE',
    intro: '목포 호텔은 평화광장, 갓바위, 목포역, 남악권 중 어디를 중심으로 움직이는지에 따라 선택 기준이 달라집니다. 야경, 식당 접근성, 주차, 가성비를 함께 봅니다.',
    purpose: '목포 여행이나 출장에서 평화광장과 목포역 이동을 함께 고려하는 사용자를 위한 페이지입니다.',
    intentQuestion: '목포에서 위치와 가성비를 함께 보기 좋은 호텔은 어디일까?',
    metaDescription: '목포 호텔 후기를 평화광장, 갓바위, 목포역, 주차, 가성비 기준으로 비교했습니다.',
    criteria: ['목포 위치', '평화광장', '목포역', '주차', '가성비'],
    tableColumns: ['목포 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['목포', '평화광장', '갓바위', '하당', '남악', 'mokpo']
  },
  {
    slug: 'suncheon-hotels',
    path: '/jeonnam/suncheon-hotels/',
    title: '순천 호텔 후기 모음',
    eyebrow: 'SUNCHEON HOTEL GUIDE',
    intro: '순천 호텔은 순천역 접근형과 순천만국가정원·순천만습지 방문형으로 나눠 보는 편이 좋습니다. 대중교통, 차량 이동, 주차, 조용함을 함께 비교합니다.',
    purpose: '순천만국가정원과 순천역 동선을 기준으로 숙소를 고르려는 사용자를 위한 페이지입니다.',
    intentQuestion: '순천에서 순천만과 역 접근성을 함께 보기 좋은 숙소는 어디일까?',
    metaDescription: '순천 호텔 후기를 순천역, 순천만국가정원, 순천만습지, 주차, 체크인 기준으로 비교했습니다.',
    criteria: ['순천 위치', '순천만', '순천역', '주차', '체크인'],
    tableColumns: ['순천 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['순천', '순천만', '국가정원', '순천역', 'suncheon']
  },
  {
    slug: 'damyang-hotels',
    path: '/jeonnam/damyang-hotels/',
    title: '담양 호텔 펜션 후기 모음',
    eyebrow: 'DAMYANG STAY GUIDE',
    intro: '담양 숙소는 호텔보다 한옥, 펜션, 가족형 숙소가 함께 검색됩니다. 죽녹원, 메타세쿼이아길, 주차, 객실 구성, 조용함을 함께 봐야 합니다.',
    purpose: '담양 가족 여행이나 전남 근교 1박을 준비하는 사용자를 위한 페이지입니다.',
    intentQuestion: '담양에서 가족 여행과 주차가 편한 숙소는 어디일까?',
    metaDescription: '담양 호텔과 펜션 후기를 죽녹원, 메타세쿼이아길, 가족 여행, 주차, 객실 기준으로 비교했습니다.',
    criteria: ['담양 위치', '죽녹원', '가족 여행', '주차', '객실'],
    tableColumns: ['담양 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['담양', '죽녹원', '메타', '한옥', 'damyang']
  },
  {
    slug: 'wando-haenam-shinan-hotels',
    path: '/jeonnam/wando-haenam-shinan-hotels/',
    title: '완도 해남 신안 호텔 후기 모음',
    eyebrow: 'SOUTH COAST GUIDE',
    intro: '완도, 해남, 신안권 숙소는 항구 이동, 섬 여행, 해안 드라이브와 함께 봐야 합니다. 오션뷰, 주차, 주변 식당, 체크인 시간을 중심으로 비교합니다.',
    purpose: '전남 해안권과 섬 여행을 준비하는 사용자를 위한 페이지입니다.',
    intentQuestion: '전남 해안권에서 항구 이동과 전망을 함께 보기 좋은 숙소는 어디일까?',
    metaDescription: '완도, 해남, 신안, 무안 호텔 후기를 항구 이동, 오션뷰, 주차, 가족 여행 기준으로 비교했습니다.',
    criteria: ['해안권 위치', '항구 이동', '오션뷰', '주차', '가족 여행'],
    tableColumns: ['해안권 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['완도', '해남', '신안', '자은도', '무안', '진도', 'wando', 'haenam', 'sinan']
  },
  {
    slug: 'gwangyang-naju-hotels',
    path: '/jeonnam/gwangyang-naju-hotels/',
    title: '광양 나주 전남 내륙 호텔 후기 모음',
    eyebrow: 'JEONNAM BUSINESS GUIDE',
    intro: '광양, 나주, 화순, 구례, 보성권 숙소는 관광보다 출장, 차량 이동, 전남 내륙 거점 성격이 강합니다. 주차, 조식, 객실 컨디션, 목적지 이동 시간을 봅니다.',
    purpose: '전남 출장이나 내륙 이동 거점 숙소를 찾는 사용자를 위한 페이지입니다.',
    intentQuestion: '전남 내륙에서 출장과 차량 이동에 맞는 호텔은 어디일까?',
    metaDescription: '광양, 나주, 화순, 구례, 보성 호텔 후기를 출장, 주차, 조식, 이동 동선 기준으로 비교했습니다.',
    criteria: ['전남 내륙', '출장', '주차', '조식', '차량 이동'],
    tableColumns: ['내륙 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['광양', '나주', '화순', '구례', '보성', '고흥', '강진', '장흥', 'gwangyang', 'naju']
  },
  {
    slug: 'jeonnam-ocean-view-hotels',
    path: '/jeonnam/jeonnam-ocean-view-hotels/',
    title: '전남 오션뷰 호텔 후기 모음',
    eyebrow: 'JEONNAM OCEAN VIEW',
    intro: '전남 오션뷰 숙소는 여수, 목포, 완도, 신안권에 많이 분포합니다. 객실 타입에 따라 전망 체감이 달라지므로 오션뷰 표기와 위치를 함께 봐야 합니다.',
    purpose: '전남에서 바다 전망 숙소를 찾는 사용자를 위한 페이지입니다.',
    intentQuestion: '전남에서 오션뷰 기대가 가능한 호텔은 어디일까?',
    metaDescription: '전남 오션뷰 호텔 후기를 여수, 목포, 완도, 신안, 객실 전망, 주차 기준으로 비교했습니다.',
    criteria: ['오션뷰', '바다 접근', '객실 전망', '주차', '가격대'],
    tableColumns: ['전망 기대', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['오션', '바다', '해변', '오션뷰', '여수', '목포', '완도', '신안', '돌산', 'ocean', 'sea']
  },
  {
    slug: 'jeonnam-hotel-comparison',
    path: '/jeonnam/jeonnam-hotel-comparison/',
    title: '전남 호텔 비교',
    eyebrow: 'JEONNAM HOTEL COMPARISON',
    intro: '전남 호텔은 여수, 목포, 순천, 담양, 완도·해남·신안, 광양·나주처럼 목적지가 넓게 나뉩니다. 먼저 여행지를 좁힌 뒤 가격과 후기, 이동 조건을 비교하는 편이 좋습니다.',
    purpose: '전남 호텔을 지역별로 먼저 나눈 뒤 개별 후기를 비교하기 위한 페이지입니다.',
    intentQuestion: '전남 호텔은 어느 지역부터 비교해야 할까?',
    metaDescription: '전남 호텔을 여수, 목포, 순천, 담양, 완도, 신안, 광양, 나주 권역으로 나눠 비교했습니다.',
    criteria: ['전남 권역', '평점', '후기 수', '가격대', '추천 목적'],
    tableColumns: ['권역', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['전남', '전라남도', '여수', '목포', '순천', '담양', '완도', '해남', '신안', '광양', '나주', 'jeonnam']
  }
];

export const jeonnamHotels = hotels
  .filter((hotel) => isJeonnamHotel(hotel) && /^jeonnam-/.test(hotel.slug))
  .sort((a, b) => popularity(b) - popularity(a));

export function getJeonnamAreaGuideHotels(guide: JeonnamAreaGuide, limit = 20): JeonnamAreaGuideHotel[] {
  return jeonnamHotels
    .map((hotel) => buildGuideHotel(hotel, guide))
    .filter((item) => item.guideScore > 0)
    .sort((a, b) => b.guideScore - a.guideScore)
    .slice(0, limit);
}

export function getRelatedJeonnamAreaGuides(hotel: Hotel) {
  if (!isJeonnamHotel(hotel)) return [];
  const text = hotelText(hotel);
  return jeonnamAreaGuides
    .map((guide) => ({
      guide,
      score: guide.slug === 'jeonnam-hotel-comparison' ? 1 : keywordScore(text, guide.keywords)
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => item.guide);
}

function buildGuideHotel(hotel: Hotel, guide: JeonnamAreaGuide): JeonnamAreaGuideHotel {
  const text = hotelText(hotel);
  const area = pickAreaLabel(hotel);
  const guideScore =
    guide.slug === 'jeonnam-hotel-comparison'
      ? 1 + popularity(hotel)
      : keywordScore(text, guide.keywords) * 10 + popularity(hotel);

  return {
    hotel,
    guideScore,
    reasons: buildReasons(hotel, guide, area),
    caution: buildCaution(hotel, guide),
    target: buildTarget(guide, area),
    tags: [...new Set([area, ...guide.criteria.slice(0, 3)])].slice(0, 5),
    tableCells: buildTableCells(guide, area, scoreText(hotel), reviewText(hotel), priceText(hotel))
  };
}

function buildReasons(hotel: Hotel, guide: JeonnamAreaGuide, area: string) {
  const reasons = [
    `${area} 일정에서 실제 이동 동선과 주차 조건을 함께 비교하기 좋은 후보입니다.`,
    hotel.reviewScore && hotel.reviewScore >= 8.5
      ? '평점이 높은 편이라 후기 기반으로 우선 검토할 만합니다.'
      : '평점과 가격, 위치를 함께 보며 기대치를 조정하기 좋습니다.',
    hotel.reviewCount && hotel.reviewCount >= 500
      ? '후기 수가 많아 반복되는 장단점을 비교하기 좋습니다.'
      : '후기 수가 아주 많지는 않아 최신 객실 상태와 운영 조건을 추가로 확인하는 편이 좋습니다.'
  ];

  if (guide.slug.includes('yeosu')) reasons[0] = '여수 관광지 접근성, 오션뷰 기대치, 돌산·엑스포역 동선을 함께 보기 좋은 후보입니다.';
  if (guide.slug.includes('mokpo')) reasons[0] = '목포 평화광장, 갓바위, 목포역 이동과 주변 식당 접근성을 함께 보기 좋은 후보입니다.';
  if (guide.slug.includes('suncheon')) reasons[0] = '순천역, 순천만국가정원, 순천만습지 동선을 함께 비교하기 좋은 후보입니다.';
  if (guide.slug.includes('damyang')) reasons[0] = '담양 관광지와 가족형 객실, 주차 조건을 함께 확인하기 좋은 후보입니다.';
  if (guide.slug.includes('ocean')) reasons[0] = '전남 바다 전망과 객실 타입, 주차 조건을 함께 비교하기 좋은 후보입니다.';
  return reasons;
}

function buildCaution(hotel: Hotel, guide: JeonnamAreaGuide) {
  const firstCon = hotel.analysis.cons[0];
  if (firstCon) return firstCon;
  if (guide.slug.includes('yeosu') || guide.slug.includes('ocean')) {
    return '오션뷰는 객실 타입과 층수에 따라 달라질 수 있어 전망 보장 여부를 예약 전에 확인해야 합니다.';
  }
  if (guide.slug.includes('wando')) {
    return '해안권 숙소는 항구나 관광지까지 차량 이동 시간이 길 수 있어 실제 동선을 먼저 확인해야 합니다.';
  }
  return '전남은 지역 간 거리가 넓어 목적지까지 실제 이동 시간과 주차 조건을 다시 확인하는 편이 좋습니다.';
}

function buildTarget(guide: JeonnamAreaGuide, area: string) {
  if (guide.slug.includes('yeosu')) return '여수 오션뷰·관광 여행';
  if (guide.slug.includes('mokpo')) return '목포 평화광장·가성비 여행';
  if (guide.slug.includes('suncheon')) return '순천만·국가정원 여행';
  if (guide.slug.includes('damyang')) return '담양 가족·한옥 여행';
  if (guide.slug.includes('wando')) return '전남 해안·섬 여행';
  if (guide.slug.includes('gwangyang')) return '전남 출장·내륙 이동';
  if (guide.slug.includes('ocean')) return '전남 오션뷰 여행';
  return `${area} 여행`;
}

function buildTableCells(guide: JeonnamAreaGuide, area: string, score: string, reviews: string, price: string) {
  return [guide.slug === 'jeonnam-hotel-comparison' ? area : `${area}권`, score, reviews, price, buildTarget(guide, area)];
}

function pickAreaLabel(hotel: Hotel) {
  const text = hotelText(hotel);
  if (/여수|돌산|오동도|엑스포|여천/i.test(text)) return '여수';
  if (/목포|평화광장|갓바위|하당|남악/i.test(text)) return '목포';
  if (/순천|순천만|국가정원/i.test(text)) return '순천';
  if (/담양|죽녹원|메타/i.test(text)) return '담양';
  if (/완도|해남|신안|자은도|무안|진도/i.test(text)) return '전남 해안권';
  if (/광양|나주|화순|구례|보성|고흥|강진|장흥/i.test(text)) return '전남 내륙권';
  return '전남';
}

function hotelText(hotel: Hotel) {
  const analysis = hotel.analysis;
  return [
    hotel.slug,
    hotel.hotelName,
    hotel.region,
    hotel.address,
    analysis?.summary,
    analysis?.seoTitle,
    analysis?.metaDescription,
    analysis?.pros?.join(' '),
    analysis?.cons?.join(' '),
    analysis?.recommendedFor?.join(' '),
    analysis?.checkPoints?.join(' ')
  ].join(' ');
}

function keywordScore(text: string, keywords: string[]) {
  const lower = text.toLowerCase();
  return keywords.reduce((sum, keyword) => sum + (lower.includes(keyword.toLowerCase()) ? 1 : 0), 0);
}

function popularity(hotel: Hotel) {
  return (hotel.reviewScore || 0) * 3 + Math.log10((hotel.reviewCount || 0) + 1);
}

function priceText(hotel: Hotel) {
  const price = hotel.averageNightlyRate ?? hotel.dailyRate;
  return price ? `${price.toLocaleString('ko-KR')}원~` : '가격 확인';
}

function scoreText(hotel: Hotel) {
  return hotel.reviewScore ? `${hotel.reviewScore}` : '확인 필요';
}

function reviewText(hotel: Hotel) {
  return hotel.reviewCount ? `${hotel.reviewCount.toLocaleString('ko-KR')}건` : '후기 부족';
}
