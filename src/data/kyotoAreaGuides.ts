import { activeHotels as hotels } from './hotels';
import type { Hotel } from './hotels';

export type KyotoAreaGuide = {
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

const guides: Omit<KyotoAreaGuide, 'path' | 'metaDescription'>[] = [
  {
    slug: 'kyoto-station-hotels', eyebrow: 'KYOTO STATION GUIDE',
    title: '교토역 호텔 후기 모음 교통·조식·체크인·짐보관 비교',
    intro: '교토역 숙소는 간사이공항과 오사카 이동이 편리하지만 하치조구치와 중앙구치의 실제 동선, 버스 정류장, 짐 보관 조건을 함께 확인해야 합니다.',
    purpose: '교토를 처음 방문하거나 근교 이동이 많은 여행자를 위한 교통 중심 숙소 가이드입니다.',
    intentQuestion: '교토역 호텔은 역과의 거리 외에 무엇을 비교해야 할까요?',
    criteria: ['교토역 도보 동선', '공항 이동', '짐 보관', '조식', '객실 크기'],
    keywords: ['교토역', 'Kyoto Station', '에키마에', 'Ekimae', '하치조', 'Hachijo', '시치조', 'Shichijo']
  },
  {
    slug: 'gion-kawaramachi-hotels', eyebrow: 'GION & KAWARAMACHI',
    title: '교토 기온·가와라마치 호텔 후기 모음 관광·맛집·교통 비교',
    intro: '기온과 가와라마치는 관광과 식사 동선이 좋지만 야간 소음, 역까지의 거리, 버스 혼잡과 캐리어 이동을 함께 살펴보는 편이 좋습니다.',
    purpose: '기온과 니시키시장, 폰토초를 걸어서 여행하고 싶은 분을 위한 숙소 가이드입니다.',
    intentQuestion: '기온·가와라마치 호텔은 관광 동선과 조용함 중 무엇을 우선해야 할까요?',
    criteria: ['기온 접근', '가와라마치역', '야간 소음', '주변 식당', '관광 동선'],
    keywords: ['기온', 'Gion', '가와라마치', 'Kawaramachi', '폰토초', 'Pontocho', '히가시야마', 'Higashiyama']
  },
  {
    slug: 'shijo-karasuma-hotels', eyebrow: 'SHIJO KARASUMA GUIDE',
    title: '교토 시조카라스마 호텔 후기 모음 쇼핑·교통·가성비 비교',
    intro: '시조카라스마는 교토 도심과 오사카 이동을 함께 보기 좋지만 지하철과 한큐선 출구, 객실 크기, 주변 상권을 비교해야 합니다.',
    purpose: '쇼핑과 대중교통, 합리적인 가격을 함께 보는 여행자를 위한 가이드입니다.',
    intentQuestion: '시조카라스마 호텔은 어느 출구와 교통 노선을 기준으로 골라야 할까요?',
    criteria: ['시조역 접근', '한큐선', '쇼핑', '가성비', '조식'],
    keywords: ['시조', 'Shijo', '카라스마', 'Karasuma', '오미야', 'Omiya', '고조', 'Gojo']
  },
  {
    slug: 'arashiyama-hotels', eyebrow: 'ARASHIYAMA GUIDE',
    title: '교토 아라시야마 호텔·료칸 후기 모음 온천·전망·교통 비교',
    intro: '아라시야마 숙소는 이른 아침 관광과 조용한 휴식에 유리하지만 도심 이동, 식사 제공 여부, 료칸 운영 시간을 함께 확인해야 합니다.',
    purpose: '대나무숲과 도게츠교를 여유롭게 즐기려는 여행자를 위한 숙소 가이드입니다.',
    intentQuestion: '아라시야마 숙소는 당일 관광보다 숙박할 가치가 있을까요?',
    criteria: ['대나무숲 접근', '도게츠교', '료칸 식사', '온천·대욕장', '도심 이동'],
    keywords: ['아라시야마', 'Arashiyama', '사가', 'Saga', '도게츠', 'Togetsu', '란잔', 'Ranzan']
  },
  {
    slug: 'kyoto-ryokan-onsen', eyebrow: 'RYOKAN & ONSEN GUIDE',
    title: '교토 료칸·온천 호텔 후기 모음 가이세키·대욕장·체크인 비교',
    intro: '교토 료칸은 다다미 객실만 볼 것이 아니라 식사 포함 여부, 대욕장 운영 시간, 체크인 마감과 침구 준비 방식을 함께 봐야 합니다.',
    purpose: '일본식 숙박과 목욕, 가이세키 경험을 중요하게 보는 여행자를 위한 가이드입니다.',
    intentQuestion: '교토 료칸 예약 전 식사와 대욕장 조건은 어떻게 확인해야 할까요?',
    criteria: ['료칸 객실', '가이세키', '대욕장·온천', '체크인 마감', '짐 보관'],
    keywords: ['료칸', 'Ryokan', '온천', 'Onsen', '대욕장', '가이세키', 'Kanade', 'Momijiya']
  },
  {
    slug: 'kyoto-family-hotels', eyebrow: 'KYOTO FAMILY GUIDE',
    title: '교토 가족호텔 후기 모음 넓은 객실·조식·교통 비교',
    intro: '가족 숙소는 침대 구성과 객실 면적, 아이 동반 조식, 세탁 시설과 버스·지하철 이동 편의성을 함께 확인해야 합니다.',
    purpose: '아이 또는 부모님과 함께 교토를 여행하는 가족을 위한 숙소 선택 가이드입니다.',
    intentQuestion: '교토 가족호텔은 넓은 객실과 관광 접근성 중 무엇을 먼저 봐야 할까요?',
    criteria: ['가족 객실', '침대 구성', '아이 조식', '세탁·주방', '교통'],
    keywords: ['가족', '패밀리', 'Family', '트리플', 'Triple', '미마루', 'Mimaru', '아파트', 'Apartment', '레지던스']
  },
  {
    slug: 'kyoto-value-hotels', eyebrow: 'KYOTO VALUE GUIDE',
    title: '교토 가성비 호텔 후기 모음 위치·객실·조식·대욕장 비교',
    intro: '교토의 가성비 숙소는 낮은 가격만 보지 말고 관광지까지의 교통비, 객실 크기, 무료 서비스와 숙박세를 함께 계산해야 합니다.',
    purpose: '숙박비를 조절하면서도 위치와 객실 만족도를 놓치고 싶지 않은 여행자를 위한 가이드입니다.',
    intentQuestion: '교토 가성비 호텔은 가격 외에 어떤 비용과 편의시설을 비교해야 할까요?',
    criteria: ['평균 가격대', '교통비', '객실 크기', '무료 서비스', '숙박세'],
    keywords: ['호텔', 'Hotel', '인', 'Inn', '소테츠', 'Sotetsu', 'APA', 'M’s', '엠스', '포켓', 'Pocket']
  },
  {
    slug: 'kyoto-hotel-comparison', eyebrow: 'KYOTO COMPARISON',
    title: '교토 호텔 비교 후기 모음 교토역·기온·가와라마치·아라시야마',
    intro: '교토는 교토역과 시조카라스마, 기온·가와라마치, 아라시야마처럼 숙박 권역에 따라 관광 동선과 밤 분위기가 크게 달라집니다.',
    purpose: '교토 주요 권역의 호텔을 여행 목적과 이동 방식에 맞춰 비교하는 페이지입니다.',
    intentQuestion: '교토 호텔은 어느 지역부터 비교하는 것이 좋을까요?',
    criteria: ['숙박 권역', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['교토', 'Kyoto']
  }
];

export const kyotoAreaGuides = guides.map((guide) => ({
  ...guide,
  path: `/kyoto/${guide.slug}/`,
  metaDescription: `${guide.title}. ${guide.criteria.join(', ')} 기준으로 예약 전 확인할 내용을 정리했습니다.`
}));

export const kyotoHotels = hotels
  .filter((hotel) => hotel.slug.startsWith('kyoto-'))
  .sort((a, b) => popularity(b) - popularity(a));

export function getKyotoAreaGuideHotels(guide: KyotoAreaGuide, limit = 20) {
  return kyotoHotels.map((hotel) => buildGuideHotel(hotel, guide))
    .filter((item) => item.guideScore > 0)
    .sort((a, b) => b.guideScore - a.guideScore)
    .slice(0, limit);
}

export function getRelatedKyotoAreaGuides(hotel: Hotel) {
  if (!hotel.slug.startsWith('kyoto-')) return [];
  const text = hotelText(hotel).toLowerCase();
  return kyotoAreaGuides.map((guide) => ({
    guide,
    score: guide.slug === 'kyoto-hotel-comparison' ? 1 : guide.keywords.filter((keyword) => text.includes(keyword.toLowerCase())).length
  })).filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 4).map((item) => item.guide);
}

function buildGuideHotel(hotel: Hotel, guide: KyotoAreaGuide) {
  const text = hotelText(hotel);
  const area = pickArea(text);
  const matches = guide.slug === 'kyoto-hotel-comparison' ? 1 : guide.keywords.filter((keyword) => text.toLowerCase().includes(keyword.toLowerCase())).length;
  const price = hotel.averageNightlyRate ?? hotel.dailyRate;
  const target = guide.slug.includes('family') ? '가족여행' : guide.slug.includes('ryokan') ? '료칸·온천 체험' : `${area} 일정`;
  return {
    hotel,
    guideScore: matches ? matches * 10000 + popularity(hotel) : 0,
    reasons: [
      `${area} 일정에서 이동 동선을 줄이기 좋은 후보입니다.`,
      hotel.reviewCount && hotel.reviewCount >= 1000 ? '후기 수가 충분해 반복되는 장점과 주의점을 비교하기 좋습니다.' : '객실 조건과 위치 후기를 함께 확인하는 편이 좋습니다.',
      hotel.reviewScore && hotel.reviewScore >= 8.8 ? '아고다 평점이 높은 편이라 우선 비교 후보로 보기 좋습니다.' : '가격과 객실 크기를 함께 비교하면 선택이 쉬워집니다.'
    ],
    caution: '객실 크기와 조식·취소 조건, 교토 숙박세는 예약 날짜와 객실 유형에 따라 다를 수 있으니 최종 화면에서 확인하세요.',
    target,
    tags: [area, ...guide.criteria.slice(0, 3)],
    tableCells: [area, String(hotel.reviewScore ?? '확인 필요'), hotel.reviewCount ? `${hotel.reviewCount.toLocaleString('ko-KR')}건` : '후기 부족', price ? `${price.toLocaleString('ko-KR')}원~` : '가격 확인', target]
  };
}

function hotelText(hotel: Hotel) {
  return [hotel.hotelName, hotel.address, hotel.region, hotel.analysis?.summary, hotel.analysis?.pros?.join(' ')].filter(Boolean).join(' ');
}

function pickArea(text: string) {
  if (/Arashiyama|아라시야마|Saga|사가|Togetsu|도게츠|Ranzan|란잔/i.test(text)) return '아라시야마';
  if (/Gion|기온|Kawaramachi|가와라마치|Higashiyama|히가시야마|Pontocho|폰토초/i.test(text)) return '기온·가와라마치';
  if (/Shijo|시조|Karasuma|카라스마|Omiya|오미야|Gojo|고조/i.test(text)) return '시조카라스마';
  if (/Kyoto Station|교토역|Ekimae|에키마에|Hachijo|하치조|Shichijo|시치조/i.test(text)) return '교토역';
  return '교토';
}

function popularity(hotel: Hotel) {
  return (hotel.reviewScore || 0) * 1000 + Math.min(hotel.reviewCount || 0, 50000) / 10;
}
