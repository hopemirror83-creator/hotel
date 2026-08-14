import { activeHotels as hotels } from './hotels';
import type { Hotel } from './hotels';

export type YokohamaAreaGuide = {
  slug: string; path: string; title: string; eyebrow: string; intro: string;
  purpose: string; intentQuestion: string; metaDescription: string;
  criteria: string[]; keywords: string[];
};

export const yokohamaAreaGuides: YokohamaAreaGuide[] = [
  guide('yokohama-station-hotels', 'YOKOHAMA STATION GUIDE', '요코하마역 호텔 후기 모음 교통·조식·체크인 비교',
    '요코하마역은 도쿄와 하네다공항, 가마쿠라 방면 이동이 편리하지만 출구와 호텔까지의 실제 동선을 함께 확인해야 합니다.',
    '철도 이동이 많은 일정에 맞는 숙소를 찾는 여행자를 위한 선택 가이드입니다.',
    '요코하마역 호텔은 어느 출구와 이동 동선을 먼저 비교해야 할까요?', ['역 접근성', '공항 이동', '조식', '짐 보관', '체크인'], ['요코하마역', 'Yokohama Station', 'Kinkocho', 'Kitasaiwai', 'Minamisaiwai']),
  guide('minatomirai-hotels', 'MINATOMIRAI GUIDE', '요코하마 미나토미라이 호텔 후기 모음 전망·관광·조식 비교',
    '미나토미라이는 야경과 쇼핑, 항구 산책이 강점이지만 객실 방향과 역까지의 거리, 주말 가격 차이를 함께 봐야 합니다.',
    '요코하마 야경과 도보 관광을 중요하게 보는 여행자를 위한 가이드입니다.',
    '미나토미라이 호텔은 전망과 이동 편의 중 무엇을 우선해야 할까요?', ['전망', '관광 동선', '조식', '객실 방향', '가격대'], ['미나토미라이', 'Minatomirai', 'Pacifico', 'Kahoku', '랜드마크']),
  guide('sakuragicho-hotels', 'SAKURAGICHO GUIDE', '요코하마 사쿠라기초 호텔 후기 모음 위치·야경·가성비 비교',
    '사쿠라기초는 미나토미라이와 노게를 함께 이용하기 좋으며, 역 출구와 언덕·보행 동선을 확인하면 숙소 선택이 쉬워집니다.',
    '관광과 식사 동선을 균형 있게 잡으려는 여행자를 위한 가이드입니다.',
    '사쿠라기초 호텔은 위치와 가격을 어떻게 비교해야 할까요?', ['역 접근성', '야경', '노게 식당가', '객실', '가성비'], ['사쿠라기초', 'Sakuragicho', 'Noge', 'Hanasaki', 'Bashamichi', '바샤미치']),
  guide('chinatown-hotels', 'CHINATOWN GUIDE', '요코하마 차이나타운 호텔 후기 모음 관광·교통·조식 비교',
    '요코하마 차이나타운과 야마시타공원 주변은 관광과 식사가 편하지만 야간 소음과 역까지의 거리를 함께 확인해야 합니다.',
    '차이나타운과 항구 관광을 도보로 즐기려는 여행자를 위한 가이드입니다.',
    '요코하마 차이나타운 호텔은 관광 동선과 조용함을 어떻게 비교해야 할까요?', ['차이나타운', '야마시타공원', '교통', '소음', '조식'], ['차이나타운', 'Chinatown', 'Yamashita', 'Motomachi', 'Kannai', '칸나이']),
  guide('shin-yokohama-hotels', 'SHIN YOKOHAMA GUIDE', '신요코하마역 호텔 후기 모음 신칸센·조식·체크인 비교',
    '신요코하마역은 신칸센 이용과 닛산스타디움 일정에 편리하지만 요코하마 중심 관광지까지의 이동 시간을 고려해야 합니다.',
    '신칸센이나 공연·경기 일정에 맞춘 숙소를 찾는 여행자를 위한 가이드입니다.',
    '신요코하마역 호텔은 교통과 주변 편의 중 무엇을 확인해야 할까요?', ['신칸센', '역 접근성', '체크인', '조식', '주변 식당'], ['신요코하마', 'Shin Yokohama', 'Shinyokohama', 'Kohoku', '닛산']),
  guide('yokohama-family-hotels', 'YOKOHAMA FAMILY GUIDE', '요코하마 가족호텔 후기 모음 객실·조식·교통 비교',
    '가족 숙소는 침대 구성과 객실 크기, 아이 동반 조식, 관광지 이동 동선을 함께 비교해야 합니다.',
    '아이와 함께 요코하마를 여행하는 가족을 위한 숙소 선택 가이드입니다.',
    '요코하마 가족호텔은 객실과 이동 편의 중 무엇을 먼저 봐야 할까요?', ['가족 객실', '침대 구성', '아이 조식', '교통', '주변 편의'], ['가족', 'family', 'triple', '트리플', 'suite', '스위트', 'resort', '리조트']),
  guide('yokohama-value-hotels', 'YOKOHAMA VALUE GUIDE', '요코하마 가성비 호텔 후기 모음 위치·객실·조식 비교',
    '가성비 숙소는 표시 요금뿐 아니라 역까지의 거리, 객실 크기와 조식·취소 조건을 함께 비교해야 합니다.',
    '교통과 기본 객실 품질을 유지하면서 숙박비를 조절하려는 여행자를 위한 가이드입니다.',
    '요코하마 가성비 호텔은 가격 외에 어떤 조건을 비교해야 할까요?', ['가격대', '역 접근성', '객실', '조식', '후기 수'], ['APA', 'Toyoko', '토요코', 'R&B', 'Route Inn', '루트 인', 'Inn', '인']),
  guide('yokohama-hotel-comparison', 'YOKOHAMA COMPARISON', '요코하마 호텔 비교 후기 모음 요코하마역·미나토미라이·차이나타운',
    '요코하마는 역 주변과 미나토미라이, 사쿠라기초, 차이나타운의 숙박 목적과 이동 방식이 서로 다릅니다.',
    '요코하마 주요 권역의 호텔을 일정과 예산에 맞게 비교하는 페이지입니다.',
    '요코하마 호텔은 어느 지역부터 비교하는 것이 좋을까요?', ['숙박 지역', '평점', '후기 수', '가격대', '추천 대상'], ['요코하마', 'Yokohama'])
];

