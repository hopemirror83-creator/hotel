import { activeHotels as hotels } from './hotels';
import type { Hotel } from './hotels';

export type NiigataAreaGuide = {
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

export const niigataAreaGuides: NiigataAreaGuide[] = [
  guide('niigata-station-hotels', 'NIIGATA STATION GUIDE', '니가타역 반다이 호텔 후기 모음 조식·체크인·교통 비교', '니가타역과 반다이 주변은 철도와 버스 이용이 편하지만 출구별 실제 도보 거리, 조식과 짐 보관 조건을 함께 확인해야 합니다.', '니가타 도심과 JR을 중심으로 움직이는 여행자를 위한 가이드입니다.', '니가타역·반다이 호텔은 위치와 조식을 어떻게 비교해야 할까요?', ['역 접근성', '반다이 이동', '조식', '짐 보관', '체크인'], ['니가타역', 'Niigata Station', '반다이', 'Bandai', '에키마에', '万代']),
  guide('echigo-yuzawa-hotels', 'ECHIGO YUZAWA GUIDE', '에치고유자와 나에바 호텔 료칸 후기 모음 스키·온천·셔틀 비교', '에치고유자와와 나에바 숙소는 설원과 온천이 장점이지만 슬로프 이동, 장비 보관, 송영과 식사 시간을 확인해야 합니다.', '스키와 온천을 함께 즐기려는 가족·커플 여행자를 위한 가이드입니다.', '유자와·나에바 숙소는 스키장 접근성과 온천을 어떻게 비교해야 할까요?', ['스키장 접근성', '온천', '셔틀', '장비 보관', '가족 객실'], ['에치고유자와', 'Echigo Yuzawa', '유자와', 'Yuzawa', '나에바', 'Naeba', '湯沢', '苗場']),
  guide('myoko-akakura-hotels', 'MYOKO AKAKURA GUIDE', '묘코 아카쿠라 호텔 료칸 후기 모음 스키·온천·석식 비교', '묘코와 아카쿠라는 스키장과 온천 마을이 넓게 분산되어 있어 슬로프 거리, 송영, 석식과 겨울철 이동 조건을 함께 보아야 합니다.', '묘코 설원과 아카쿠라온천을 중심으로 머무는 여행자를 위한 가이드입니다.', '묘코·아카쿠라 숙소는 슬로프와 식사 조건을 어떻게 비교해야 할까요?', ['슬로프 접근성', '온천', '석식', '송영', '겨울 교통'], ['묘코', 'Myoko', '아카쿠라', 'Akakura', '妙高', '赤倉']),
  guide('nagaoka-hotels', 'NAGAOKA GUIDE', '나가오카 호텔 후기 모음 역근처·주차·조식·출장 비교', '나가오카 숙소는 역세권과 차량 이동형으로 나뉘므로 실제 도보 거리, 주차 요금, 조식 시작 시간과 체크인 조건을 비교하는 편이 좋습니다.', '나가오카역 이용과 출장·렌터카 일정을 위한 가이드입니다.', '나가오카 호텔은 역 접근성과 주차를 어떻게 비교해야 할까요?', ['나가오카역', '주차', '조식', '출장', '체크인'], ['나가오카', 'Nagaoka', '長岡']),
  guide('sado-island-hotels', 'SADO ISLAND GUIDE', '사도섬 호텔 료칸 후기 모음 항구·렌터카·식사·전망 비교', '사도섬 숙소는 료쓰항 등 입도 항구와의 거리, 렌터카 동선, 식사 포함 여부와 객실 전망을 함께 확인해야 합니다.', '사도섬을 천천히 둘러보는 렌터카·식도락 여행자를 위한 가이드입니다.', '사도섬 숙소는 항구와 섬 내 이동을 어떻게 비교해야 할까요?', ['항구 이동', '렌터카', '석식', '바다 전망', '주차'], ['사도', 'Sado', '료쓰', 'Ryotsu', '오기', 'Ogi', '佐渡', '両津']),
  guide('niigata-onsen-ryokan', 'NIIGATA ONSEN GUIDE', '니가타 온천 료칸 후기 모음 이와무로·쓰키오카 노천탕·석식 비교', '이와무로와 쓰키오카를 비롯한 니가타 온천 숙소는 대욕장과 노천탕, 식사 구성, 송영 예약과 체크인 마감을 함께 보아야 합니다.', '온천과 식사 중심으로 쉬어갈 여행자를 위한 가이드입니다.', '니가타 온천 료칸은 온천과 식사를 어떻게 비교해야 할까요?', ['노천탕', '대욕장', '석식', '송영', '체크인'], ['이와무로', 'Iwamuro', '쓰키오카', 'Tsukioka', '온천', 'Onsen', '岩室', '月岡']),
  guide('niigata-ski-family-hotels', 'NIIGATA SKI FAMILY GUIDE', '니가타 스키 가족호텔 후기 모음 유자와·나에바·묘코 비교', '니가타 스키 가족 숙소는 슬로프 이동, 가족 객실과 침대 구성, 장비 보관, 식사와 아이 동반 조건을 함께 비교해야 합니다.', '아이와 니가타 설원을 찾는 가족을 위한 가이드입니다.', '니가타 스키 가족호텔은 어떤 조건을 우선해야 할까요?', ['가족 객실', '스키장', '장비 보관', '셔틀', '식사'], ['가족', 'family', '스키', 'ski', '유자와', 'Yuzawa', '나에바', 'Naeba', '묘코', 'Myoko']),
  guide('niigata-hotel-comparison', 'NIIGATA COMPARISON', '니가타 호텔 비교 후기 모음 니가타역·유자와·묘코·사도·온천', '니가타역과 유자와·나에바, 묘코, 나가오카, 사도섬과 온천 지역은 숙박 목적과 이동 방식이 서로 다릅니다.', '니가타 주요 권역을 일정과 예산에 맞게 비교하는 페이지입니다.', '니가타 숙소는 어느 지역부터 비교하는 것이 좋을까요?', ['숙박 지역', '평점', '후기 수', '가격대', '추천 대상'], ['니가타', 'Niigata', '유자와', 'Yuzawa', '묘코', 'Myoko', '나가오카', 'Nagaoka', '사도', 'Sado']),
];

function guide(slug: string, eyebrow: string, title: string, intro: string, purpose: string, intentQuestion: string, criteria: string[], keywords: string[]): NiigataAreaGuide {
  return { slug, path: `/niigata/${slug}/`, eyebrow, title, intro, purpose, intentQuestion, criteria, keywords, metaDescription: `${title.replace('후기 모음 ', '')} 기준으로 예약 전 조건을 비교합니다.` };
}

export const niigataHotels = hotels.filter((hotel) => hotel.slug.startsWith('niigata-')).sort((a, b) => popularity(b) - popularity(a));

export function getNiigataAreaGuideHotels(areaGuide: NiigataAreaGuide, limit = 20) {
  return niigataHotels.map((hotel) => buildItem(hotel, areaGuide)).filter((item) => item.guideScore > 0).sort((a, b) => b.guideScore - a.guideScore).slice(0, limit);
}

export function getRelatedNiigataAreaGuides(hotel: Hotel) {
  if (!hotel.slug.startsWith('niigata-')) return [];
  const text = hotelText(hotel).toLowerCase();
  return niigataAreaGuides
    .map((areaGuide) => ({ guide: areaGuide, score: areaGuide.slug === 'niigata-hotel-comparison' ? 1 : areaGuide.keywords.filter((keyword) => text.includes(keyword.toLowerCase())).length }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => item.guide);
}

function buildItem(hotel: Hotel, areaGuide: NiigataAreaGuide) {
  const text = hotelText(hotel);
  const area = pickArea(text);
  const matches = areaGuide.slug === 'niigata-hotel-comparison' ? 1 : areaGuide.keywords.filter((keyword) => text.toLowerCase().includes(keyword.toLowerCase())).length;
  const price = hotel.averageNightlyRate ?? hotel.dailyRate;
  const target = areaGuide.slug.includes('family') ? '스키 가족여행' : areaGuide.slug.includes('onsen') ? '온천 여행' : `${area} 일정`;
  return {
    hotel,
    guideScore: matches ? matches * 10000 + popularity(hotel) : 0,
    reasons: [
      `${area} 일정에서 이동 동선을 줄이기 좋은 후보입니다.`,
      hotel.reviewCount && hotel.reviewCount >= 1000 ? '후기 수가 충분해 반복되는 장점과 주의점을 비교하기 좋습니다.' : '객실과 식사·교통 조건을 함께 확인하는 편이 좋습니다.',
      hotel.reviewScore && hotel.reviewScore >= 8.8 ? '아고다 평점이 높은 편이어서 우선 비교 후보로 보기 좋습니다.' : '가격과 객실 조건을 함께 비교하면 선택이 쉬워집니다.',
    ],
    caution: '객실과 조식·온천·취소 조건, 송영과 숙박 요금은 날짜와 객실 유형에 따라 달라질 수 있으니 최종 예약 화면에서 확인하세요.',
    target,
    tags: [area, ...areaGuide.criteria.slice(0, 3)],
    tableCells: [area, String(hotel.reviewScore ?? '확인 필요'), hotel.reviewCount ? `${hotel.reviewCount.toLocaleString('ko-KR')}건` : '후기 부족', price ? `${price.toLocaleString('ko-KR')}원~` : '가격 확인', target],
  };
}

function hotelText(hotel: Hotel) { return [hotel.hotelName, hotel.address, hotel.region, hotel.analysis?.summary, hotel.analysis?.pros?.join(' ')].filter(Boolean).join(' '); }
function pickArea(text: string) { if (/유자와|Yuzawa|나에바|Naeba/i.test(text)) return '유자와·나에바'; if (/묘코|Myoko|아카쿠라|Akakura/i.test(text)) return '묘코·아카쿠라'; if (/나가오카|Nagaoka/i.test(text)) return '나가오카'; if (/사도|Sado|료쓰|Ryotsu/i.test(text)) return '사도섬'; if (/이와무로|Iwamuro|쓰키오카|Tsukioka/i.test(text)) return '니가타 온천'; return '니가타역·반다이'; }
function popularity(hotel: Hotel) { return (hotel.reviewScore || 0) * 1000 + Math.min(hotel.reviewCount || 0, 50000) / 10; }
