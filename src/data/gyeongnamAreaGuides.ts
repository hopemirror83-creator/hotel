import { activeHotels as hotels } from './hotels';
import type { Hotel } from './hotels';
import { isGyeongnamHotel } from './gyeongnamSearchIntents';

export type GyeongnamAreaGuide = {
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

export type GyeongnamAreaGuideHotel = {
  hotel: Hotel;
  guideScore: number;
  reasons: string[];
  caution: string;
  target: string;
  tags: string[];
  tableCells: string[];
};

export const gyeongnamAreaGuides: GyeongnamAreaGuide[] = [
  {
    slug: 'tongyeong-hotels',
    path: '/gyeongnam/tongyeong-hotels/',
    title: '통영 호텔 후기 모음',
    eyebrow: 'TONGYEONG HOTEL GUIDE',
    intro: '통영 호텔은 통영항, 동피랑, 케이블카, 섬 여행 동선에 따라 만족도가 달라집니다. 항구 접근성, 오션뷰, 주차, 체크인 조건을 함께 비교합니다.',
    purpose: '통영항과 동피랑, 케이블카 일정을 준비하는 사용자를 위한 페이지입니다.',
    intentQuestion: '통영에서는 항구 접근성과 오션뷰 중 무엇을 먼저 봐야 할까?',
    metaDescription: '통영 호텔 후기를 통영항, 동피랑, 오션뷰, 주차, 체크인 기준으로 비교했습니다.',
    criteria: ['통영항', '오션뷰', '동피랑', '주차', '체크인'],
    tableColumns: ['통영 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['통영', '한산', '충무', '동피랑', '서피랑', '마리나', 'tongyeong']
  },
  {
    slug: 'geoje-hotels',
    path: '/gyeongnam/geoje-hotels/',
    title: '거제 호텔 후기 모음',
    eyebrow: 'GEOJE HOTEL GUIDE',
    intro: '거제 호텔은 고현, 옥포, 장승포, 해안 관광지 동선에 따라 선택 기준이 달라집니다. 오션뷰와 가족 여행, 주차 조건을 함께 비교합니다.',
    purpose: '거제 바다 여행이나 출장 숙박을 준비하는 사용자를 위한 페이지입니다.',
    intentQuestion: '거제에서는 고현·옥포 접근성과 바다 전망 중 무엇을 먼저 봐야 할까?',
    metaDescription: '거제 호텔 후기를 오션뷰, 고현, 옥포, 장승포, 가족 여행, 주차 기준으로 비교했습니다.',
    criteria: ['오션뷰', '고현', '옥포', '가족', '주차'],
    tableColumns: ['거제 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['거제', '옥포', '장승포', '고현', 'geoje']
  },
  {
    slug: 'changwon-masan-jinhae-hotels',
    path: '/gyeongnam/changwon-masan-jinhae-hotels/',
    title: '창원 마산 진해 호텔 후기 모음',
    eyebrow: 'CHANGWON HOTEL GUIDE',
    intro: '창원·마산·진해 호텔은 출장, 상남동, 창원중앙역, 마산, 진해 용원 동선이 중요합니다. 주차와 조식, 주변 식당 접근성을 중심으로 비교합니다.',
    purpose: '창원·마산·진해 출장 또는 짧은 숙박을 준비하는 사용자를 위한 페이지입니다.',
    intentQuestion: '창원·마산·진해 숙소는 출장 동선과 주차 중 무엇을 먼저 봐야 할까?',
    metaDescription: '창원, 마산, 진해 호텔 후기를 출장, 상남동, 주차, 조식, 역·터미널 접근성 기준으로 비교했습니다.',
    criteria: ['출장', '상남동', '마산', '진해', '주차'],
    tableColumns: ['출장 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['창원', '마산', '진해', '상남', '용원', '출장', 'changwon', 'masan', 'jinhae']
  },
  {
    slug: 'jinju-hotels',
    path: '/gyeongnam/jinju-hotels/',
    title: '진주 호텔 후기 모음',
    eyebrow: 'JINJU HOTEL GUIDE',
    intro: '진주 호텔은 남강, 진주성, 혁신도시, 출장 동선에 따라 비교 기준이 달라집니다. 관광과 업무 목적을 나눠 주차·조식 조건을 봅니다.',
    purpose: '진주 관광과 출장 숙소를 함께 비교하려는 사용자를 위한 페이지입니다.',
    intentQuestion: '진주에서는 남강 관광과 혁신도시 출장 중 어떤 동선을 먼저 봐야 할까?',
    metaDescription: '진주 호텔 후기를 남강, 진주성, 혁신도시, 출장, 주차, 조식 기준으로 비교했습니다.',
    criteria: ['남강', '진주성', '혁신도시', '출장', '주차'],
    tableColumns: ['진주 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['진주', '남강', '진주성', '혁신', 'jinju']
  },
  {
    slug: 'gimhae-yangsan-hotels',
    path: '/gyeongnam/gimhae-yangsan-hotels/',
    title: '김해 양산 호텔 후기 모음',
    eyebrow: 'GIMHAE YANGSAN HOTEL GUIDE',
    intro: '김해·양산 호텔은 김해공항, 부산신항, 산업단지, 양산 시내 이동이 중요합니다. 출장과 공항 접근성, 주차 조건을 함께 비교합니다.',
    purpose: '김해공항, 부산신항, 양산 출장 숙소를 찾는 사용자를 위한 페이지입니다.',
    intentQuestion: '김해·양산 숙소는 공항 접근성과 출장 동선 중 무엇을 먼저 봐야 할까?',
    metaDescription: '김해, 양산 호텔 후기를 김해공항, 부산신항, 출장, 주차, 가성비 기준으로 비교했습니다.',
    criteria: ['김해공항', '부산신항', '출장', '주차', '가성비'],
    tableColumns: ['김해·양산 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['김해', '양산', '부산신항', '녹산', '김해공항', 'gimhae', 'yangsan']
  },
  {
    slug: 'namhae-hadong-hotels',
    path: '/gyeongnam/namhae-hadong-hotels/',
    title: '남해 하동 호텔 후기 모음',
    eyebrow: 'NAMHAE HADONG HOTEL GUIDE',
    intro: '남해·하동 숙소는 독일마을, 바다 전망, 해안도로, 지리산 동선이 중요합니다. 펜션·풀빌라형 숙소는 객실별 시설 차이를 함께 봐야 합니다.',
    purpose: '남해 바다 여행과 하동 지리산권 휴식 숙소를 찾는 사용자를 위한 페이지입니다.',
    intentQuestion: '남해·하동 숙소는 오션뷰와 차량 이동 중 무엇을 먼저 봐야 할까?',
    metaDescription: '남해, 하동 호텔 후기를 오션뷰, 독일마을, 풀빌라, 가족 여행, 주차 기준으로 비교했습니다.',
    criteria: ['오션뷰', '독일마을', '풀빌라', '가족', '주차'],
    tableColumns: ['남해·하동 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['남해', '하동', '독일마을', '지리산', '풀빌라', 'namhae', 'hadong']
  },
  {
    slug: 'sacheon-goseong-hotels',
    path: '/gyeongnam/sacheon-goseong-hotels/',
    title: '사천 고성 호텔 후기 모음',
    eyebrow: 'SACHEON GOSEONG HOTEL GUIDE',
    intro: '사천·고성 숙소는 삼천포, 남일대, 해안 이동, 가족 여행 조건을 함께 봐야 합니다. 바다 전망과 주차, 주변 식당 운영 시간을 비교합니다.',
    purpose: '사천·고성 해안 여행과 조용한 가족 숙소를 찾는 사용자를 위한 페이지입니다.',
    intentQuestion: '사천·고성 여행에서는 바다 전망과 주변 편의성 중 무엇을 먼저 봐야 할까?',
    metaDescription: '사천, 고성 호텔 후기를 오션뷰, 삼천포, 가족 여행, 주차, 체크인 기준으로 비교했습니다.',
    criteria: ['오션뷰', '삼천포', '가족', '주차', '체크인'],
    tableColumns: ['사천·고성 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['사천', '고성', '삼천포', '남일대', 'sacheon', 'goseong']
  },
  {
    slug: 'gyeongnam-hotel-comparison',
    path: '/gyeongnam/gyeongnam-hotel-comparison/',
    title: '경남 호텔 비교',
    eyebrow: 'GYEONGNAM HOTEL COMPARISON',
    intro: '경남 호텔은 통영, 거제, 창원, 진주, 김해·양산, 남해·하동, 사천·고성처럼 목적지가 넓게 나뉩니다. 먼저 지역을 고른 뒤 후기와 이동 조건을 비교하는 것이 좋습니다.',
    purpose: '경남 전체 호텔을 지역별로 비교하고 개별 후기 페이지로 이동하기 위한 페이지입니다.',
    intentQuestion: '경남 호텔은 어느 지역부터 비교하는 것이 좋을까?',
    metaDescription: '경남 호텔을 통영, 거제, 창원, 진주, 김해·양산, 남해·하동, 사천·고성 권역으로 비교했습니다.',
    criteria: ['지역', '평점', '후기 수', '가격대', '추천 목적'],
    tableColumns: ['권역', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['경남', '경상남도', '통영', '거제', '창원', '진주', '김해', '양산', '남해', '하동', '사천', '고성']
  }
];

export const gyeongnamHotels = hotels
  .filter((hotel) => isGyeongnamHotel(hotel) && /^gyeongnam-/.test(hotel.slug))
  .sort((a, b) => popularity(b) - popularity(a));

export function getGyeongnamAreaGuideHotels(guide: GyeongnamAreaGuide, limit = 20): GyeongnamAreaGuideHotel[] {
  return gyeongnamHotels
    .map((hotel) => buildGuideHotel(hotel, guide))
    .filter((item) => item.guideScore > 0)
    .sort((a, b) => b.guideScore - a.guideScore)
    .slice(0, limit);
}

export function getRelatedGyeongnamAreaGuides(hotel: Hotel) {
  if (!isGyeongnamHotel(hotel)) return [];
  const text = hotelText(hotel);
  return gyeongnamAreaGuides
    .map((guide) => ({
      guide,
      score: guide.slug === 'gyeongnam-hotel-comparison' ? 1 : keywordScore(text, guide.keywords)
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => item.guide);
}

function buildGuideHotel(hotel: Hotel, guide: GyeongnamAreaGuide): GyeongnamAreaGuideHotel {
  const text = hotelText(hotel);
  const area = pickAreaLabel(hotel);
  const directScore = guide.slug === 'gyeongnam-hotel-comparison' ? 1 : keywordScore(text, guide.keywords);
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

function buildReasons(hotel: Hotel, guide: GyeongnamAreaGuide, area: string) {
  const reasons = [
    `${area} 일정에서 위치와 차량 이동 조건을 함께 비교하기 좋은 후보입니다.`,
    hotel.reviewScore && hotel.reviewScore >= 8.5
      ? '평점이 높은 편이라 후기 기반으로 우선 검토할 만합니다.'
      : '평점과 후기 수를 함께 보며 기대치를 조정하는 것이 좋습니다.',
    hotel.reviewCount && hotel.reviewCount >= 100
      ? '후기 수가 충분해 반복되는 장단점을 비교하기 좋습니다.'
      : '후기 수가 많지 않아 객실 타입과 최근 조건을 추가 확인하는 편이 좋습니다.'
  ];

  if (guide.slug.includes('tongyeong')) reasons[0] = '통영항, 동피랑, 케이블카, 섬 여행 동선을 함께 보기 좋은 후보입니다.';
  if (guide.slug.includes('geoje')) reasons[0] = '거제 고현·옥포·장승포와 바다 여행 동선을 함께 보기 좋은 후보입니다.';
  if (guide.slug.includes('changwon')) reasons[0] = '창원·마산·진해 출장과 짧은 숙박 기준으로 비교하기 좋은 후보입니다.';
  if (guide.slug.includes('jinju')) reasons[0] = '진주 남강 관광과 혁신도시 출장 동선을 함께 보기 좋은 후보입니다.';
  if (guide.slug.includes('gimhae')) reasons[0] = '김해공항, 부산신항, 양산 이동 조건을 함께 보기 좋은 후보입니다.';
  if (guide.slug.includes('namhae')) reasons[0] = '남해·하동 바다 전망과 차량 이동 조건을 함께 보기 좋은 후보입니다.';
  if (guide.slug.includes('sacheon')) reasons[0] = '사천·고성 해안 여행과 가족 숙박 조건을 함께 보기 좋은 후보입니다.';
  return reasons;
}

function buildCaution(hotel: Hotel, guide: GyeongnamAreaGuide) {
  if (guide.slug.includes('tongyeong') || guide.slug.includes('geoje') || guide.slug.includes('namhae')) return '오션뷰는 객실 타입과 층수에 따라 달라질 수 있어 예약 전 확인이 필요합니다.';
  if (guide.slug.includes('changwon') || guide.slug.includes('gimhae')) return '출장 목적이라면 조식 시작 시간과 주차 가능 여부를 먼저 확인하세요.';
  if (hotel.reviewCount && hotel.reviewCount < 50) return '후기 수가 적어 최근 객실 상태와 운영 조건을 추가 확인하는 편이 안전합니다.';
  return '성수기에는 체크인 대기, 주차 혼잡, 가격 변동이 생길 수 있습니다.';
}

function buildTarget(guide: GyeongnamAreaGuide, area: string) {
  if (guide.slug.includes('changwon') || guide.slug.includes('gimhae') || guide.slug.includes('jinju')) return '출장·짧은 숙박';
  if (guide.slug.includes('tongyeong') || guide.slug.includes('geoje') || guide.slug.includes('namhae') || guide.slug.includes('sacheon')) return '바다 여행';
  return `${area} 여행`;
}

function pickAreaLabel(hotel: Hotel) {
  const text = hotelText(hotel);
  if (/통영|한산|충무|동피랑|서피랑/i.test(text)) return '통영';
  if (/거제|옥포|장승포|고현/i.test(text)) return '거제';
  if (/창원|마산|진해|상남|용원/i.test(text)) return '창원·마산·진해';
  if (/진주|남강|혁신/i.test(text)) return '진주';
  if (/김해|양산|부산신항|녹산/i.test(text)) return '김해·양산';
  if (/남해|하동|독일마을|지리산/i.test(text)) return '남해·하동';
  if (/사천|고성|삼천포/i.test(text)) return '사천·고성';
  return '경남';
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
