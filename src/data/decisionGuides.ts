import { activeHotels as hotels } from './hotels';
import type { Hotel } from './hotels';

export type IssueLevel = 'high' | 'medium' | 'low';

export interface HotelDecisionTags {
  familyScore: number;
  coupleScore: number;
  businessScore: number;
  airportScore: number;
  parkingScore: number;
  breakfastScore: number;
  cleanlinessScore: number;
  roomScore: number;
  noiseIssue: IssueLevel;
  valueScore: number;
  oceanViewScore: number;
  revisitScore: number;
  repeatedConsScore: number;
  summaryTags: string[];
}

export interface GuideHotel {
  hotel: Hotel;
  tags: HotelDecisionTags;
  guideScore: number;
  reasons: string[];
  caution: string;
  target: string;
}

export interface DecisionGuide {
  slug: string;
  path: string;
  title: string;
  eyebrow: string;
  purpose: string;
  criteria: string[];
  intro: string;
  intentQuestion: string;
  metaDescription: string;
  tableColumns: string[];
  sort: (hotel: Hotel, tags: HotelDecisionTags) => number;
  filter?: (hotel: Hotel, tags: HotelDecisionTags) => boolean;
}

export const yeongjongGuides: DecisionGuide[] = [
  {
    slug: 'yeongjongdo-hotels',
    path: '/incheon/yeongjongdo-hotels/',
    title: '영종도 호텔 후기 모음',
    eyebrow: 'YEONGJONGDO HOTEL GUIDE',
    purpose: '영종도에서 숙박 후보를 빠르게 좁히기 위한 전체 후기 기반 호텔 목록입니다.',
    criteria: ['후기 수와 평점', '공항 접근성', '가격대', '객실·청결 만족도'],
    intro:
      '영종도 호텔 후기 모음은 호텔로그가 수집한 숙소 정보, 공개 검색 신호, 예약 플랫폼 평점 데이터를 바탕으로 예약 전 비교가 필요한 호텔을 정리한 페이지입니다.',
    intentQuestion: '영종도에서 먼저 비교해볼 만한 호텔은 어디인가?',
    metaDescription: '영종도 호텔 후기를 바탕으로 평점, 가격, 위치, 공항 접근성, 장단점을 비교해 예약 전 선택을 돕습니다.',
    tableColumns: ['공항 접근성', '가성비', '객실', '청결', '추천 대상'],
    sort: (hotel, tags) => basePopularity(hotel) + tags.airportScore + tags.cleanlinessScore
  },
  {
    slug: 'yeongjongdo-family-hotels',
    path: '/incheon/yeongjongdo-family-hotels/',
    title: '영종도 가족호텔 추천',
    eyebrow: 'FAMILY HOTEL GUIDE',
    purpose: '아이와 함께 묵을 때 객실, 이동, 부대시설 부담을 줄일 수 있는 호텔을 고르는 페이지입니다.',
    criteria: ['가족여행 적합도', '객실 넓이', '주차 편의성', '조용함', '주변 편의시설'],
    intro:
      '영종도 가족호텔 추천은 객실 크기, 수영장·키즈 시설, 주차, 해변 접근성, 체크인 대기 가능성을 함께 봅니다. 좋은 시설만 보지 않고 아이 동반 시 불편할 수 있는 지점도 같이 정리합니다.',
    intentQuestion: '아이와 영종도에서 묵기 좋은 호텔은 어디인가?',
    metaDescription: '영종도 가족호텔을 후기 기반으로 비교했습니다. 객실 넓이, 주차, 키즈 시설, 조용함, 주의점을 함께 확인하세요.',
    tableColumns: ['가족 적합도', '객실 넓이', '주차', '조용함', '추천 대상'],
    filter: (_hotel, tags) => tags.familyScore >= 3,
    sort: (_hotel, tags) => tags.familyScore * 3 + tags.roomScore + tags.parkingScore - issuePenalty(tags.noiseIssue)
  },
  {
    slug: 'yeongjongdo-couple-hotels',
    path: '/incheon/yeongjongdo-couple-hotels/',
    title: '영종도 커플 호텔 추천',
    eyebrow: 'COUPLE HOTEL GUIDE',
    purpose: '기념일, 데이트, 조용한 휴식 관점에서 만족도가 높은 숙소를 고르는 페이지입니다.',
    criteria: ['커플여행 적합도', '오션뷰 가능성', '객실 분위기', '소음 이슈', '주변 식당·해변 접근성'],
    intro:
      '커플 호텔은 단순히 시설이 화려한지보다 객실 분위기, 전망, 이동 동선, 조용함을 함께 봐야 합니다. 이 페이지는 영종도 숙소를 데이트와 짧은 휴식 관점에서 다시 정렬합니다.',
    intentQuestion: '기념일·데이트용으로 만족도가 높은 영종도 호텔은 어디인가?',
    metaDescription: '영종도 커플 호텔을 후기 기반으로 비교했습니다. 오션뷰, 객실 분위기, 조용함, 가격 부담, 주의점을 함께 확인하세요.',
    tableColumns: ['커플 적합도', '오션뷰', '객실', '소음 이슈', '추천 대상'],
    filter: (_hotel, tags) => tags.coupleScore >= 3,
    sort: (_hotel, tags) => tags.coupleScore * 3 + tags.oceanViewScore + tags.roomScore - issuePenalty(tags.noiseIssue)
  },
  {
    slug: 'yeongjongdo-value-hotels',
    path: '/incheon/yeongjongdo-value-hotels/',
    title: '영종도 가성비 호텔 추천',
    eyebrow: 'VALUE HOTEL GUIDE',
    purpose: '가격 대비 후기 만족도가 괜찮은 숙소를 찾는 여행자를 위한 비교 페이지입니다.',
    criteria: ['가성비', '평점 대비 가격', '청결 만족도', '객실 만족도', '반복 단점'],
    intro:
      '가성비 호텔은 단순 최저가가 아니라 가격을 낮추면서도 청결, 위치, 기본 객실 컨디션을 크게 포기하지 않는지가 중요합니다. 이 페이지는 저렴한 가격과 후기 신뢰도를 함께 봅니다.',
    intentQuestion: '영종도에서 가격 대비 후기가 좋은 호텔은 어디인가?',
    metaDescription: '영종도 가성비 호텔을 평점, 가격, 청결, 객실 만족도 기준으로 비교했습니다. 저렴하지만 확인할 점도 함께 정리합니다.',
    tableColumns: ['가성비', '예상 가격', '청결', '객실', '주의점'],
    filter: (_hotel, tags) => tags.valueScore >= 3,
    sort: (hotel, tags) => tags.valueScore * 3 + tags.cleanlinessScore + tags.roomScore - pricePenalty(hotel)
  },
  {
    slug: 'yeongjongdo-ocean-view-hotels',
    path: '/incheon/yeongjongdo-ocean-view-hotels/',
    title: '영종도 오션뷰 호텔 추천',
    eyebrow: 'OCEAN VIEW HOTEL GUIDE',
    purpose: '바다 전망 기대가 가능한 호텔을 전망, 위치, 가격 부담 기준으로 고르는 페이지입니다.',
    criteria: ['오션뷰 가능성', '구읍뱃터·을왕리 접근성', '객실 만족도', '가격대', '전망 관련 주의점'],
    intro:
      '오션뷰 호텔은 호텔명만 보고 고르면 객실 타입에 따라 기대와 달라질 수 있습니다. 이 페이지는 바다 전망 가능성이 언급되는 숙소를 중심으로, 예약 전 객실 타입 확인이 필요한 곳까지 함께 보여줍니다.',
    intentQuestion: '영종도에서 바다뷰 기대가 가능한 호텔은 어디인가?',
    metaDescription: '영종도 오션뷰 호텔을 후기 기반으로 비교했습니다. 구읍뱃터, 을왕리, 바다 전망 가능성과 예약 전 주의점을 확인하세요.',
    tableColumns: ['오션뷰', '위치권역', '객실', '가격대', '주의점'],
    filter: (_hotel, tags) => tags.oceanViewScore >= 3,
    sort: (_hotel, tags) => tags.oceanViewScore * 3 + tags.coupleScore + tags.roomScore
  },
  {
    slug: 'yeongjongdo-airport-hotels',
    path: '/incheon/yeongjongdo-airport-hotels/',
    title: '영종도 인천공항 근처 호텔 추천',
    eyebrow: 'AIRPORT HOTEL GUIDE',
    purpose: '새벽 비행, 심야 도착, 환승 전후 숙박에 적합한 호텔을 고르는 페이지입니다.',
    criteria: ['공항 접근성', '셔틀 여부', '새벽 체크아웃', '방음', '가격대'],
    intro:
      '공항 근처 호텔은 거리만 가까운지보다 셔틀 운영, 운서역 접근, 새벽 이동, 방음 후기가 중요합니다. 이 페이지는 비행 전후 숙박 관점에서 영종도 호텔을 다시 비교합니다.',
    intentQuestion: '새벽비행·공항 이동에 적합한 영종도 호텔은 어디인가?',
    metaDescription: '영종도 인천공항 근처 호텔을 공항 접근성, 셔틀, 새벽 체크아웃, 방음, 가격 기준으로 비교했습니다.',
    tableColumns: ['공항 접근성', '셔틀 여부', '새벽 체크아웃', '방음', '추천 대상'],
    filter: (_hotel, tags) => tags.airportScore >= 4,
    sort: (_hotel, tags) => tags.airportScore * 4 + tags.businessScore + tags.valueScore - issuePenalty(tags.noiseIssue)
  },
  {
    slug: 'yeongjongdo-hotel-comparison',
    path: '/incheon/yeongjongdo-hotel-comparison/',
    title: '영종도 호텔 비교',
    eyebrow: 'HOTEL COMPARISON',
    purpose: '가족, 커플, 공항 이동, 가성비, 오션뷰 기준을 한 번에 놓고 비교하는 페이지입니다.',
    criteria: ['가족 적합도', '커플 적합도', '공항 접근성', '가성비', '반복 단점'],
    intro:
      '영종도 호텔 비교는 목적별 추천 페이지를 보기 전, 전체 후보의 성격을 빠르게 나누기 위한 페이지입니다. 같은 호텔이라도 가족 여행, 공항 이동, 오션뷰 기대에 따라 판단 기준이 달라집니다.',
    intentQuestion: '영종도 호텔을 목적별로 비교하면 어떤 차이가 있는가?',
    metaDescription: '영종도 호텔을 가족, 커플, 공항 접근성, 가성비, 오션뷰 기준으로 한눈에 비교합니다.',
    tableColumns: ['가족', '커플', '공항', '가성비', '추천 대상'],
    sort: (hotel, tags) => basePopularity(hotel) + tags.familyScore + tags.coupleScore + tags.airportScore + tags.valueScore
  }
];

