import { activeHotels as hotels } from './hotels';
import type { Hotel } from './hotels';
import { isUlsanHotel } from './ulsanSearchIntents';

export type UlsanAreaGuide = {
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

export type UlsanAreaGuideHotel = {
  hotel: Hotel;
  guideScore: number;
  reasons: string[];
  caution: string;
  target: string;
  tags: string[];
  tableCells: string[];
};

export const ulsanAreaGuides: UlsanAreaGuide[] = [
  {
    slug: 'samsan-hotels',
    path: '/ulsan/samsan-hotels/',
    title: '울산 삼산동 호텔 후기 모음 출장 체크인 주차 조식',
    eyebrow: 'SAMSAN GUIDE',
    intro: '울산 삼산동 호텔은 출장, 태화강역 이동, 시외버스터미널 일정, 번화가 접근성을 함께 봐야 합니다. 주차와 조식 조건도 예약 전 비교 포인트입니다.',
    purpose: '울산 도심 출장이나 삼산동 일정에 맞는 숙소를 찾는 사용자를 위한 페이지입니다.',
    intentQuestion: '울산 삼산동 호텔은 출장 동선과 주차 중 무엇을 먼저 봐야 할까요?',
    metaDescription: '울산 삼산동 호텔 후기를 출장, 체크인, 주차, 조식, 태화강역 이동 기준으로 비교했습니다.',
    criteria: ['삼산동 접근', '출장 동선', '주차', '조식', '가성비'],
    tableColumns: ['삼산 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['삼산', '달동', '태화강', '시외버스터미널', '고속버스터미널', '출장']
  },
  {
    slug: 'ilsan-beach-hotels',
    path: '/ulsan/ilsan-beach-hotels/',
    title: '울산 일산해수욕장 호텔 후기 모음 오션뷰 주차 커플 가족',
    eyebrow: 'ILSAND BEACH GUIDE',
    intro: '울산 일산해수욕장 호텔은 바다 접근성, 대왕암공원 일정, 객실 전망, 주차 조건을 함께 봐야 만족도가 달라집니다.',
    purpose: '일산해수욕장, 대왕암공원, 방어진 일정을 준비하는 여행자를 위한 페이지입니다.',
    intentQuestion: '울산 일산해수욕장 호텔은 오션뷰와 이동 동선 중 무엇을 먼저 봐야 할까요?',
    metaDescription: '울산 일산해수욕장 호텔 후기를 오션뷰, 대왕암공원, 주차, 커플·가족 여행 기준으로 비교했습니다.',
    criteria: ['일산해수욕장', '오션뷰', '대왕암공원', '주차', '커플·가족'],
    tableColumns: ['해변 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['일산', '일산해수욕장', '대왕암', '방어진', '동구', '정자해수욕장', '오션뷰']
  },
  {
    slug: 'ktx-station-hotels',
    path: '/ulsan/ktx-station-hotels/',
    title: '울산 KTX역 호텔 후기 모음 교통 출장 체크인 주차',
    eyebrow: 'KTX STATION GUIDE',
    intro: '울산 KTX역 호텔은 열차 이동, 언양·울주 일정, 렌터카 이동, 체크인 시간을 기준으로 비교하는 편이 좋습니다.',
    purpose: 'KTX로 울산에 도착하거나 울주·언양 일정을 준비하는 사용자를 위한 페이지입니다.',
    intentQuestion: '울산 KTX역 호텔은 역 접근성과 차량 이동 중 무엇이 더 중요할까요?',
    metaDescription: '울산 KTX역 호텔 후기를 교통, 출장, 체크인, 주차, 언양·울주 이동 기준으로 비교했습니다.',
    criteria: ['KTX 접근', '렌터카 이동', '출장', '주차', '체크인'],
    tableColumns: ['역 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['KTX', '울산역', '언양', '울주', '삼남', '교통']
  },
  {
    slug: 'ganjeolgot-hotels',
    path: '/ulsan/ganjeolgot-hotels/',
    title: '울산 간절곶 호텔 펜션 후기 모음 오션뷰 일출 가족 주차',
    eyebrow: 'GANJEOLGOT GUIDE',
    intro: '울산 간절곶 숙소는 일출 일정, 오션뷰 기대치, 차량 이동, 펜션형 시설 차이를 함께 확인해야 합니다.',
    purpose: '간절곶 일출 여행이나 울주 해안 숙박을 준비하는 여행자를 위한 페이지입니다.',
    intentQuestion: '울산 간절곶 숙소는 오션뷰와 차량 이동 중 무엇을 먼저 확인해야 할까요?',
    metaDescription: '울산 간절곶 호텔과 펜션 후기를 오션뷰, 일출, 가족 여행, 주차 기준으로 비교했습니다.',
    criteria: ['간절곶', '일출', '오션뷰', '펜션', '주차'],
    tableColumns: ['간절곶 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['간절곶', '서생', '일출', '오션뷰', '펜션', '울주']
  },
  {
    slug: 'yeongnam-alps-hotels',
    path: '/ulsan/yeongnam-alps-hotels/',
    title: '울산 영남알프스 호텔 후기 모음 온천 가족 주차 가성비',
    eyebrow: 'YEONGNAM ALPS GUIDE',
    intro: '울산 영남알프스 숙소는 산행 동선, 온천·휴식 목적, 차량 이동, 주변 식당 접근성을 함께 보는 것이 좋습니다.',
    purpose: '영남알프스 산행, 간월재, 온천 휴식 일정을 준비하는 여행자를 위한 페이지입니다.',
    intentQuestion: '울산 영남알프스 숙소는 산행 동선과 온천·휴식 조건 중 무엇을 봐야 할까요?',
    metaDescription: '울산 영남알프스 호텔 후기를 온천, 산행, 가족 여행, 주차, 가성비 기준으로 비교했습니다.',
    criteria: ['영남알프스', '온천', '산행', '주차', '가족'],
    tableColumns: ['산행 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['영남알프스', '간월재', '배내골', '온천', '상북', '언양']
  },
  {
    slug: 'jangsaengpo-hotels',
    path: '/ulsan/jangsaengpo-hotels/',
    title: '울산 장생포 호텔 후기 모음 고래문화마을 가족 주차 위치',
    eyebrow: 'JANGSAENGPO GUIDE',
    intro: '울산 장생포 호텔은 고래문화마을, 장생포항, 가족 일정, 주차와 차량 이동 조건을 함께 확인해야 합니다.',
    purpose: '장생포 고래문화마을과 남구 해안 일정을 준비하는 여행자를 위한 페이지입니다.',
    intentQuestion: '울산 장생포 호텔은 가족 일정과 차량 이동 조건 중 무엇이 중요할까요?',
    metaDescription: '울산 장생포 호텔 후기를 고래문화마을, 가족 여행, 주차, 위치 기준으로 비교했습니다.',
    criteria: ['장생포', '고래문화마을', '가족', '주차', '위치'],
    tableColumns: ['장생포 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['장생포', '고래문화마을', '장생포항', '남구', '가족']
  },
  {
    slug: 'ulsan-family-hotels',
    path: '/ulsan/ulsan-family-hotels/',
    title: '울산 가족호텔 후기 모음 주차 객실 오션뷰 체크인',
    eyebrow: 'ULSAN FAMILY GUIDE',
    intro: '울산 가족 숙소는 객실 구성, 주차, 주변 이동, 해변 접근성, 체크인 편의성을 함께 비교해야 합니다.',
    purpose: '아이 동반 울산 여행이나 가족 단위 숙박을 준비하는 사용자를 위한 페이지입니다.',
    intentQuestion: '울산 가족호텔은 객실과 주차, 이동 동선 중 무엇을 먼저 봐야 할까요?',
    metaDescription: '울산 가족호텔 후기를 주차, 객실, 오션뷰, 체크인, 주변 이동 기준으로 비교했습니다.',
    criteria: ['가족', '객실', '주차', '오션뷰', '체크인'],
    tableColumns: ['가족 동선', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['가족', '키즈', '풀빌라', '펜션', '오션뷰', '주차', '일산', '간절곶']
  },
  {
    slug: 'ulsan-hotel-comparison',
    path: '/ulsan/ulsan-hotel-comparison/',
    title: '울산 호텔 비교 후기 모음 삼산 일산해수욕장 KTX역 간절곶',
    eyebrow: 'ULSAN HOTEL COMPARISON',
    intro: '울산 호텔은 삼산동 도심, 일산해수욕장, KTX역, 간절곶, 영남알프스처럼 목적지가 나뉩니다. 먼저 여행 목적지를 정한 뒤 후기와 조건을 비교하는 것이 좋습니다.',
    purpose: '울산 전체 호텔을 주요 권역과 여행 목적별로 비교하기 위한 페이지입니다.',
    intentQuestion: '울산 호텔은 어느 권역부터 비교하는 것이 좋을까요?',
    metaDescription: '울산 호텔을 삼산동, 일산해수욕장, KTX역, 간절곶, 영남알프스 기준으로 비교했습니다.',
    criteria: ['권역', '평점', '후기 수', '가격대', '추천 목적'],
    tableColumns: ['권역', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['울산', '삼산', '일산', 'KTX', '간절곶', '영남알프스', '장생포']
  }
];

export const ulsanHotels = hotels
  .filter((hotel) => isUlsanHotel(hotel) && /^ulsan-/.test(hotel.slug))
  .sort((a, b) => popularity(b) - popularity(a));

export function getUlsanAreaGuideHotels(guide: UlsanAreaGuide, limit = 20): UlsanAreaGuideHotel[] {
  return ulsanHotels
    .map((hotel) => buildGuideHotel(hotel, guide))
    .filter((item) => item.guideScore > 0)
    .sort((a, b) => b.guideScore - a.guideScore)
    .slice(0, limit);
}

export function getRelatedUlsanAreaGuides(hotel: Hotel) {
  if (!isUlsanHotel(hotel)) return [];
  const text = hotelText(hotel);
  return ulsanAreaGuides
    .map((guide) => ({
      guide,
      score: guide.slug === 'ulsan-hotel-comparison' ? 1 : keywordScore(text, guide.keywords)
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => item.guide);
}

function buildGuideHotel(hotel: Hotel, guide: UlsanAreaGuide): UlsanAreaGuideHotel {
  const text = hotelText(hotel);
  const area = pickAreaLabel(hotel);
  const directScore = guide.slug === 'ulsan-hotel-comparison' ? 1 : keywordScore(text, guide.keywords);
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
    tableCells: [area, score, reviews, price, buildTarget(guide, area)]
  };
}

function buildReasons(hotel: Hotel, guide: UlsanAreaGuide, area: string) {
  const reasons = [
    `${area} 일정에서 위치와 차량 이동 조건을 함께 비교하기 좋은 후보입니다.`,
    hotel.reviewScore && hotel.reviewScore >= 8.5
      ? '평점이 높은 편이라 후기 기반으로 우선 검토할 만합니다.'
      : '평점과 후기 수를 함께 보며 기대치를 조정하는 편이 좋습니다.',
    hotel.reviewCount && hotel.reviewCount >= 100
      ? '후기 수가 충분해 반복되는 장점과 주의점을 비교하기 좋습니다.'
      : '후기 수가 많지 않아 객실 타입과 최근 조건을 추가 확인하는 편이 안전합니다.'
  ];

  if (guide.slug.includes('samsan')) reasons[0] = '삼산동·달동 일정과 태화강역 이동, 출장 동선을 함께 보기 좋은 후보입니다.';
  if (guide.slug.includes('ilsan')) reasons[0] = '일산해수욕장, 대왕암공원, 동구 해안 일정과 함께 비교하기 좋은 후보입니다.';
  if (guide.slug.includes('ktx')) reasons[0] = '울산 KTX역이나 언양·울주 이동을 기준으로 비교하기 좋은 후보입니다.';
  if (guide.slug.includes('ganjeolgot')) reasons[0] = '간절곶 일출과 울주 해안 여행 동선을 기준으로 보기 좋은 후보입니다.';
  if (guide.slug.includes('yeongnam')) reasons[0] = '영남알프스 산행이나 온천·휴식 일정과 함께 비교하기 좋은 후보입니다.';
  if (guide.slug.includes('family')) reasons[0] = '가족 여행 관점에서 객실, 주차, 주변 이동 조건을 함께 보기 좋은 후보입니다.';

  return reasons;
}

function buildCaution(hotel: Hotel, guide: UlsanAreaGuide) {
  if (guide.slug.includes('ilsan') || guide.slug.includes('ganjeolgot')) return '오션뷰는 객실 타입과 층수에 따라 달라질 수 있어 예약 전 확인이 필요합니다.';
  if (guide.slug.includes('samsan') || guide.slug.includes('ktx')) return '출장 일정이라면 주차, 체크인 가능 시간, 조식 시작 시간을 먼저 확인하세요.';
  if (guide.slug.includes('yeongnam')) return '산행·온천 일정은 차량 이동과 주변 식당 운영 시간을 함께 확인하는 편이 좋습니다.';
  if (hotel.reviewCount && hotel.reviewCount < 50) return '후기 수가 적어 최근 객실 상태와 운영 조건을 추가 확인하는 편이 좋습니다.';
  return '성수기에는 가격과 체크인 대기, 주차 혼잡이 달라질 수 있습니다.';
}

function buildTarget(guide: UlsanAreaGuide, area: string) {
  if (guide.slug.includes('samsan') || guide.slug.includes('ktx')) return '출장·교통';
  if (guide.slug.includes('ilsan') || guide.slug.includes('ganjeolgot')) return '바다 여행';
  if (guide.slug.includes('yeongnam')) return '산행·휴식';
  if (guide.slug.includes('family')) return '가족 여행';
  return `${area} 일정`;
}

function pickAreaLabel(hotel: Hotel) {
  const text = hotelText(hotel);
  if (/삼산|달동|태화강|시외버스터미널|고속버스터미널/i.test(text)) return '삼산동';
  if (/일산|대왕암|방어진|동구|정자해수욕장|강동|블루마시티/i.test(text)) return '일산해수욕장';
  if (/KTX|울산역|언양|울주/i.test(text)) return '울산 KTX역';
  if (/간절곶|서생|일출/i.test(text)) return '간절곶';
  if (/영남알프스|간월재|배내골|온천|상북/i.test(text)) return '영남알프스';
  if (/장생포|고래문화마을/i.test(text)) return '장생포';
  return '울산';
}

function hotelText(hotel: Hotel) {
  return [
    hotel.slug,
    hotel.hotelName,
    hotel.region,
    hotel.address,
    hotel.analysis?.summary,
    hotel.analysis?.pros?.join(' '),
    hotel.analysis?.recommendedFor?.join(' ')
  ]
    .filter(Boolean)
    .join(' ');
}

function keywordScore(text: string, keywords: string[]) {
  const normalized = text.toLowerCase();
  return keywords.reduce((score, keyword) => score + (normalized.includes(keyword.toLowerCase()) ? 1 : 0), 0);
}

function popularity(hotel: Hotel) {
  return (hotel.reviewScore || 0) * 100 + Math.min(hotel.reviewCount || 0, 5000) / 20;
}

function priceText(hotel: Hotel) {
  const price = hotel.averageNightlyRate ?? hotel.dailyRate;
  return price ? `${price.toLocaleString('ko-KR')}원~` : '가격 확인';
}
