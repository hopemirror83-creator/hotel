import { activeHotels as hotels } from './hotels';
import type { Hotel } from './hotels';

export type HiroshimaAreaGuide = {
  slug: string; path: string; title: string; eyebrow: string; intro: string;
  purpose: string; intentQuestion: string; metaDescription: string;
  criteria: string[]; keywords: string[];
};

export const hiroshimaAreaGuides: HiroshimaAreaGuide[] = [
  {
    slug: 'hiroshima-station-hotels', path: '/hiroshima/hiroshima-station-hotels/', eyebrow: 'HIROSHIMA STATION GUIDE',
    title: '히로시마역 호텔 후기 모음 교통·조식·체크인·짐보관 비교',
    intro: '히로시마역 숙소는 공항과 신칸센 이동이 편리하지만 역 출구, 지하상가 동선과 객실 크기를 함께 확인해야 합니다.',
    purpose: '공항 이동과 근교 여행, 짧은 히로시마 일정을 준비하는 여행자를 위한 선택 가이드입니다.',
    intentQuestion: '히로시마역 호텔은 역과의 거리 외에 무엇을 비교해야 할까요?',
    metaDescription: '히로시마역 호텔을 교통, 조식, 체크인, 짐 보관, 객실 크기 기준으로 비교합니다.',
    criteria: ['히로시마역 도보 동선', '공항·신칸센 이동', '짐 보관', '조식', '객실 크기'],
    keywords: ['히로시마역', 'Hiroshima Station', 'Hiroshima-Ekimae', '히로시마에키마에', 'Minami-ku', '미나미구', '신칸센구치']
  },
  {
    slug: 'peace-park-hotels', path: '/hiroshima/peace-park-hotels/', eyebrow: 'PEACE PARK GUIDE',
    title: '히로시마 평화기념공원 호텔 후기 모음 위치·교통·조식 비교',
    intro: '평화기념공원과 오테마치 주변은 주요 관광지를 도보로 둘러보기 좋지만 히로시마역 이동과 야간 식사 동선을 함께 봐야 합니다.',
    purpose: '원폭돔과 평화기념공원을 중심으로 히로시마 도심을 여행하는 분을 위한 가이드입니다.',
    intentQuestion: '평화기념공원 호텔은 관광 접근성과 히로시마역 이동 중 무엇을 먼저 봐야 할까요?',
    metaDescription: '히로시마 평화기념공원 호텔을 위치, 교통, 조식, 객실, 가성비 기준으로 비교합니다.',
    criteria: ['평화기념공원 접근', '원폭돔', '노면전차', '조식', '야간 동선'],
    keywords: ['평화기념공원', 'Peace Park', 'Peace Memorial', '원폭돔', 'Atomic Bomb Dome', 'Otemachi', '오테마치', 'Nakajimacho', '나카지마초']
  },
  {
    slug: 'hatchobori-hondori-hotels', path: '/hiroshima/hatchobori-hondori-hotels/', eyebrow: 'HATCHOBORI & HONDORI GUIDE',
    title: '히로시마 핫초보리·혼도리 호텔 후기 모음 쇼핑·맛집·교통',
    intro: '핫초보리와 혼도리는 쇼핑과 맛집, 야간 이동이 편리하지만 번화가 소음과 노면전차 정류장까지의 거리를 확인해야 합니다.',
    purpose: '쇼핑과 식사, 늦은 저녁 일정을 중심으로 히로시마를 여행하는 분을 위한 가이드입니다.',
    intentQuestion: '핫초보리·혼도리 호텔은 번화가 접근성과 조용한 숙박 중 어느 쪽을 우선해야 할까요?',
    metaDescription: '히로시마 핫초보리·혼도리 호텔을 쇼핑, 맛집, 교통, 소음, 가성비로 비교합니다.',
    criteria: ['핫초보리 접근', '혼도리 쇼핑', '맛집', '야간 소음', '노면전차'],
    keywords: ['핫초보리', 'Hatchobori', '혼도리', 'Hondori', 'Noboricho', '노보리초', 'Shintenchi', '신텐치', 'Nagarekawa', '나가레카와']
  },
  {
    slug: 'miyajima-hotels', path: '/hiroshima/miyajima-hotels/', eyebrow: 'MIYAJIMA GUIDE',
    title: '미야지마 호텔·료칸 후기 모음 온천·조식·오션뷰·교통 비교',
    intro: '미야지마 숙소는 섬 안과 미야지마구치의 이동 방식이 다르며, 석식 포함 여부와 송영, 페리 시간도 함께 확인해야 합니다.',
    purpose: '이쓰쿠시마 신사와 미야지마에서 여유 있게 머물려는 여행자를 위한 선택 가이드입니다.',
    intentQuestion: '미야지마 숙소는 섬 안 료칸과 미야지마구치 호텔 중 어디가 맞을까요?',
    metaDescription: '미야지마 호텔과 료칸을 온천, 조식·석식, 오션뷰, 페리, 송영 기준으로 비교합니다.',
    criteria: ['미야지마 위치', '페리 접근', '온천', '조식·석식', '오션뷰'],
    keywords: ['미야지마', 'Miyajima', 'Itsukushima', '이쓰쿠시마', 'Miyajimaguchi', '미야지마구치', 'Hatsukaichi', '하츠카이치', 'Miyahama', '미야하마']
  },
  {
    slug: 'hiroshima-onsen-hotels', path: '/hiroshima/hiroshima-onsen-hotels/', eyebrow: 'ONSEN & BATH GUIDE',
    title: '히로시마 대욕장·온천 호텔 후기 모음 위치·조식·휴식 비교',
    intro: '대욕장 숙소는 시설 유무뿐 아니라 운영 시간, 혼잡도와 객실 욕실 조건까지 함께 확인해야 만족도를 가늠하기 쉽습니다.',
    purpose: '도보 여행 후 목욕과 휴식을 중요하게 보는 여행자를 위한 가이드입니다.',
    intentQuestion: '히로시마 대욕장 호텔은 시설 외에 무엇을 확인해야 할까요?',
    metaDescription: '히로시마 대욕장·온천 호텔을 시설, 운영 시간, 위치, 조식, 휴식 기준으로 비교합니다.',
    criteria: ['대욕장', '온천·사우나', '운영 시간', '조식', '역 접근'],
    keywords: ['대욕장', '온천', 'Natural Hot Spring', 'Dormy', '도미', 'spa', 'bath']
  },
  {
    slug: 'hiroshima-family-hotels', path: '/hiroshima/hiroshima-family-hotels/', eyebrow: 'HIROSHIMA FAMILY GUIDE',
    title: '히로시마 가족호텔 후기 모음 객실·조식·교통 비교',
    intro: '가족 숙소는 침대 구성과 객실 크기, 아이 동반 조식, 세탁 시설과 역까지의 이동 동선을 함께 봐야 합니다.',
    purpose: '아이와 함께 히로시마와 근교를 여행하는 가족을 위한 숙소 선택 가이드입니다.',
    intentQuestion: '히로시마 가족호텔은 넓은 객실과 교통 중 무엇을 먼저 비교해야 할까요?',
    metaDescription: '히로시마 가족호텔을 객실 크기, 침대, 조식, 세탁, 교통 기준으로 비교합니다.',
    criteria: ['가족 객실', '침대 구성', '아이 조식', '세탁', '교통'],
    keywords: ['가족', '패밀리', 'family', 'triple', '트리플', '스위트', 'suite', 'residence', 'kitchen']
  },
  {
    slug: 'hiroshima-value-hotels', path: '/hiroshima/hiroshima-value-hotels/', eyebrow: 'HIROSHIMA VALUE GUIDE',
    title: '히로시마 가성비 호텔 후기 모음 역 접근·객실·조식 비교',
    intro: '가성비 숙소는 표시 요금만 보기보다 역까지의 거리와 객실 크기, 조식·대욕장 포함 여부를 함께 비교해야 합니다.',
    purpose: '교통과 기본 객실 품질을 유지하면서 숙박비를 조절하려는 여행자를 위한 가이드입니다.',
    intentQuestion: '히로시마 가성비 호텔은 가격 외에 어떤 조건을 비교해야 할까요?',
    metaDescription: '히로시마 가성비 호텔을 역 접근, 객실, 조식, 대욕장, 후기 수 기준으로 비교합니다.',
    criteria: ['가격대', '역 접근', '객실', '조식', '후기 수'],
    keywords: ['APA', 'KOKO', 'Toyoko', '토요코', 'Smile', '스마일', 'Inn', '인']
  },
  {
    slug: 'hiroshima-hotel-comparison', path: '/hiroshima/hiroshima-hotel-comparison/', eyebrow: 'HIROSHIMA COMPARISON',
    title: '히로시마 호텔 비교 후기 모음 히로시마역·평화공원·미야지마',
    intro: '히로시마는 히로시마역과 평화기념공원, 핫초보리, 미야지마처럼 지역마다 교통과 여행 동선의 장점이 뚜렷합니다.',
    purpose: '히로시마 주요 지역 호텔을 일정과 이동 방식, 숙박 예산에 맞게 비교하는 페이지입니다.',
    intentQuestion: '히로시마 호텔은 어느 지역부터 비교하는 것이 좋을까요?',
    metaDescription: '히로시마 호텔을 히로시마역, 평화기념공원, 핫초보리, 미야지마 기준으로 비교합니다.',
    criteria: ['숙박 지역', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['히로시마', 'Hiroshima']
  }
];

export const hiroshimaHotels = hotels
  .filter((hotel) => hotel.slug.startsWith('hiroshima-'))
  .sort((a, b) => popularity(b) - popularity(a));

export function getHiroshimaAreaGuideHotels(guide: HiroshimaAreaGuide, limit = 20) {
  return hiroshimaHotels.map((hotel) => buildGuideHotel(hotel, guide))
    .filter((item) => item.guideScore > 0)
    .sort((a, b) => b.guideScore - a.guideScore)
    .slice(0, limit);
}

export function getRelatedHiroshimaAreaGuides(hotel: Hotel) {
  if (!hotel.slug.startsWith('hiroshima-')) return [];
  const text = hotelText(hotel).toLowerCase();
  return hiroshimaAreaGuides.map((guide) => ({
    guide,
    score: guide.slug === 'hiroshima-hotel-comparison' ? 1 : guide.keywords.filter((keyword) => text.includes(keyword.toLowerCase())).length
  })).filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 4).map((item) => item.guide);
}