export const yeongjongHotels = hotels
  .filter(isYeongjongHotel)
  .sort((a, b) => basePopularity(b) - basePopularity(a));

export function getDecisionGuide(slug: string) {
  return yeongjongGuides.find((guide) => guide.slug === slug);
}

export function getGuideHotels(guide: DecisionGuide, limit = 14): GuideHotel[] {
  return yeongjongHotels
    .map((hotel) => {
      const tags = buildDecisionTags(hotel);
      return {
        hotel,
        tags,
        guideScore: guide.sort(hotel, tags),
        reasons: buildReasons(hotel, tags, guide.slug),
        caution: buildCaution(hotel, tags, guide.slug),
        target: buildTarget(hotel, tags, guide.slug)
      };
    })
    .filter((item) => !guide.filter || guide.filter(item.hotel, item.tags))
    .sort((a, b) => b.guideScore - a.guideScore)
    .slice(0, limit);
}

export function isYeongjongHotel(hotel: Hotel) {
  const text = hotelText(hotel);
  if (!/^incheon-/.test(hotel.slug)) return false;
  if (/송도|연수구|부평|구월|남동구|계양구|청라|검단|강화|월미도|차이나타운/.test(text)) return false;
  return /영종|운서|인천공항|에어포트|공항|을왕|용유|구읍뱃터|마시란|선녀바위|제1터미널|제2터미널|은하수로|흰바위로|신도시남로|모랫말|공항문화로|중구|unseo|airport|terminal|eunhasu/i.test(text);
}

