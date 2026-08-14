import { activeHotels as hotels } from './hotels';
import type { Hotel } from './hotels';

export type OsakaAreaGuide = {
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

export type OsakaAreaGuideHotel = {
  hotel: Hotel;
  guideScore: number;
  reasons: string[];
  caution: string;
  target: string;
  tags: string[];
  tableCells: string[];
};

export const osakaAreaGuides: OsakaAreaGuide[] = [
  {
    slug: 'namba-hotels', path: '/osaka/namba-hotels/', eyebrow: 'NAMBA GUIDE',
    title: '오사카 난바 호텔 후기 모음 도톤보리 교통 조식 가성비',
    intro: '난바 숙소는 도톤보리와 구로몬시장 접근성, 공항 이동, 객실 크기와 야간 소음을 함께 비교해야 합니다.',
    purpose: '먹거리와 쇼핑을 중심으로 오사카를 여행하려는 분을 위한 선택 가이드입니다.',
    intentQuestion: '난바 호텔은 도톤보리 접근성과 교통 중 무엇을 먼저 봐야 할까요?',
    metaDescription: '오사카 난바 호텔 후기를 도톤보리, 교통, 조식, 객실, 가성비 기준으로 비교합니다.',
    criteria: ['도톤보리 접근', '난바역 이동', '객실 크기', '야간 소음', '가성비'],
    keywords: ['난바', 'Namba', 'Naniwa', '도톤보리', 'Dotonbori', '닛폰바시', 'Nipponbashi']
  },
  {
    slug: 'umeda-hotels', path: '/osaka/umeda-hotels/', eyebrow: 'UMEDA GUIDE',
    title: '오사카 우메다 호텔 후기 모음 오사카역 교통 조식 출장',
    intro: '우메다는 JR 오사카역과 지하철 환승, 교토·고베 이동, 공항버스 동선을 중심으로 숙소를 골라야 합니다.',
    purpose: '광역 교통과 쇼핑, 출장 동선을 중요하게 보는 여행자를 위한 페이지입니다.',
    intentQuestion: '우메다 호텔은 오사카역과 지하철 접근성 중 어느 쪽이 더 중요할까요?',
    metaDescription: '오사카 우메다 호텔 후기를 오사카역, 공항버스, 조식, 출장, 쇼핑 동선으로 비교합니다.',
    criteria: ['오사카역 접근', '공항버스', '교토·고베 이동', '조식', '출장'],
    keywords: ['우메다', 'Umeda', 'Kita-ku', 'Kita Ward', '오사카역', 'Osaka Station']
  },
  {
    slug: 'shinsaibashi-hotels', path: '/osaka/shinsaibashi-hotels/', eyebrow: 'SHINSAIBASHI GUIDE',
    title: '오사카 신사이바시 호텔 후기 모음 쇼핑 도톤보리 체크인',
    intro: '신사이바시는 쇼핑 거리와 도톤보리 도보 이동이 편하지만 객실 크기와 번화가 소음을 확인할 필요가 있습니다.',
    purpose: '쇼핑과 맛집을 걸어서 즐기려는 커플·친구 여행자를 위한 선택 가이드입니다.',
    intentQuestion: '신사이바시 숙소는 쇼핑 동선과 조용함을 함께 만족시킬 수 있을까요?',
    metaDescription: '오사카 신사이바시 호텔 후기를 쇼핑, 도톤보리, 체크인, 객실, 소음 기준으로 비교합니다.',
    criteria: ['쇼핑 거리', '도톤보리 도보', '체크인', '객실', '소음'],
    keywords: ['신사이바시', 'Shinsaibashi', 'Minamisenba', 'Shimanouchi']
  },
  {
    slug: 'usj-hotels', path: '/osaka/usj-hotels/', eyebrow: 'USJ GUIDE',
    title: '오사카 USJ 호텔 후기 모음 가족 조식 객실 이동',
    intro: 'USJ 호텔은 파크 입장 동선, 가족 객실, 조식 시작 시간과 체크아웃 후 짐 보관을 함께 확인해야 합니다.',
    purpose: '유니버설 스튜디오 재팬 일정이 여행의 중심인 가족·커플을 위한 페이지입니다.',
    intentQuestion: 'USJ 방문에는 파크 앞 호텔과 전철 이동 호텔 중 어느 쪽이 나을까요?',
    metaDescription: '오사카 USJ 호텔 후기를 파크 접근성, 가족 객실, 조식, 짐 보관, 가격 기준으로 비교합니다.',
    criteria: ['USJ 접근', '가족 객실', '조식 시간', '짐 보관', '가격'],
    keywords: ['유니버설', 'Universal', 'USJ', 'Konohana', 'Sakurajima']
  },
  {
    slug: 'kansai-airport-hotels', path: '/osaka/kansai-airport-hotels/', eyebrow: 'KIX GUIDE',
    title: '오사카 간사이공항 호텔 후기 모음 셔틀 새벽비행 조식',
    intro: '간사이공항 숙소는 터미널 이동 시간, 무료 셔틀, 첫차·막차와 새벽 체크아웃 가능 여부가 핵심입니다.',
    purpose: '늦은 도착이나 이른 출발로 공항 근처 숙박이 필요한 여행자를 위한 페이지입니다.',
    intentQuestion: '간사이공항 숙소는 공항 직결과 무료 셔틀 중 무엇이 더 편할까요?',
    metaDescription: '간사이공항 호텔 후기를 셔틀, 새벽비행, 터미널 접근, 조식, 짐 보관 기준으로 비교합니다.',
    criteria: ['공항 접근', '셔틀', '새벽 체크아웃', '조식', '짐 보관'],
    keywords: ['간사이', 'Kansai', 'KIX', 'Izumisano', 'Rinku', '공항', 'Airport']
  },
  {
    slug: 'shin-osaka-hotels', path: '/osaka/shin-osaka-hotels/', eyebrow: 'SHIN-OSAKA GUIDE',
    title: '오사카 신오사카역 호텔 후기 모음 신칸센 출장 조식',
    intro: '신오사카역 숙소는 신칸센과 지하철 환승, 역 출구, 비 오는 날 이동 동선을 중심으로 비교하는 편이 좋습니다.',
    purpose: '교토·도쿄 이동이나 출장 일정으로 신칸센을 이용하는 여행자를 위한 페이지입니다.',
    intentQuestion: '신오사카역 호텔은 역 출구와 지하철 환승 중 무엇을 먼저 확인해야 할까요?',
    metaDescription: '신오사카역 호텔 후기를 신칸센, 지하철, 출장, 조식, 체크인 기준으로 비교합니다.',
    criteria: ['신칸센', '역 출구', '지하철 환승', '출장', '조식'],
    keywords: ['신오사카', 'Shin-Osaka', 'Shinosaka', 'Yodogawa', 'Higashiyodogawa']
  },
  {
    slug: 'osaka-family-hotels', path: '/osaka/osaka-family-hotels/', eyebrow: 'FAMILY GUIDE',
    title: '오사카 가족호텔 후기 모음 객실 조식 교통 USJ',
    intro: '오사카 가족 숙소는 침대 구성과 객실 면적, 아이 동반 조식, 세탁 시설과 역 이동 편의성을 함께 봐야 합니다.',
    purpose: '아이와 함께 오사카를 찾는 가족 여행자를 위한 숙소 선택 가이드입니다.',
    intentQuestion: '오사카 가족호텔은 넓은 객실과 관광지 접근성 중 무엇을 우선해야 할까요?',
    metaDescription: '오사카 가족호텔 후기를 객실 크기, 조식, 교통, 세탁 시설, USJ 접근성으로 비교합니다.',
    criteria: ['가족 객실', '침대 구성', '아이 조식', '세탁 시설', '교통'],
    keywords: ['가족', '패밀리', 'Family', '트리플', 'Triple', '쿼드', 'Universal', 'USJ']
  },
  {
    slug: 'osaka-hotel-comparison', path: '/osaka/osaka-hotel-comparison/', eyebrow: 'OSAKA COMPARISON',
    title: '오사카 호텔 비교 후기 모음 난바 우메다 USJ 간사이공항',
    intro: '오사카는 난바·우메다·USJ·신오사카·간사이공항처럼 목적지에 따라 가장 편한 숙박 권역이 달라집니다.',
    purpose: '오사카 주요 권역의 호텔을 여행 목적과 이동 방식에 따라 비교하는 페이지입니다.',
    intentQuestion: '오사카 호텔은 어느 지역부터 비교하는 것이 좋을까요?',
    metaDescription: '오사카 호텔을 난바, 우메다, 신사이바시, USJ, 신오사카, 간사이공항 기준으로 비교합니다.',
    criteria: ['숙박 권역', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['오사카', 'Osaka']
  }
];

export const osakaHotels = hotels
  .filter((hotel) => hotel.slug.startsWith('osaka-'))
  .sort((a, b) => popularity(b) - popularity(a));

export function getOsakaAreaGuideHotels(guide: OsakaAreaGuide, limit = 20): OsakaAreaGuideHotel[] {
  return osakaHotels
    .map((hotel) => buildGuideHotel(hotel, guide))
    .filter((item) => item.guideScore > 0)
    .sort((a, b) => b.guideScore - a.guideScore)
    .slice(0, limit);
}

export function getRelatedOsakaAreaGuides(hotel: Hotel) {
  if (!hotel.slug.startsWith('osaka-')) return [];
  const text = hotelText(hotel).toLowerCase();
  return osakaAreaGuides
    .map((guide) => ({
      guide,
      score: guide.slug === 'osaka-hotel-comparison'
        ? 1
        : guide.keywords.filter((keyword) => text.includes(keyword.toLowerCase())).length
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => item.guide);
}

function buildGuideHotel(hotel: Hotel, guide: OsakaAreaGuide): OsakaAreaGuideHotel {
  const text = hotelText(hotel);
  const area = pickArea(text);
  const matches = guide.slug === 'osaka-hotel-comparison'
    ? 1
    : guide.keywords.filter((keyword) => text.toLowerCase().includes(keyword.toLowerCase())).length;
  const guideScore = matches ? matches * 10000 + popularity(hotel) : 0;
  const price = hotel.averageNightlyRate ?? hotel.dailyRate;
  const target = guide.slug.includes('family') ? '가족 여행' : guide.slug.includes('airport') ? '공항 전후 숙박' : `${area} 일정`;

  return {
    hotel,
    guideScore,
    reasons: [
      `${area} 일정에서 이동 동선을 줄이기 좋은 후보입니다.`,
      hotel.reviewCount && hotel.reviewCount >= 1000 ? '후기 수가 충분해 반복되는 장점과 주의점을 비교하기 좋습니다.' : '최근 객실 조건과 위치 후기를 함께 확인하는 편이 좋습니다.',
      hotel.reviewScore && hotel.reviewScore >= 8.8 ? '아고다 평점이 높은 편이라 우선 비교 후보로 살펴볼 만합니다.' : '가격과 객실 크기를 함께 비교하면 선택이 쉬워집니다.'
    ],
    caution: area === '난바·신사이바시' ? '번화가 숙소는 야간 소음과 역 출구까지의 실제 도보 동선을 확인하세요.' : '객실 크기와 조식·취소 조건은 예약하는 객실 유형별로 다시 확인하세요.',
    target,
    tags: [area, ...guide.criteria.slice(0, 3)],
    tableCells: [area, String(hotel.reviewScore ?? '확인 필요'), hotel.reviewCount ? `${hotel.reviewCount.toLocaleString('ko-KR')}건` : '후기 부족', price ? `${price.toLocaleString('ko-KR')}원~` : '가격 확인', target]
  };
}

function hotelText(hotel: Hotel) {
  return [hotel.hotelName, hotel.address, hotel.region, hotel.analysis?.summary, hotel.analysis?.pros?.join(' ')].filter(Boolean).join(' ');
}

function pickArea(text: string) {
  if (/Universal|유니버설|USJ|Konohana|Sakurajima/i.test(text)) return 'USJ';
  if (/Kansai|간사이|Izumisano|Rinku|Airport|공항/i.test(text)) return '간사이공항';
  if (/Shin-?Osaka|신오사카|Yodogawa/i.test(text)) return '신오사카';
  if (/Umeda|우메다|Kita-ku|Kita Ward|오사카역/i.test(text)) return '우메다';
  if (/Shinsaibashi|신사이바시|Minamisenba/i.test(text)) return '신사이바시';
  if (/Namba|난바|Dotonbori|도톤보리|Naniwa|Nipponbashi|닛폰바시/i.test(text)) return '난바·신사이바시';
  return '오사카';
}

function popularity(hotel: Hotel) {
  return (hotel.reviewScore || 0) * 1000 + Math.min(hotel.reviewCount || 0, 50000) / 10;
}
