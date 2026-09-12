import type { Hotel } from './hotels';
export function getSoctrangSearchIntent(hotel: Hotel) {
  if (!hotel.slug.startsWith('soctrang-')) return;
  const name = hotel.hotelName.trim();
  const terms = ['속짱', '시내', '조식', '체크인'];
  const title = `${name} 속짱 후기 모음 ${terms.join(' ')}`;
  return { title, seoTitle: `${title} | 예약 전 FAQ`, metaDescription: `${name} 후기를 속짱 시내 이동과 조식·체크인 조건 중심으로 정리했습니다.`, intentChips: terms, recommendedFor: ['속짱 시내 일정', '주변 식당과 이동 동선을 살피는 여행자'], notRecommendedFor: ['해변 리조트만 찾는 여행자'], faqs: [
    { category: '위치', question: `${name}은 속짱 시내 이동에 편리한가요?`, answer: '숙소 주소를 기준으로 방문할 장소와 실제 이동 시간을 지도에서 확인하세요.' },
    { category: '조식', question: `${name} 조식은 포함되나요?`, answer: '객실 상품별 포함 여부와 운영 시간은 예약 화면에서 다시 확인하세요.' },
    { category: '체크인', question: `${name} 늦은 체크인이 가능한가요?`, answer: '도착이 늦다면 프런트 운영 시간과 체크인 가능 여부를 숙소에 문의하세요.' },
    { category: '예약', question: `${name} 예약 전 무엇을 확인해야 하나요?`, answer: '객실 유형, 취소 기한, 조식과 교통 동선을 함께 비교하세요.' }
  ] };
}
