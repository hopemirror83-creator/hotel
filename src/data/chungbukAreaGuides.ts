import { activeHotels as hotels } from './hotels';
import type { Hotel } from './hotels';
import { isChungbukHotel } from './chungbukSearchIntents';

export type ChungbukAreaGuide = {
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

export type ChungbukAreaGuideHotel = {
  hotel: Hotel;
  guideScore: number;
  reasons: string[];
  caution: string;
  target: string;
  tags: string[];
  tableCells: string[];
};

export const chungbukAreaGuides: ChungbukAreaGuide[] = [
  {
    slug: 'cheongju-osong-hotels',
    path: '/chungbuk/cheongju-osong-hotels/',
    title: '청주 오송 호텔 후기 모음 출장 주차 조식',
    eyebrow: 'CHEONGJU OSONG GUIDE',
    intro: '청주와 오송 숙소는 청주공항, 오송역, 청주터미널, 오창산단처럼 실제 목적지에 따라 만족도가 달라집니다. 출장과 여행 관점에서 위치, 주차, 조식, 체크인을 함께 비교했습니다.',
    purpose: '청주 출장, 오송역 이동, 청주공항 이용 전 숙소를 고르는 사용자를 위한 페이지입니다.',
    intentQuestion: '청주·오송 숙소는 역, 공항, 터미널 중 무엇을 먼저 봐야 할까요?',
    metaDescription: '청주 오송 호텔 후기를 위치, 출장, 주차, 조식, 체크인 기준으로 비교했습니다.',
    criteria: ['오송역 접근', '청주공항', '출장', '주차', '조식'],
    tableColumns: ['청주·오송 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['청주', '오송', '오창', '청주공항', '충북대', '터미널']
  },
  {
    slug: 'chungju-hotels',
    path: '/chungbuk/chungju-hotels/',
    title: '충주 호텔 후기 모음 수안보 주차 가성비',
    eyebrow: 'CHUNGJU GUIDE',
    intro: '충주 숙소는 충주역·터미널, 수안보, 중앙탑 방향이 서로 달라 일정에 맞는 위치 선택이 중요합니다. 후기에서 반복되는 주차, 객실, 가격 만족도를 중심으로 정리했습니다.',
    purpose: '충주 출장, 수안보 여행, 차량 이동 숙박을 준비하는 사용자를 위한 페이지입니다.',
    intentQuestion: '충주 호텔은 시내 접근성과 수안보·관광지 접근성 중 무엇을 먼저 봐야 할까요?',
    metaDescription: '충주 호텔 후기를 수안보, 충주역, 주차, 가성비, 객실 기준으로 비교했습니다.',
    criteria: ['충주역', '수안보', '주차', '가성비', '객실'],
    tableColumns: ['충주 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['충주', '수안보', '충주역', '중앙탑', '탄금대']
  },
  {
    slug: 'jecheon-cheongpung-hotels',
    path: '/chungbuk/jecheon-cheongpung-hotels/',
    title: '제천 청풍호 호텔 후기 모음 가족 리조트 주차',
    eyebrow: 'JECHEON CHEONGPUNG GUIDE',
    intro: '제천·청풍 숙소는 청풍호 전망, 리조트 분위기, 제천역 접근, 월악산 동선에 따라 선택 기준이 달라집니다. 가족 여행과 휴식 관점에서 장단점을 비교했습니다.',
    purpose: '청풍호, 의림지, 월악산, 제천 가족 여행 숙소를 고르는 사용자를 위한 페이지입니다.',
    intentQuestion: '제천·청풍 숙소는 전망과 실제 이동 거리 중 무엇을 먼저 봐야 할까요?',
    metaDescription: '제천 청풍호 호텔 후기를 가족 여행, 리조트, 전망, 주차, 객실 기준으로 비교했습니다.',
    criteria: ['청풍호', '가족', '리조트', '주차', '객실'],
    tableColumns: ['제천·청풍 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['제천', '청풍', '청풍호', '의림지', '월악산', '리솜']
  },
  {
    slug: 'danyang-hotels',
    path: '/chungbuk/danyang-hotels/',
    title: '단양 호텔 펜션 후기 모음 가족 취사 소백산',
    eyebrow: 'DANYANG GUIDE',
    intro: '단양 숙소는 호텔보다 펜션과 게스트하우스 비중이 높아 객실 구조, 취사 가능 여부, 주차, 관광지 이동 시간이 중요합니다. 가족 여행과 자연 관광 관점에서 비교했습니다.',
    purpose: '도담삼봉, 구경시장, 소백산, 만천하스카이워크 여행 전 숙소를 고르는 사용자를 위한 페이지입니다.',
    intentQuestion: '단양 숙소는 관광지 위치와 취사 가능 여부 중 무엇을 먼저 봐야 할까요?',
    metaDescription: '단양 호텔과 펜션 후기를 가족, 취사, 소백산, 도담삼봉, 주차 기준으로 비교했습니다.',
    criteria: ['도담삼봉', '소백산', '가족', '취사', '주차'],
    tableColumns: ['단양 관광 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['단양', '소백산', '도담', '구경시장', '만천하', '펜션']
  },
  {
    slug: 'boeun-sokrisan-hotels',
    path: '/chungbuk/boeun-sokrisan-hotels/',
    title: '보은 속리산 호텔 후기 모음 가족 주차 조용한 숙소',
    eyebrow: 'BOEUN SOKRISAN GUIDE',
    intro: '보은·속리산 숙소는 등산, 가족 여행, 조용한 휴식 목적에 따라 봐야 할 기준이 다릅니다. 주차, 주변 식당, 객실 컨디션, 체크인 편의성을 중심으로 정리했습니다.',
    purpose: '속리산 여행이나 보은 조용한 숙박을 준비하는 사용자를 위한 페이지입니다.',
    intentQuestion: '속리산 숙소는 등산 동선과 주변 편의시설 중 무엇을 먼저 확인해야 할까요?',
    metaDescription: '보은 속리산 호텔 후기를 가족 여행, 주차, 조용함, 체크인, 객실 기준으로 비교했습니다.',
    criteria: ['속리산', '조용함', '가족', '주차', '객실'],
    tableColumns: ['속리산 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['보은', '속리산', '말티', '정이품송', '펜션']
  },
  {
    slug: 'jincheon-eumseong-hotels',
    path: '/chungbuk/jincheon-eumseong-hotels/',
    title: '진천 음성 충북혁신도시 호텔 후기 모음 출장 주차 가성비',
    eyebrow: 'JINCHEON EUMSEONG GUIDE',
    intro: '진천·음성·충북혁신도시 숙소는 출장과 차량 이동 수요가 많아 목적지 접근, 주차, 주변 식당, 객실 방음이 중요합니다. 후기 기반으로 실용적인 선택 기준을 정리했습니다.',
    purpose: '충북혁신도시, 진천, 음성 출장 숙소를 찾는 사용자를 위한 페이지입니다.',
    intentQuestion: '진천·음성 숙소는 출장 목적지 접근성과 가성비 중 무엇을 먼저 봐야 할까요?',
    metaDescription: '진천 음성 충북혁신도시 호텔 후기를 출장, 주차, 가성비, 객실, 위치 기준으로 비교했습니다.',
    criteria: ['충북혁신도시', '출장', '주차', '가성비', '객실'],
    tableColumns: ['진천·음성 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['진천', '음성', '충북혁신도시', '증평', '괴산', '옥천', '영동']
  },
  {
    slug: 'chungbuk-family-hotels',
    path: '/chungbuk/chungbuk-family-hotels/',
    title: '충북 가족 호텔 추천 후기 모음 단양 제천 속리산',
    eyebrow: 'CHUNGBUK FAMILY GUIDE',
    intro: '충북 가족 숙소는 단양 펜션, 제천·청풍 리조트, 속리산 휴식형 숙소처럼 목적에 따라 선택 기준이 다릅니다. 객실 구성, 주차, 주변 이동 편의성을 중심으로 비교했습니다.',
    purpose: '아이 동반 또는 가족 단위 충북 여행 숙소를 고르는 사용자를 위한 페이지입니다.',
    intentQuestion: '충북 가족 숙소는 객실 넓이와 관광지 동선 중 무엇을 먼저 봐야 할까요?',
    metaDescription: '충북 가족 호텔과 펜션 후기를 단양, 제천, 속리산, 주차, 객실 기준으로 비교했습니다.',
    criteria: ['가족', '객실', '주차', '관광 동선', '조용함'],
    tableColumns: ['가족 적합도', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['가족', '리조트', '펜션', '단양', '제천', '속리산', '청풍']
  },
  {
    slug: 'chungbuk-hotel-comparison',
    path: '/chungbuk/chungbuk-hotel-comparison/',
    title: '충북 호텔 비교 후기 모음 청주 단양 제천 충주',
    eyebrow: 'CHUNGBUK COMPARISON',
    intro: '충북 호텔은 청주·오송, 충주, 제천·청풍, 단양, 속리산처럼 목적지가 넓게 나뉩니다. 지역별 이동 동선과 후기 신호를 함께 비교해 예약 전 판단을 돕습니다.',
    purpose: '충북 주요 지역 숙소를 한 번에 비교하려는 사용자를 위한 페이지입니다.',
    intentQuestion: '충북 호텔은 지역명보다 실제 방문지를 기준으로 골라야 할까요?',
    metaDescription: '충북 호텔 후기를 청주, 오송, 충주, 제천, 단양, 속리산 기준으로 비교했습니다.',
    criteria: ['지역 동선', '후기 수', '평점', '주차', '가격대'],
    tableColumns: ['주요 지역', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['충북', '청주', '오송', '충주', '제천', '단양', '속리산']
  }
];

export const chungbukHotels = hotels.filter(isChungbukHotel);

export function getChungbukAreaGuideHotels(guide: ChungbukAreaGuide, limit = 20): ChungbukAreaGuideHotel[] {
  return chungbukHotels
    .map((hotel) => buildGuideHotel(guide, hotel))
    .filter((item) => item.guideScore > 0)
    .sort((a, b) => b.guideScore - a.guideScore)
    .slice(0, limit);
}

export function getRelatedChungbukAreaGuides(hotel: Hotel) {
  if (!isChungbukHotel(hotel)) return [];
  return chungbukAreaGuides
    .map((guide) => ({ guide, score: scoreGuide(guide, hotel) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.guide);
}

function buildGuideHotel(guide: ChungbukAreaGuide, hotel: Hotel): ChungbukAreaGuideHotel {
  const guideScore = scoreGuide(guide, hotel);
  const text = searchableText(hotel);
  const reasons = [
    buildLocationReason(guide, hotel),
    hotel.reviewCount && hotel.reviewCount >= 100 ? `후기 ${hotel.reviewCount.toLocaleString('ko-KR')}건 이상으로 비교 신호가 충분합니다.` : '후기 데이터가 많지는 않아 위치와 가격 조건을 함께 확인해야 합니다.',
    /주차|parking|차량/i.test(text) ? '차량 이동과 주차 조건을 함께 보기 좋은 숙소입니다.' : '주차 가능 여부와 만차 시 대체 주차장을 예약 전에 확인하는 편이 좋습니다.'
  ];

  return {
    hotel,
    guideScore,
    reasons,
    caution: buildCaution(guide, hotel),
    target: buildTarget(guide),
    tags: buildTags(guide, hotel),
    tableCells: [
      buildTableArea(guide, hotel),
      hotel.reviewScore ? String(hotel.reviewScore) : '확인 필요',
      hotel.reviewCount ? `${hotel.reviewCount.toLocaleString('ko-KR')}건` : '후기 부족',
      priceText(hotel),
      buildTarget(guide)
    ]
  };
}

function scoreGuide(guide: ChungbukAreaGuide, hotel: Hotel) {
  const text = searchableText(hotel);
  let score = 0;
  for (const keyword of guide.keywords) {
    if (new RegExp(keyword, 'i').test(text)) score += 20;
  }
  if (guide.slug === 'chungbuk-family-hotels' && /가족|리조트|펜션|풀빌라|카라반|캠핑|한옥|단양|제천|청풍|속리산/i.test(text)) score += 35;
  if (guide.slug === 'chungbuk-hotel-comparison') score += 20;
  score += Math.min(25, (hotel.reviewScore ?? 0) * 2);
  score += Math.min(25, Math.log10((hotel.reviewCount ?? 0) + 1) * 8);
  return score;
}

function buildLocationReason(guide: ChungbukAreaGuide, hotel: Hotel) {
  if (guide.slug.includes('cheongju')) return '청주·오송 이동 동선에서 위치, 주차, 조식 조건을 함께 비교하기 좋습니다.';
  if (guide.slug.includes('chungju')) return '충주 시내와 수안보 방향 이동을 기준으로 확인하기 좋은 후보입니다.';
  if (guide.slug.includes('jecheon')) return '제천·청풍 여행에서 청풍호, 제천역, 월악산 동선을 함께 보기 좋습니다.';
  if (guide.slug.includes('danyang')) return '단양 관광지 이동과 객실 구조, 취사 가능 여부를 함께 비교하기 좋습니다.';
  if (guide.slug.includes('boeun')) return '속리산과 보은 여행에서 조용함, 주차, 주변 편의시설을 확인하기 좋습니다.';
  if (guide.slug.includes('jincheon')) return '진천·음성·충북혁신도시 출장 동선과 주차 조건을 함께 보기 좋습니다.';
  return `${hotel.region || '충북'} 숙소 중 후기와 위치 신호를 함께 확인할 수 있는 후보입니다.`;
}

function buildCaution(guide: ChungbukAreaGuide, hotel: Hotel) {
  if ((hotel.reviewCount ?? 0) < 30) return '후기 수가 많지 않아 최신 후기와 지도 위치를 함께 확인하는 편이 좋습니다.';
  if (guide.slug.includes('danyang') || guide.slug.includes('boeun') || guide.slug.includes('jecheon')) return '관광지와 숙소 사이의 실제 차량 이동 시간, 성수기 주차 혼잡을 확인해야 합니다.';
  return '체크인 시간, 무료 주차 조건, 조식 포함 여부는 예약 옵션별로 달라질 수 있습니다.';
}

function buildTarget(guide: ChungbukAreaGuide) {
  if (guide.slug.includes('cheongju')) return '출장·공항·오송역';
  if (guide.slug.includes('chungju')) return '충주 출장·수안보';
  if (guide.slug.includes('jecheon')) return '청풍호·가족 여행';
  if (guide.slug.includes('danyang')) return '단양 가족 여행';
  if (guide.slug.includes('boeun')) return '속리산·조용한 휴식';
  if (guide.slug.includes('jincheon')) return '혁신도시 출장';
  if (guide.slug.includes('family')) return '가족 여행';
  return '충북 호텔 비교';
}

function buildTags(guide: ChungbukAreaGuide, hotel: Hotel) {
  const tags = [buildTarget(guide)];
  if ((hotel.reviewScore ?? 0) >= 8.5) tags.push('평점 우수');
  if ((hotel.reviewCount ?? 0) >= 300) tags.push('후기 많음');
  if (hotel.averageNightlyRate || hotel.dailyRate) tags.push('가격 확인');
  return tags.slice(0, 4);
}

function buildTableArea(guide: ChungbukAreaGuide, hotel: Hotel) {
  return hotel.address || hotel.region || guide.title.replace(' 후기 모음', '');
}

function priceText(hotel: Hotel) {
  const price = hotel.averageNightlyRate ?? hotel.dailyRate;
  return price ? `${price.toLocaleString('ko-KR')}원~` : '가격 확인';
}

function searchableText(hotel: Hotel) {
  return [
    hotel.slug,
    hotel.hotelName,
    hotel.region,
    hotel.address,
    hotel.analysis?.summary,
    hotel.analysis?.seoTitle,
    hotel.analysis?.metaDescription,
    ...(hotel.analysis?.pros ?? []),
    ...(hotel.analysis?.checkPoints ?? [])
  ]
    .filter(Boolean)
    .join(' ');
}
