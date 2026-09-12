import { activeHotels as hotels } from './hotels';
import type { Hotel } from './hotels';

export type PhuketAreaGuide = { slug: string; path: string; title: string; eyebrow: string; intro: string; purpose: string; intentQuestion: string; metaDescription: string; criteria: string[]; area: string };
const make = (slug: string, area: string, title: string, intro: string, purpose: string, question: string, criteria: string[]): PhuketAreaGuide => ({ slug, area, path: `/phuket/${slug}/`, title, eyebrow: 'PHUKET HOTEL GUIDE', intro, purpose, intentQuestion: question, criteria, metaDescription: `${title}. 푸껫 숙소의 위치와 공개 후기, 예약 조건을 비교합니다.` });
export const phuketAreaGuides = [
  make('patong-hotels', '빠통', '푸껫 빠통 호텔 후기 모음 해변·쇼핑·밤거리', '빠통은 해변과 쇼핑, 밤거리 접근이 장점이지만 숙소 위치에 따라 소음과 교통 혼잡이 다릅니다.', '빠통 중심 일정에 맞는 숙소를 비교합니다.', '빠통 해변과 시내 이동을 함께 고려하면 어디에 묵는 게 좋을까요?', ['해변 접근', '쇼핑', '소음', '이동 동선']),
  make('kata-karon-hotels', '카타·카론', '푸껫 카타·카론 호텔 후기 가족여행·해변', '카타·카론은 빠통과 숙박 분위기가 다릅니다. 해변까지의 실제 거리와 언덕길, 가족 동반 조건을 함께 보세요.', '카타·카론 해변 일정에 맞는 숙소를 비교합니다.', '가족과 조용히 해변을 즐기려면 어떤 조건을 살펴야 할까요?', ['해변 거리', '언덕길', '가족', '객실']),
  make('airport-hotels', '공항 북부', '푸껫 공항 근처 호텔 후기 늦은 도착·이른 출발', '푸껫 공항 주변은 도착·출발 시각이 중요한 여행자에게 편리하지만, 빠통이나 남부 해변과는 이동 거리가 있습니다.', '공항 이동을 우선하는 숙소를 비교합니다.', '늦게 도착하거나 일찍 출발할 때 어디가 편리할까요?', ['공항 이동', '픽업 확인', '체크인', '해변 거리']),
  make('quiet-coast-hotels', '해변 휴양', '푸껫 해변 리조트 비교 방타오·판와·라와이', '방타오, 판와, 라와이와 칼림의 숙소는 서로 떨어져 있습니다. 전망만이 아니라 이동 수단과 주변 식당을 확인하세요.', '푸껫 여러 해변 권역의 휴양형 숙소를 비교합니다.', '시내보다 휴양을 우선한다면 어느 해변 권역이 맞을까요?', ['해변 권역', '주변 식당', '차량 이동', '객실 전망']),
  make('phuket-hotel-comparison', '전체', '푸껫 호텔 비교 빠통·카타·공항·해변', '푸껫은 권역마다 이동 시간과 숙박 목적이 크게 다릅니다. 후기 수와 평점뿐 아니라 여행 동선으로 먼저 후보를 좁혀보세요.', '푸껫 주요 숙소의 위치와 후기 단서를 비교합니다.', '관광 동선과 후기 기준으로 어떤 숙소가 맞을까요?', ['권역', '후기 수', '평점', '가격대'])
] as PhuketAreaGuide[];
export const phuketHotels = hotels.filter(h => h.slug.startsWith('phuket-')).sort((a, b) => popularity(b) - popularity(a));
export function getPhuketArea(hotel: Hotel) {
  const lat = hotel.latitude ?? 0, lon = hotel.longitude ?? 0;
  if (lat >= 8.08) return '공항 북부';
  if (lat >= 7.98 && lat < 8.08) return '방타오';
  if (lon >= 98.38) return '판와';
  if (lat < 7.805 && lon < 98.36) return '라와이';
  if (lat >= 7.80 && lat < 7.85 && lon < 98.32) return '카타·카론';
  if (lat >= 7.91 && lon < 98.29) return '칼림·카말라';
  return '빠통';
}
export function getPhuketAreaGuideHotels(guide: PhuketAreaGuide, limit = 20) {
  const selected = phuketHotels.filter(h => guide.area === '전체' || (guide.area === '해변 휴양' ? ['방타오', '판와', '라와이', '칼림·카말라'].includes(getPhuketArea(h)) : getPhuketArea(h) === guide.area));
  return selected.slice(0, limit).map(hotel => {
    const area = getPhuketArea(hotel), price = hotel.averageNightlyRate ?? hotel.dailyRate;
    return { hotel, reasons: [`${area} 권역의 이동 동선을 기준으로 살펴볼 숙소입니다.`, hotel.reviewCount && hotel.reviewCount >= 1000 ? '아고다 후기 수가 많아 여러 관점을 비교할 수 있습니다.' : '공개 후기와 객실 조건을 함께 확인하세요.', hotel.reviewScore && hotel.reviewScore >= 8.5 ? '아고다 평점이 높은 편입니다.' : '평점만 보지 말고 객실 유형을 비교하세요.'], caution: '객실 전망·조식·취소 조건과 공항 이동 시간은 예약 전 확인하세요.', tags: [area, ...guide.criteria.slice(0, 2)], tableCells: [area, String(hotel.reviewScore ?? '확인 필요'), hotel.reviewCount ? `${hotel.reviewCount.toLocaleString('ko-KR')}건` : '후기 부족', price ? `${price.toLocaleString('ko-KR')}원~` : '가격 확인', guide.area === '전체' ? area : guide.area] };
  });
}
export function getRelatedPhuketAreaGuides(hotel: Hotel) {
  if (!hotel.slug.startsWith('phuket-')) return [];
  const area = getPhuketArea(hotel);
  return phuketAreaGuides.filter(guide => guide.area === '전체' || guide.area === area || (guide.area === '해변 휴양' && ['방타오', '판와', '라와이', '칼림·카말라'].includes(area)));
}
function popularity(hotel: Hotel) { return (hotel.reviewScore || 0) * 1000 + Math.min(hotel.reviewCount || 0, 50000) / 10; }
