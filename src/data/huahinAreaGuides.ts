import { activeHotels as hotels } from './hotels';
import type { Hotel } from './hotels';

export type HuahinAreaGuide = { slug: string; path: string; title: string; eyebrow: string; intro: string; purpose: string; intentQuestion: string; metaDescription: string; criteria: string[]; area: string };
const make = (slug: string, area: string, title: string, intro: string, question: string, criteria: string[]): HuahinAreaGuide => ({ slug, area, path: `/huahin/${slug}/`, title, eyebrow: 'HUA HIN HOTEL GUIDE', intro, purpose: `${area} 숙소를 공개 후기와 위치 기준으로 비교합니다.`, intentQuestion: question, criteria, metaDescription: `${title}. 후아힌 숙소의 위치, 후기와 예약 조건을 비교합니다.` });
export const huahinAreaGuides = [
  make('central-hotels', '후아힌 중심', '후아힌 시내 호텔 후기 야시장·해변·교통 비교', '후아힌 중심 숙소는 야시장과 식당, 해변까지의 실제 이동 방법을 함께 봐야 합니다. 도보 거리와 차량 이동 시간을 예약 전에 비교하세요.', '후아힌 시내 관광에 편리한 숙소는 어디일까요?', ['야시장 동선', '해변 접근', '객실', '조식']),
  make('khao-takiab-hotels', '카오타키압', '후아힌 카오타키압 호텔 후기 해변·수영장·가족여행', '카오타키압은 해변 휴양과 가족 일정을 함께 계획할 때 살펴볼 권역입니다. 시내 접근성과 리조트 시설을 함께 확인하세요.', '카오타키압에서 휴양과 시내 이동을 어떻게 비교할까요?', ['해변', '수영장', '가족여행', '시내 이동']),
  make('cha-am-hotels', '차암', '차암 후아힌 호텔 후기 해변 리조트·조식·가성비', '차암 숙소는 후아힌 중심과 거리가 있는 만큼 리조트 안에서 보내는 시간과 이동 계획이 중요합니다.', '차암 리조트는 어떤 여행자에게 맞을까요?', ['해변', '리조트 시설', '조식', '이동']),
  make('pranburi-hotels', '프란부리', '프란부리 호텔 후기 조용한 해변·풀빌라·커플여행', '프란부리는 조용한 휴양을 원하는 여행자에게 후보가 되지만, 식당과 관광지 이동에는 차량이 필요할 수 있습니다.', '프란부리에서 조용한 숙소를 고를 때 무엇을 확인할까요?', ['조용함', '해변', '객실', '차량 이동']),
  make('hua-hin-hotel-comparison', '전체', '후아힌 호텔 비교 시내·카오타키압·차암·프란부리', '후아힌은 시내 관광, 해변 휴양, 가족 리조트, 조용한 풀빌라에 따라 적합한 권역이 달라집니다.', '여행 일정에 따라 후아힌 어느 권역이 맞을까요?', ['권역', '후기 수', '평점', '예약 조건'])
] as HuahinAreaGuide[];
export const huahinHotels = hotels.filter(hotel => hotel.slug.startsWith('huahin-')).sort((a, b) => popularity(b) - popularity(a));
export function getHuahinArea(hotel: Hotel) {
  const lat = hotel.latitude ?? 0;
  if (lat >= 12.65) return '차암';
  if (lat < 12.45) return '프란부리';
  if (lat < 12.53) return '카오타키압';
  return '후아힌 중심';
}
export function getHuahinAreaGuideHotels(guide: HuahinAreaGuide, limit = 20) {
  return huahinHotels.filter(hotel => guide.area === '전체' || getHuahinArea(hotel) === guide.area).slice(0, limit).map(hotel => {
    const area = getHuahinArea(hotel), price = hotel.averageNightlyRate ?? hotel.dailyRate;
    return { hotel, reasons: [`${area} 권역에서 위치를 비교할 숙소입니다.`, hotel.reviewCount && hotel.reviewCount >= 1000 ? '아고다 후기 수가 많아 여러 관점을 비교할 수 있습니다.' : '공개 후기와 객실 조건을 함께 확인하세요.', hotel.reviewScore && hotel.reviewScore >= 8.5 ? '아고다 평점이 높은 편입니다.' : '평점 외에 객실 유형도 비교하세요.'], caution: '객실 방향·조식·취소 조건과 실제 이동 동선을 예약 전 확인하세요.', tags: [area, ...guide.criteria.slice(0, 2)], tableCells: [area, String(hotel.reviewScore ?? '확인 필요'), hotel.reviewCount ? `${hotel.reviewCount.toLocaleString('ko-KR')}건` : '후기 부족', price ? `${price.toLocaleString('ko-KR')}원~` : '가격 확인', area] };
  });
}
export function getRelatedHuahinAreaGuides(hotel: Hotel) {
  if (!hotel.slug.startsWith('huahin-')) return [];
  const area = getHuahinArea(hotel);
  return huahinAreaGuides.filter(guide => guide.area === '전체' || guide.area === area);
}
function popularity(hotel: Hotel) { return (hotel.reviewScore || 0) * 1000 + Math.min(hotel.reviewCount || 0, 50000) / 10; }
