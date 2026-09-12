import { activeHotels as hotels } from './hotels';
import type { Hotel } from './hotels';

export type KhaolakAreaGuide = { slug: string; path: string; title: string; eyebrow: string; intro: string; purpose: string; intentQuestion: string; metaDescription: string; criteria: string[]; area: string };
const make = (slug: string, area: string, title: string, intro: string, purpose: string, question: string, criteria: string[]): KhaolakAreaGuide => ({ slug, area, path: `/khaolak/${slug}/`, title, eyebrow: 'KHAO LAK HOTEL GUIDE', intro, purpose, intentQuestion: question, criteria, metaDescription: `${title}. 카오락 숙소의 위치와 공개 후기, 예약 조건을 비교합니다.` });
export const khaolakAreaGuides = [
  make('khao-lak-beach-hotels', '카오락 비치', '카오락 비치 호텔 후기 해변·공항 이동·조식', '카오락 남쪽 해변 숙소는 공항에서 출발하는 일정과 해변 체류를 함께 고려해야 합니다. 주변 식당과 차량 이동 조건도 확인하세요.', '남쪽 카오락 해변의 숙소를 비교합니다.', '도착 첫날과 해변 휴양을 함께 고려하면 어디에 묵는 게 좋을까요?', ['해변 접근', '공항 이동', '조식', '주변 식당']),
  make('nang-thong-hotels', '낭통', '카오락 낭통 비치 호텔 후기 시내·해변·식당', '낭통은 해변과 카오락 중심지 동선을 함께 보는 여행자에게 후보가 됩니다. 숙소별로 해변까지의 실제 거리와 주변 식사 선택지를 살펴보세요.', '낭통 해변권의 숙소를 비교합니다.', '해변과 식당 접근을 함께 원한다면 어떤 숙소가 맞을까요?', ['해변 거리', '식당', '객실', '체크인']),
  make('bang-niang-hotels', '방니앙', '카오락 방니앙 호텔 후기 시장·해변·가족', '방니앙에서는 시장과 해변 접근, 가족 동반 객실 조건을 함께 비교할 수 있습니다. 시설 규모보다 실제 여행 동선이 중요한 경우도 있습니다.', '방니앙 일정을 위한 숙소를 비교합니다.', '방니앙에 머문다면 해변과 시장 중 어디를 우선할까요?', ['시장 동선', '해변', '가족 객실', '조식']),
  make('khuk-khak-hotels', '쿡칵', '카오락 쿡칵 호텔 후기 조용한 해변·리조트', '쿡칵은 방니앙 중심부보다 한적한 휴양을 기대하는 경우 살펴볼 만합니다. 주변 이동 수단과 식사 조건은 숙소마다 확인이 필요합니다.', '쿡칵 해변권의 리조트를 비교합니다.', '리조트 체류에 집중한다면 어떤 조건을 먼저 확인해야 할까요?', ['해변 분위기', '객실 전망', '식사', '차량 이동']),
  make('bang-sak-hotels', '방삭', '카오락 방삭 호텔 후기 북쪽 해변·휴양', '방삭 방향 숙소는 카오락 중심부에서 멀어질 수 있습니다. 휴양과 투어 출발지, 주변 식당까지의 거리를 함께 확인하세요.', '북쪽 카오락 해변 숙소를 비교합니다.', '한적한 북쪽 해변에 머물 때 어떤 이동 계획이 필요할까요?', ['해변', '투어 동선', '식당', '공항 거리']),
  make('khao-lak-hotel-comparison', '전체', '카오락 호텔 비교 낭통·방니앙·쿡칵·방삭', '카오락은 해변 권역마다 중심지 접근과 휴양 방식이 다릅니다. 후기 수와 평점뿐 아니라 이동 계획에 맞춰 후보를 좁혀보세요.', '카오락 주요 숙소의 위치와 후기 단서를 비교합니다.', '여행 목적에 따라 어느 카오락 권역이 맞을까요?', ['권역', '후기 수', '평점', '예약 조건'])
] as KhaolakAreaGuide[];
export const khaolakHotels = hotels.filter(h => h.slug.startsWith('khaolak-')).sort((a, b) => popularity(b) - popularity(a));
export function getKhaolakArea(hotel: Hotel) {
  const lat = hotel.latitude ?? 0;
  if (lat < 8.635) return '카오락 비치';
  if (lat < 8.66) return '낭통';
  if (lat < 8.69) return '방니앙';
  if (lat < 8.745) return '쿡칵';
  return '방삭';
}
export function getKhaolakAreaGuideHotels(guide: KhaolakAreaGuide, limit = 20) {
  return khaolakHotels.filter(h => guide.area === '전체' || getKhaolakArea(h) === guide.area).slice(0, limit).map(hotel => {
    const area = getKhaolakArea(hotel), price = hotel.averageNightlyRate ?? hotel.dailyRate;
    return { hotel, reasons: [`${area} 권역의 위치를 기준으로 살펴볼 숙소입니다.`, hotel.reviewCount && hotel.reviewCount >= 1000 ? '아고다 후기 수가 많아 여러 관점을 비교할 수 있습니다.' : '공개 후기와 객실 조건을 함께 확인하세요.', hotel.reviewScore && hotel.reviewScore >= 8.5 ? '아고다 평점이 높은 편입니다.' : '평점 외에 객실 유형도 비교하세요.'], caution: '객실 전망·조식·취소 조건과 이동 방식은 예약 전 확인하세요.', tags: [area, ...guide.criteria.slice(0, 2)], tableCells: [area, String(hotel.reviewScore ?? '확인 필요'), hotel.reviewCount ? `${hotel.reviewCount.toLocaleString('ko-KR')}건` : '후기 부족', price ? `${price.toLocaleString('ko-KR')}원~` : '가격 확인', area] };
  });
}
export function getRelatedKhaolakAreaGuides(hotel: Hotel) {
  if (!hotel.slug.startsWith('khaolak-')) return [];
  const area = getKhaolakArea(hotel);
  return khaolakAreaGuides.filter(guide => guide.area === '전체' || guide.area === area);
}
function popularity(hotel: Hotel) { return (hotel.reviewScore || 0) * 1000 + Math.min(hotel.reviewCount || 0, 50000) / 10; }
