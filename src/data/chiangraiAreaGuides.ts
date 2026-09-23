import { activeHotels as hotels } from './hotels';
import type { Hotel } from './hotels';

export type ChiangraiAreaGuide = { slug: string; path: string; title: string; eyebrow: string; intro: string; purpose: string; intentQuestion: string; metaDescription: string; criteria: string[]; area: string };
const make = (slug: string, area: string, title: string, intro: string, question: string, criteria: string[]): ChiangraiAreaGuide => ({ slug, area, path: `/chiangrai/${slug}/`, title, eyebrow: 'CHIANG RAI HOTEL GUIDE', intro, purpose: `${area} 숙소를 공개 후기와 위치 기준으로 비교합니다.`, intentQuestion: question, criteria, metaDescription: `${title}. 치앙라이 숙소의 위치, 후기와 예약 조건을 비교합니다.` });
export const chiangraiAreaGuides = [
  make('central-hotels', '치앙라이 시내', '치앙라이 시내 호텔 후기 야시장·시계탑·교통 비교', '치앙라이 시내 숙소는 야시장과 시계탑, 버스터미널까지의 실제 동선을 함께 봐야 합니다. 도보 이동과 차량 이용 조건을 예약 전에 비교하세요.', '치앙라이 시내 관광에 편리한 숙소는 어디일까요?', ['야시장 동선', '시계탑', '객실', '조식']),
  make('mae-sai-hotels', '매사이', '치앙라이 매사이 호텔 후기 국경·시장·교통 비교', '매사이는 태국 북부 국경 일정과 시장 방문을 계획할 때 살펴볼 권역입니다. 체크인 시간과 이동 수단을 함께 확인하세요.', '매사이 일정에 맞는 숙소는 어떻게 고를까요?', ['국경 접근', '시장', '주차', '체크인']),
  make('chiang-saen-hotels', '치앙센·골든트라이앵글', '치앙센 골든트라이앵글 호텔 후기 메콩강 전망·위치 비교', '치앙센과 골든트라이앵글 숙소는 메콩강 전망과 관광지 접근성, 시내 식당까지의 이동 방법을 함께 확인해야 합니다.', '골든트라이앵글 일정에 적합한 숙소는 어디일까요?', ['메콩강 전망', '관광지 접근', '조식', '차량 이동']),
  make('mae-salong-hotels', '매살롱·산악권', '치앙라이 매살롱 호텔 후기 산악 전망·차밭·렌터카', '매살롱과 산악권 숙소는 전망이 장점이지만 도로 상태와 야간 이동, 주변 식당 접근성을 반드시 함께 봐야 합니다.', '치앙라이 산악 지역 숙소를 고를 때 무엇을 확인할까요?', ['산악 전망', '차밭', '렌터카', '야간 이동']),
  make('chiang-rai-hotel-comparison', '전체', '치앙라이 호텔 비교 시내·매사이·치앙센·매살롱', '치앙라이는 시내 관광, 국경 일정, 골든트라이앵글, 산악 휴양에 따라 적합한 숙소 권역이 달라집니다.', '여행 일정에 따라 치앙라이 어느 권역이 맞을까요?', ['권역', '후기 수', '평점', '이동 조건'])
] as ChiangraiAreaGuide[];
export const chiangraiHotels = hotels.filter(hotel => hotel.slug.startsWith('chiangrai-')).sort((a, b) => popularity(b) - popularity(a));
export function getChiangraiArea(hotel: Hotel) {
  const lat = hotel.latitude ?? 0, lon = hotel.longitude ?? 0, address = hotel.address || '';
  if (/Mae Sai|매사이|แม่สาย/i.test(address) || lat >= 20.25) return '매사이';
  if (/Chiang Saen|치앙센|เชียงแสน|Golden Triangle|골든 트라이앵글/i.test(address) || lon >= 100.15) return '치앙센·골든트라이앵글';
  if (/Mae Salong|매살롱|แม่สลอง/i.test(address) || (lat >= 20.05 && lon < 100.05)) return '매살롱·산악권';
  return '치앙라이 시내';
}
export function getChiangraiAreaGuideHotels(guide: ChiangraiAreaGuide, limit = 20) {
  return chiangraiHotels.filter(hotel => guide.area === '전체' || getChiangraiArea(hotel) === guide.area).slice(0, limit).map(hotel => {
    const area = getChiangraiArea(hotel), price = hotel.averageNightlyRate ?? hotel.dailyRate;
    return { hotel, reasons: [`${area} 권역에서 위치를 비교할 숙소입니다.`, hotel.reviewCount && hotel.reviewCount >= 1000 ? '아고다 후기 수가 많아 여러 관점을 비교할 수 있습니다.' : '공개 후기와 객실 조건을 함께 확인하세요.', hotel.reviewScore && hotel.reviewScore >= 8.5 ? '아고다 평점이 높은 편입니다.' : '평점 외에 객실 유형도 비교하세요.'], caution: '객실 유형·조식·취소 조건과 실제 이동 동선을 예약 전 확인하세요.', tags: [area, ...guide.criteria.slice(0, 2)], tableCells: [area, String(hotel.reviewScore ?? '확인 필요'), hotel.reviewCount ? `${hotel.reviewCount.toLocaleString('ko-KR')}건` : '후기 부족', price ? `${price.toLocaleString('ko-KR')}원~` : '가격 확인', area] };
  });
}
export function getRelatedChiangraiAreaGuides(hotel: Hotel) { if (!hotel.slug.startsWith('chiangrai-')) return []; const area = getChiangraiArea(hotel); return chiangraiAreaGuides.filter(guide => guide.area === '전체' || guide.area === area); }
function popularity(hotel: Hotel) { return (hotel.reviewScore || 0) * 1000 + Math.min(hotel.reviewCount || 0, 50000) / 10; }
