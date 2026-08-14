import { activeHotels as hotels } from './hotels';
import type { Hotel } from './hotels';
import { isGyeonggiHotel } from './gyeonggiSearchIntents';

export type GyeonggiAreaGuide = {
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

export type GyeonggiAreaGuideHotel = {
  hotel: Hotel;
  guideScore: number;
  reasons: string[];
  caution: string;
  target: string;
  tags: string[];
  tableCells: string[];
};

export const gyeonggiAreaGuides: GyeonggiAreaGuide[] = [
  {
    slug: 'suwon-hotels',
    path: '/gyeonggi/suwon-hotels/',
    title: '수원 호텔 후기 모음',
    eyebrow: 'SUWON HOTEL GUIDE',
    intro: '수원 호텔은 수원역, 인계동, 행궁동 중 어디가 목적지인지에 따라 만족도가 달라집니다. 위치, 주차, 객실, 조식 조건을 함께 비교합니다.',
    purpose: '수원 출장, 수원역 이동, 행궁동 관광을 준비하는 여행자가 숙소를 고르기 위한 페이지입니다.',
    intentQuestion: '수원에서 이동과 후기 균형이 좋은 호텔은 어디일까?',
    metaDescription: '수원 호텔 후기를 수원역, 인계동, 행궁동, 주차, 객실, 조식 기준으로 비교했습니다.',
    criteria: ['수원 위치', '수원역 접근', '주차', '객실 컨디션', '출장·관광'],
    tableColumns: ['수원 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['수원', '팔달구', '권선구', '인계동', '매산로', '행궁', 'suwon']
  },
  {
    slug: 'gimpo-hotels',
    path: '/gyeonggi/gimpo-hotels/',
    title: '김포 호텔 후기 모음',
    eyebrow: 'GIMPO HOTEL GUIDE',
    intro: '김포 호텔은 김포공항 호텔과 혼동하지 않고 김포시 일정, 차량 이동, 주차 조건을 따로 봐야 합니다. 서울 서북권 이동까지 함께 비교합니다.',
    purpose: '김포 출장이나 김포시 일정이 있는 사용자가 숙소를 고르기 위한 페이지입니다.',
    intentQuestion: '김포시 일정에 맞는 호텔은 어디일까?',
    metaDescription: '김포 호텔 후기를 김포시 위치, 차량 이동, 주차, 주변 편의시설 기준으로 비교했습니다.',
    criteria: ['김포 위치', '차량 이동', '주차', '서울 서북권', '출장'],
    tableColumns: ['김포 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['김포', 'gimpo-si', 'gimpo']
  },
  {
    slug: 'ilsan-goyang-hotels',
    path: '/gyeonggi/ilsan-goyang-hotels/',
    title: '일산 고양 호텔 후기 모음',
    eyebrow: 'ILSANG & GOYANG GUIDE',
    intro: '일산과 고양 호텔은 킨텍스, 라페스타, 화정, 대화역 등 목적지에 따라 선택 기준이 달라집니다. 행사 일정은 혼잡과 체크인 대기도 함께 봐야 합니다.',
    purpose: '킨텍스 행사, 일산 출장, 고양 공연·전시 일정을 준비하는 사용자를 위한 페이지입니다.',
    intentQuestion: '일산과 고양에서 킨텍스나 전시 일정에 맞는 호텔은 어디일까?',
    metaDescription: '일산 고양 호텔 후기를 킨텍스, 라페스타, 화정, 주차, 객실 조건 기준으로 비교했습니다.',
    criteria: ['일산·고양', '킨텍스', '행사 혼잡', '주차', '체크인'],
    tableColumns: ['일산 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['고양', '일산', '화정', '라페스타', '킨텍스', 'goyang', 'ilsan', 'kintex']
  },
  {
    slug: 'bundang-seongnam-hotels',
    path: '/gyeonggi/bundang-seongnam-hotels/',
    title: '분당 성남 호텔 후기 모음',
    eyebrow: 'BUNDANG & SEONGNAM GUIDE',
    intro: '분당과 성남 호텔은 판교 업무지구, 미금·정자, 수정구 도심 일정에 따라 위치 만족도가 달라집니다. 출퇴근 시간대 이동을 함께 고려해야 합니다.',
    purpose: '판교 출장과 분당·성남 일정을 준비하는 사용자를 위한 페이지입니다.',
    intentQuestion: '분당과 성남에서 출장에 맞는 호텔은 어디일까?',
    metaDescription: '분당 성남 호텔 후기를 판교, 미금, 정자, 교통, 주차 기준으로 비교했습니다.',
    criteria: ['성남·분당', '판교 접근', '출장', '주차', '지하철'],
    tableColumns: ['분당 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['성남', '분당', '미금', '판교', '정자', 'seongnam', 'bundang', 'pangyo']
  },
  {
    slug: 'yongin-hotels',
    path: '/gyeonggi/yongin-hotels/',
    title: '용인 호텔 후기 모음',
    eyebrow: 'YONGIN HOTEL GUIDE',
    intro: '용인 호텔은 기흥·신갈, 수지, 에버랜드 권역이 나뉩니다. 차량 이동이 많은 지역이라 목적지까지의 실제 소요 시간과 주차가 중요합니다.',
    purpose: '용인 출장이나 에버랜드 주변 숙박을 검토하는 사용자를 위한 페이지입니다.',
    intentQuestion: '용인에서 차량 이동과 주차를 함께 보기 좋은 호텔은 어디일까?',
    metaDescription: '용인 호텔 후기를 기흥, 신갈, 에버랜드, 차량 이동, 주차 기준으로 비교했습니다.',
    criteria: ['용인 위치', '기흥·신갈', '차량 이동', '주차', '출장·가족'],
    tableColumns: ['용인 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['용인', '신갈', '기흥', '에버랜드', 'yongin', 'giheung', 'everland']
  },
  {
    slug: 'dongtan-hwaseong-hotels',
    path: '/gyeonggi/dongtan-hwaseong-hotels/',
    title: '동탄 화성 호텔 후기 모음',
    eyebrow: 'DONGTAN & HWASEONG GUIDE',
    intro: '동탄과 화성 호텔은 산업단지, 동탄역, 향남 권역이 나뉘며 출장 목적이 많은 편입니다. 차량 소요 시간과 주차를 함께 비교합니다.',
    purpose: '동탄·화성 출장이나 차량 이동 숙박을 찾는 사용자를 위한 페이지입니다.',
    intentQuestion: '동탄과 화성에서 출장 동선에 맞는 호텔은 어디일까?',
    metaDescription: '동탄 화성 호텔 후기를 동탄역, 향남, 산업단지, 주차, 차량 이동 기준으로 비교했습니다.',
    criteria: ['동탄·화성', '출장', '차량 이동', '주차', '가격대'],
    tableColumns: ['화성 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['화성', '동탄', '향남', 'hwaseong', 'dongtan', 'hyangnam']
  },
  {
    slug: 'ansan-daebudo-hotels',
    path: '/gyeonggi/ansan-daebudo-hotels/',
    title: '안산 대부도 호텔 후기 모음',
    eyebrow: 'ANSAN & DAEBUDO GUIDE',
    intro: '안산과 대부도 숙소는 도심형 호텔과 바다·펜션형 숙소가 섞여 있습니다. 차량 이동, 주차, 바베큐, 주변 편의시설을 함께 확인해야 합니다.',
    purpose: '안산 출장이나 대부도 드라이브 여행을 준비하는 사용자를 위한 페이지입니다.',
    intentQuestion: '안산과 대부도에서 차량 이동에 맞는 숙소는 어디일까?',
    metaDescription: '안산 대부도 호텔 후기를 차량 이동, 주차, 바베큐, 객실, 주변 편의시설 기준으로 비교했습니다.',
    criteria: ['안산·대부도', '차량 이동', '주차', '바베큐', '객실'],
    tableColumns: ['권역', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['안산', '대부도', '단원구', '시화', '월곶', '시흥', 'ansan', 'daebudo', 'siheung', 'wolgot']
  },
  {
    slug: 'yangpyeong-hotels',
    path: '/gyeonggi/yangpyeong-hotels/',
    title: '양평 호텔 펜션 후기 모음',
    eyebrow: 'YANGPYEONG STAY GUIDE',
    intro: '양평 숙소는 호텔보다 펜션, 드라이브인, 독채형 숙소가 많이 섞입니다. 조용함, 바베큐, 차량 이동, 객실 독립성을 함께 보는 것이 좋습니다.',
    purpose: '양평 드라이브나 가족·친구 모임 숙소를 찾는 사용자를 위한 페이지입니다.',
    intentQuestion: '양평에서 조용한 휴식이나 모임에 맞는 숙소는 어디일까?',
    metaDescription: '양평 호텔 펜션 후기를 드라이브, 바베큐, 가족 모임, 객실 독립성, 주차 기준으로 비교했습니다.',
    criteria: ['양평 위치', '드라이브', '가족 모임', '바베큐', '조용함'],
    tableColumns: ['양평 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['양평', 'yangpyeong']
  },
  {
    slug: 'gyeonggi-hotel-comparison',
    path: '/gyeonggi/gyeonggi-hotel-comparison/',
    title: '경기 호텔 비교',
    eyebrow: 'GYEONGGI HOTEL COMPARISON',
    intro: '경기 호텔은 도시와 목적지가 넓게 흩어져 있어 지역 선택이 먼저입니다. 수원, 김포, 일산, 분당, 용인, 동탄, 양평처럼 목적지별로 비교해야 합니다.',
    purpose: '경기 호텔을 지역별로 먼저 좁힌 뒤 개별 호텔을 비교하기 위한 페이지입니다.',
    intentQuestion: '경기 호텔은 어느 지역부터 비교해야 할까?',
    metaDescription: '경기 호텔을 수원, 김포, 일산, 분당, 용인, 동탄, 안산, 양평 권역으로 비교했습니다.',
    criteria: ['경기 권역', '평점', '후기 수', '가격대', '추천 목적'],
    tableColumns: ['권역', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['경기', '경기도', 'gyeonggi-do']
  }
];

export const gyeonggiHotels = hotels
  .filter(isGyeonggiHotel)
  .sort((a, b) => popularity(b) - popularity(a));

export function getGyeonggiAreaGuide(slug: string) {
  return gyeonggiAreaGuides.find((guide) => guide.slug === slug);
}

export function getGyeonggiAreaGuideHotels(guide: GyeonggiAreaGuide, limit = 20): GyeonggiAreaGuideHotel[] {
  return gyeonggiHotels
    .map((hotel) => buildGuideHotel(hotel, guide))
    .filter((item) => item.guideScore > 0)
    .sort((a, b) => b.guideScore - a.guideScore)
    .slice(0, limit);
}

export function getRelatedGyeonggiAreaGuides(hotel: Hotel) {
  if (!isGyeonggiHotel(hotel)) return [];
  const text = hotelText(hotel);
  return gyeonggiAreaGuides
    .map((guide) => ({
      guide,
      score: keywordScore(text, guide.keywords) - keywordScore(text, guide.negativeKeywords || [])
    }))
    .filter((item) => item.score > 0 || item.guide.slug === 'gyeonggi-hotel-comparison')
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => item.guide);
}

function buildGuideHotel(hotel: Hotel, guide: GyeonggiAreaGuide): GyeonggiAreaGuideHotel {
  const text = hotelText(hotel);
  const directScore =
    guide.slug === 'gyeonggi-hotel-comparison'
      ? 1
      : keywordScore(text, guide.keywords) - keywordScore(text, guide.negativeKeywords || []);
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

function buildReasons(hotel: Hotel, guide: GyeonggiAreaGuide, area: string) {
  const reasons = [
    `${area} 일정에서 실제 이동 동선과 주차를 함께 비교하기 좋은 후보입니다.`,
    hotel.reviewScore && hotel.reviewScore >= 8.5
      ? '평점이 높은 편이라 후기 기반으로 우선 검토할 만합니다.'
      : '평점과 후기 수를 함께 보며 기대치를 조정하기 좋습니다.',
    hotel.reviewCount && hotel.reviewCount >= 100
      ? '후기 수가 있어 반복되는 장단점을 비교하기 좋습니다.'
      : '후기 수가 많지 않아 객실 타입과 최신 조건을 추가 확인하는 편이 좋습니다.'
  ];

  if (guide.slug.includes('suwon')) reasons[0] = '수원역, 인계동, 행궁동 동선을 함께 비교하기 좋은 후보입니다.';
  if (guide.slug.includes('ilsan')) reasons[0] = '일산·고양 행사나 킨텍스 일정과 함께 보기 좋은 후보입니다.';
  if (guide.slug.includes('yangpyeong')) reasons[0] = '양평 드라이브와 가족·친구 모임 조건을 함께 보기 좋은 후보입니다.';
  return reasons;
}

function buildCaution(hotel: Hotel, guide: GyeonggiAreaGuide) {
  const firstCon = hotel.analysis.cons[0];
  if (firstCon) return firstCon;
  if (guide.slug.includes('yangpyeong') || guide.slug.includes('ansan')) return '외곽형 숙소는 차량 이동, 주차, 주변 편의시설을 예약 전에 다시 확인하는 것이 좋습니다.';
  if (guide.slug.includes('suwon') || guide.slug.includes('bundang') || guide.slug.includes('ilsan')) return '도심형 호텔은 주차와 주변 소음, 객실 타입 차이를 함께 확인해야 합니다.';
  return '체크인 시간, 주차 가능 여부, 객실 타입별 면적을 예약 단계에서 다시 확인해야 합니다.';
}

function buildTarget(guide: GyeonggiAreaGuide, area: string) {
  if (guide.slug.includes('suwon')) return '수원 출장·관광';
  if (guide.slug.includes('gimpo')) return '김포 출장·차량 이동';
  if (guide.slug.includes('ilsan')) return '일산·킨텍스 일정';
  if (guide.slug.includes('bundang')) return '분당·판교 출장';
  if (guide.slug.includes('yongin')) return '용인 출장·가족 여행';
  if (guide.slug.includes('dongtan')) return '동탄·화성 출장';
  if (guide.slug.includes('ansan')) return '안산·대부도 여행';
  if (guide.slug.includes('yangpyeong')) return '양평 드라이브·모임';
  return `${area} 호텔 비교`;
}

function buildTableCells(guide: GyeonggiAreaGuide, area: string, score: string, reviews: string, price: string) {
  if (guide.slug === 'gyeonggi-hotel-comparison') return [area, score, reviews, price, buildTarget(guide, area)];
  return ['확인 필요', score, reviews, price, buildTarget(guide, area)];
}

function pickAreaLabel(hotel: Hotel) {
  const text = hotelText(hotel);
  if (/수원|팔달구|권선구|인계동|매산로|행궁|suwon/.test(text)) return '수원';
  if (/김포|gimpo/.test(text)) return '김포';
  if (/고양|일산|화정|라페스타|킨텍스|goyang|ilsan|kintex/.test(text)) return '고양·일산';
  if (/성남|분당|미금|판교|정자|seongnam|bundang|pangyo/.test(text)) return '성남·분당';
  if (/용인|신갈|기흥|에버랜드|yongin|giheung|everland/.test(text)) return '용인';
  if (/화성|동탄|향남|hwaseong|dongtan|hyangnam/.test(text)) return '화성·동탄';
  if (/안산|대부도|단원구|시화|월곶|시흥|ansan|daebudo|siheung|wolgot/.test(text)) return '안산·대부도';
  if (/양평|yangpyeong/.test(text)) return '양평';
  if (/평택|pyeongtaek/.test(text)) return '평택';
  return '경기';
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
    ...(analysis?.checkPoints || [])
  ]
    .join(' ')
    .toLowerCase();
}
