import { activeHotels as hotels } from './hotels';
import type { Hotel } from './hotels';

export type SamuiAreaGuide = { slug: string; path: string; title: string; eyebrow: string; intro: string; purpose: string; intentQuestion: string; metaDescription: string; criteria: string[]; area: string };
const make = (slug: string, area: string, title: string, intro: string, question: string, criteria: string[]): SamuiAreaGuide => ({ slug, area, path: `/samui/${slug}/`, title, eyebrow: 'KOH SAMUI HOTEL GUIDE', intro, purpose: `${area} 숙소를 공개 후기와 위치 기준으로 비교합니다.`, intentQuestion: question, criteria, metaDescription: `${title}. 코사무이 숙소의 위치, 후기와 예약 조건을 비교합니다.` });
export const samuiAreaGuides = [
  make('chaweng-hotels', '차웽', '코사무이 차웽 호텔 후기 해변·식당·이동', '차웽은 해변과 식당 접근을 함께 고려하는 여행자에게 후보가 됩니다. 숙소별로 중심 거리와 해변까지의 실제 동선을 확인하세요.', '차웽에서 해변과 식당 중 무엇을 더 중요하게 볼까요?', ['해변 접근', '식당', '객실', '야간 소음']),
  make('bophut-hotels', '보풋', '코사무이 보풋 호텔 후기 피셔맨스빌리지·가족', '보풋 주변에서는 피셔맨스빌리지 접근과 가족 동반 객실 조건을 함께 살펴보세요. 같은 보풋 권역이라도 도보 동선은 다를 수 있습니다.', '보풋에서 가족 여행과 저녁 외출을 함께 고려하면 어디가 맞을까요?', ['피셔맨스빌리지', '가족 객실', '조식', '이동']),
  make('lamai-hotels', '라마이', '코사무이 라마이 호텔 후기 해변·조식·휴양', '라마이 해변권은 차웽과 분위기가 달라 여행 목적에 따라 선택이 갈립니다. 객실 전망과 주변 식당, 이동 수단을 함께 비교하세요.', '라마이에서 조용한 휴양과 주변 편의성을 어떻게 비교할까요?', ['해변', '객실 전망', '조식', '식당']),
  make('maenam-hotels', '매남', '코사무이 매남 호텔 후기 해변·조용함·리조트', '매남에서는 한적한 체류를 원하는지, 주요 관광지 이동을 자주 할지 먼저 정하는 편이 좋습니다. 숙소 위치와 교통 조건을 확인하세요.', '매남에서 조용한 숙소를 고를 때 어떤 이동 계획이 필요할까요?', ['해변 분위기', '이동', '객실', '식사']),
  make('choeng-mon-west-hotels', '청몬·서해안', '코사무이 청몬·서해안 호텔 후기 전망·휴양 비교', '청몬과 섬 서쪽은 서로 다른 위치입니다. 전망, 해변, 이동 거리와 귀국일 동선을 별도로 확인한 뒤 비교하세요.', '청몬과 서쪽 해변 중 어느 위치가 일정에 맞을까요?', ['위치', '해변', '전망', '공항 이동']),
  make('koh-samui-hotel-comparison', '전체', '코사무이 호텔 비교 차웽·보풋·라마이·매남', '코사무이는 해변 권역마다 식당 접근과 휴양 분위기가 다릅니다. 후기 수와 평점뿐 아니라 여행 동선에 맞춰 후보를 좁혀보세요.', '여행 목적에 따라 코사무이 어느 해변 권역이 맞을까요?', ['권역', '후기 수', '평점', '예약 조건'])
] as SamuiAreaGuide[];
export const samuiHotels = hotels.filter(h => h.slug.startsWith('samui-')).sort((a, b) => popularity(b) - popularity(a));
export function getSamuiArea(hotel: Hotel) {
  const lat = hotel.latitude ?? 0, lon = hotel.longitude ?? 0;
  if (lon < 99.98 || (lat >= 9.56 && lon >= 100.06)) return '청몬·서해안';
  if (lat < 9.51) return '라마이';
  if (lat < 9.55 && lon >= 100.04) return '차웽';
  if (lat >= 9.55 && lon >= 100.02) return '보풋';
  return '매남';
}
export function getSamuiAreaGuideHotels(guide: SamuiAreaGuide, limit = 20) {
  return samuiHotels.filter(h => guide.area === '전체' || getSamuiArea(h) === guide.area).slice(0, limit).map(hotel => {
    const area = getSamuiArea(hotel), price = hotel.averageNightlyRate ?? hotel.dailyRate;
    return { hotel, reasons: [`${area} 권역에서 위치를 비교할 숙소입니다.`, hotel.reviewCount && hotel.reviewCount >= 1000 ? '아고다 후기 수가 많아 여러 관점을 비교할 수 있습니다.' : '공개 후기와 객실 조건을 함께 확인하세요.', hotel.reviewScore && hotel.reviewScore >= 8.5 ? '아고다 평점이 높은 편입니다.' : '평점 외에 객실 유형도 비교하세요.'], caution: '객실 전망·조식·취소 조건과 현지 이동 수단을 예약 전 확인하세요.', tags: [area, ...guide.criteria.slice(0, 2)], tableCells: [area, String(hotel.reviewScore ?? '확인 필요'), hotel.reviewCount ? `${hotel.reviewCount.toLocaleString('ko-KR')}건` : '후기 부족', price ? `${price.toLocaleString('ko-KR')}원~` : '가격 확인', area] };
  });
}
export function getRelatedSamuiAreaGuides(hotel: Hotel) {
  if (!hotel.slug.startsWith('samui-')) return [];
  const area = getSamuiArea(hotel);
  return samuiAreaGuides.filter(guide => guide.area === '전체' || guide.area === area);
}
function popularity(hotel: Hotel) { return (hotel.reviewScore || 0) * 1000 + Math.min(hotel.reviewCount || 0, 50000) / 10; }