function guide(slug: string, eyebrow: string, title: string, intro: string, purpose: string, intentQuestion: string, criteria: string[], keywords: string[]): YokohamaAreaGuide {
  return { slug, path: `/yokohama/${slug}/`, eyebrow, title, intro, purpose, intentQuestion, criteria, keywords, metaDescription: `${title.replace('후기 모음 ', '')} 기준으로 예약 전 조건을 비교합니다.` };
}

export const yokohamaHotels = hotels.filter((hotel) => hotel.slug.startsWith('yokohama-')).sort((a, b) => popularity(b) - popularity(a));

export function getYokohamaAreaGuideHotels(guide: YokohamaAreaGuide, limit = 20) {
  return yokohamaHotels.map((hotel) => buildGuideHotel(hotel, guide)).filter((item) => item.guideScore > 0).sort((a, b) => b.guideScore - a.guideScore).slice(0, limit);
}

export function getRelatedYokohamaAreaGuides(hotel: Hotel) {
  if (!hotel.slug.startsWith('yokohama-')) return [];
  const text = hotelText(hotel).toLowerCase();
  return yokohamaAreaGuides.map((guide) => ({ guide, score: guide.slug === 'yokohama-hotel-comparison' ? 1 : guide.keywords.filter((keyword) => text.includes(keyword.toLowerCase())).length }))
    .filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 4).map((item) => item.guide);
}

function buildGuideHotel(hotel: Hotel, guide: YokohamaAreaGuide) {
  const text = hotelText(hotel);
  const area = pickArea(text);
  const matches = guide.slug === 'yokohama-hotel-comparison' ? 1 : guide.keywords.filter((keyword) => text.toLowerCase().includes(keyword.toLowerCase())).length;
  const price = hotel.averageNightlyRate ?? hotel.dailyRate;
  const target = guide.slug.includes('family') ? '가족여행' : guide.slug.includes('value') ? '가성비 여행' : `${area} 일정`;
  return {
    hotel, guideScore: matches ? matches * 10000 + popularity(hotel) : 0,
    reasons: [`${area} 일정에서 이동 동선을 줄이기 좋은 후보입니다.`, hotel.reviewCount && hotel.reviewCount >= 1000 ? '후기 수가 충분해 반복되는 장점과 주의점을 비교하기 좋습니다.' : '객실 조건과 위치 후기를 함께 확인하는 편이 좋습니다.', hotel.reviewScore && hotel.reviewScore >= 8.8 ? '아고다 평점이 높은 편이어서 우선 비교 후보로 보기 좋습니다.' : '가격과 객실 크기를 함께 비교하면 선택이 쉬워집니다.'],
    caution: '객실 크기와 조식·취소 조건, 숙박 요금은 객실 유형과 날짜에 따라 달라질 수 있으니 최종 예약 화면에서 확인하세요.',
    target, tags: [area, ...guide.criteria.slice(0, 3)],
    tableCells: [area, String(hotel.reviewScore ?? '확인 필요'), hotel.reviewCount ? `${hotel.reviewCount.toLocaleString('ko-KR')}건` : '후기 부족', price ? `${price.toLocaleString('ko-KR')}원~` : '가격 확인', target]
  };
}

function hotelText(hotel: Hotel) { return [hotel.hotelName, hotel.address, hotel.region, hotel.analysis?.summary, hotel.analysis?.pros?.join(' ')].filter(Boolean).join(' '); }
function pickArea(text: string) {
  if (/신요코하마|Shin.?Yokohama|Shinyokohama|Kohoku/i.test(text)) return '신요코하마';
  if (/차이나타운|Chinatown|Yamashita|Motomachi|야마시타/i.test(text)) return '차이나타운';
  if (/미나토미라이|Minatomirai|Pacifico|랜드마크/i.test(text)) return '미나토미라이';
  if (/사쿠라기초|Sakuragicho|Noge|Bashamichi|바샤미치/i.test(text)) return '사쿠라기초';
  if (/요코하마역|Yokohama Station|Kinkocho|Kitasaiwai|Minamisaiwai/i.test(text)) return '요코하마역';
  return '요코하마';
}
function popularity(hotel: Hotel) { return (hotel.reviewScore || 0) * 1000 + Math.min(hotel.reviewCount || 0, 50000) / 10; }
