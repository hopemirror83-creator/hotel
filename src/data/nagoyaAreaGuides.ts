import { activeHotels as hotels } from './hotels';
import type { Hotel } from './hotels';

export type NagoyaAreaGuide = {
  slug: string; path: string; title: string; eyebrow: string; intro: string;
  purpose: string; intentQuestion: string; metaDescription: string;
  criteria: string[]; keywords: string[];
};

export const nagoyaAreaGuides: NagoyaAreaGuide[] = [
  {
    slug: 'nagoya-station-hotels', path: '/nagoya/nagoya-station-hotels/', eyebrow: 'NAGOYA STATION GUIDE',
    title: '나고야역 호텔 후기 모음 교통·조식·체크인·짐보관 비교',
    intro: '나고야역 숙소는 공항과 신칸센 이동이 편리하지만 역 출구, 지하상가 동선과 객실 크기를 함께 확인해야 합니다.',
    purpose: '공항 이동과 근교 여행, 짧은 나고야 일정을 준비하는 여행자를 위한 선택 가이드입니다.',
    intentQuestion: '나고야역 호텔은 역과의 거리 외에 무엇을 비교해야 할까요?',
    metaDescription: '나고야역 호텔을 교통, 조식, 체크인, 짐 보관, 객실 크기 기준으로 비교합니다.',
    criteria: ['나고야역 도보 동선', '공항·신칸센 이동', '짐 보관', '조식', '객실 크기'],
    keywords: ['나고야역', 'Nagoya Station', 'Meieki', '메이에키', 'Nakamura', '나카무라']
  },
  {
    slug: 'sakae-hotels', path: '/nagoya/sakae-hotels/', eyebrow: 'SAKAE GUIDE',
    title: '나고야 사카에 호텔 후기 모음 쇼핑·맛집·교통·대욕장 비교',
    intro: '사카에는 쇼핑과 식사, 야간 일정이 편리하지만 역 출구와 소음, 객실 크기를 함께 보는 편이 좋습니다.',
    purpose: '쇼핑과 맛집, 늦은 저녁 일정을 중심으로 나고야를 여행하는 분을 위한 가이드입니다.',
    intentQuestion: '사카에 호텔은 쇼핑 동선과 조용한 숙박 중 어느 쪽을 우선해야 할까요?',
    metaDescription: '나고야 사카에 호텔을 쇼핑, 맛집, 교통, 대욕장, 가성비 기준으로 비교합니다.',
    criteria: ['사카에역 접근', '쇼핑·식당', '야간 소음', '대욕장', '가성비'],
    keywords: ['사카에', 'Sakae', 'Nishiki', '니시키', 'Naka-ku', '나카구']
  },
  {
    slug: 'kanayama-hotels', path: '/nagoya/kanayama-hotels/', eyebrow: 'KANAYAMA GUIDE',
    title: '나고야 가나야마 호텔 후기 모음 공항·철도·교통·가성비 비교',
    intro: '가나야마는 공항철도와 JR, 지하철 환승이 편리해 이동 중심 일정에 유리하지만 주변 상권과 객실 조건도 확인해야 합니다.',
    purpose: '주부공항과 나고야 시내, 근교 도시를 함께 이동하는 여행자를 위한 가이드입니다.',
    intentQuestion: '가나야마 호텔은 공항 접근성과 나고야역 접근성 중 어떤 장점이 클까요?',
    metaDescription: '나고야 가나야마 호텔을 공항철도, 교통, 객실, 조식, 가성비로 비교합니다.',
    criteria: ['공항철도', 'JR·지하철 환승', '객실', '조식', '가성비'],
    keywords: ['가나야마', 'Kanayama', 'Atsuta', '아츠타']
  },
  {
    slug: 'nagoya-castle-hotels', path: '/nagoya/nagoya-castle-hotels/', eyebrow: 'NAGOYA CASTLE GUIDE',
    title: '나고야성·마루노우치 호텔 후기 모음 관광·교통·조식 비교',
    intro: '나고야성과 마루노우치 주변은 관광과 업무 이동에 유리하지만 사카에까지의 동선과 야간 상권을 함께 봐야 합니다.',
    purpose: '나고야성 관광이나 마루노우치 업무 일정을 준비하는 여행자를 위한 가이드입니다.',
    intentQuestion: '나고야성 주변 호텔은 관광 접근성과 식사 동선 중 무엇을 먼저 봐야 할까요?',
    metaDescription: '나고야성·마루노우치 호텔을 관광, 교통, 조식, 조용함, 가성비로 비교합니다.',
    criteria: ['나고야성 접근', '마루노우치 교통', '조식', '조용함', '주변 식당'],
    keywords: ['나고야성', 'Nagoya Castle', '마루노우치', 'Marunouchi', 'Fushimi', '후시미']
  },
  {
    slug: 'nagoya-onsen-hotels', path: '/nagoya/nagoya-onsen-hotels/', eyebrow: 'ONSEN & BATH GUIDE',
    title: '나고야 대욕장·온천 호텔 후기 모음 위치·조식·휴식 비교',
    intro: '대욕장 숙소는 시설 유무뿐 아니라 운영 시간, 혼잡도와 객실 욕실 조건까지 함께 확인해야 만족도를 가늠하기 쉽습니다.',
    purpose: '도보 여행 후 목욕과 휴식을 중요하게 보는 여행자를 위한 가이드입니다.',
    intentQuestion: '나고야 대욕장 호텔은 시설 외에 무엇을 확인해야 할까요?',
    metaDescription: '나고야 대욕장·온천 호텔을 시설, 운영 시간, 위치, 조식, 휴식 기준으로 비교합니다.',
    criteria: ['대욕장', '온천·사우나', '운영 시간', '조식', '역 접근'],
    keywords: ['대욕장', '온천', 'Natural Hot Spring', 'Dormy', '도미', 'spa', 'bath']
  },
  {
    slug: 'nagoya-family-hotels', path: '/nagoya/nagoya-family-hotels/', eyebrow: 'NAGOYA FAMILY GUIDE',
    title: '나고야 가족호텔 후기 모음 객실·조식·교통 비교',
    intro: '가족 숙소는 침대 구성과 객실 크기, 아이 동반 조식, 세탁 시설과 역까지의 이동 동선을 함께 봐야 합니다.',
    purpose: '아이와 함께 나고야와 근교를 여행하는 가족을 위한 숙소 선택 가이드입니다.',
    intentQuestion: '나고야 가족호텔은 넓은 객실과 교통 중 무엇을 먼저 비교해야 할까요?',
    metaDescription: '나고야 가족호텔을 객실 크기, 침대, 조식, 세탁, 교통 기준으로 비교합니다.',
    criteria: ['가족 객실', '침대 구성', '아이 조식', '세탁', '교통'],
    keywords: ['가족', '패밀리', 'family', 'triple', '트리플', '스위트', 'suite', 'residence', 'kitchen']
  },
  {
    slug: 'nagoya-value-hotels', path: '/nagoya/nagoya-value-hotels/', eyebrow: 'NAGOYA VALUE GUIDE',
    title: '나고야 가성비 호텔 후기 모음 역 접근·객실·조식 비교',
    intro: '가성비 숙소는 표시 요금만 보기보다 역까지의 거리와 객실 크기, 조식·대욕장 포함 여부를 함께 비교해야 합니다.',
    purpose: '교통과 기본 객실 품질을 유지하면서 숙박비를 조절하려는 여행자를 위한 가이드입니다.',
    intentQuestion: '나고야 가성비 호텔은 가격 외에 어떤 조건을 비교해야 할까요?',
    metaDescription: '나고야 가성비 호텔을 역 접근, 객실, 조식, 대욕장, 후기 수 기준으로 비교합니다.',
    criteria: ['가격대', '역 접근', '객실', '조식', '후기 수'],
    keywords: ['APA', 'KOKO', 'Toyoko', '토요코', 'Smile', '스마일', 'Inn', '인']
  },
  {
    slug: 'nagoya-hotel-comparison', path: '/nagoya/nagoya-hotel-comparison/', eyebrow: 'NAGOYA COMPARISON',
    title: '나고야 호텔 비교 후기 모음 나고야역·사카에·가나야마',
    intro: '나고야는 나고야역과 사카에, 가나야마처럼 지역마다 교통과 여행 동선의 장점이 뚜렷합니다.',
    purpose: '나고야 주요 지역 호텔을 일정과 이동 방식, 숙박 예산에 맞게 비교하는 페이지입니다.',
    intentQuestion: '나고야 호텔은 어느 지역부터 비교하는 것이 좋을까요?',
    metaDescription: '나고야 호텔을 나고야역, 사카에, 가나야마, 나고야성 기준으로 비교합니다.',
    criteria: ['숙박 지역', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['나고야', 'Nagoya']
  }
];

export const nagoyaHotels = hotels
  .filter((hotel) => hotel.slug.startsWith('nagoya-'))
  .sort((a, b) => popularity(b) - popularity(a));

export function getNagoyaAreaGuideHotels(guide: NagoyaAreaGuide, limit = 20) {
  return nagoyaHotels.map((hotel) => buildGuideHotel(hotel, guide))
    .filter((item) => item.guideScore > 0)
    .sort((a, b) => b.guideScore - a.guideScore)
    .slice(0, limit);
}

export function getRelatedNagoyaAreaGuides(hotel: Hotel) {
  if (!hotel.slug.startsWith('nagoya-')) return [];
  const text = hotelText(hotel).toLowerCase();
  return nagoyaAreaGuides.map((guide) => ({
    guide,
    score: guide.slug === 'nagoya-hotel-comparison' ? 1 : guide.keywords.filter((keyword) => text.includes(keyword.toLowerCase())).length
  })).filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 4).map((item) => item.guide);
}