export function buildDecisionTags(hotel: Hotel): HotelDecisionTags {
  const text = hotelText(hotel);
  const reviewScore = hotel.reviewScore || 7.5;
  const price = hotel.averageNightlyRate || hotel.dailyRate || 0;

  const familyScore = clampScore(
    2 +
      hit(text, ['가족', '아이', '키즈', '수영장', '리조트', '워터파크', '패밀리', '넓은 객실', '해변']) +
      (reviewScore >= 8.5 ? 1 : 0)
  );
  const coupleScore = clampScore(
    2 +
      hit(text, ['커플', '데이트', '기념일', '오션뷰', '바다 전망', '을왕리', '스파', '히노끼', '조용', '리조트']) +
      (reviewScore >= 8.6 ? 1 : 0)
  );
  const airportScore = clampScore(
    1 + hit(text, ['인천공항', '공항', '에어포트', '터미널', '셔틀', '운서역', '환승', '새벽', '심야', '제1터미널', '제2터미널'])
  );
  const parkingScore = clampScore(3 + hit(text, ['주차', '무료 주차', '차량', '렌터카']) - hit(text, ['주차 공간이 협소', '기계식 주차']));
  const breakfastScore = clampScore(2 + hit(text, ['조식', '무료 조식', '뷔페', '레스토랑']) - hit(text, ['조식 불포함', '별도 구매', '별도 비용']));
  const cleanlinessScore = clampScore(3 + hit(text, ['청결', '깨끗', '깔끔', '쾌적']) + (reviewScore >= 8.5 ? 1 : 0));
  const roomScore = clampScore(3 + hit(text, ['넓', '객실', '룸', '레지던스', '패밀리룸']) - hit(text, ['작', '아담', '좁']));
  const valueScore = clampScore(
    2 +
      hit(text, ['가성비', '합리적인 가격', '저렴', '실속', '가격 대비']) +
      (price > 0 && price <= 90000 ? 2 : price > 0 && price <= 150000 ? 1 : 0) +
      (reviewScore >= 8.5 ? 1 : 0) -
      (price >= 250000 ? 2 : 0)
  );
  const oceanViewScore = clampScore(1 + hit(text, ['오션뷰', '바다 전망', '해변', '을왕리', '구읍뱃터', '마시란', '선녀바위', '은하수로']));
  const businessScore = clampScore(2 + hit(text, ['출장', '비즈니스', '공항철도', '운서역', '셀프 체크인', '환승', '공항']));
  const revisitScore = clampScore(Math.round(reviewScore / 2) + hit(text, ['재방문', '만족', '높은 평점', '추천']));
  const repeatedConsScore = clampScore(1 + hit(text, ['반복', '혼잡', '대기', '소음', '작', '불포함', '별도', '협소']));
  const noiseIssue: IssueLevel = /소음|방음|번화가|혼잡/.test(text) ? 'medium' : /조용|휴식|한적/.test(text) ? 'low' : 'medium';

  return {
    familyScore,
    coupleScore,
    businessScore,
    airportScore,
    parkingScore,
    breakfastScore,
    cleanlinessScore,
    roomScore,
    noiseIssue,
    valueScore,
    oceanViewScore,
    revisitScore,
    repeatedConsScore,
    summaryTags: buildSummaryTags({ familyScore, coupleScore, airportScore, valueScore, oceanViewScore, breakfastScore, cleanlinessScore }, text)
  };
}

