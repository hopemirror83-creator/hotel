import { activeHotels as hotels } from './hotels';
import type { Hotel } from './hotels';

export type ChibaAreaGuide = {
  slug: string; path: string; title: string; eyebrow: string; intro: string;
  purpose: string; intentQuestion: string; metaDescription: string;
  criteria: string[]; keywords: string[];
};

export const chibaAreaGuides: ChibaAreaGuide[] = [
  guide('narita-airport-hotels', 'NARITA AIRPORT GUIDE', '나리타공항 호텔 후기 모음 셔틀·조식·체크인 비교',
    '나리타공항 주변은 터미널까지의 거리보다 무료 셔틀 시간표, 새벽 이동과 체크인 마감 시간을 함께 확인하는 것이 중요합니다.',
    '출국 전날이나 늦은 입국 후 이동 부담을 줄이려는 여행자를 위한 숙소 선택 가이드입니다.',
    '나리타공항 호텔은 셔틀과 터미널 접근성을 어떻게 비교해야 할까요?', ['공항 셔틀', '터미널 이동', '새벽 체크아웃', '조식', '짐 보관'], ['나리타', 'Narita', 'Tokko', '공항', 'airport']),
  guide('tokyo-disney-resort-hotels', 'TOKYO DISNEY RESORT GUIDE', '도쿄 디즈니리조트 호텔 후기 모음 셔틀·가족·조식 비교',
    '마이하마와 우라야스 숙소는 파크 셔틀, 침대 구성과 아이 동반 조식, 폐장 후 귀가 동선을 함께 비교해야 합니다.',
    '도쿄 디즈니랜드와 디즈니씨 방문을 중심으로 숙소를 찾는 가족·커플 여행자를 위한 가이드입니다.',
    '디즈니리조트 호텔은 공식 호텔 여부보다 어떤 조건을 먼저 봐야 할까요?', ['파크 셔틀', '마이하마역', '가족 객실', '아이 조식', '귀가 동선'], ['디즈니', 'Disney', '마이하마', 'Maihama', '우라야스', 'Urayasu', 'Tokyo Bay']),
  guide('makuhari-hotels', 'MAKUHARI GUIDE', '마쿠하리 호텔 후기 모음 멧세·교통·조식 비교',
    '마쿠하리는 전시·공연 일정과 쇼핑에 편리하지만 가이힌마쿠하리역, 행사장과 호텔 사이의 실제 보행 동선을 확인해야 합니다.',
    '마쿠하리 멧세 행사나 지바 롯데 경기 일정에 맞는 숙소를 찾는 여행자를 위한 가이드입니다.',
    '마쿠하리 호텔은 행사장 접근성과 객실 조건을 어떻게 비교해야 할까요?', ['마쿠하리 멧세', '역 접근성', '체크인', '조식', '행사 일정'], ['마쿠하리', 'Makuhari', 'Hibino', 'Mihama', '가이힌']),
  guide('chiba-station-hotels', 'CHIBA STATION GUIDE', '지바역 호텔 후기 모음 위치·주차·조식 비교',
    '지바역과 지바추오역 주변은 JR·모노레일 이동과 식사가 편리하며, 역 출구와 주차 조건을 함께 비교하면 선택이 쉬워집니다.',
    '지바 시내 이동과 출장 일정을 효율적으로 구성하려는 여행자를 위한 가이드입니다.',
    '지바역 호텔은 교통과 주차 중 어떤 조건을 우선해야 할까요?', ['지바역', '지바추오역', '주차', '조식', '출장'], ['지바역', 'Chiba Station', 'Chiba Ekimae', 'Chuo-ku', 'Sakaecho']),
  guide('boso-resort-hotels', 'BOSO RESORT GUIDE', '보소반도 호텔 후기 모음 온천·오션뷰·주차 비교',
    '가모가와와 다테야마, 기사라즈 등 보소반도 숙소는 바다 전망과 온천뿐 아니라 렌터카 이동, 식사 포함 조건을 함께 봐야 합니다.',
    '도심보다 휴식과 바다 풍경을 중요하게 보는 여행자를 위한 리조트·료칸 선택 가이드입니다.',
    '보소반도 숙소는 오션뷰와 이동 편의를 어떻게 비교해야 할까요?', ['오션뷰', '온천', '렌터카', '석식', '주차'], ['가모가와', 'Kamogawa', '다테야마', 'Tateyama', '기사라즈', 'Kisarazu', '보소', 'Boso', '온주쿠', 'Onjuku']),
  guide('chiba-family-hotels', 'CHIBA FAMILY GUIDE', '지바 가족호텔 후기 모음 객실·조식·교통 비교',
    '가족 숙소는 객실 크기와 침대 구성, 아이 동반 조식, 주차와 관광지 이동 동선을 함께 비교해야 합니다.',
    '아이와 함께 지바·나리타·우라야스를 여행하는 가족을 위한 숙소 선택 가이드입니다.',
    '지바 가족호텔은 객실과 이동 편의 중 무엇을 먼저 봐야 할까요?', ['가족 객실', '침대 구성', '아이 조식', '주차', '교통'], ['가족', 'family', 'triple', '트리플', 'suite', '스위트', 'resort', '리조트']),
  guide('chiba-value-hotels', 'CHIBA VALUE GUIDE', '지바 가성비 호텔 후기 모음 위치·객실·조식 비교',
    '가성비 숙소는 표시 요금뿐 아니라 역·공항까지의 이동 비용, 객실 크기와 조식·취소 조건을 함께 비교해야 합니다.',
    '교통과 기본 객실 품질을 유지하면서 숙박비를 조절하려는 여행자를 위한 가이드입니다.',
    '지바 가성비 호텔은 가격 외에 어떤 조건을 비교해야 할까요?', ['가격대', '역 접근성', '객실', '조식', '후기 수'], ['APA', 'Toyoko', '토요코', 'Route Inn', '루트 인', 'Livemax', '라이브맥스', 'Inn', '인']),
  guide('chiba-hotel-comparison', 'CHIBA COMPARISON', '지바 호텔 비교 후기 모음 나리타공항·디즈니·마쿠하리·보소반도',
    '지바현은 나리타공항과 우라야스, 마쿠하리, 지바 시내와 보소반도의 숙박 목적과 이동 방식이 서로 다릅니다.',
    '지바 주요 권역의 호텔을 일정과 예산에 맞게 비교하는 페이지입니다.',
    '지바 호텔은 어느 지역부터 비교하는 것이 좋을까요?', ['숙박 지역', '평점', '후기 수', '가격대', '추천 대상'], ['지바', 'Chiba', '나리타', 'Narita', '우라야스', 'Urayasu'])
];

