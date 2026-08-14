import { activeHotels as hotels } from './hotels';
import type { Hotel } from './hotels';
import { isDaejeonHotel } from './daejeonSearchIntents';

export type DaejeonAreaGuide = {
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

export type DaejeonAreaGuideHotel = {
  hotel: Hotel;
  guideScore: number;
  reasons: string[];
  caution: string;
  target: string;
  tags: string[];
  tableCells: string[];
};

export const daejeonAreaGuides: DaejeonAreaGuide[] = [
  {
    slug: 'yuseong-hotels',
    path: '/daejeon/yuseong-hotels/',
    title: '대전 유성온천 호텔 후기 모음 온천 체크인 주차 조식',
    eyebrow: 'YUSEONG GUIDE',
    intro: '유성온천 호텔은 온천 이용 기대치, 주변 식당, 지하철 접근성, 주차 조건을 함께 봐야 합니다.',
    purpose: '유성온천 여행이나 가족 숙박을 준비하는 사용자를 위한 페이지입니다.',
    intentQuestion: '유성온천 호텔은 온천·주차·객실 조건 중 무엇을 먼저 봐야 할까요?',
    metaDescription: '대전 유성온천 호텔 후기를 온천, 체크인, 주차, 조식, 가족 여행 기준으로 비교했습니다.',
    criteria: ['온천권 위치', '주차', '객실 컨디션', '조식', '가족 여행'],
    tableColumns: ['유성 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['유성', '온천', '봉명', '궁동', '구암', '월평', '도안']
  },
  {
    slug: 'dunsan-hotels',
    path: '/daejeon/dunsan-hotels/',
    title: '대전 둔산동 호텔 후기 모음 출장 정부청사 주차 체크인',
    eyebrow: 'DUNSAN GUIDE',
    intro: '둔산동 호텔은 정부청사, 시청, 탄방동, 갤러리아 주변 일정과 출장 동선을 기준으로 비교하는 것이 좋습니다.',
    purpose: '대전 출장, 정부청사 일정, 둔산 상권 이용자를 위한 페이지입니다.',
    intentQuestion: '둔산동 호텔은 출장 동선과 주차 중 무엇을 먼저 확인해야 할까요?',
    metaDescription: '대전 둔산동 호텔 후기를 출장, 정부청사, 주차, 체크인, 조식 기준으로 비교했습니다.',
    criteria: ['정부청사 접근', '출장 동선', '주차', '체크인', '조식'],
    tableColumns: ['둔산 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['둔산', '정부청사', '시청', '탄방', '갈마', '만년', '갤러리아']
  },
  {
    slug: 'daejeon-station-hotels',
    path: '/daejeon/daejeon-station-hotels/',
    title: '대전역 중앙로 호텔 후기 모음 교통 성심당 체크인 가성비',
    eyebrow: 'DAEJEON STATION GUIDE',
    intro: '대전역·중앙로 호텔은 KTX 이동, 성심당 방문, 원도심 도보 동선, 주차 조건을 함께 봐야 합니다.',
    purpose: '대전역 도착 후 짧게 머물거나 성심당·중앙로 일정을 잡는 사용자를 위한 페이지입니다.',
    intentQuestion: '대전역 주변 호텔은 교통 편의성과 주차 중 무엇을 더 중요하게 봐야 할까요?',
    metaDescription: '대전역 중앙로 호텔 후기를 교통, 성심당, 체크인, 가성비, 주차 기준으로 비교했습니다.',
    criteria: ['대전역 접근', '중앙로 상권', '성심당', '주차', '가성비'],
    tableColumns: ['역 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['대전역', '중앙로', '은행', '선화', '소제', '성심당', '원도심']
  },
  {
    slug: 'expo-convention-hotels',
    path: '/daejeon/expo-convention-hotels/',
    title: '대전 엑스포 컨벤션 호텔 후기 모음 DCC 출장 주차 조식',
    eyebrow: 'EXPO GUIDE',
    intro: '엑스포·컨벤션 호텔은 DCC 행사, 신세계, 엑스포과학공원, 주차와 체크인 대기 조건을 함께 봐야 합니다.',
    purpose: '컨벤션 행사, 엑스포과학공원, 신세계 주변 숙박을 찾는 사용자를 위한 페이지입니다.',
    intentQuestion: '대전 엑스포권 호텔은 행사 접근성과 가격 변동 중 무엇을 봐야 할까요?',
    metaDescription: '대전 엑스포 컨벤션 호텔 후기를 DCC, 출장, 주차, 조식, 행사 접근성 기준으로 비교했습니다.',
    criteria: ['DCC 접근', '행사 일정', '주차', '조식', '가격 변동'],
    tableColumns: ['컨벤션 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['엑스포', 'DCC', '컨벤션', '오노마', 'ICC', '신세계', '과학공원']
  },
  {
    slug: 'shintanjin-daedeok-hotels',
    path: '/daejeon/shintanjin-daedeok-hotels/',
    title: '대전 신탄진 대덕 호텔 후기 모음 가성비 주차 출장 체크인',
    eyebrow: 'DAEDEOK GUIDE',
    intro: '신탄진·대덕권 호텔은 차량 이동, 출장 목적지, 주차, 가격 대비 객실 컨디션을 중심으로 보는 편이 좋습니다.',
    purpose: '대덕구 출장, 신탄진역 주변 숙박, 차량 이동 숙박을 찾는 사용자를 위한 페이지입니다.',
    intentQuestion: '신탄진·대덕 호텔은 대전 중심지 호텔과 어떻게 비교해야 할까요?',
    metaDescription: '대전 신탄진 대덕 호텔 후기를 가성비, 주차, 출장, 체크인, 차량 이동 기준으로 비교했습니다.',
    criteria: ['신탄진 접근', '대덕구 출장', '주차', '가성비', '차량 이동'],
    tableColumns: ['대덕 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['신탄진', '대덕', '중리', '오정', '송촌']
  },
  {
    slug: 'daeheung-eunhaeng-hotels',
    path: '/daejeon/daeheung-eunhaeng-hotels/',
    title: '대전 대흥동 은행동 호텔 후기 모음 성심당 가성비 체크인 주차',
    eyebrow: 'OLD TOWN GUIDE',
    intro: '대흥동·은행동 호텔은 중앙로 상권, 성심당, 원도심 도보 이동과 주차 조건을 함께 비교해야 합니다.',
    purpose: '대전 원도심, 성심당, 중앙로 상권을 중심으로 숙소를 고르는 사용자를 위한 페이지입니다.',
    intentQuestion: '대흥동·은행동 호텔은 도보 동선과 주차 중 무엇이 더 중요할까요?',
    metaDescription: '대전 대흥동 은행동 호텔 후기를 성심당, 가성비, 체크인, 주차, 원도심 동선 기준으로 비교했습니다.',
    criteria: ['성심당 접근', '중앙로 상권', '주차', '가성비', '야간 소음'],
    tableColumns: ['원도심 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['대흥', '은행', '중앙로', '문창', '유천', '오류', '용문', '성심당']
  },
  {
    slug: 'daejeon-family-hotels',
    path: '/daejeon/daejeon-family-hotels/',
    title: '대전 가족 호텔 후기 모음 유성 엑스포 주차 객실 조식',
    eyebrow: 'FAMILY GUIDE',
    intro: '대전 가족 호텔은 객실 컨디션, 주차, 주변 이동, 조식, 조용함을 함께 확인해야 합니다.',
    purpose: '아이와 대전 여행을 준비하거나 유성·엑스포 주변에서 가족 숙박을 찾는 사용자를 위한 페이지입니다.',
    intentQuestion: '대전 가족 호텔은 객실과 이동 동선 중 무엇을 먼저 봐야 할까요?',
    metaDescription: '대전 가족 호텔 후기를 유성, 엑스포, 주차, 객실, 조식 기준으로 비교했습니다.',
    criteria: ['가족 적합도', '객실 컨디션', '주차', '조식', '주변 이동'],
    tableColumns: ['가족 동선', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['가족', '유성', '엑스포', '온천', '주차', '조식']
  },
  {
    slug: 'daejeon-hotel-comparison',
    path: '/daejeon/daejeon-hotel-comparison/',
    title: '대전 호텔 비교 후기 모음 유성 둔산 대전역 엑스포 신탄진',
    eyebrow: 'DAEJEON COMPARISON',
    intro: '대전 호텔은 유성, 둔산, 대전역, 엑스포, 신탄진처럼 목적지에 따라 선택 기준이 달라집니다.',
    purpose: '대전 주요 지역 호텔을 한 번에 비교하려는 사용자를 위한 페이지입니다.',
    intentQuestion: '대전 호텔은 지역명보다 실제 방문 목적지 기준으로 골라야 할까요?',
    metaDescription: '대전 호텔 후기를 유성, 둔산, 대전역, 엑스포, 신탄진 기준으로 비교했습니다.',
    criteria: ['지역 동선', '평점', '후기 수', '주차', '가격대'],
    tableColumns: ['주요 지역', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['대전', '유성', '둔산', '대전역', '엑스포', '신탄진', '대덕', '대흥']
  }
];

export const daejeonHotels = hotels.filter(isDaejeonHotel);

export function getDaejeonAreaGuideHotels(guide: DaejeonAreaGuide, limit = 20): DaejeonAreaGuideHotel[] {
  return daejeonHotels
    .map((hotel) => buildGuideHotel(guide, hotel))
    .filter((item) => item.guideScore > 0)
    .sort((a, b) => b.guideScore - a.guideScore)
    .slice(0, limit);
}

export function getRelatedDaejeonAreaGuides(hotel: Hotel) {
  if (!isDaejeonHotel(hotel)) return [];
  return daejeonAreaGuides
    .map((guide) => ({ guide, score: scoreGuide(guide, hotel) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.guide);
}

function buildGuideHotel(guide: DaejeonAreaGuide, hotel: Hotel): DaejeonAreaGuideHotel {
  const guideScore = scoreGuide(guide, hotel);
  const reasons = [
    buildLocationReason(guide),
    hotel.reviewCount && hotel.reviewCount >= 100 ? `후기 ${hotel.reviewCount.toLocaleString('ko-KR')}건 이상으로 비교 신호가 충분합니다.` : '후기 수가 많지 않아 위치와 객실 조건을 함께 확인하는 편이 좋습니다.',
    /주차|parking|차량/i.test(searchableText(hotel)) ? '차량 이동과 주차 조건을 함께 보기 좋은 숙소입니다.' : '주차 가능 여부와 만차 시 대체 주차장을 예약 전에 확인하는 편이 좋습니다.'
  ];

  return {
    hotel,
    guideScore,
    reasons,
    caution: buildCaution(guide),
    target: buildTarget(guide),
    tags: buildTags(guide, hotel),
    tableCells: [
      hotel.address || hotel.region || guide.title,
      hotel.reviewScore ? String(hotel.reviewScore) : '확인 필요',
      hotel.reviewCount ? `${hotel.reviewCount.toLocaleString('ko-KR')}건` : '후기 부족',
      priceText(hotel),
      buildTarget(guide)
    ]
  };
}

function scoreGuide(guide: DaejeonAreaGuide, hotel: Hotel) {
  const text = searchableText(hotel);
  let score = guide.slug === 'daejeon-hotel-comparison' ? 20 : 0;
  for (const keyword of guide.keywords) {
    if (new RegExp(keyword, 'i').test(text)) score += 22;
  }
  score += Math.min(25, (hotel.reviewScore ?? 0) * 2);
  score += Math.min(25, Math.log10((hotel.reviewCount ?? 0) + 1) * 8);
  return score;
}

function buildLocationReason(guide: DaejeonAreaGuide) {
  if (guide.slug.includes('yuseong')) return '유성온천, 봉명동, 구암역 주변 동선에서 온천·식당·주차를 함께 비교하기 좋습니다.';
  if (guide.slug.includes('dunsan')) return '둔산동, 정부청사, 시청 주변 출장 동선에서 체크인과 주차 조건을 확인하기 좋습니다.';
  if (guide.slug.includes('station')) return '대전역, 중앙로, 성심당 방문 동선에서 교통과 가성비를 함께 보기 좋습니다.';
  if (guide.slug.includes('expo')) return 'DCC, 엑스포과학공원, 신세계 주변 행사 일정에서 접근성을 비교하기 좋습니다.';
  if (guide.slug.includes('shintanjin')) return '신탄진·대덕구 차량 이동 일정에서 주차와 가격대를 함께 비교하기 좋습니다.';
  if (guide.slug.includes('daeheung')) return '대흥동·은행동 원도심 상권과 성심당 방문 동선에서 보기 좋은 숙소입니다.';
  if (guide.slug.includes('family')) return '가족 여행 기준에서 객실 컨디션, 주차, 조식 조건을 함께 볼 수 있습니다.';
  return '대전 주요 지역별 이동 동선과 후기 신호를 한 번에 비교하기 좋습니다.';
}

function buildCaution(guide: DaejeonAreaGuide) {
  if (guide.slug.includes('station') || guide.slug.includes('daeheung')) return '원도심 상권 주변은 주차와 야간 소음 조건이 숙소별로 다를 수 있습니다.';
  if (guide.slug.includes('expo')) return '행사 기간에는 가격과 체크인 대기, 주차 혼잡도가 평소와 달라질 수 있습니다.';
  if (guide.slug.includes('shintanjin')) return '대전역·둔산·유성 중심 일정이라면 이동 시간이 길 수 있습니다.';
  if (guide.slug.includes('yuseong')) return '온천 목적이라면 실제 온천 시설 운영 여부와 객실 욕조 조건을 따로 확인해야 합니다.';
  return '체크인 시간, 무료 주차 조건, 조식 포함 여부는 예약 옵션별로 달라질 수 있습니다.';
}

function buildTarget(guide: DaejeonAreaGuide) {
  if (guide.slug.includes('yuseong')) return '유성온천 여행';
  if (guide.slug.includes('dunsan')) return '둔산 출장';
  if (guide.slug.includes('station')) return '대전역·성심당';
  if (guide.slug.includes('expo')) return '엑스포·컨벤션';
  if (guide.slug.includes('shintanjin')) return '대덕·신탄진 출장';
  if (guide.slug.includes('daeheung')) return '대전 원도심';
  if (guide.slug.includes('family')) return '가족 여행';
  return '대전 호텔 비교';
}

function buildTags(guide: DaejeonAreaGuide, hotel: Hotel) {
  const tags = [buildTarget(guide)];
  if ((hotel.reviewScore ?? 0) >= 8.5) tags.push('평점 우수');
  if ((hotel.reviewCount ?? 0) >= 300) tags.push('후기 많음');
  if (hotel.averageNightlyRate || hotel.dailyRate) tags.push('가격 확인');
  return tags.slice(0, 4);
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