export function scoreLabel(score: number) {
  return score >= 5 ? '매우 높음' : score >= 4 ? '높음' : score >= 3 ? '보통' : '낮음';
}

export function issueLabel(level: IssueLevel) {
  return level === 'high' ? '주의 필요' : level === 'medium' ? '일부 확인' : '낮음';
}

function buildReasons(hotel: Hotel, tags: HotelDecisionTags, guideSlug: string) {
  const text = hotelText(hotel);
  const common = [
    tags.airportScore >= 4 ? '공항 이동 동선이 좋아 비행 전후 숙박 부담이 적습니다.' : '',
    tags.cleanlinessScore >= 4 ? '청결과 객실 관리에 대한 긍정 신호가 비교적 뚜렷합니다.' : '',
    tags.valueScore >= 4 ? '가격 대비 평점과 기본 시설 만족도가 괜찮은 편입니다.' : ''
  ].filter(Boolean);

  const byGuide: Record<string, string[]> = {
    'yeongjongdo-family-hotels': [
      tags.familyScore >= 4 ? '가족 여행에서 중요한 객실·시설·이동 편의성이 함께 확인됩니다.' : '',
      /수영장|키즈|워터파크|리조트/.test(text) ? '아이와 시간을 보내기 좋은 부대시설 신호가 있습니다.' : '',
      tags.parkingScore >= 4 ? '차량 이동과 주차를 고려하는 가족 여행에 맞습니다.' : ''
    ],
    'yeongjongdo-couple-hotels': [
      tags.oceanViewScore >= 4 ? '바다 전망이나 해변 접근을 기대할 수 있는 요소가 있습니다.' : '',
      tags.coupleScore >= 4 ? '기념일·데이트용 숙박에서 중요하게 보는 분위기 신호가 있습니다.' : '',
      tags.noiseIssue === 'low' ? '조용한 휴식 관점에서 비교적 부담이 적습니다.' : ''
    ],
    'yeongjongdo-value-hotels': [
      tags.valueScore >= 4 ? '가격 부담을 낮추면서도 후기 점수가 무너지지 않는 편입니다.' : '',
      (hotel.averageNightlyRate || hotel.dailyRate || 0) > 0 ? '예상 가격을 기준으로 다른 영종도 숙소와 비교하기 쉽습니다.' : '',
      tags.cleanlinessScore >= 4 ? '저가형 선택에서 중요한 청결 신호가 보입니다.' : ''
    ],
    'yeongjongdo-ocean-view-hotels': [
      tags.oceanViewScore >= 4 ? '오션뷰 또는 해변 접근 관련 언급이 반복적으로 잡힙니다.' : '',
      /구읍뱃터|을왕리|마시란|선녀바위/.test(text) ? '영종도 바다권 이동이 쉬운 위치입니다.' : '',
      tags.coupleScore >= 4 ? '커플 여행이나 짧은 휴식 목적에도 맞는 편입니다.' : ''
    ],
    'yeongjongdo-airport-hotels': [
      tags.airportScore >= 5 ? '공항 접근성 신호가 가장 강한 축에 속합니다.' : '',
      /셔틀/.test(text) ? '셔틀 관련 언급이 있어 이동 계획을 세우기 좋습니다.' : '',
      /운서역|터미널|환승/.test(text) ? '운서역 또는 터미널 접근 관점에서 검토할 만합니다.' : ''
    ],
    'yeongjongdo-hotel-comparison': [
      `가족 ${scoreLabel(tags.familyScore)}, 공항 ${scoreLabel(tags.airportScore)}, 가성비 ${scoreLabel(tags.valueScore)}로 성격이 나뉩니다.`,
      tags.summaryTags.length ? `${tags.summaryTags.slice(0, 3).join(', ')} 목적의 후보로 볼 수 있습니다.` : '',
      tags.repeatedConsScore >= 4 ? '반복 단점이 보여 예약 전 조건 확인이 필요합니다.' : ''
    ]
  };

  return [...(byGuide[guideSlug] || []), ...common].filter(Boolean).slice(0, 3);
}