function guide(slug: string, eyebrow: string, title: string, intro: string, purpose: string, intentQuestion: string, criteria: string[], keywords: string[]): ChibaAreaGuide {
  return { slug, path: `/chiba/${slug}/`, eyebrow, title, intro, purpose, intentQuestion, criteria, keywords, metaDescription: `${title.replace('후기 모음 ', '')} 기준으로 예약 전 조건을 비교합니다.` };
}

export const chibaHotels = hotels.filter((hotel) => hotel.slug.startsWith('chiba-')).sort((a, b) => popularity(b) - popularity(a));

export function getChibaAreaGuideHotels(guide: ChibaAreaGuide, limit = 20) {
  return chibaHotels.map((hotel) => buildGuideHotel(hotel, guide)).filter((item) => item.guideScore > 0).sort((a, b) => b.guideScore - a.guideScore).slice(0, limit);
}

export function getRelatedChibaAreaGuides(hotel: Hotel) {
  if (!hotel.slug.startsWith('chiba-')) return [];
  const text = hotelText(hotel).toLowerCase();
  return chibaAreaGuides.map((guide) => ({ guide, score: guide.slug === 'chiba-hotel-comparison' ? 1 : guide.keywords.filter((keyword) => text.includes(keyword.toLowerCase())).length }))
    .filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 4).map((item) => item.guide);
}

function buildGuideHotel(hotel: Hotel, guide: ChibaAreaGuide) {
  const text = hotelText(hotel);
  const area = pickArea(text);
  const matches = guide.slug === 'chiba-hotel-comparison' ? 1 : guide.keywords.filter((keyword) => text.toLowerCase().includes(keyword.toLowerCase())).length;
  const price = hotel.averageNightlyRate ?? hotel.dailyRate;
  const target = guide.slug.includes('family') ? '가족여행' : guide.slug.includes('value') ? '가성비 여행' : `${area} 일정`;
  return {
    hotel, guideScore: matches ? matches * 10000 + popularity(hotel) : 0,
    reasons: [`${area} 일정에서 이동 동선을 줄이기 좋은 후보입니다.`, hotel.reviewCount && hotel.reviewCount >= 1000 ? '후기 수가 충분해 반복되는 장점과 주의점을 비교하기 좋습니다.' : '객실 조건과 위치 후기를 함께 확인하는 편이 좋습니다.', hotel.reviewScore && hotel.reviewScore >= 8.8 ? '아고다 평점이 높은 편이어서 우선 비교 후보로 보기 좋습니다.' : '가격과 객실 조건을 함께 비교하면 선택이 쉬워집니다.'],
    caution: '객실 크기와 조식·취소 조건, 셔틀 시간과 숙박 요금은 날짜와 객실 유형에 따라 달라질 수 있으니 최종 예약 화면에서 확인하세요.',
    target, tags: [area, ...guide.criteria.slice(0, 3)],
    tableCells: [area, String(hotel.reviewScore ?? '확인 필요'), hotel.reviewCount ? `${hotel.reviewCount.toLocaleString('ko-KR')}건` : '후기 부족', price ? `${price.toLocaleString('ko-KR')}원~` : '가격 확인', target]
  };
}

function hotelText(hotel: Hotel) { return [hotel.hotelName, hotel.address, hotel.region, hotel.analysis?.summary, hotel.analysis?.pros?.join(' ')].filter(Boolean).join(' '); }
function pickArea(text: string) {
  if (/나리타|Narita|Tokko/i.test(text)) return '나리타공항';
  if (/디즈니|Disney|마이하마|Maihama|우라야스|Urayasu/i.test(text)) return '디즈니·우라야스';
  if (/마쿠하리|Makuhari|Hibino|Mihama/i.test(text)) return '마쿠하리';
  if (/가모가와|Kamogawa|다테야마|Tateyama|기사라즈|Kisarazu|온주쿠|Onjuku/i.test(text)) return '보소반도';
  if (/가시와|Kashiwa|후나바시|Funabashi|이치카와|Ichikawa/i.test(text)) return '가시와·후나바시';
  return '지바 시내';
}
function popularity(hotel: Hotel) { return (hotel.reviewScore || 0) * 1000 + Math.min(hotel.reviewCount || 0, 50000) / 10; }
