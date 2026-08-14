import { activeHotels as hotels } from './hotels';
import type { Hotel } from './hotels';

export type FukuokaAreaGuide = {
  slug: string;
  path: string;
  title: string;
  eyebrow: string;
  intro: string;
  purpose: string;
  intentQuestion: string;
  metaDescription: string;
  criteria: string[];
  keywords: string[];
};

export const fukuokaAreaGuides: FukuokaAreaGuide[] = [
  {
    slug: 'hakata-station-hotels', path: '/fukuoka/hakata-station-hotels/', eyebrow: 'HAKATA STATION GUIDE',
    title: '후쿠오카 하카타역 호텔 후기 모음 교통·조식·체크인 비교',
    intro: '하카타역 숙소는 신칸센과 지하철, 공항 이동이 편리하지만 출구와 객실 크기, 짐 보관 조건을 함께 봐야 합니다.',
    purpose: '교통 중심의 짧은 후쿠오카 일정과 근교 여행을 준비하는 분을 위한 선택 가이드입니다.',
    intentQuestion: '하카타역 호텔은 역과의 거리 외에 무엇을 비교해야 할까요?',
    metaDescription: '후쿠오카 하카타역 호텔을 교통, 조식, 체크인, 객실, 가성비 기준으로 비교합니다.',
    criteria: ['하카타역 도보 동선', '공항 이동', '짐 보관', '조식', '객실 크기'],
    keywords: ['하카타', 'Hakata', '박도', 'Sumiyoshi', '스미요시']
  },
  {
    slug: 'tenjin-hotels', path: '/fukuoka/tenjin-hotels/', eyebrow: 'TENJIN GUIDE',
    title: '후쿠오카 텐진 호텔 후기 모음 쇼핑·교통·가성비 비교',
    intro: '텐진은 쇼핑과 맛집 접근성이 좋지만 야간 소음, 역 출구, 공항선 이동 동선을 함께 확인하는 편이 좋습니다.',
    purpose: '쇼핑과 식사, 야간 일정을 중심으로 후쿠오카를 여행하는 분을 위한 가이드입니다.',
    intentQuestion: '텐진 호텔은 쇼핑 동선과 조용한 숙박 중 어느 쪽을 우선해야 할까요?',
    metaDescription: '후쿠오카 텐진 호텔을 쇼핑, 교통, 조식, 소음, 가성비 기준으로 비교합니다.',
    criteria: ['텐진역 접근', '쇼핑', '야간 소음', '조식', '공항선 이동'],
    keywords: ['텐진', 'Tenjin', '약인', 'Yakuin', '니시나카스', 'Nishinakasu']
  },
  {
    slug: 'nakasu-hotels', path: '/fukuoka/nakasu-hotels/', eyebrow: 'NAKASU GUIDE',
    title: '후쿠오카 나카스 호텔 후기 모음 포장마·야경·교통 비교',
    intro: '나카스와 카와바타 숙소는 야간 동선이 편리하지만 방음과 주변 분위기, 역까지의 거리를 꼼꼼히 봐야 합니다.',
    purpose: '포장마와 맛집, 캐널시티 일정을 늦게까지 즐기는 여행자를 위한 가이드입니다.',
    intentQuestion: '나카스 호텔은 야간 이동 편의성과 소음 중 무엇을 먼저 확인해야 할까요?',
    metaDescription: '후쿠오카 나카스·카와바타 호텔을 야경, 포장마, 교통, 소음, 가성비로 비교합니다.',
    criteria: ['나카스 야간 동선', '카와바타역 접근', '소음', '편의점·식당', '가성비'],
    keywords: ['나카스', 'Nakasu', '카와바타', 'Kawabata', '하루요시', 'Haruyoshi']
  },
  {
    slug: 'fukuoka-airport-hotels', path: '/fukuoka/fukuoka-airport-hotels/', eyebrow: 'FUKUOKA AIRPORT GUIDE',
    title: '후쿠오카 공항 근처 호텔 후기 모음 새벽비행·짐보관·교통',
    intro: '후쿠오카 공항은 도심과 가깝지만 국제선 셔틀과 첫 지하철, 새벽 체크아웃 가능성을 따로 따져야 합니다.',
    purpose: '늦은 도착이나 이른 출발, 짧은 환승 일정을 준비하는 여행자를 위한 가이드입니다.',
    intentQuestion: '후쿠오카 공항 숙소는 공항 앞과 하카타역 중 어디가 더 편리할까요?',
    metaDescription: '후쿠오카 공항 근처 호텔을 새벽비행, 짐 보관, 지하철, 셔틀, 가성비로 비교합니다.',
    criteria: ['공항 이동 시간', '이른 체크아웃', '짐 보관', '지하철', '방음'],
    keywords: ['후쿠오카 공항', 'Fukuoka Airport', 'Higashihie', '히가시히에', '하카타']
  },
  {
    slug: 'ohori-park-hotels', path: '/fukuoka/ohori-park-hotels/', eyebrow: 'OHORI & MOMOCHI GUIDE',
    title: '후쿠오카 오호리공원·모모치 호텔 후기 모음 오션뷰·가족',
    intro: '오호리공원과 모모치 해변 숙소는 조용한 환경과 전망이 장점이지만 도심 이동과 주변 식당 여부를 함께 확인해야 합니다.',
    purpose: '해변 산책과 야구, 가족 휴식을 중심으로 일정을 짜는 여행자를 위한 가이드입니다.',
    intentQuestion: '오호리공원·모모치 호텔은 전망과 도심 이동 중 어느 조건을 우선해야 할까요?',
    metaDescription: '후쿠오카 오호리공원·모모치 호텔을 전망, 가족여행, 교통, 조식, 주차로 비교합니다.',
    criteria: ['공원·해변 접근', '전망', '가족 객실', '주차', '도심 이동'],
    keywords: ['오호리', 'Ohori', '모모치', 'Momochi', '시호크', 'Sea Hawk', '후쿠오카 돔', 'PayPay Dome']
  },
  {
    slug: 'fukuoka-onsen-hotels', path: '/fukuoka/fukuoka-onsen-hotels/', eyebrow: 'ONSEN & BATH GUIDE',
    title: '후쿠오카 대욕장·온천 호텔 후기 모음 휴식·조식·위치',
    intro: '대욕장을 중요하게 본다면 온천수 여부뿐 아니라 운영 시간, 혼잡도, 타투 규정과 객실 욕실을 함께 봐야 합니다.',
    purpose: '도보 일정 후 목욕과 휴식을 중요하게 보는 여행자를 위한 가이드입니다.',
    intentQuestion: '후쿠오카 대욕장 호텔은 시설 외에 무엇을 확인해야 할까요?',
    metaDescription: '후쿠오카 대욕장·온천 호텔을 시설, 운영 시간, 혼잡도, 조식, 교통으로 비교합니다.',
    criteria: ['대욕장', '온천·사우나', '운영 시간', '조식', '교통'],
    keywords: ['대욕장', '온천', '사우나', 'onsen', 'spa', 'bath', '도미인', 'Dormy']
  },
  {
    slug: 'fukuoka-family-hotels', path: '/fukuoka/fukuoka-family-hotels/', eyebrow: 'FUKUOKA FAMILY GUIDE',
    title: '후쿠오카 가족호텔 후기 모음 객실·조식·교통 비교',
    intro: '가족 숙소는 침대 구성과 객실 크기, 아이 동반 조식, 세탁 시설과 역까지의 도보 동선을 함께 봐야 합니다.',
    purpose: '아이와 함께 후쿠오카를 여행하는 가족을 위한 숙소 선택 가이드입니다.',
    intentQuestion: '후쿠오카 가족호텔은 넓은 객실과 교통 중 무엇을 먼저 비교해야 할까요?',
    metaDescription: '후쿠오카 가족호텔을 객실 크기, 침대, 조식, 세탁, 교통 기준으로 비교합니다.',
    criteria: ['가족 객실', '침대 구성', '아이 조식', '세탁', '교통'],
    keywords: ['가족', '패밀리', 'family', 'triple', '트리플', '주방', 'kitchen', '레지던스', 'residence']
  },
  {
    slug: 'fukuoka-hotel-comparison', path: '/fukuoka/fukuoka-hotel-comparison/', eyebrow: 'FUKUOKA COMPARISON',
    title: '후쿠오카 호텔 비교 후기 모음 하카타·텐진·나카스·공항',
    intro: '후쿠오카는 하카타와 텐진, 나카스, 모모치처럼 지역별 장점과 이동 방식이 뚜렷합니다.',
    purpose: '후쿠오카 주요 지역 호텔을 일정과 교통, 숙박 예산에 맞게 비교하는 페이지입니다.',
    intentQuestion: '후쿠오카 호텔은 어느 지역부터 비교하는 것이 좋을까요?',
    metaDescription: '후쿠오카 호텔을 하카타, 텐진, 나카스, 공항, 모모치 기준으로 비교합니다.',
    criteria: ['숙박 지역', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['후쿠오카', 'Fukuoka']
  }
];

export const fukuokaHotels = hotels
  .filter((hotel) => hotel.slug.startsWith('fukuoka-'))
  .sort((a, b) => popularity(b) - popularity(a));

export function getFukuokaAreaGuideHotels(guide: FukuokaAreaGuide, limit = 20) {
  return fukuokaHotels.map((hotel) => buildGuideHotel(hotel, guide))
    .filter((item) => item.guideScore > 0)
    .sort((a, b) => b.guideScore - a.guideScore)
    .slice(0, limit);
}

export function getRelatedFukuokaAreaGuides(hotel: Hotel) {
  if (!hotel.slug.startsWith('fukuoka-')) return [];
  const text = hotelText(hotel).toLowerCase();
  return fukuokaAreaGuides.map((guide) => ({
    guide,
    score: guide.slug === 'fukuoka-hotel-comparison' ? 1 : guide.keywords.filter((keyword) => text.includes(keyword.toLowerCase())).length
  })).filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 4).map((item) => item.guide);
}

