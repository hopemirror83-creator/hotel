import { activeHotels as hotels } from './hotels';
import type { Hotel } from './hotels';

export type ChiangmaiAreaGuide = { slug: string; path: string; title: string; eyebrow: string; intro: string; purpose: string; intentQuestion: string; metaDescription: string; criteria: string[]; area: string };
const make = (slug: string, area: string, title: string, intro: string, question: string, criteria: string[]): ChiangmaiAreaGuide => ({ slug, area, path: `/chiangmai/${slug}/`, title, eyebrow: 'CHIANG MAI HOTEL GUIDE', intro, purpose: `${area} 숙소를 공개 후기와 위치 기준으로 비교합니다.`, intentQuestion: question, criteria, metaDescription: `${title}. 치앙마이 숙소의 위치, 후기와 예약 조건을 비교합니다.` });
export const chiangmaiAreaGuides = [
  make('old-city-hotels', '구시가지', '치앙마이 구시가지 호텔 후기 타패문·사원·도보 동선', '구시가지 숙소는 주요 사원과 타패문 일정을 걸어서 다닐지에 따라 선택이 갈립니다. 실제 이동 경로와 객실 소음을 함께 확인하세요.', '구시가지 관광에 맞는 숙소는 어디일까요?', ['타패문 동선', '사원', '객실', '소음']),
  make('nimman-hotels', '님만', '치앙마이 님만 호텔 후기 카페·쇼핑·공항 이동', '님만은 카페와 쇼핑 동선을 중시하는 여행자에게 후보입니다. 같은 권역이라도 큰 도로와 골목 숙소의 이동·소음 조건은 다릅니다.', '님만에서 카페 접근과 객실 편안함을 어떻게 비교할까요?', ['카페', '교통', '객실', '조식']),
  make('night-bazaar-hotels', '나이트바자', '치앙마이 나이트바자 호텔 후기 야시장·식당·객실', '나이트바자 주변은 저녁 외출과 식당 이용을 계획할 때 살펴볼 만합니다. 숙소마다 야간 분위기와 객실 조건을 함께 확인하세요.', '저녁 외출이 잦다면 나이트바자에서 어디에 묵는 게 좋을까요?', ['야시장 동선', '식당', '객실', '소음']),
  make('ping-riverside-hotels', '핑강 주변', '치앙마이 핑강 주변 호텔 후기 강변·휴양·이동', '핑강 주변 숙소는 강 전망보다 실제 객실 방향과 시내 이동 방식이 중요할 수 있습니다. 투어 집결지까지의 동선도 함께 비교하세요.', '강 주변에서 휴양과 시내 관광을 함께 하려면 무엇을 확인할까요?', ['객실 전망', '시내 이동', '조식', '분위기']),
  make('airport-hotels', '공항권', '치앙마이 공항 근처 호텔 후기 출국 동선·체크인·조식', '공항권 숙소는 이른 출국이나 늦은 도착에 유용할 수 있습니다. 공항까지의 실제 이동 수단과 프런트 운영 시간은 예약 전에 확인하세요.', '출국 전날 공항권 숙소에서 어떤 조건을 우선할까요?', ['공항 이동', '체크인', '객실', '조식']),
  make('chiang-mai-hotel-comparison', '전체', '치앙마이 호텔 비교 구시가지·님만·나이트바자·강변', '치앙마이는 구시가지 관광과 님만 카페 일정, 강변 휴양의 동선이 다릅니다. 후기 수와 평점 외에 방문 장소부터 정해보세요.', '여행 일정에 따라 치앙마이 어느 권역이 맞을까요?', ['권역', '후기 수', '평점', '예약 조건'])
] as ChiangmaiAreaGuide[];
export const chiangmaiHotels = hotels.filter(h => h.slug.startsWith('chiangmai-')).sort((a, b) => popularity(b) - popularity(a));
export function getChiangmaiArea(hotel: Hotel) {
  const lat = hotel.latitude ?? 0, lon = hotel.longitude ?? 0;
  if (lat < 18.775 && lon >= 98.94 && lon < 98.995) return '공항권';
  if (lat >= 18.75 && lat < 18.825 && lon >= 99.003) return '핑강 주변';
  if (lat >= 18.785 && lon >= 98.94 && lon < 98.975) return '님만';
  if (lat >= 18.775 && lat < 18.8 && lon >= 98.978 && lon < 98.995) return '구시가지';
  return '나이트바자';
}
export function getChiangmaiAreaGuideHotels(guide: ChiangmaiAreaGuide, limit = 20) {
  return chiangmaiHotels.filter(h => guide.area === '전체' || getChiangmaiArea(h) === guide.area).slice(0, limit).map(hotel => {
    const area = getChiangmaiArea(hotel), price = hotel.averageNightlyRate ?? hotel.dailyRate;
    return { hotel, reasons: [`${area} 권역에서 위치를 비교할 숙소입니다.`, hotel.reviewCount && hotel.reviewCount >= 1000 ? '아고다 후기 수가 많아 여러 관점을 비교할 수 있습니다.' : '공개 후기와 객실 조건을 함께 확인하세요.', hotel.reviewScore && hotel.reviewScore >= 8.5 ? '아고다 평점이 높은 편입니다.' : '평점 외에 객실 유형도 비교하세요.'], caution: '객실 방향·조식·취소 조건과 실제 이동 동선을 예약 전 확인하세요.', tags: [area, ...guide.criteria.slice(0, 2)], tableCells: [area, String(hotel.reviewScore ?? '확인 필요'), hotel.reviewCount ? `${hotel.reviewCount.toLocaleString('ko-KR')}건` : '후기 부족', price ? `${price.toLocaleString('ko-KR')}원~` : '가격 확인', area] };
  });
}
export function getRelatedChiangmaiAreaGuides(hotel: Hotel) {
  if (!hotel.slug.startsWith('chiangmai-')) return [];
  const area = getChiangmaiArea(hotel);
  return chiangmaiAreaGuides.filter(guide => guide.area === '전체' || guide.area === area);
}
function popularity(hotel: Hotel) { return (hotel.reviewScore || 0) * 1000 + Math.min(hotel.reviewCount || 0, 50000) / 10; }
