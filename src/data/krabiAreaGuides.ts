import { activeHotels as hotels } from './hotels';
import type { Hotel } from './hotels';

export type KrabiAreaGuide = { slug: string; path: string; title: string; eyebrow: string; intro: string; purpose: string; intentQuestion: string; metaDescription: string; criteria: string[]; area: string };
const make = (slug: string, area: string, title: string, intro: string, purpose: string, question: string, criteria: string[]): KrabiAreaGuide => ({ slug, area, path: `/krabi/${slug}/`, title, eyebrow: 'KRABI HOTEL GUIDE', intro, purpose, intentQuestion: question, criteria, metaDescription: `${title}. 끄라비 숙소의 위치와 공개 후기, 예약 조건을 비교합니다.` });
export const krabiAreaGuides = [
  make('ao-nang-hotels', '아오낭', '끄라비 아오낭 호텔 후기 해변·투어·조식', '아오낭에서는 해변과 투어 집결지, 식당까지의 이동 동선이 숙소마다 다릅니다. 객실 위치와 밤 시간대 소음도 함께 확인하세요.', '아오낭 중심 일정에 맞는 숙소를 비교합니다.', '아오낭 해변과 투어 이동을 함께 고려하면 어디에 묵는 게 좋을까요?', ['해변 접근', '투어 동선', '조식', '소음']),
  make('railay-hotels', '라일레이', '끄라비 라일레이 호텔 후기 해변·이동·가족', '라일레이는 같은 끄라비라도 아오낭 시내 호텔과 체류 방식이 다릅니다. 도착 동선과 짐 이동, 주변 식사 선택지를 먼저 확인하세요.', '라일레이 숙박에 맞는 숙소를 비교합니다.', '라일레이에 묵는다면 이동과 편의시설 중 무엇을 우선할까요?', ['도착 동선', '짐 이동', '해변', '식사']),
  make('krabi-town-hotels', '끄라비타운', '끄라비타운 호텔 후기 교통·시장·가성비', '끄라비타운은 해변 휴양보다 시내 이동과 식당 접근을 우선하는 일정에 어울립니다. 방문할 해변까지의 거리도 확인하세요.', '끄라비타운 숙소를 시내 이동 관점에서 비교합니다.', '끄라비 시내 숙박이 여행 동선에 맞을까요?', ['시내 교통', '시장·식당', '해변 거리', '체크인']),
  make('klong-muang-tubkaek-hotels', '클롱무앙·텁캑', '끄라비 클롱무앙·텁캑 호텔 후기 조용한 해변·리조트', '클롱무앙과 텁캑은 아오낭 중심가와 거리가 있습니다. 한적한 휴양을 원한다면 주변 식당과 차량 이동 조건을 함께 살펴보세요.', '끄라비 서쪽 해변의 리조트 숙박을 비교합니다.', '조용한 해변을 고를 때 어떤 이동 조건을 확인해야 할까요?', ['해변 분위기', '식당', '차량 이동', '객실 전망']),
  make('krabi-hotel-comparison', '전체', '끄라비 호텔 비교 아오낭·라일레이·시내·해변', '끄라비는 권역에 따라 해변 접근과 이동 방식이 크게 달라집니다. 평점뿐 아니라 일정에 맞는 위치로 먼저 후보를 좁혀보세요.', '끄라비 주요 숙소의 위치와 후기 단서를 비교합니다.', '여행 목적에 따라 어느 권역의 숙소가 맞을까요?', ['권역', '후기 수', '평점', '예약 조건'])
] as KrabiAreaGuide[];
export const krabiHotels = hotels.filter(h => h.slug.startsWith('krabi-')).sort((a, b) => popularity(b) - popularity(a));
export function getKrabiArea(hotel: Hotel) {
  const lat = hotel.latitude ?? 0, lon = hotel.longitude ?? 0;
  if (lon < 98.8 && lat >= 8.04) return '클롱무앙·텁캑';
  if (lat < 8.02 && lon >= 98.82 && lon < 98.86) return '라일레이';
  if (lon >= 98.88 && lat >= 8.04) return '끄라비타운';
  return '아오낭';
}
export function getKrabiAreaGuideHotels(guide: KrabiAreaGuide, limit = 20) {
  return krabiHotels.filter(h => guide.area === '전체' || getKrabiArea(h) === guide.area).slice(0, limit).map(hotel => {
    const area = getKrabiArea(hotel), price = hotel.averageNightlyRate ?? hotel.dailyRate;
    return { hotel, reasons: [`${area} 권역의 위치를 기준으로 살펴볼 숙소입니다.`, hotel.reviewCount && hotel.reviewCount >= 1000 ? '아고다 후기 수가 많아 여러 관점을 비교할 수 있습니다.' : '공개 후기와 객실 조건을 함께 확인하세요.', hotel.reviewScore && hotel.reviewScore >= 8.5 ? '아고다 평점이 높은 편입니다.' : '평점 외에 객실 유형도 비교하세요.'], caution: '객실 전망·조식·취소 조건과 이동 방식은 예약 전 확인하세요.', tags: [area, ...guide.criteria.slice(0, 2)], tableCells: [area, String(hotel.reviewScore ?? '확인 필요'), hotel.reviewCount ? `${hotel.reviewCount.toLocaleString('ko-KR')}건` : '후기 부족', price ? `${price.toLocaleString('ko-KR')}원~` : '가격 확인', area] };
  });
}
export function getRelatedKrabiAreaGuides(hotel: Hotel) {
  if (!hotel.slug.startsWith('krabi-')) return [];
  const area = getKrabiArea(hotel);
  return krabiAreaGuides.filter(guide => guide.area === '전체' || guide.area === area);
}
function popularity(hotel: Hotel) { return (hotel.reviewScore || 0) * 1000 + Math.min(hotel.reviewCount || 0, 50000) / 10; }