function buildCaution(hotel: Hotel, tags: HotelDecisionTags, guideSlug: string) {
  const firstCon = hotel.analysis.cons[0]?.replace(/\.$/, '') || '';
  if (guideSlug === 'yeongjongdo-ocean-view-hotels') return '오션뷰는 객실 타입별 차이가 커서 예약 단계에서 전망 조건을 확인해야 합니다.';
  if (guideSlug === 'yeongjongdo-airport-hotels') return '셔틀 시간, 터미널 위치, 새벽 이동 가능 여부를 예약 전에 확인하는 편이 좋습니다.';
  if (guideSlug === 'yeongjongdo-family-hotels') return '성수기에는 체크인 대기와 조식 혼잡 가능성을 함께 고려해야 합니다.';
  if (guideSlug === 'yeongjongdo-value-hotels') return firstCon || '가격이 낮은 객실은 전망·크기·부대시설 조건이 다를 수 있습니다.';
  if (tags.repeatedConsScore >= 4) return firstCon || '반복 단점이 있어 예약 전 세부 조건 확인이 필요합니다.';
  return firstCon || '후기 데이터가 충분하지 않은 항목은 현장 조건을 한 번 더 확인하는 것이 좋습니다.';
}

function buildTarget(_hotel: Hotel, tags: HotelDecisionTags, guideSlug: string) {
  if (guideSlug === 'yeongjongdo-airport-hotels') return tags.airportScore >= 5 ? '새벽 비행·환승객' : '공항 이동이 필요한 여행자';
  if (guideSlug === 'yeongjongdo-family-hotels') return tags.familyScore >= 5 ? '아이 동반 가족' : '차량 이동 가족';
  if (guideSlug === 'yeongjongdo-couple-hotels') return tags.oceanViewScore >= 4 ? '오션뷰를 보는 커플' : '조용한 휴식 커플';
  if (guideSlug === 'yeongjongdo-value-hotels') return '가격 대비 만족도를 보는 여행자';
  if (guideSlug === 'yeongjongdo-ocean-view-hotels') return '바다 전망을 기대하는 여행자';
  return tags.summaryTags.slice(0, 2).join('·') || '영종도 숙박 후보';
}

