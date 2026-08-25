import type { Hotel } from './hotels';
const profiles = {
  longbeach: { label: '롱비치·공항', terms: ['해변', '공항픽업', '조식', '수영장'], focus: '롱비치 접근과 공항 이동, 조식·수영장 조건' },
  north: { label: '북부·그랜드월드', terms: ['가족여행', '빈원더스', '수영장', '이동'], focus: '그랜드월드와 빈원더스 접근, 리조트 이동·가족 객실 조건' },
  south: { label: '남부·켐비치', terms: ['오션뷰', '리조트', '조식', '선셋타운'], focus: '켐비치와 선셋타운 이동, 객실 전망·리조트 시설 조건' },
  town: { label: '즈엉동·시내', terms: ['야시장', '공항', '가성비', '체크인'], focus: '즈엉동 야시장과 공항 이동, 가성비·체크인 조건' },
  all: { label: '베트남 푸꾸옥', terms: ['위치', '조식', '수영장', '예약조건'], focus: '푸꾸옥 위치와 객실·조식·수영장·예약 조건' },
};
export function getPhuquocSearchIntent(hotel: Hotel) { if (!hotel.slug.startsWith('phuquoc-')) return; const p = pick(hotel); const name = hotel.hotelName.trim(); const title = `${name} ${p.label} 후기 모음 ${p.terms.join(' ')}`; return { title, seoTitle: `${title} | 예약 전 FAQ`, metaDescription: `${name} 후기를 ${p.focus} 중심으로 정리했습니다. 예약 전 최신 객실 조건과 요금을 확인하세요.`, intentChips: p.terms, recommendedFor: ['푸꾸옥 자유여행', '해변·호캉스 여행', '가족·커플 여행'], notRecommendedFor: ['권역별 이동 거리와 객실 조건을 확인하지 않는 여행자'], faqs: [
  { category: '위치', question: `${name} 위치는 ${p.label} 일정에 맞나요?`, answer: `${p.focus}을 먼저 확인하세요. 푸꾸옥은 북부·중부·남부 사이 이동 시간이 길어 숙박 권역 선택이 중요합니다.` },
  { category: '공항·체크인', question: `${name} 공항 이동과 체크인은 어떻게 확인하나요?`, answer: '무료 공항 셔틀 예약 방법과 운행 시간, 늦은 도착 가능 여부, 짐 보관 조건을 확인하세요.' },
  { category: '조식', question: `${name} 조식은 예약에 포함되나요?`, answer: '객실 상품별 조식 포함 여부와 이용 시간, 어린이 요금은 예약 화면에서 다시 확인하세요.' },
  { category: '수영장·해변', question: `${name} 수영장과 해변 이용 시 무엇을 볼까요?`, answer: '수영장 운영 시간과 해변까지 실제 거리, 객실 전망 및 우기 시설 운영 여부를 비교하세요.' },
  { category: '예약', question: `${name} 객실 조건은 무엇을 비교할까요?`, answer: '침대 구성과 전망, 셔틀, 무료 취소 기한, 리조트 내 추가 요금을 결제 전에 확인하세요.' },
] }; }
function pick(hotel: Hotel) { const v = [hotel.hotelName, hotel.address, hotel.analysis?.summary].filter(Boolean).join(' '); if (/Ganh Dau|Gành Dầu|Grand World|그랜드월드|Vinpearl|빈펄|Bai Dai/i.test(v)) return profiles.north; if (/Khem|켐비치|An Thoi|An Thới|선셋타운|Sunset Town|Hillside/i.test(v)) return profiles.south; if (/Long Beach|롱비치|Bai Truong|Bãi Trường|Cua Lap|Cửa Lấp|Duong To/i.test(v)) return profiles.longbeach; if (/Duong Dong|Dương Đông|즈엉동|Market|시장/i.test(v)) return profiles.town; return profiles.all; }
