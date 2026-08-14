import { activeHotels as hotels } from './hotels';
import type { Hotel } from './hotels';
import { isBusanHotel } from './busanSearchIntents';

export type BusanAreaGuide = {
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

export type BusanAreaGuideHotel = {
  hotel: Hotel;
  guideScore: number;
  reasons: string[];
  caution: string;
  target: string;
  tags: string[];
  tableCells: string[];
};

export const busanAreaGuides: BusanAreaGuide[] = [
  {
    slug: 'haeundae-hotels',
    path: '/busan/haeundae-hotels/',
    title: '해운대 호텔 후기 모음',
    eyebrow: 'HAEUNDAE HOTEL GUIDE',
    intro: '해운대 호텔은 바다 접근, 오션뷰, 센텀 이동, 주차 조건을 함께 봐야 합니다. 성수기에는 가격과 체크인 대기 후기도 선택에 영향을 줍니다.',
    purpose: '해운대 해변과 센텀 일정을 준비하는 사용자를 위한 후기 기반 선택 가이드입니다.',
    intentQuestion: '해운대에서 위치와 후기 균형이 좋은 호텔은 어디일까?',
    metaDescription: '해운대 호텔 후기를 해변 접근, 오션뷰, 센텀, 주차, 조식 기준으로 비교했습니다.',
    criteria: ['해운대 위치', '해변 접근', '오션뷰', '주차', '센텀 이동'],
    tableColumns: ['해운대 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['해운대', '마린시티', '센텀', '동백', '달맞이', 'haeundae', 'centum']
  },
  {
    slug: 'seomyeon-hotels',
    path: '/busan/seomyeon-hotels/',
    title: '서면 호텔 후기 모음',
    eyebrow: 'SEOMYEON HOTEL GUIDE',
    intro: '서면 호텔은 지하철 환승, 식당, 쇼핑 접근성이 강점입니다. 해변 휴양보다 부산 전역 이동 효율과 도심 편의성을 중심으로 비교하는 편이 좋습니다.',
    purpose: '부산 도심 여행과 대중교통 이동을 중시하는 사용자를 위한 페이지입니다.',
    intentQuestion: '서면에서 교통과 주변 편의가 좋은 호텔은 어디일까?',
    metaDescription: '서면 호텔 후기를 교통, 맛집, 쇼핑, 객실, 주차 기준으로 비교했습니다.',
    criteria: ['서면 위치', '지하철 접근', '맛집', '쇼핑', '도심 이동'],
    tableColumns: ['서면 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['서면', '부산진구', '전포', '범천', 'seomyeon', 'jeonpo']
  },
  {
    slug: 'busan-station-hotels',
    path: '/busan/busan-station-hotels/',
    title: '부산역 호텔 후기 모음',
    eyebrow: 'BUSAN STATION HOTEL GUIDE',
    intro: '부산역 호텔은 KTX 도착 전후 1박, 출장, 짧은 숙박에서 자주 비교됩니다. 남포동과 영도 이동은 편하지만 해운대까지는 시간이 걸릴 수 있습니다.',
    purpose: 'KTX 이용자와 짧은 부산 숙박을 준비하는 사용자를 위한 선택 가이드입니다.',
    intentQuestion: '부산역 근처에서 이동이 편한 호텔은 어디일까?',
    metaDescription: '부산역 호텔 후기를 KTX 접근, 출장, 짧은 숙박, 주차, 가격대 기준으로 비교했습니다.',
    criteria: ['부산역 접근', 'KTX', '출장', '짧은 숙박', '남포동 이동'],
    tableColumns: ['부산역 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['부산역', '동구', '초량', '중앙대로', 'busan station', 'choryang']
  },
  {
    slug: 'gwangalli-hotels',
    path: '/busan/gwangalli-hotels/',
    title: '광안리 호텔 후기 모음',
    eyebrow: 'GWANGALLI HOTEL GUIDE',
    intro: '광안리 호텔은 광안대교 야경, 해변 산책, 카페와 식당 접근성이 핵심입니다. 주말에는 주차와 소음, 오션뷰 객실 타입을 함께 확인해야 합니다.',
    purpose: '광안리 해변과 야경을 중심으로 숙소를 찾는 사용자를 위한 페이지입니다.',
    intentQuestion: '광안리에서 야경과 위치가 좋은 호텔은 어디일까?',
    metaDescription: '광안리 호텔 후기를 광안대교, 해변, 오션뷰, 주차, 커플 여행 기준으로 비교했습니다.',
    criteria: ['광안리 위치', '광안대교', '해변 산책', '오션뷰', '주차'],
    tableColumns: ['광안리 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['광안리', '수영구', '광안', '민락', '광안대교', 'gwangalli', 'gwangan']
  },
  {
    slug: 'nampo-jagalchi-hotels',
    path: '/busan/nampo-jagalchi-hotels/',
    title: '남포동 자갈치 호텔 후기 모음',
    eyebrow: 'NAMPO & JAGALCHI GUIDE',
    intro: '남포동과 자갈치 주변 호텔은 시장 관광, 영도, 부산역 이동과 함께 보기 좋습니다. 해변 휴양보다 도심 관광과 먹거리 동선에 초점을 맞춰 비교합니다.',
    purpose: '남포동, 자갈치, 국제시장, 영도 일정을 준비하는 사용자를 위한 선택 가이드입니다.',
    intentQuestion: '남포동과 자갈치 일정에 맞는 호텔은 어디일까?',
    metaDescription: '남포동 자갈치 호텔 후기를 시장 관광, 영도, 부산역 접근, 주차, 가격대 기준으로 비교했습니다.',
    criteria: ['남포동', '자갈치', '국제시장', '영도', '부산역 이동'],
    tableColumns: ['남포 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['남포', '자갈치', '광복', '중구', '영도', '국제시장', 'nampo', 'jagalchi', 'yeongdo']
  },
  {
    slug: 'gijang-hotels',
    path: '/busan/gijang-hotels/',
    title: '기장 호텔 후기 모음',
    eyebrow: 'GIJANG HOTEL GUIDE',
    intro: '기장 호텔은 오시리아, 송정, 해안 드라이브, 가족 여행 일정과 연결됩니다. 도심과는 거리가 있어 차량 이동과 주차 조건을 함께 보는 편이 좋습니다.',
    purpose: '기장과 오시리아, 송정 일정을 준비하는 사용자를 위한 후기 기반 비교 페이지입니다.',
    intentQuestion: '기장과 오시리아 일정에 맞는 호텔은 어디일까?',
    metaDescription: '기장 호텔 후기를 오시리아, 송정, 가족 여행, 차량 이동, 주차 기준으로 비교했습니다.',
    criteria: ['기장 위치', '오시리아', '송정', '가족 여행', '차량 이동'],
    tableColumns: ['기장 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['기장', '송정', '오시리아', '롯데월드', 'gijang', 'songjeong', 'osiria']
  },
  {
    slug: 'busan-ocean-view-hotels',
    path: '/busan/busan-ocean-view-hotels/',
    title: '부산 오션뷰 호텔 후기 모음',
    eyebrow: 'BUSAN OCEAN VIEW GUIDE',
    intro: '부산 오션뷰 호텔은 해운대, 광안리, 송도, 기장처럼 지역마다 분위기가 다릅니다. 객실 타입과 층수에 따라 전망 체감이 달라질 수 있습니다.',
    purpose: '바다 전망을 중시하는 사용자가 예약 전 기대치를 조정할 수 있도록 정리한 페이지입니다.',
    intentQuestion: '부산에서 오션뷰 기대가 가능한 호텔은 어디일까?',
    metaDescription: '부산 오션뷰 호텔 후기를 바다 전망, 객실 타입, 해변 접근, 가격대, 주의점 기준으로 비교했습니다.',
    criteria: ['오션뷰 가능성', '객실 타입', '해변 접근', '가격대', '주의점'],
    tableColumns: ['전망 기대', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['오션', '바다', '해변', '해운대', '광안리', '광안대교', '송도', 'ocean', 'sea', 'beach']
  },
  {
    slug: 'busan-hotel-comparison',
    path: '/busan/busan-hotel-comparison/',
    title: '부산 호텔 비교',
    eyebrow: 'BUSAN HOTEL COMPARISON',
    intro: '부산 호텔은 해운대, 서면, 부산역, 광안리, 남포동, 기장처럼 지역별 목적이 뚜렷합니다. 먼저 여행 동선을 정한 뒤 개별 호텔을 비교하는 것이 좋습니다.',
    purpose: '부산 호텔을 지역과 목적별로 먼저 좁힌 뒤 개별 호텔 후기를 비교하기 위한 페이지입니다.',
    intentQuestion: '부산 호텔은 어느 지역부터 비교해야 할까?',
    metaDescription: '부산 호텔을 해운대, 서면, 부산역, 광안리, 남포동, 기장, 오션뷰 기준으로 비교했습니다.',
    criteria: ['부산 지역', '평점', '후기 수', '가격대', '추천 목적'],
    tableColumns: ['지역', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['부산', '해운대', '서면', '부산역', '광안리', '남포', '기장', 'busan']
  }
];

export const busanHotels = hotels
  .filter(isBusanHotel)
  .sort((a, b) => popularity(b) - popularity(a));

export function getBusanAreaGuideHotels(guide: BusanAreaGuide, limit = 20): BusanAreaGuideHotel[] {
  return busanHotels
    .map((hotel) => buildGuideHotel(hotel, guide))
    .filter((item) => item.guideScore > 0)
    .sort((a, b) => b.guideScore - a.guideScore)
    .slice(0, limit);
}

export function getRelatedBusanAreaGuides(hotel: Hotel) {
  if (!isBusanHotel(hotel)) return [];
  const text = hotelText(hotel);
  return busanAreaGuides
    .map((guide) => ({
      guide,
      score: guide.slug === 'busan-hotel-comparison' ? 1 : keywordScore(text, guide.keywords)
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => item.guide);
}

function buildGuideHotel(hotel: Hotel, guide: BusanAreaGuide): BusanAreaGuideHotel {
  const text = hotelText(hotel);
  const directScore = guide.slug === 'busan-hotel-comparison' ? 1 : keywordScore(text, guide.keywords);
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

function buildReasons(hotel: Hotel, guide: BusanAreaGuide, area: string) {
  const reasons = [
    `${area} 일정에서 실제 이동 동선과 주차 조건을 함께 비교하기 좋은 후보입니다.`,
    hotel.reviewScore && hotel.reviewScore >= 8.6
      ? '평점이 높은 편이라 후기 기반으로 우선 검토할 만합니다.'
      : '평점과 후기 수를 함께 보면서 기대치를 조정하기 좋습니다.',
    hotel.reviewCount && hotel.reviewCount >= 1000
      ? '후기 수가 충분해 반복되는 장단점을 비교하기 좋습니다.'
      : '후기 수가 많지 않아 객실 타입과 최신 조건을 추가 확인하는 편이 좋습니다.'
  ];

  if (guide.slug.includes('haeundae')) reasons[0] = '해운대 해변, 센텀, 오션뷰 조건을 함께 비교하기 좋은 후보입니다.';
  if (guide.slug.includes('station')) reasons[0] = '부산역과 KTX 이동 전후 1박 조건을 함께 보기 좋은 후보입니다.';
  if (guide.slug.includes('gwangalli')) reasons[0] = '광안리 해변과 광안대교 야경 일정을 함께 보기 좋은 후보입니다.';
  if (guide.slug.includes('ocean')) reasons[0] = '바다 접근이나 전망 기대치를 확인하며 비교하기 좋은 후보입니다.';
  return reasons;
}

function buildCaution(hotel: Hotel, guide: BusanAreaGuide) {
  if (guide.slug.includes('haeundae')) return '성수기에는 가격, 주차, 체크인 대기 후기를 함께 확인하세요.';
  if (guide.slug.includes('ocean')) return '오션뷰는 객실 타입과 층수에 따라 체감이 달라질 수 있습니다.';
  if (guide.slug.includes('station')) return '해운대나 광안리까지는 이동 시간이 걸릴 수 있습니다.';
  if (guide.slug.includes('gijang')) return '차량 이동과 주차 조건을 함께 보는 것이 좋습니다.';
  if (hotel.reviewCount && hotel.reviewCount < 100) return '후기 데이터가 적어 최신 객실 상태를 추가 확인하는 편이 좋습니다.';
  return '부산 숙소는 목적지와 숙소 지역이 맞는지 먼저 확인하는 것이 좋습니다.';
}

function buildTarget(guide: BusanAreaGuide, area: string) {
  if (guide.slug.includes('haeundae')) return '해운대 해변 여행자';
  if (guide.slug.includes('seomyeon')) return '도심 이동 중심 여행자';
  if (guide.slug.includes('station')) return 'KTX·출장 여행자';
  if (guide.slug.includes('gwangalli')) return '광안리 야경 여행자';
  if (guide.slug.includes('nampo')) return '시장·영도 일정 여행자';
  if (guide.slug.includes('gijang')) return '기장·오시리아 가족 여행자';
  if (guide.slug.includes('ocean')) return '바다 전망 중시 여행자';
  return `${area} 일정 여행자`;
}

function buildTableCells(guide: BusanAreaGuide, area: string, score: string, reviews: string, price: string) {
  const first = guide.slug.includes('comparison') ? area : `${area} 중심`;
  return [first, score, reviews, price, buildTarget(guide, area)];
}

function pickAreaLabel(hotel: Hotel) {
  const text = hotelText(hotel);
  if (/해운대|마린시티|센텀|haeundae|centum/i.test(text)) return '해운대';
  if (/서면|부산진구|전포|seomyeon/i.test(text)) return '서면';
  if (/부산역|초량|동구|busan station/i.test(text)) return '부산역';
  if (/광안리|수영구|광안|gwangalli|gwangan/i.test(text)) return '광안리';
  if (/남포|자갈치|영도|nampo|jagalchi|yeongdo/i.test(text)) return '남포동';
  if (/기장|송정|오시리아|gijang|songjeong|osiria/i.test(text)) return '기장';
  if (/송도|암남|songdo/i.test(text)) return '송도';
  return '부산';
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
