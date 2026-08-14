import { activeHotels as hotels } from './hotels';
import type { Hotel } from './hotels';
import { isGwangjuHotel } from './gwangjuSearchIntents';

export type GwangjuAreaGuide = {
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

export type GwangjuAreaGuideHotel = {
  hotel: Hotel;
  guideScore: number;
  reasons: string[];
  caution: string;
  target: string;
  tags: string[];
  tableCells: string[];
};

export const gwangjuAreaGuides: GwangjuAreaGuide[] = [
  guide('sangmu-hotels', '광주 상무지구 호텔 후기 모음 출장 주차 조식 체크인', 'SANGMU GUIDE', '상무지구 호텔은 출장 목적지, 상무역 접근성, 주차와 조식 조건을 함께 비교해야 합니다.', '광주 출장과 상무지구 일정을 준비하는 여행자를 위한 페이지입니다.', '상무지구 호텔은 위치와 주차 중 무엇을 먼저 확인해야 할까요?', ['상무지구 접근', '출장 동선', '주차', '조식', '체크인'], ['상무', '치평', '시청', '김대중컨벤션', '운천']),
  guide('songjeong-station-hotels', '광주송정역 호텔 후기 모음 KTX 공항 주차 체크인', 'SONGJEONG GUIDE', '광주송정역 주변 호텔은 KTX·SRT 도착 시간, 광주공항 이동, 짐 보관과 늦은 체크인을 중심으로 보는 편이 좋습니다.', '광주송정역과 광주공항을 이용하는 여행자를 위한 페이지입니다.', '광주송정역 호텔은 교통과 체크인 조건 중 무엇이 중요할까요?', ['송정역 접근', '광주공항 이동', '체크인', '짐 보관', '주차'], ['송정', '송정역', '광주공항', '도산', '우산', '하남', '광산']),
  guide('cheomdan-hotels', '광주 첨단지구 호텔 후기 모음 출장 주차 조식 가성비', 'CHEOMDAN GUIDE', '첨단지구 호텔은 산업단지와 업무 목적지 접근성, 차량 이동, 주차, 객실 컨디션을 함께 확인해야 합니다.', '첨단지구 출장과 광산구 숙박을 준비하는 여행자를 위한 페이지입니다.', '첨단지구 호텔은 출장 동선과 가성비를 어떻게 비교해야 할까요?', ['첨단지구 접근', '출장 동선', '주차', '객실', '가성비'], ['첨단', '쌍암', '월계', '수완', '신가', '광산']),
  guide('chungjangro-hotels', '광주 충장로 동명동 호텔 후기 모음 위치 주차 가성비', 'CHUNGJANGRO GUIDE', '충장로·동명동 호텔은 도보 여행 동선, 야간 이동, 주차와 주변 식당 접근성을 함께 보는 것이 좋습니다.', '광주 구도심과 동명동 여행을 준비하는 여행자를 위한 페이지입니다.', '충장로 호텔은 도보 위치와 주차 중 무엇을 먼저 봐야 할까요?', ['충장로 접근', '동명동 이동', '주차', '야간 동선', '가성비'], ['충장', '동명', '금남로', '대인', '계림', '동구']),
  guide('gwangju-family-hotels', '광주 가족호텔 후기 모음 객실 주차 조식 여행 체크', 'FAMILY GUIDE', '광주 가족호텔은 객실 여유, 주차, 조식, 주변 이동과 소음 후기를 함께 확인해야 합니다.', '아이와 광주를 방문하거나 가족 단위 객실을 찾는 여행자를 위한 페이지입니다.', '광주 가족호텔은 객실과 주차 중 무엇을 먼저 비교해야 할까요?', ['가족 적합도', '객실 여유', '주차', '조식', '주변 이동'], ['가족', '패밀리', '스위트', '리조트', '키즈', '조식']),
  guide('gwangju-hotel-comparison', '광주 호텔 비교 후기 모음 상무 송정역 첨단 충장로', 'GWANGJU COMPARISON', '광주 호텔은 상무지구, 송정역, 첨단지구, 충장로처럼 실제 목적지에 따라 유리한 위치가 달라집니다.', '광주 주요 지역 호텔을 한 번에 비교하려는 여행자를 위한 페이지입니다.', '광주 호텔은 지역명보다 실제 방문 목적지를 기준으로 골라야 할까요?', ['지역 동선', '평점', '후기 수', '주차', '가격대'], ['광주'])
];

function guide(slug: string, title: string, eyebrow: string, intro: string, purpose: string, intentQuestion: string, criteria: string[], keywords: string[]): GwangjuAreaGuide {
  return {
    slug,
    path: `/gwangju/${slug}/`,
    title,
    eyebrow,
    intro,
    purpose,
    intentQuestion,
    metaDescription: `${title}을 위치, 후기 수, 평점, 주차, 조식과 추천 대상 기준으로 비교했습니다.`,
    criteria,
    tableColumns: ['지역 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords
  };
}

export const gwangjuHotels = hotels.filter(isGwangjuHotel);

export function getGwangjuAreaGuideHotels(guide: GwangjuAreaGuide, limit = 20): GwangjuAreaGuideHotel[] {
  return gwangjuHotels
    .map((hotel) => buildGuideHotel(guide, hotel))
    .filter((item) => item.guideScore > 0)
    .sort((a, b) => b.guideScore - a.guideScore)
    .slice(0, limit);
}

function buildGuideHotel(guide: GwangjuAreaGuide, hotel: Hotel): GwangjuAreaGuideHotel {
  const text = searchableText(hotel);
  const target = targetText(guide);
  const guideScore = scoreGuide(guide, hotel, text);
  const reasons = [
    `${target} 일정에서 위치와 이동 동선을 비교하기 좋은 후보입니다.`,
    hotel.reviewCount && hotel.reviewCount >= 100 ? `후기 ${hotel.reviewCount.toLocaleString('ko-KR')}건으로 비교 단서가 충분합니다.` : '후기 수가 많지 않아 위치와 객실 조건을 함께 확인하는 편이 좋습니다.',
    /주차|parking|차량/i.test(text) ? '차량 이동과 주차 관련 단서가 확인됩니다.' : '무료 주차 여부와 만차 시 대체 주차장을 예약 전에 확인하세요.'
  ];
  const tags = [target];
  if ((hotel.reviewScore ?? 0) >= 8.5) tags.push('평점 우수');
  if ((hotel.reviewCount ?? 0) >= 100) tags.push('후기 많음');

  return {
    hotel,
    guideScore,
    reasons,
    caution: '체크인 시간, 조식 포함 여부, 무료 주차 조건은 객실 상품별로 달라질 수 있습니다.',
    target,
    tags: tags.slice(0, 4),
    tableCells: [hotel.address || '위치 확인', hotel.reviewScore ? String(hotel.reviewScore) : '확인 필요', hotel.reviewCount ? `${hotel.reviewCount.toLocaleString('ko-KR')}건` : '후기 부족', priceText(hotel), target]
  };
}

function scoreGuide(guide: GwangjuAreaGuide, hotel: Hotel, text: string) {
  let score = guide.slug === 'gwangju-hotel-comparison' ? 20 : 0;
  for (const keyword of guide.keywords) if (text.includes(keyword)) score += 22;
  score += Math.min(25, (hotel.reviewScore ?? 0) * 2);
  score += Math.min(25, Math.log10((hotel.reviewCount ?? 0) + 1) * 8);
  return score;
}

function targetText(guide: GwangjuAreaGuide) {
  if (guide.slug.includes('sangmu')) return '상무지구 출장';
  if (guide.slug.includes('songjeong')) return '송정역·공항 이동';
  if (guide.slug.includes('cheomdan')) return '첨단지구 출장';
  if (guide.slug.includes('chungjangro')) return '충장로·동명동 여행';
  if (guide.slug.includes('family')) return '가족 여행';
  return '광주 호텔 비교';
}

function priceText(hotel: Hotel) {
  const price = hotel.averageNightlyRate ?? hotel.dailyRate;
  return price ? `${price.toLocaleString('ko-KR')}원~` : '가격 확인';
}

function searchableText(hotel: Hotel) {
  return [hotel.slug, hotel.hotelName, hotel.region, hotel.address, hotel.analysis?.summary, hotel.analysis?.seoTitle, ...(hotel.analysis?.pros ?? []), ...(hotel.analysis?.checkPoints ?? [])].filter(Boolean).join(' ');
}
