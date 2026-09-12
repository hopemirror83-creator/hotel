import { activeHotels as hotels } from './hotels';
import type { Hotel } from './hotels';

export type SoctrangAreaGuide = { slug: string; path: string; title: string; eyebrow: string; intro: string; purpose: string; intentQuestion: string; metaDescription: string; criteria: string[] };
const make = (slug: string, title: string, intro: string, purpose: string, question: string, criteria: string[]): SoctrangAreaGuide => ({ slug, path: `/soctrang/${slug}/`, title, eyebrow: 'SOC TRANG HOTEL GUIDE', intro, purpose, intentQuestion: question, criteria, metaDescription: `${title}. 공개 후기와 호텔 위치, 객실 조건을 함께 비교합니다.` });
export const soctrangAreaGuides = [
  make('soc-trang-city-hotels', '속짱 시내 호텔 후기 모음 교통·조식·체크인', '속짱 시내에서 이동을 계획한다면 버스터미널과 식당 위치, 늦은 체크인 가능 여부를 함께 보세요.', '속짱 시내 일정에 맞는 숙소를 살펴봅니다.', '속짱 시내에서 이동과 식사가 편리한 호텔은 어디일까요?', ['시내 이동', '주변 식당', '조식', '체크인']),
  make('soc-trang-hotel-comparison', '속짱 호텔 비교 후기·위치·가격대', '같은 속짱 숙소라도 시내 이동과 객실 조건, 후기 수에 차이가 있습니다. 가격은 예약 날짜에 따라 다시 확인해야 합니다.', '후기 단서가 있는 속짱 숙소를 비교합니다.', '후기 수와 위치를 함께 보면 어느 숙소가 맞을까요?', ['평점', '후기 수', '위치', '가격대'])
] as SoctrangAreaGuide[];
export const soctrangHotels = hotels.filter(h => h.slug.startsWith('soctrang-')).sort((a, b) => popularity(b) - popularity(a));
export function getSoctrangAreaGuideHotels(guide: SoctrangAreaGuide, limit = 20) {
  return soctrangHotels.slice(0, limit).map(hotel => {
    const price = hotel.averageNightlyRate ?? hotel.dailyRate;
    return { hotel, reasons: ['속짱 지역 숙소로 위치를 확인했습니다.', hotel.reviewCount && hotel.reviewCount >= 50 ? '후기 수가 비교적 많아 장단점을 살펴보기 좋습니다.' : '공개 후기와 객실 조건을 함께 확인하세요.', hotel.reviewScore && hotel.reviewScore >= 8.5 ? '아고다 평점이 높은 편입니다.' : '평점 외에도 객실 유형을 비교하세요.'], caution: '조식, 취소 조건과 실제 이동 시간은 예약 전 확인하세요.', tags: ['속짱', ...guide.criteria.slice(0, 3)], tableCells: ['속짱', String(hotel.reviewScore ?? '확인 필요'), hotel.reviewCount ? `${hotel.reviewCount.toLocaleString('ko-KR')}건` : '후기 부족', price ? `${price.toLocaleString('ko-KR')}원~` : '가격 확인', '속짱 여행'] };
  });
}
export function getRelatedSoctrangAreaGuides(hotel: Hotel) { return hotel.slug.startsWith('soctrang-') ? soctrangAreaGuides : []; }
function popularity(hotel: Hotel) { return (hotel.reviewScore || 0) * 1000 + Math.min(hotel.reviewCount || 0, 50000) / 10; }
