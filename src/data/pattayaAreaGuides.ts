import { activeHotels as hotels } from './hotels';
import type { Hotel } from './hotels';

export type PattayaAreaGuide = { slug: string; path: string; title: string; eyebrow: string; intro: string; purpose: string; intentQuestion: string; metaDescription: string; criteria: string[]; area: string };
const make = (slug: string, area: string, title: string, intro: string, question: string, criteria: string[]): PattayaAreaGuide => ({ slug, area, path: `/pattaya/${slug}/`, title, eyebrow: 'PATTAYA HOTEL GUIDE', intro, purpose: `${area} 숙소를 공개 후기와 위치 기준으로 비교합니다.`, intentQuestion: question, criteria, metaDescription: `${title}. 파타야 숙소의 위치, 후기와 예약 조건을 비교합니다.` });
export const pattayaAreaGuides = [
  make('north-pattaya-hotels', '북파타야', '북파타야 호텔 후기 해변·가족·리조트 비교', '북파타야 숙소는 해변 인접성과 대형 리조트 시설을 함께 고려하는 경우가 많습니다. 지도에서 실제 해변 출입 경로와 이동 수단을 확인하세요.', '북파타야에서 가족 여행에 맞는 위치와 시설은 무엇일까요?', ['해변 접근', '가족 객실', '수영장', '교통']),
  make('central-pattaya-hotels', '파타야 중심부', '파타야 중심부 호텔 후기 쇼핑·해변·야간 소음', '중심부는 쇼핑과 식당 접근을 우선하는 여행자에게 편리할 수 있지만 시간대별 소음은 숙소마다 다릅니다. 객실 위치도 함께 확인하세요.', '중심부에서 이동 편의와 조용한 객실을 어떻게 비교할까요?', ['식당', '해변', '객실', '소음']),
  make('south-pattaya-hotels', '남파타야', '남파타야 호텔 후기 프라탐낙·전망·이동', '남파타야에서는 전망과 주변 이동 동선을 함께 봐야 합니다. 바다를 볼 수 있는 객실인지, 중심가까지 어떤 교통편이 필요한지 확인하세요.', '남파타야에서 전망과 이동 편의 중 무엇을 우선할까요?', ['전망', '이동', '객실', '조식']),
  make('jomtien-hotels', '좀티엔', '파타야 좀티엔 호텔 후기 해변·가족·조식', '좀티엔은 파타야 중심부와 다른 해변권입니다. 가족 동반 여행이라면 객실 구성과 해변 동선, 주변 식당을 함께 비교하세요.', '좀티엔에서 가족 숙박에 필요한 조건은 무엇일까요?', ['해변', '가족 객실', '조식', '식당']),
  make('na-jomtien-hotels', '나좀티엔', '파타야 나좀티엔 호텔 후기 리조트·해변·이동', '나좀티엔은 중심부에서 거리가 생길 수 있어 리조트 체류와 관광 이동의 균형이 중요합니다. 이동 수단과 식사 조건을 예약 전에 확인하세요.', '나좀티엔 휴양을 택하면 어떤 이동 계획이 필요할까요?', ['리조트', '해변', '이동', '식사']),
  make('pattaya-hotel-comparison', '전체', '파타야 호텔 비교 북부·중심부·좀티엔·나좀티엔', '파타야는 해변 권역에 따라 분위기와 이동 방식이 달라집니다. 후기 수와 평점뿐 아니라 여행 일정에 맞는 위치를 먼저 고르세요.', '파타야 여행 목적에 따라 어느 권역이 맞을까요?', ['권역', '후기 수', '평점', '예약 조건'])
] as PattayaAreaGuide[];
export const pattayaHotels = hotels.filter(h => h.slug.startsWith('pattaya-')).sort((a, b) => popularity(b) - popularity(a));
export function getPattayaArea(hotel: Hotel) {
  const lat = hotel.latitude ?? 0;
  if (lat >= 12.948) return '북파타야';
  if (lat >= 12.928) return '파타야 중심부';
  if (lat >= 12.91) return '남파타야';
  if (lat >= 12.87) return '좀티엔';
  return '나좀티엔';
}
export function getPattayaAreaGuideHotels(guide: PattayaAreaGuide, limit = 20) {
  return pattayaHotels.filter(h => guide.area === '전체' || getPattayaArea(h) === guide.area).slice(0, limit).map(hotel => {
    const area = getPattayaArea(hotel), price = hotel.averageNightlyRate ?? hotel.dailyRate;
    return { hotel, reasons: [`${area} 권역에서 위치를 비교할 숙소입니다.`, hotel.reviewCount && hotel.reviewCount >= 1000 ? '아고다 후기 수가 많아 여러 관점을 비교할 수 있습니다.' : '공개 후기와 객실 조건을 함께 확인하세요.', hotel.reviewScore && hotel.reviewScore >= 8.5 ? '아고다 평점이 높은 편입니다.' : '평점 외에 객실 유형도 비교하세요.'], caution: '객실 전망·조식·취소 조건과 해변까지의 실제 동선을 예약 전 확인하세요.', tags: [area, ...guide.criteria.slice(0, 2)], tableCells: [area, String(hotel.reviewScore ?? '확인 필요'), hotel.reviewCount ? `${hotel.reviewCount.toLocaleString('ko-KR')}건` : '후기 부족', price ? `${price.toLocaleString('ko-KR')}원~` : '가격 확인', area] };
  });
}
export function getRelatedPattayaAreaGuides(hotel: Hotel) {
  if (!hotel.slug.startsWith('pattaya-')) return [];
  const area = getPattayaArea(hotel);
  return pattayaAreaGuides.filter(guide => guide.area === '전체' || guide.area === area);
}
function popularity(hotel: Hotel) { return (hotel.reviewScore || 0) * 1000 + Math.min(hotel.reviewCount || 0, 50000) / 10; }
