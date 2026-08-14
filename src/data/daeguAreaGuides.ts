import { activeHotels as hotels } from './hotels';
import type { Hotel } from './hotels';
import { isDaeguHotel } from './daeguSearchIntents';

export type DaeguAreaGuide = {
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

export type DaeguAreaGuideHotel = {
  hotel: Hotel;
  guideScore: number;
  reasons: string[];
  caution: string;
  target: string;
  tags: string[];
  tableCells: string[];
};

export const daeguAreaGuides: DaeguAreaGuide[] = [
  {
    slug: 'dongseongro-hotels',
    path: '/daegu/dongseongro-hotels/',
    title: '대구 동성로 호텔 후기 모음 위치 체크인 주차 조식',
    eyebrow: 'DONGSEONGRO GUIDE',
    intro: '동성로 호텔은 반월당, 중앙로, 서문시장, 대구역 동선과 함께 주차·소음·체크인 조건을 같이 봐야 합니다.',
    purpose: '대구 시내 여행이나 동성로 도보 일정을 준비하는 사용자를 위한 페이지입니다.',
    intentQuestion: '동성로 호텔은 위치와 주차 중 무엇을 먼저 봐야 할까요?',
    metaDescription: '대구 동성로 호텔 후기를 위치, 체크인, 주차, 조식, 소음 기준으로 비교했습니다.',
    criteria: ['동성로 접근', '주차', '소음', '체크인', '조식'],
    tableColumns: ['동성로 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['동성로', '반월당', '중앙로', '서문시장', '대구역', '중구']
  },
  {
    slug: 'dongdaegu-station-hotels',
    path: '/daegu/dongdaegu-station-hotels/',
    title: '동대구역 호텔 후기 모음 교통 출장 체크인 주차',
    eyebrow: 'DONGDAEGU GUIDE',
    intro: '동대구역 호텔은 KTX, 대구공항, 늦은 도착, 출장 일정에 맞춰 교통과 체크인 조건을 보는 것이 중요합니다.',
    purpose: '동대구역·대구공항 이동이 중요한 출장객과 여행자를 위한 페이지입니다.',
    intentQuestion: '동대구역 호텔은 역 접근성과 체크인 조건 중 무엇이 더 중요할까요?',
    metaDescription: '동대구역 호텔 후기를 교통, 출장, 체크인, 주차, 조식 기준으로 비교했습니다.',
    criteria: ['동대구역', '대구공항', '출장', '체크인', '주차'],
    tableColumns: ['역 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['동대구', '동대구역', '대구공항', '동구', '신천', '동촌유원지']
  },
  {
    slug: 'suseong-hotels',
    path: '/daegu/suseong-hotels/',
    title: '대구 수성못 호텔 후기 모음 가족 호캉스 주차 객실',
    eyebrow: 'SUSEONG GUIDE',
    intro: '수성구 호텔은 수성못, 범어, 라이온즈파크 일정과 함께 객실 만족도, 주차, 가족 동반 편의성을 확인해야 합니다.',
    purpose: '수성못 주변 호캉스나 가족 여행 숙소를 고르는 사용자를 위한 페이지입니다.',
    intentQuestion: '수성못 호텔은 호캉스와 가족 여행 기준에서 무엇을 봐야 할까요?',
    metaDescription: '대구 수성못 호텔 후기를 가족, 호캉스, 주차, 객실, 위치 기준으로 비교했습니다.',
    criteria: ['수성못', '가족', '객실', '주차', '호캉스'],
    tableColumns: ['수성구 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['수성', '수성못', '범어', '황금', '라이온즈파크', '알파시티']
  },
  {
    slug: 'exco-hotels',
    path: '/daegu/exco-hotels/',
    title: '대구 엑스코 호텔 후기 모음 출장 행사 주차 조식',
    eyebrow: 'EXCO GUIDE',
    intro: '대구 엑스코 호텔은 행사 일정, 경북대 인근 이동, 주차, 조식 시작 시간, 체크인 대기를 함께 봐야 합니다.',
    purpose: '엑스코 행사나 북구·경북대 일정을 준비하는 사용자를 위한 페이지입니다.',
    intentQuestion: '엑스코 호텔은 행사장 접근성과 주차 중 무엇을 먼저 봐야 할까요?',
    metaDescription: '대구 엑스코 호텔 후기를 출장, 행사, 주차, 조식, 체크인 기준으로 비교했습니다.',
    criteria: ['엑스코', '행사', '출장', '주차', '조식'],
    tableColumns: ['엑스코 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['엑스코', 'EXCO', '경북대', '북구']
  },
  {
    slug: 'seongseo-hotels',
    path: '/daegu/seongseo-hotels/',
    title: '대구 성서 달서구 호텔 후기 모음 출장 주차 가성비 객실',
    eyebrow: 'SEONGSEO GUIDE',
    intro: '성서·달서구 호텔은 출장 목적지, 차량 이동, 주차, 가격 대비 객실 만족도를 중심으로 비교하는 편이 좋습니다.',
    purpose: '성서산단, 달서구, 두류·상인 일정을 준비하는 사용자를 위한 페이지입니다.',
    intentQuestion: '성서·달서구 호텔은 출장과 가성비 기준에서 무엇을 봐야 할까요?',
    metaDescription: '대구 성서 달서구 호텔 후기를 출장, 주차, 가성비, 객실 기준으로 비교했습니다.',
    criteria: ['성서', '달서구', '출장', '주차', '가성비'],
    tableColumns: ['성서·달서 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['성서', '달서', '상인', '두류', '월배', '대명', '앞산']
  },
  {
    slug: 'palgongsan-hotels',
    path: '/daegu/palgongsan-hotels/',
    title: '대구 팔공산 호텔 후기 모음 가족 조용함 주차 휴식',
    eyebrow: 'PALGONGSAN GUIDE',
    intro: '팔공산 호텔은 시내 접근성보다 조용함, 차량 이동, 주변 식당, 가족 휴식 조건을 우선 보는 편이 좋습니다.',
    purpose: '팔공산 나들이나 조용한 휴식형 숙소를 찾는 사용자를 위한 페이지입니다.',
    intentQuestion: '팔공산 호텔은 시내 접근성보다 어떤 조건을 봐야 할까요?',
    metaDescription: '대구 팔공산 호텔 후기를 가족, 조용함, 주차, 휴식 기준으로 비교했습니다.',
    criteria: ['팔공산', '조용함', '가족', '주차', '휴식'],
    tableColumns: ['팔공산 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['팔공산', '이시아']
  },
  {
    slug: 'hyeonpung-hotels',
    path: '/daegu/hyeonpung-hotels/',
    title: '대구 현풍 달성군 호텔 후기 모음 출장 주차 가성비 체크인',
    eyebrow: 'HYEONPUNG GUIDE',
    intro: '현풍·달성군 호텔은 대구 중심가보다 출장 목적지와 차량 이동 시간이 중요합니다. 주차와 체크인 조건을 함께 확인해야 합니다.',
    purpose: '현풍, 달성군, 테크노폴리스 일정을 준비하는 사용자를 위한 페이지입니다.',
    intentQuestion: '현풍·달성군 호텔은 대구 중심가 숙소와 어떻게 비교해야 할까요?',
    metaDescription: '대구 현풍 달성군 호텔 후기를 출장, 주차, 가성비, 체크인 기준으로 비교했습니다.',
    criteria: ['현풍', '달성군', '출장', '주차', '가성비'],
    tableColumns: ['현풍·달성 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['현풍', '달성', '테크노폴리스', '혁신도시']
  },
  {
    slug: 'daegu-hotel-comparison',
    path: '/daegu/daegu-hotel-comparison/',
    title: '대구 호텔 비교 후기 모음 동성로 동대구역 수성못 성서',
    eyebrow: 'DAEGU COMPARISON',
    intro: '대구 호텔은 동성로, 동대구역, 수성못, 엑스코, 성서처럼 목적지에 따라 선택 기준이 달라집니다.',
    purpose: '대구 주요 지역 호텔을 한 번에 비교하려는 사용자를 위한 페이지입니다.',
    intentQuestion: '대구 호텔은 지역명보다 실제 방문 목적지를 기준으로 골라야 할까요?',
    metaDescription: '대구 호텔 후기를 동성로, 동대구역, 수성못, 엑스코, 성서 기준으로 비교했습니다.',
    criteria: ['지역 동선', '평점', '후기 수', '주차', '가격대'],
    tableColumns: ['주요 지역', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['대구', '동성로', '동대구', '수성', '엑스코', '성서', '팔공산', '현풍']
  }
];

export const daeguHotels = hotels.filter(isDaeguHotel);

export function getDaeguAreaGuideHotels(guide: DaeguAreaGuide, limit = 20): DaeguAreaGuideHotel[] {
  return daeguHotels
    .map((hotel) => buildGuideHotel(guide, hotel))
    .filter((item) => item.guideScore > 0)
    .sort((a, b) => b.guideScore - a.guideScore)
    .slice(0, limit);
}

export function getRelatedDaeguAreaGuides(hotel: Hotel) {
  if (!isDaeguHotel(hotel)) return [];
  return daeguAreaGuides
    .map((guide) => ({ guide, score: scoreGuide(guide, hotel) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.guide);
}

function buildGuideHotel(guide: DaeguAreaGuide, hotel: Hotel): DaeguAreaGuideHotel {
  const guideScore = scoreGuide(guide, hotel);
  const reasons = [
    buildLocationReason(guide),
    hotel.reviewCount && hotel.reviewCount >= 100 ? `후기 ${hotel.reviewCount.toLocaleString('ko-KR')}건 이상으로 비교 신호가 충분합니다.` : '후기 수가 많지는 않아 최신 후기와 위치 조건을 함께 확인해야 합니다.',
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

function scoreGuide(guide: DaeguAreaGuide, hotel: Hotel) {
  const text = searchableText(hotel);
  let score = guide.slug === 'daegu-hotel-comparison' ? 20 : 0;
  for (const keyword of guide.keywords) {
    if (new RegExp(keyword, 'i').test(text)) score += 22;
  }
  score += Math.min(25, (hotel.reviewScore ?? 0) * 2);
  score += Math.min(25, Math.log10((hotel.reviewCount ?? 0) + 1) * 8);
  return score;
}

function buildLocationReason(guide: DaeguAreaGuide) {
  if (guide.slug.includes('dongseongro')) return '동성로·반월당·중앙로 동선에서 위치와 주차를 함께 비교하기 좋습니다.';
  if (guide.slug.includes('dongdaegu')) return '동대구역, 대구공항, 출장 이동 동선에서 체크인 조건을 확인하기 좋습니다.';
  if (guide.slug.includes('suseong')) return '수성못·수성구 일정에서 객실과 주차, 가족 동반 조건을 비교하기 좋습니다.';
  if (guide.slug.includes('exco')) return '엑스코 행사와 경북대 인근 일정에서 접근성과 주차를 보기 좋습니다.';
  if (guide.slug.includes('seongseo')) return '성서·달서구 출장과 차량 이동 숙박 기준으로 비교하기 좋습니다.';
  if (guide.slug.includes('palgongsan')) return '팔공산 주변 조용한 휴식과 차량 이동 조건을 확인하기 좋습니다.';
  if (guide.slug.includes('hyeonpung')) return '현풍·달성군 출장과 차량 이동 동선에 맞춰 보기 좋습니다.';
  return '대구 주요 지역별 동선과 후기 신호를 한 번에 비교하기 좋습니다.';
}

function buildCaution(guide: DaeguAreaGuide) {
  if (guide.slug.includes('dongseongro')) return '번화가 인근은 주차와 야간 소음 조건이 객실 위치에 따라 달라질 수 있습니다.';
  if (guide.slug.includes('exco')) return '행사 기간에는 가격과 체크인 대기, 주차 혼잡이 달라질 수 있습니다.';
  if (guide.slug.includes('palgongsan')) return '시내 접근성보다 차량 이동과 주변 편의시설 운영 시간을 먼저 확인해야 합니다.';
  return '체크인 시간, 무료 주차 조건, 조식 포함 여부는 예약 옵션별로 달라질 수 있습니다.';
}

function buildTarget(guide: DaeguAreaGuide) {
  if (guide.slug.includes('dongseongro')) return '동성로 여행';
  if (guide.slug.includes('dongdaegu')) return '역·공항 이동';
  if (guide.slug.includes('suseong')) return '수성구 가족·호캉스';
  if (guide.slug.includes('exco')) return '엑스코 출장';
  if (guide.slug.includes('seongseo')) return '성서·달서 출장';
  if (guide.slug.includes('palgongsan')) return '팔공산 휴식';
  if (guide.slug.includes('hyeonpung')) return '현풍·달성 출장';
  return '대구 호텔 비교';
}

function buildTags(guide: DaeguAreaGuide, hotel: Hotel) {
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
