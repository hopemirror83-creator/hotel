import type { Hotel } from './hotels';
import { getChiangraiArea } from './chiangraiAreaGuides';
export function getChiangraiSearchIntent(hotel: Hotel) {
  if (!hotel.slug.startsWith('chiangrai-')) return;
  const name = hotel.hotelName.trim(), area = getChiangraiArea(hotel);
  const terms = ['치앙라이', area, '조식', '위치'];
  const title = `${name} 후기 모음 ${terms.join(' ')}`;
  return { title, seoTitle: `${title} | 예약 전 FAQ`, metaDescription: `${name}의 ${area} 위치와 공개 후기, 객실·조식·이동 조건을 예약 전에 확인하도록 정리했습니다.`, intentChips: terms, recommendedFor: [`${area} 일정을 계획하는 여행자`, '숙소 위치와 후기 단서를 함께 비교하는 여행자'], notRecommendedFor: ['산악·국경 지역의 이동 동선을 확인하지 않고 예약하려는 여행자'], faqs: [
    { category: '위치', question: `${name}에서 치앙라이 주요 장소까지 이동하기 편리한가요?`, answer: `숙소가 위치한 ${area}와 방문할 장소를 지도에서 비교하고 실제 이동 수단을 확인하세요.` },
    { category: '조식', question: `${name} 조식은 예약 요금에 포함되나요?`, answer: '객실 상품마다 포함 여부가 다를 수 있으므로 예약 화면의 식사 조건을 확인하세요.' },
    { category: '체크인', question: `${name} 늦은 체크인이 가능한가요?`, answer: '늦게 도착한다면 프런트 운영 시간과 체크인 가능 여부를 숙소에 미리 문의하세요.' },
    { category: '교통', question: `${name} 치앙라이 공항이나 버스터미널에서 어떻게 이동하나요?`, answer: '택시와 차량 호출, 숙소 픽업 여부를 확인하고 산악 지역은 야간 이동 시간을 여유 있게 잡으세요.' },
    { category: '예약', question: `${name} 예약 전 무엇을 확인해야 하나요?`, answer: '객실 유형과 전망, 조식, 취소 기한, 관광지까지의 실제 이동 동선을 함께 비교하세요.' }
  ] };
}
