import { activeHotels as hotels } from './hotels';
import type { Hotel } from './hotels';

export type TokyoAreaGuide = {
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

export type TokyoAreaGuideHotel = {
  hotel: Hotel;
  guideScore: number;
  reasons: string[];
  caution: string;
  target: string;
  tags: string[];
  tableCells: string[];
};

export const tokyoAreaGuides: TokyoAreaGuide[] = [
  {
    slug: 'shinjuku-hotels', path: '/tokyo/shinjuku-hotels/', eyebrow: 'SHINJUKU GUIDE',
    title: '도쿄 신주쿠 호텔 후기 모음 교통 조식 체크인 가성비',
    intro: '신주쿠 숙소는 역 출구와 실제 도보 동선, 공항 이동, 번화가 소음과 객실 크기를 함께 비교해야 합니다.',
    purpose: '쇼핑과 교통을 중심으로 도쿄를 여행하거나 신주쿠에 머무르려는 분을 위한 선택 가이드입니다.',
    intentQuestion: '신주쿠 호텔은 역 접근성과 조용한 객실 중 무엇을 먼저 봐야 할까요?',
    metaDescription: '도쿄 신주쿠 호텔 후기를 교통, 조식, 체크인, 객실, 가성비 기준으로 비교합니다.',
    criteria: ['신주쿠역 접근', '공항 이동', '조식', '야간 소음', '가성비'],
    keywords: ['신주쿠', 'Shinjuku', 'Kabukicho', '가부키초', 'Nishishinjuku', '니시신주쿠']
  },
  {
    slug: 'shibuya-hotels', path: '/tokyo/shibuya-hotels/', eyebrow: 'SHIBUYA GUIDE',
    title: '도쿄 시부야 호텔 후기 모음 쇼핑 교통 커플 체크인',
    intro: '시부야 숙소는 쇼핑과 야간 일정에 편리하지만 역 출구, 언덕길, 객실 크기와 소음을 함께 확인하는 편이 좋습니다.',
    purpose: '쇼핑과 맛집, 도쿄의 늦은 밤 일정을 즐기려는 커플·친구 여행자를 위한 페이지입니다.',
    intentQuestion: '시부야 호텔은 쇼핑 동선과 교통 중 어느 조건이 더 중요할까요?',
    metaDescription: '도쿄 시부야 호텔 후기를 쇼핑, 교통, 커플 여행, 체크인, 객실 기준으로 비교합니다.',
    criteria: ['시부야역 접근', '쇼핑', '야간 이동', '객실', '커플 여행'],
    keywords: ['시부야', 'Shibuya', 'Harajuku', '하라주쿠', 'Ebisu', '에비스']
  },
  {
    slug: 'ginza-tokyo-station-hotels', path: '/tokyo/ginza-tokyo-station-hotels/', eyebrow: 'GINZA & TOKYO STATION',
    title: '도쿄 긴자 도쿄역 호텔 후기 모음 교통 조식 출장 쇼핑',
    intro: '긴자와 도쿄역 호텔은 공항과 신칸센 이동, 쇼핑 동선, 조식 시간과 객실 면적을 중심으로 비교해야 합니다.',
    purpose: '도쿄역 광역 교통과 긴자 쇼핑, 출장 일정을 함께 고려하는 여행자를 위한 페이지입니다.',
    intentQuestion: '긴자와 도쿄역 중 어느 지역이 관광과 광역 이동에 더 편리할까요?',
    metaDescription: '도쿄 긴자·도쿄역 호텔 후기를 교통, 조식, 출장, 쇼핑, 공항 이동 기준으로 비교합니다.',
    criteria: ['도쿄역 접근', '긴자 쇼핑', '공항 이동', '조식', '출장'],
    keywords: ['긴자', 'Ginza', '도쿄역', 'Tokyo Station', 'Marunouchi', '마루노우치', 'Kyobashi', '교바시']
  },
  {
    slug: 'asakusa-ueno-hotels', path: '/tokyo/asakusa-ueno-hotels/', eyebrow: 'ASAKUSA & UENO GUIDE',
    title: '도쿄 아사쿠사 우에노 호텔 후기 모음 관광 교통 가족 가성비',
    intro: '아사쿠사와 우에노 숙소는 전통 관광지 접근, 나리타공항 이동, 가족 일정과 주변 식당을 함께 살펴보는 편이 좋습니다.',
    purpose: '센소지와 우에노공원, 스카이트리 일정을 준비하는 가족·자유여행자를 위한 페이지입니다.',
    intentQuestion: '아사쿠사와 우에노 중 가족 여행과 공항 이동에 더 편한 곳은 어디일까요?',
    metaDescription: '도쿄 아사쿠사·우에노 호텔 후기를 관광, 교통, 가족 여행, 조식, 가성비 기준으로 비교합니다.',
    criteria: ['관광지 접근', '공항 이동', '가족 여행', '조식', '가성비'],
    keywords: ['아사쿠사', 'Asakusa', '우에노', 'Ueno', '센소지', 'Sensoji', '스카이트리', 'Skytree']
  },
  {
    slug: 'ikebukuro-hotels', path: '/tokyo/ikebukuro-hotels/', eyebrow: 'IKEBUKURO GUIDE',
    title: '도쿄 이케부쿠로 호텔 후기 모음 교통 쇼핑 가성비 조식',
    intro: '이케부쿠로 호텔은 여러 노선의 환승 편의와 쇼핑, 신주쿠·시부야 이동, 역 출구까지의 거리를 함께 비교해야 합니다.',
    purpose: '교통과 가성비를 함께 보고 도쿄 서북부에 머무르려는 여행자를 위한 페이지입니다.',
    intentQuestion: '이케부쿠로 호텔은 역 접근성과 가격 중 무엇을 먼저 비교해야 할까요?',
    metaDescription: '도쿄 이케부쿠로 호텔 후기를 교통, 쇼핑, 가성비, 조식, 객실 기준으로 비교합니다.',
    criteria: ['이케부쿠로역', '환승 교통', '쇼핑', '가성비', '조식'],
    keywords: ['이케부쿠로', 'Ikebukuro', 'Toshima', '도시마', 'Otsuka', '오츠카']
  },
  {
    slug: 'haneda-airport-hotels', path: '/tokyo/haneda-airport-hotels/', eyebrow: 'HANEDA AIRPORT GUIDE',
    title: '도쿄 하네다공항 호텔 후기 모음 셔틀 새벽비행 조식',
    intro: '하네다공항 숙소는 터미널 이동 시간, 셔틀 운행, 새벽 체크아웃과 공항철도 접근성을 먼저 확인해야 합니다.',
    purpose: '늦은 도착이나 이른 출발로 하네다공항 근처 숙박이 필요한 여행자를 위한 페이지입니다.',
    intentQuestion: '하네다공항 호텔은 공항 직결과 무료 셔틀 중 어느 쪽이 더 편리할까요?',
    metaDescription: '도쿄 하네다공항 호텔 후기를 셔틀, 새벽비행, 터미널 접근, 조식, 짐 보관 기준으로 비교합니다.',
    criteria: ['공항 접근', '셔틀', '새벽 체크아웃', '조식', '짐 보관'],
    keywords: ['하네다', 'Haneda', '공항', 'Airport', 'Ota', '오타', 'Kamata', '가마타']
  },
  {
    slug: 'tokyo-family-hotels', path: '/tokyo/tokyo-family-hotels/', eyebrow: 'TOKYO FAMILY GUIDE',
    title: '도쿄 가족호텔 후기 모음 객실 조식 교통 세탁',
    intro: '도쿄 가족 숙소는 침대 구성과 객실 면적, 아이 동반 조식, 세탁 시설과 역 이동 편의성을 함께 봐야 합니다.',
    purpose: '아이와 함께 도쿄를 찾는 가족 여행자를 위한 숙소 선택 가이드입니다.',
    intentQuestion: '도쿄 가족호텔은 넓은 객실과 관광지 접근성 중 무엇을 우선해야 할까요?',
    metaDescription: '도쿄 가족호텔 후기를 객실 크기, 조식, 교통, 세탁 시설, 가족 여행 기준으로 비교합니다.',
    criteria: ['가족 객실', '침대 구성', '아이 조식', '세탁 시설', '교통'],
    keywords: ['가족', '패밀리', 'Family', '트리플', 'Triple', '쿼드', '세탁', 'Laundry']
  },
  {
    slug: 'tokyo-hotel-comparison', path: '/tokyo/tokyo-hotel-comparison/', eyebrow: 'TOKYO COMPARISON',
    title: '도쿄 호텔 비교 후기 모음 신주쿠 시부야 긴자 아사쿠사',
    intro: '도쿄는 신주쿠·시부야·긴자·아사쿠사·하네다공항처럼 목적지에 따라 편한 숙박 권역이 크게 달라집니다.',
    purpose: '도쿄 주요 권역의 호텔을 여행 목적과 이동 방식에 따라 비교하는 페이지입니다.',
    intentQuestion: '도쿄 호텔은 어느 지역부터 비교하는 것이 좋을까요?',
    metaDescription: '도쿄 호텔을 신주쿠, 시부야, 긴자·도쿄역, 아사쿠사·우에노, 이케부쿠로, 하네다공항 기준으로 비교합니다.',
    criteria: ['숙박 권역', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['도쿄', 'Tokyo']
  }
];

export const tokyoHotels = hotels
  .filter((hotel) => hotel.slug.startsWith('tokyo-'))
  .sort((a, b) => popularity(b) - popularity(a));

export function getTokyoAreaGuideHotels(guide: TokyoAreaGuide, limit = 20): TokyoAreaGuideHotel[] {
  return tokyoHotels.map((hotel) => buildGuideHotel(hotel, guide))
    .filter((item) => item.guideScore > 0)
    .sort((a, b) => b.guideScore - a.guideScore)
    .slice(0, limit);
}

export function getRelatedTokyoAreaGuides(hotel: Hotel) {
  if (!hotel.slug.startsWith('tokyo-')) return [];
  const text = hotelText(hotel).toLowerCase();
  return tokyoAreaGuides.map((guide) => ({
    guide,
    score: guide.slug === 'tokyo-hotel-comparison' ? 1 : guide.keywords.filter((keyword) => text.includes(keyword.toLowerCase())).length
  })).filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 4).map((item) => item.guide);
}

function buildGuideHotel(hotel: Hotel, guide: TokyoAreaGuide): TokyoAreaGuideHotel {
  const text = hotelText(hotel);
  const area = pickArea(text);
  const matches = guide.slug === 'tokyo-hotel-comparison' ? 1 : guide.keywords.filter((keyword) => text.toLowerCase().includes(keyword.toLowerCase())).length;
  const price = hotel.averageNightlyRate ?? hotel.dailyRate;
  const target = guide.slug.includes('family') ? '가족 여행' : guide.slug.includes('airport') ? '공항 전후 숙박' : `${area} 일정`;
  return {
    hotel,
    guideScore: matches ? matches * 10000 + popularity(hotel) : 0,
    reasons: [
      `${area} 일정에서 이동 동선을 줄이기 좋은 후보입니다.`,
      hotel.reviewCount && hotel.reviewCount >= 1000 ? '후기 수가 충분해 반복되는 장점과 주의점을 비교하기 좋습니다.' : '최근 객실 조건과 위치 후기를 함께 확인하는 편이 좋습니다.',
      hotel.reviewScore && hotel.reviewScore >= 8.8 ? '아고다 평점이 높은 편이라 우선 비교 후보로 살펴볼 만합니다.' : '가격과 객실 크기를 함께 비교하면 선택이 쉬워집니다.'
    ],
    caution: area === '신주쿠·시부야' ? '번화가 숙소는 야간 소음과 역 출구까지의 실제 도보 동선을 확인하세요.' : '객실 크기와 조식·취소 조건은 예약하는 객실 유형별로 다시 확인하세요.',
    target,
    tags: [area, ...guide.criteria.slice(0, 3)],
    tableCells: [area, String(hotel.reviewScore ?? '확인 필요'), hotel.reviewCount ? `${hotel.reviewCount.toLocaleString('ko-KR')}건` : '후기 부족', price ? `${price.toLocaleString('ko-KR')}원~` : '가격 확인', target]
  };
}

function hotelText(hotel: Hotel) {
  return [hotel.hotelName, hotel.address, hotel.region, hotel.analysis?.summary, hotel.analysis?.pros?.join(' ')].filter(Boolean).join(' ');
}

function pickArea(text: string) {
  if (/Haneda|하네다|Ota|오타|Kamata|가마타/i.test(text)) return '하네다공항';
  if (/Shinjuku|신주쿠|Kabukicho|가부키초|Nishishinjuku|니시신주쿠/i.test(text)) return '신주쿠·시부야';
  if (/Shibuya|시부야|Harajuku|하라주쿠|Ebisu|에비스/i.test(text)) return '신주쿠·시부야';
  if (/Ginza|긴자|Tokyo Station|도쿄역|Marunouchi|마루노우치|Kyobashi|교바시/i.test(text)) return '긴자·도쿄역';
  if (/Asakusa|아사쿠사|Ueno|우에노|Sensoji|센소지|Skytree|스카이트리/i.test(text)) return '아사쿠사·우에노';
  if (/Ikebukuro|이케부쿠로|Toshima|도시마|Otsuka|오츠카/i.test(text)) return '이케부쿠로';
  return '도쿄';
}

function popularity(hotel: Hotel) {
  return (hotel.reviewScore || 0) * 1000 + Math.min(hotel.reviewCount || 0, 50000) / 10;
}