function buildGuideHotel(hotel: Hotel, guide: HiroshimaAreaGuide) {
  const text = hotelText(hotel);
  const area = pickArea(text);
  const matches = guide.slug === 'hiroshima-hotel-comparison' ? 1 : guide.keywords.filter((keyword) => text.toLowerCase().includes(keyword.toLowerCase())).length;
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
  if (/Miyajima|미야지마|Itsukushima|이쓰쿠시마|Hatsukaichi|하츠카이치|Miyahama|미야하마/i.test(text)) return '미야지마';
  if (/Peace Park|Peace Memorial|평화기념공원|원폭돔|Otemachi|오테마치|Nakajimacho|나카지마초/i.test(text)) return '평화기념공원';
  if (/Hatchobori|핫초보리|Hondori|혼도리|Noboricho|노보리초|Shintenchi|신텐치|Nagarekawa|나가레카와/i.test(text)) return '핫초보리·혼도리';
  if (/Hiroshima Station|히로시마역|Hiroshima-Ekimae|히로시마에키마에|Minami-ku|미나미구|신칸센구치/i.test(text)) return '히로시마역';
  return '히로시마';
}

function popularity(hotel: Hotel) {
  return (hotel.reviewScore || 0) * 1000 + Math.min(hotel.reviewCount || 0, 50000) / 10;
}

