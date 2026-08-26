import type { Hotel } from './hotels';

const profiles = {
  benthan: { label: '1군·벤탄시장', terms: ['위치', '조식', '체크인', '도보관광'], focus: '벤탄시장과 주요 관광지 도보 접근, 조식·체크인 조건' },
  dongkhoi: { label: '동커이·응우옌후에', terms: ['야경', '쇼핑', '조식', '수영장'], focus: '동커이와 응우옌후에 접근, 전망·조식·수영장 조건' },
  buivien: { label: '부이비엔·팜응우라오', terms: ['가성비', '야간소음', '체크인', '공항버스'], focus: '부이비엔과 팜응우라오 접근, 야간 소음·체크인·가성비 조건' },
  airport: { label: '탄손녓 공항', terms: ['공항이동', '새벽체크인', '조식', '셔틀'], focus: '탄손녓공항 이동 시간과 셔틀, 새벽 체크인·조식 조건' },
  riverside: { label: '사이공강·랜드마크81', terms: ['리버뷰', '수영장', '가족여행', '이동'], focus: '사이공강과 랜드마크81 접근, 전망·수영장·가족 객실 조건' },
  all: { label: '베트남 호치민', terms: ['위치', '조식', '공항', '예약조건'], focus: '호치민 위치와 객실·조식·공항 이동·예약 조건' },
};

export function getHochiminhSearchIntent(hotel: Hotel) {
  if (!hotel.slug.startsWith('hochiminh-')) return;
  const profile = pick(hotel);
  const name = hotel.hotelName.trim();
  const title = `${name} ${profile.label} 후기 모음 ${profile.terms.join(' ')}`;
  return {
    title,
    seoTitle: `${title} | 예약 전 FAQ`,
    metaDescription: `${name} 후기를 ${profile.focus} 중심으로 정리했습니다. 예약 전 최신 객실 조건과 요금을 확인하세요.`,
    intentChips: profile.terms,
    recommendedFor: ['호치민 자유여행', '도심 관광 여행', '출장·커플 여행'],
    notRecommendedFor: ['교통 시간과 주변 소음, 객실 조건을 확인하지 않는 여행자'],
    faqs: [
      { category: '위치', question: `${name} 위치는 ${profile.label} 일정에 맞나요?`, answer: `${profile.focus}을 먼저 확인하세요. 호치민은 교통 정체가 잦아 지도상 거리보다 실제 이동 시간이 길 수 있습니다.` },
      { category: '공항·체크인', question: `${name} 공항 이동과 체크인은 어떻게 확인하나요?`, answer: '탄손녓공항까지 예상 이동 시간과 심야 체크인 가능 여부, 공항 셔틀·짐 보관 조건을 확인하세요.' },
      { category: '조식', question: `${name} 조식은 예약에 포함되나요?`, answer: '객실 상품별 조식 포함 여부와 이용 시간, 어린이 요금은 예약 화면에서 다시 확인하세요.' },
      { category: '객실·소음', question: `${name} 객실과 소음은 무엇을 살펴볼까요?`, answer: '창문 유무와 객실 크기, 도로·유흥가 방향, 고층 객실 가능 여부를 공개 후기와 객실 설명에서 비교하세요.' },
      { category: '예약', question: `${name} 예약 조건은 무엇을 비교할까요?`, answer: '침대 구성과 전망, 무료 취소 기한, 세금·추가 요금 및 체크아웃 시간을 결제 전에 확인하세요.' },
    ],
  };
}

function pick(hotel: Hotel) {
  const value = [hotel.hotelName, hotel.address, hotel.analysis?.summary].filter(Boolean).join(' ');
  if (/Airport|에어포트|Tan Son Nhat|Tân Sơn Nhất|탄손녓|Tan Binh|Tân Bình/i.test(value)) return profiles.airport;
  if (/Bui Vien|Bùi Viện|부이비엔|Pham Ngu Lao|Phạm Ngũ Lão|팜응우라오/i.test(value)) return profiles.buivien;
  if (/Dong Khoi|Đồng Khởi|동커이|Nguyen Hue|Nguyễn Huệ|응우옌후에|Opera|오페라/i.test(value)) return profiles.dongkhoi;
  if (/Landmark 81|랜드마크|Saigon River|사이공강|Binh Thanh|Bình Thạnh|리버사이드/i.test(value)) return profiles.riverside;
  if (/Ben Thanh|Bến Thành|벤탄|District 1|Quan 1|Quận 1|1군/i.test(value)) return profiles.benthan;
  return profiles.all;
}
