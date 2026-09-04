import type { Hotel } from './hotels';

export function getDienbienSearchIntent(hotel: Hotel) {
  if (!hotel.slug.startsWith('dienbien-')) return;
  const name = hotel.hotelName.trim();
  const airport = /airport|공항/i.test([hotel.hotelName, hotel.address].filter(Boolean).join(' '));
  const label = airport ? '디엔비엔푸 공항' : '디엔비엔푸';
  const terms = airport ? ['공항', '교통', '체크인', '주차'] : ['A1언덕', '조식', '주차', '체크인'];
  const title = `${name} ${label} 후기 모음 ${terms.join(' ')}`;
  return {
    title,
    seoTitle: `${title} | 예약 전 FAQ`,
    metaDescription: `${name} 후기를 A1 언덕·공항 이동과 조식·주차 조건 중심으로 정리했습니다.`,
    intentChips: terms,
    recommendedFor: ['디엔비엔푸 역사 여행', '베트남 서북부 일정', '공항과 시내 동선을 함께 보는 여행자'],
    notRecommendedFor: ['하노이 당일 관광만 계획하는 여행자'],
    faqs: [
      { category: '위치', question: `${name}은 A1 언덕과 시내 관광에 편리한가요?`, answer: 'A1 언덕·전승박물관·시장까지의 실제 이동 시간과 야간 교통편을 함께 확인하세요.' },
      { category: '공항', question: `${name}에서 디엔비엔푸 공항 이동은 어떤가요?`, answer: '예상 이동 시간과 택시·픽업 가능 여부를 항공편 시간에 맞춰 문의하세요.' },
      { category: '조식', question: `${name} 조식은 이른 일정에도 가능한가요?`, answer: '조식 포함 여부와 시작 시간, 이른 출발 시 대체 식사 가능 여부를 확인하세요.' },
      { category: '주차', question: `${name} 주차와 차량 진입은 편리한가요?`, answer: '무료 주차 여부와 주차대수, 대형 차량 진입 가능 여부를 예약 전에 확인하세요.' },
      { category: '예약', question: `${name} 예약 전 무엇을 비교할까요?`, answer: '객실 냉방, 조식, 공항 이동, 취소 기한과 새벽 체크아웃 가능 여부를 비교하세요.' }
    ]
  };
}