function buildGuideHotel(hotel: Hotel, guide: NagoyaAreaGuide) {
  const text = hotelText(hotel);
  const area = pickArea(text);
  const matches = guide.slug === 'nagoya-hotel-comparison' ? 1 : guide.keywords.filter((keyword) => text.toLowerCase().includes(keyword.toLowerCase())).length;
  const price = hotel.averageNightlyRate ?? hotel.dailyRate;
  const target = guide.slug.includes('family') ? '가족여행' : guide.slug.includes('onsen') ? '대욕장 휴식' : guide.slug.includes('value') ? '가성비 여행' : `${area} 일정`;
  return {
    hotel,
    guideScore: matches ? matches * 10000 + popularity(hotel) : 0,
    reasons: [
      `${area} 일정에서 이동 동선을 줄이기 좋은 후보입니다.`,
      hotel.reviewCount && hotel.reviewCount >= 1000 ? '후기 수가 충분해 반복되는 장점과 주의점을 비교하기 좋습니다.' : '객실 조건과 위치 후기를 함께 확인하는 편이 좋습니다.',
      hotel.reviewScore && hotel.reviewScore >= 8.8 ? '아고다 평점이 높은 편이라 우선 비교 후보로 보기 좋습니다.' : '가격과 객실 크기를 함께 비교하면 선택이 쉬워집니다.'
    ],
    caution: '객실 크기와 조식·취소 조건, 숙박세는 객실 유형과 날짜에 따라 다를 수 있으니 최종 예약 화면에서 확인하세요.',
    target,
    tags: [area, ...guide.criteria.slice(0, 3)],
    tableCells: [area, String(hotel.reviewScore ?? '확인 필요'), hotel.reviewCount ? `${hotel.reviewCount.toLocaleString('ko-KR')}건` : '후기 부족', price ? `${price.toLocaleString('ko-KR')}원~` : '가격 확인', target]
  };
}

function hotelText(hotel: Hotel) {
  return [hotel.hotelName, hotel.address, hotel.region, hotel.analysis?.summary, hotel.analysis?.pros?.join(' ')].filter(Boolean).join(' ');
}

function pickArea(text: string) {
  if (/Kanayama|가나야마|Atsuta|아츠타/i.test(text)) return '가나야마';
  if (/Nagoya Castle|나고야성|Marunouchi|마루노우치|Fushimi|후시미/i.test(text)) return '나고야성·마루노우치';
  if (/Sakae|사카에|Nishiki|니시키|Naka-ku|나카구/i.test(text)) return '사카에·니시키';
  if (/Nagoya Station|나고야역|Meieki|메이에키|Nakamura|나카무라/i.test(text)) return '나고야역';
  return '나고야';
}

function popularity(hotel: Hotel) {
  return (hotel.reviewScore || 0) * 1000 + Math.min(hotel.reviewCount || 0, 50000) / 10;
}
