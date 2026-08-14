import { activeHotels as hotels } from './hotels';
import type { Hotel } from './hotels';
import { isGyeongbukHotel } from './gyeongbukSearchIntents';

export type GyeongbukAreaGuide = {
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

export type GyeongbukAreaGuideHotel = {
  hotel: Hotel;
  guideScore: number;
  reasons: string[];
  caution: string;
  target: string;
  tags: string[];
  tableCells: string[];
};

export const gyeongbukAreaGuides: GyeongbukAreaGuide[] = [
  {
    slug: 'gyeongju-hotels',
    path: '/gyeongbuk/gyeongju-hotels/',
    title: '경주 호텔 후기 모음',
    eyebrow: 'GYEONGJU HOTEL GUIDE',
    intro: '경주 호텔은 황리단길·대릉원 도보권과 보문단지 리조트권으로 성격이 나뉩니다. 후기에서는 위치, 주차, 체크인, 조식, 가족 여행 적합도를 함께 보는 것이 중요합니다.',
    purpose: '경주 여행에서 황리단길 접근성과 보문단지 휴식형 숙소를 비교하려는 사용자를 위한 페이지입니다.',
    intentQuestion: '경주에서 황리단길과 보문단지 중 어디에 숙소를 잡는 것이 좋을까?',
    metaDescription: '경주 호텔 후기를 황리단길, 보문단지, 주차, 체크인, 조식, 가족 여행 기준으로 비교했습니다.',
    criteria: ['황리단길', '보문단지', '주차', '체크인', '가족 여행'],
    tableColumns: ['경주 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['경주', '황리단', '보문', '불국사', '대릉원', '첨성대', 'gyeongju']
  },
  {
    slug: 'pohang-hotels',
    path: '/gyeongbuk/pohang-hotels/',
    title: '포항 호텔 후기 모음',
    eyebrow: 'POHANG HOTEL GUIDE',
    intro: '포항 호텔은 영일대, 죽도시장, 구룡포 이동 목적에 따라 만족도가 달라집니다. 바다 전망과 시장 접근성, 주차 조건을 함께 비교합니다.',
    purpose: '포항 영일대 오션뷰와 죽도시장 접근성을 기준으로 숙소를 고르려는 사용자를 위한 페이지입니다.',
    intentQuestion: '포항에서 영일대 오션뷰와 죽도시장 접근성 중 무엇을 우선해야 할까?',
    metaDescription: '포항 호텔 후기를 영일대, 오션뷰, 죽도시장, 주차, 조식 기준으로 비교했습니다.',
    criteria: ['영일대', '오션뷰', '죽도시장', '주차', '조식'],
    tableColumns: ['포항 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['포항', '영일대', '죽도', '구룡포', '송도해수욕장', 'pohang']
  },
  {
    slug: 'andong-hotels',
    path: '/gyeongbuk/andong-hotels/',
    title: '안동 호텔 후기 모음',
    eyebrow: 'ANDONG HOTEL GUIDE',
    intro: '안동 호텔은 시내 접근성과 하회마을·월영교 이동 시간을 함께 봐야 합니다. 한옥 감성 숙소와 실용형 호텔을 분리해 비교합니다.',
    purpose: '안동 하회마을, 월영교, 안동역 동선을 기준으로 숙소를 고르려는 사용자를 위한 페이지입니다.',
    intentQuestion: '안동 여행에서는 시내권과 하회마을 접근성 중 무엇을 먼저 봐야 할까?',
    metaDescription: '안동 호텔 후기를 하회마을, 월영교, 안동역, 주차, 체크인 기준으로 비교했습니다.',
    criteria: ['하회마을', '월영교', '안동역', '주차', '한옥 감성'],
    tableColumns: ['안동 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['안동', '하회', '월영교', '안동역', 'andong']
  },
  {
    slug: 'gumi-gimcheon-hotels',
    path: '/gyeongbuk/gumi-gimcheon-hotels/',
    title: '구미 김천 상주 호텔 후기 모음',
    eyebrow: 'GUMI BUSINESS HOTEL GUIDE',
    intro: '구미·김천·상주권 호텔은 출장, 산업단지, 역·터미널 접근성, 주차와 조식 조건이 중요합니다. 짧은 숙박 기준으로 실용성을 비교합니다.',
    purpose: '경북 내륙 출장과 짧은 숙박에 맞는 실용형 호텔을 찾는 사용자를 위한 페이지입니다.',
    intentQuestion: '구미·김천·상주 출장 숙소는 어떤 기준으로 고르는 것이 좋을까?',
    metaDescription: '구미, 김천, 상주 호텔 후기를 출장, 주차, 조식, 역·터미널 접근성 기준으로 비교했습니다.',
    criteria: ['출장', '주차', '조식', '역·터미널', '가성비'],
    tableColumns: ['출장 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['구미', '김천', '상주', '칠곡', '산업단지', '출장', 'gumi', 'gimcheon', 'sangju']
  },
  {
    slug: 'mungyeong-yeongju-hotels',
    path: '/gyeongbuk/mungyeong-yeongju-hotels/',
    title: '문경 영주 호텔 후기 모음',
    eyebrow: 'MUNGYEONG YEONGJU GUIDE',
    intro: '문경·영주 호텔은 문경새재, 소백산, 풍기온천처럼 차량 이동형 일정에 맞춰 봐야 합니다. 가족 여행과 온천·리조트형 숙소를 함께 비교합니다.',
    purpose: '문경새재, 소백산, 풍기온천 여행에 맞는 숙소를 찾는 사용자를 위한 페이지입니다.',
    intentQuestion: '문경·영주 여행에서는 관광지 접근성과 가족 숙박 조건 중 무엇을 먼저 봐야 할까?',
    metaDescription: '문경, 영주 호텔 후기를 문경새재, 소백산, 풍기온천, 가족 여행, 주차 기준으로 비교했습니다.',
    criteria: ['문경새재', '소백산', '풍기온천', '가족', '주차'],
    tableColumns: ['내륙 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['문경', '영주', '풍기', '소백산', '문경새재', '온천', 'mungyeong', 'yeongju']
  },
  {
    slug: 'yeongdeok-uljin-ulleung-hotels',
    path: '/gyeongbuk/yeongdeok-uljin-ulleung-hotels/',
    title: '영덕 울진 울릉 호텔 후기 모음',
    eyebrow: 'GYEONGBUK EAST COAST GUIDE',
    intro: '영덕·울진·울릉 숙소는 오션뷰, 항구 이동, 배편 시간, 주변 식당 운영 시간을 함께 확인해야 합니다. 바다 전망 기대치와 실제 이동 편의성을 같이 비교합니다.',
    purpose: '경북 동해안 여행에서 오션뷰와 항구 접근성을 기준으로 숙소를 고르려는 사용자를 위한 페이지입니다.',
    intentQuestion: '영덕·울진·울릉 숙소는 오션뷰와 항구 접근성 중 무엇을 우선해야 할까?',
    metaDescription: '영덕, 울진, 울릉 호텔 후기를 오션뷰, 항구 이동, 가족 여행, 주차 기준으로 비교했습니다.',
    criteria: ['오션뷰', '항구 이동', '배편', '가족', '주차'],
    tableColumns: ['동해안 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['영덕', '울진', '울릉', '강구항', '후포항', '덕구', '오션뷰', 'yeongdeok', 'uljin', 'ulleung']
  },
  {
    slug: 'gyeongbuk-family-hotels',
    path: '/gyeongbuk/gyeongbuk-family-hotels/',
    title: '경북 가족 호텔 추천 후기 모음',
    eyebrow: 'GYEONGBUK FAMILY HOTEL GUIDE',
    intro: '경북 가족 호텔은 객실 크기, 주차, 조식, 주변 관광지 이동이 핵심입니다. 경주 보문단지, 문경·영주, 동해안 숙소를 가족 여행 관점에서 비교합니다.',
    purpose: '아이 동반 경북 여행에서 객실과 이동 조건을 함께 보는 사용자를 위한 페이지입니다.',
    intentQuestion: '아이와 경북 여행을 갈 때 어떤 호텔을 먼저 비교해야 할까?',
    metaDescription: '경북 가족 호텔을 객실, 주차, 조식, 관광지 이동, 리조트형 숙소 기준으로 비교했습니다.',
    criteria: ['가족 여행', '객실', '주차', '조식', '관광지 이동'],
    tableColumns: ['가족 적합', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['가족', '키즈', '리조트', '풀빌라', '펜션', '보문', '문경', '영주', '울진']
  },
  {
    slug: 'gyeongbuk-hotel-comparison',
    path: '/gyeongbuk/gyeongbuk-hotel-comparison/',
    title: '경북 호텔 비교',
    eyebrow: 'GYEONGBUK HOTEL COMPARISON',
    intro: '경북 호텔은 경주, 포항, 안동, 구미, 문경·영주, 영덕·울진·울릉처럼 목적지가 넓게 나뉩니다. 먼저 지역을 고른 뒤 후기와 가격, 이동 조건을 비교하는 것이 좋습니다.',
    purpose: '경북 전체 호텔을 지역별로 비교하고 개별 후기 페이지로 이동하기 위한 페이지입니다.',
    intentQuestion: '경북 호텔은 어느 지역부터 비교하는 것이 좋을까?',
    metaDescription: '경북 호텔을 경주, 포항, 안동, 구미, 문경·영주, 영덕·울진·울릉 권역으로 나누어 비교했습니다.',
    criteria: ['지역', '평점', '후기 수', '가격대', '추천 목적'],
    tableColumns: ['권역', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['경북', '경상북도', '경주', '포항', '안동', '구미', '문경', '영주', '영덕', '울진', '울릉']
  }
];

export const gyeongbukHotels = hotels
  .filter((hotel) => isGyeongbukHotel(hotel) && /^gyeongbuk-/.test(hotel.slug))
  .sort((a, b) => popularity(b) - popularity(a));

export function getGyeongbukAreaGuideHotels(guide: GyeongbukAreaGuide, limit = 20): GyeongbukAreaGuideHotel[] {
  return gyeongbukHotels
    .map((hotel) => buildGuideHotel(hotel, guide))
    .filter((item) => item.guideScore > 0)
    .sort((a, b) => b.guideScore - a.guideScore)
    .slice(0, limit);
}

export function getRelatedGyeongbukAreaGuides(hotel: Hotel) {
  if (!isGyeongbukHotel(hotel)) return [];
  const text = hotelText(hotel);
  return gyeongbukAreaGuides
    .map((guide) => ({
      guide,
      score: guide.slug === 'gyeongbuk-hotel-comparison' ? 1 : keywordScore(text, guide.keywords)
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => item.guide);
}

function buildGuideHotel(hotel: Hotel, guide: GyeongbukAreaGuide): GyeongbukAreaGuideHotel {
  const text = hotelText(hotel);
  const area = pickAreaLabel(hotel);
  const directScore =
    guide.slug === 'gyeongbuk-hotel-comparison'
      ? 1
      : guide.slug === 'gyeongbuk-family-hotels'
        ? keywordScore(text, guide.keywords)
        : keywordScore(text, guide.keywords);
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

function buildReasons(hotel: Hotel, guide: GyeongbukAreaGuide, area: string) {
  const reasons = [
    `${area} 일정에서 위치와 차량 이동 조건을 함께 비교하기 좋은 후보입니다.`,
    hotel.reviewScore && hotel.reviewScore >= 8.5
      ? '평점이 높은 편이라 후기 기반으로 우선 검토할 만합니다.'
      : '평점과 후기 수를 함께 보며 기대치를 조정하는 것이 좋습니다.',
    hotel.reviewCount && hotel.reviewCount >= 100
      ? '후기 수가 충분해 반복되는 장단점을 비교하기 좋습니다.'
      : '후기 수가 많지 않아 객실 타입과 최근 조건을 추가 확인하는 편이 좋습니다.'
  ];

  if (guide.slug.includes('gyeongju')) reasons[0] = '경주 황리단길, 보문단지, 불국사 동선에 맞춰 비교하기 좋은 후보입니다.';
  if (guide.slug.includes('pohang')) reasons[0] = '포항 영일대, 죽도시장, 구룡포 이동 조건을 함께 보기 좋은 후보입니다.';
  if (guide.slug.includes('andong')) reasons[0] = '안동 시내권, 하회마을, 월영교 동선을 기준으로 비교하기 좋은 후보입니다.';
  if (guide.slug.includes('gumi')) reasons[0] = '구미·김천·상주 출장 또는 짧은 숙박 기준으로 비교하기 좋은 후보입니다.';
  if (guide.slug.includes('mungyeong')) reasons[0] = '문경새재, 소백산, 풍기온천 일정과 차량 이동을 함께 보기 좋은 후보입니다.';
  if (guide.slug.includes('yeongdeok')) reasons[0] = '경북 동해안 오션뷰와 항구 이동 조건을 함께 보기 좋은 후보입니다.';
  if (guide.slug.includes('family')) reasons[0] = '가족 여행 기준으로 객실, 주차, 조식, 주변 이동 조건을 함께 보기 좋은 후보입니다.';
  return reasons;
}

function buildCaution(hotel: Hotel, guide: GyeongbukAreaGuide) {
  if (guide.slug.includes('pohang') || guide.slug.includes('yeongdeok')) return '오션뷰는 객실 타입과 층수에 따라 달라질 수 있어 예약 전 확인이 필요합니다.';
  if (guide.slug.includes('gyeongju')) return '황리단길권과 보문단지권은 이동 방식이 다르므로 실제 방문지를 먼저 정하는 편이 좋습니다.';
  if (guide.slug.includes('gumi')) return '출장 목적이라면 조식 시작 시간과 주차 가능 여부를 먼저 확인하세요.';
  if (hotel.reviewCount && hotel.reviewCount < 50) return '후기 수가 적어 최근 객실 상태와 운영 조건을 추가 확인하는 편이 안전합니다.';
  return '성수기에는 체크인 대기, 주차 혼잡, 가격 변동이 생길 수 있습니다.';
}

function buildTarget(guide: GyeongbukAreaGuide, area: string) {
  if (guide.slug.includes('family')) return '가족 여행';
  if (guide.slug.includes('gumi')) return '출장·짧은 숙박';
  if (guide.slug.includes('pohang') || guide.slug.includes('yeongdeok')) return '바다 여행';
  if (guide.slug.includes('gyeongju')) return '경주 관광';
  if (guide.slug.includes('andong')) return '전통문화 여행';
  if (guide.slug.includes('mungyeong')) return '내륙 힐링 여행';
  return `${area} 여행`;
}

function pickAreaLabel(hotel: Hotel) {
  const text = hotelText(hotel);
  if (/경주|황리단|보문|불국사/i.test(text)) return '경주';
  if (/포항|영일대|죽도|구룡포/i.test(text)) return '포항';
  if (/안동|하회|월영교/i.test(text)) return '안동';
  if (/구미|김천|상주|칠곡/i.test(text)) return '구미·김천·상주';
  if (/문경|영주|풍기|소백산/i.test(text)) return '문경·영주';
  if (/영덕|울진|울릉|강구항|후포항/i.test(text)) return '경북 동해안';
  return '경북';
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