function buildSummaryTags(scores: Pick<HotelDecisionTags, 'familyScore' | 'coupleScore' | 'airportScore' | 'valueScore' | 'oceanViewScore' | 'breakfastScore' | 'cleanlinessScore'>, text: string) {
  const tags = [
    scores.familyScore >= 4 ? '가족여행' : '',
    scores.coupleScore >= 4 ? '커플여행' : '',
    scores.airportScore >= 4 ? '공항근처' : '',
    scores.valueScore >= 4 ? '가성비' : '',
    scores.oceanViewScore >= 4 ? '오션뷰' : '',
    scores.breakfastScore >= 4 ? '조식' : '',
    scores.cleanlinessScore >= 4 ? '청결' : '',
    /운서역/.test(text) ? '운서역' : '',
    /을왕리/.test(text) ? '을왕리' : '',
    /구읍뱃터/.test(text) ? '구읍뱃터' : ''
  ].filter(Boolean);
  return [...new Set(tags)].slice(0, 5);
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
    ...(analysis?.notRecommendedFor || []),
    ...(analysis?.checkPoints || [])
  ].join(' ');
}

function basePopularity(hotel: Hotel) {
  return (hotel.reviewScore || 0) * 2 + Math.log10((hotel.reviewCount || 0) + 10);
}

function hit(text: string, keywords: string[]) {
  return keywords.reduce((sum, keyword) => sum + (text.includes(keyword) ? 1 : 0), 0);
}

function clampScore(value: number) {
  return Math.max(1, Math.min(5, Math.round(value)));
}

function issuePenalty(level: IssueLevel) {
  return level === 'high' ? 2 : level === 'medium' ? 1 : 0;
}

function pricePenalty(hotel: Hotel) {
  const price = hotel.averageNightlyRate || hotel.dailyRate || 0;
  return price >= 250000 ? 3 : price >= 160000 ? 1 : 0;
}