function buildGuideHotel(hotel: Hotel, guide: FukuokaAreaGuide) {
  const text = hotelText(hotel);
  const area = pickArea(text);
  const matches = guide.slug === 'fukuoka-hotel-comparison' ? 1 : guide.keywords.filter((keyword) => text.toLowerCase().includes(keyword.toLowerCase())).length;
  const price = hotel.averageNightlyRate ?? hotel.dailyRate;
  const target = guide.slug.includes('family') ? '가족여행' : guide.slug.includes('airport') ? '공항 전후 숙박' : guide.slug.includes('onsen') ? '대욕장 휴식' : `${area} 일정`;
  return {
    hotel,
    guideScore: matches ? matches * 10000 + popularity(hotel) : 0,
    reasons: [
      `${area} 일정에서 이동 동선을 줄이기 좋은 후보입니다.`,
      hotel.reviewCount && hotel.reviewCount >= 1000 ? '후기 수가 충분해 반복되는 장점과 주의점을 비교하기 좋습니다.' : '객실 조건과 위치 후기를 함께 확인하는 편이 좋습니다.',
      hotel.reviewScore && hotel.reviewScore >= 8.8 ? '아고다 평점이 높은 편이라 우선 비교 후보로 보기 좋습니다.' : '가격과 객실 크기를 함께 비교하면 선택이 쉬워집니다.'
    ],
    caution: '객실 크기와 조식·취소 조건, 숙박세는 예약하는 객실 유형과 날짜에 따라 다를 수 있으니 최종 화면에서 확인하세요.',
    target,
    tags: [area, ...guide.criteria.slice(0, 3)],
    tableCells: [area, String(hotel.reviewScore ?? '확인 필요'), hotel.reviewCount ? `${hotel.reviewCount.toLocaleString('ko-KR')}건` : '후기 부족', price ? `${price.toLocaleString('ko-KR')}원~` : '가격 확인', target]
  };
}

function hotelText(hotel: Hotel) {
  return [hotel.hotelName, hotel.address, hotel.region, hotel.analysis?.summary, hotel.analysis?.pros?.join(' ')].filter(Boolean).join(' ');
}

function pickArea(text: string) {
  if (/Fukuoka Airport|후쿠오카 공항|Higashihie|히가시히에/i.test(text)) return '후쿠오카 공항';
  if (/Momochi|모모치|Ohori|오호리|Sea Hawk|시호크|PayPay/i.test(text)) return '오호리·모모치';
  if (/Tenjin|텐진|Yakuin|약인|Nishinakasu|니시나카스/i.test(text)) return '텐진';
  if (/Nakasu|나카스|Kawabata|카와바타|Haruyoshi|하루요시/i.test(text)) return '나카스·카와바타';
  if (/Hakata|하카타|Sumiyoshi|스미요시/i.test(text)) return '하카타';
  return '후쿠오카';
}

function popularity(hotel: Hotel) {
  return (hotel.reviewScore || 0) * 1000 + Math.min(hotel.reviewCount || 0, 50000) / 10;
}
