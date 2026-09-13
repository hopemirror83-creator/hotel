import type { Hotel } from './hotels';
import { getPattayaArea } from './pattayaAreaGuides';
export function getPattayaSearchIntent(hotel: Hotel) {
  if (!hotel.slug.startsWith('pattaya-')) return;
  const name = hotel.hotelName.trim(), area = getPattayaArea(hotel);
  const terms = ['파타야', area, '해변', '조식'];
  const title = `${name} 후기 모음 ${terms.join(' ')}`;
  return { title, seoTitle: `${title} | 예약 전 FAQ`, metaDescription: `${name}의 ${area} 위치와 공개 후기, 객실·조식·이동 조건을 예약 전 확인하도록 정리했습니다.`, intentChips: terms, recommendedFor: [`${area} 일정을 계획하는 여행자`, '숙소 위치와 후기 단서를 함께 비교하는 여행자'], notRecommendedFor: ['해변 동선을 확인하지 않고 예약하려는 여행자'], faqs: [
    { category: '위치', question: `${name}에서 ${area} 주요 장소까지 이동하기 편리한가요?`, answer: '숙소 위치와 방문할 장소를 지도에서 비교하고, 교통 상황에 따른 이동 시간을 확인하세요.' },
    { category: '조식', question: `${name} 조식은 예약 요금에 포함되나요?`, answer: '객실 상품마다 포함 여부가 다를 수 있으므로 예약 화면의 식사 조건을 확인하세요.' },
    { category: '체크인', question: `${name} 늦은 체크인이 가능한가요?`, answer: '늦게 도착한다면 프런트 운영 시간과 체크인 가능 여부를 숙소에 미리 문의하세요.' },
    { category: '해변', question: `${name}에서 해변까지 걸어갈 수 있나요?`, answer: '숙소 위치와 실제 해변 출입 경로를 지도에서 확인하세요. 호텔 이름에 해변이 포함돼도 객실별 전망은 다를 수 있습니다.' },
    { category: '예약', question: `${name} 예약 전 무엇을 확인해야 하나요?`, answer: '객실 유형과 전망, 조식, 취소 기한, 주변 이동 동선을 함께 비교하세요.' }
  ] };
}
