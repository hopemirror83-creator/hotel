import { activeHotels as hotels } from './hotels';
import type { Hotel } from './hotels';

export type BangkokAreaGuide = { slug: string; path: string; title: string; eyebrow: string; intro: string; purpose: string; intentQuestion: string; metaDescription: string; criteria: string[]; area: string };
const make = (slug: string, area: string, title: string, intro: string, question: string, criteria: string[]): BangkokAreaGuide => ({ slug, area, path: `/bangkok/${slug}/`, title, eyebrow: 'BANGKOK HOTEL GUIDE', intro, purpose: `${area} 숙소를 공개 후기와 위치 기준으로 비교합니다.`, intentQuestion: question, criteria, metaDescription: `${title}. 방콕 숙소의 위치, 후기와 예약 조건을 비교합니다.` });
export const bangkokAreaGuides = [
  make('sukhumvit-hotels', '수쿰윗', '방콕 수쿰윗 호텔 후기 BTS·쇼핑·조식', '수쿰윗에서는 같은 도로에 있어도 역까지의 실제 이동과 교통 소음이 다릅니다. 쇼핑과 관광 동선에 맞는 위치를 먼저 확인하세요.', '수쿰윗에서 역 접근과 객실 컨디션을 어떻게 비교할까요?', ['역 동선', '객실', '조식', '소음']),
  make('siam-pratunam-hotels', '시암·프라투남', '방콕 시암·프라투남 호텔 후기 쇼핑·이동·객실', '시암과 프라투남은 쇼핑 일정에 편리하지만 지역과 시간대에 따라 도보 이동 경험이 다릅니다. 숙소 위치와 객실 조건을 함께 보세요.', '쇼핑 중심 일정이라면 시암과 프라투남 중 어디가 맞을까요?', ['쇼핑 동선', '교통', '객실', '조식']),
  make('silom-sathorn-hotels', '실롬·사톤', '방콕 실롬·사톤 호텔 후기 출장·교통·조식', '실롬과 사톤은 업무 동선과 도심 관광을 함께 고려할 때 후보가 됩니다. 가까운 역과 실제 이동 경로를 숙소마다 확인하세요.', '출장과 관광을 함께 계획할 때 어떤 위치가 편할까요?', ['업무 동선', '역 접근', '조식', '객실']),
  make('riverside-hotels', '차오프라야 강변', '방콕 차오프라야 강변 호텔 후기 전망·배·조식', '강변 숙소는 전망뿐 아니라 선착장과 주요 관광지까지의 이동 방식이 중요합니다. 객실별 강 전망 제공 여부도 예약 조건을 확인하세요.', '강변 전망과 관광 동선을 함께 고려하면 어느 숙소가 맞을까요?', ['객실 전망', '선착장', '조식', '이동']),
  make('old-town-khaosan-hotels', '구시가·카오산', '방콕 구시가·카오산 호텔 후기 관광·소음·가성비', '구시가 숙소는 사원·야시장 일정에 유리할 수 있지만 야간 소음과 교통 접근은 위치마다 다릅니다. 예약 전 동선을 비교하세요.', '구시가 관광과 조용한 숙박 사이에서 무엇을 우선할까요?', ['관광 동선', '야간 소음', '객실', '교통']),
  make('bangkok-hotel-comparison', '전체', '방콕 호텔 비교 수쿰윗·시암·실롬·강변·카오산', '방콕은 권역마다 교통과 관광 동선이 크게 다릅니다. 후기 수와 평점뿐 아니라 방문 장소에 맞춰 숙소를 좁혀보세요.', '방콕 여행 목적에 따라 어느 권역이 맞을까요?', ['권역', '후기 수', '평점', '예약 조건'])
] as BangkokAreaGuide[];
export const bangkokHotels = hotels.filter(h => h.slug.startsWith('bangkok-')).sort((a, b) => popularity(b) - popularity(a));
export function getBangkokArea(hotel: Hotel) {
  const lat = hotel.latitude ?? 0, lon = hotel.longitude ?? 0;
  if (lat >= 13.75 && lat < 13.775 && lon < 100.515) return '구시가·카오산';
  if (lat < 13.75 && lon < 100.515) return '차오프라야 강변';
  if (lat < 13.735 && lon >= 100.515 && lon < 100.55) return '실롬·사톤';
  if (lat >= 13.735 && lat < 13.77 && lon >= 100.525 && lon < 100.55) return '시암·프라투남';
  return '수쿰윗';
}
export function getBangkokAreaGuideHotels(guide: BangkokAreaGuide, limit = 20) {
  return bangkokHotels.filter(h => guide.area === '전체' || getBangkokArea(h) === guide.area).slice(0, limit).map(hotel => {
    const area = getBangkokArea(hotel), price = hotel.averageNightlyRate ?? hotel.dailyRate;
    return { hotel, reasons: [`${area} 권역에서 위치를 비교할 숙소입니다.`, hotel.reviewCount && hotel.reviewCount >= 1000 ? '아고다 후기 수가 많아 여러 관점을 비교할 수 있습니다.' : '공개 후기와 객실 조건을 함께 확인하세요.', hotel.reviewScore && hotel.reviewScore >= 8.5 ? '아고다 평점이 높은 편입니다.' : '평점 외에 객실 유형도 비교하세요.'], caution: '객실 전망·조식·취소 조건과 실제 교통 동선을 예약 전 확인하세요.', tags: [area, ...guide.criteria.slice(0, 2)], tableCells: [area, String(hotel.reviewScore ?? '확인 필요'), hotel.reviewCount ? `${hotel.reviewCount.toLocaleString('ko-KR')}건` : '후기 부족', price ? `${price.toLocaleString('ko-KR')}원~` : '가격 확인', area] };
  });
}
export function getRelatedBangkokAreaGuides(hotel: Hotel) {
  if (!hotel.slug.startsWith('bangkok-')) return [];
  const area = getBangkokArea(hotel);
  return bangkokAreaGuides.filter(guide => guide.area === '전체' || guide.area === area);
}
function popularity(hotel: Hotel) { return (hotel.reviewScore || 0) * 1000 + Math.min(hotel.reviewCount || 0, 50000) / 10; }
