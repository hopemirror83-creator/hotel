import type { Hotel } from './hotels';

type Profile = { label: string; terms: string[]; recommendedFor: string[]; notRecommendedFor: string[]; focus: string };
const profiles: Record<string, Profile> = {
  nikko: { label: '닛코', terms: ['세계유산', '도쇼구', '역거리', '버스'], recommendedFor: ['닛코 도쇼구·세계유산 관광', '철도와 버스 중심 여행', '자연과 온천을 함께 보는 일정'], notRecommendedFor: ['늦은 밤 번화가와 쇼핑이 중요한 여행자'], focus: '닛코역과 도쇼구·주젠지호 이동, 버스와 식사 조건' },
  kinugawa: { label: '기누가와온천', terms: ['온천', '석식', '송영', '객실'], recommendedFor: ['기누가와 온천여행', '료칸 식사와 대욕장 이용', '가족·커플 휴식'], notRecommendedFor: ['도심 상권과 심야 교통이 중요한 여행자'], focus: '기누가와온천역 거리와 온천·석식·송영 조건' },
  nasu: { label: '나스고원', terms: ['가족', '렌터카', '조식', '리조트'], recommendedFor: ['아이와 나스고원 여행', '렌터카 리조트 일정', '자연과 부대시설 중심 휴식'], notRecommendedFor: ['철도역 도보 이동만 계획하는 여행자'], focus: '나스고원 관광지 거리와 렌터카·가족 객실·조식 조건' },
  shiobara: { label: '시오바라온천', terms: ['온천료칸', '석식', '주차', '조용함'], recommendedFor: ['조용한 온천 료칸 휴식', '석식 포함 숙박', '렌터카 여행'], notRecommendedFor: ['잦은 대중교통과 번화가 접근이 중요한 여행자'], focus: '시오바라 온천 이동과 료칸 식사·주차·객실 조건' },
  city: { label: '우쓰노미야·오야마', terms: ['역근처', '출장', '주차', '조식'], recommendedFor: ['우쓰노미야·오야마 출장', 'JR역 중심 이동', '합리적인 도심 숙박'], notRecommendedFor: ['온천 료칸 자체가 여행 목적인 여행자'], focus: 'JR역 접근과 도심 이동, 주차·조식·체크인 조건' },
  all: { label: '도치기현', terms: ['위치', '객실', '교통', '예약조건'], recommendedFor: ['도치기 자유여행', '온천·리조트 비교', '렌터카 여행'], notRecommendedFor: ['교통과 식사 조건 확인 없이 최저가만 찾는 여행자'], focus: '도치기 위치와 객실·교통·식사·예약 조건' },
};

export function getTochigiSearchIntent(hotel: Hotel) {
  if (!hotel.slug.startsWith('tochigi-')) return undefined;
  const profile = pickProfile(hotel); const name = hotel.hotelName.trim(); const title = `${name} ${profile.label} 후기 모음 ${profile.terms.join(' ')}`;
  return { title, seoTitle: `${title} | 예약 전 FAQ`, metaDescription: `${name} 후기를 ${profile.focus} 중심으로 정리했습니다. 체크인과 식사, 교통 및 예약 조건을 예약 전에 확인하세요.`, intentChips: profile.terms, faqs: makeFaqs(name, profile), recommendedFor: profile.recommendedFor, notRecommendedFor: profile.notRecommendedFor };
}
function pickProfile(hotel: Hotel) { const text = [hotel.hotelName, hotel.address, hotel.region, hotel.analysis?.summary].filter(Boolean).join(' '); if (/닛코|Nikko|日光|주젠지|Chuzenji/i.test(text)) return profiles.nikko; if (/기누가와|키누가와|Kinugawa|鬼怒川|가와지|Kawaji|유니시가와/i.test(text)) return profiles.kinugawa; if (/나스|Nasu|那須/i.test(text)) return profiles.nasu; if (/시오바라|Shiobara|塩原/i.test(text)) return profiles.shiobara; if (/우쓰노미야|우츠노미야|Utsunomiya|오야마|Oyama|사노|Sano|아시카가|Ashikaga/i.test(text)) return profiles.city; return profiles.all; }
function makeFaqs(name: string, profile: Profile) { return [
  { category: '위치', question: `${name} 위치는 ${profile.label} 여행 동선에 맞나요?`, answer: `${profile.focus}을 먼저 확인하세요. 도치기는 지도상 거리뿐 아니라 버스 배차와 역 송영, 렌터카 이동 시간이 중요할 수 있습니다.` },
  { category: '체크인', question: `${name} 체크인 전에 무엇을 확인해야 하나요?`, answer: '프런트 운영 시간과 짐 보관, 늦은 도착 가능 여부를 확인하세요. 료칸은 석식 시간 때문에 체크인 마감이 빠를 수 있습니다.' },
  { category: '조식·석식', question: `${name} 식사 포함 예약이 유리할까요?`, answer: '온천과 고원 지역은 저녁 식당 선택이 제한될 수 있습니다. 메뉴와 식사 시작 시간, 요금 차이를 함께 비교하세요.' },
  { category: '교통·주차', question: `${name} 교통과 주차는 무엇을 확인해야 하나요?`, answer: '역 송영은 사전 예약과 운행 시간이 정해진 경우가 많습니다. 렌터카라면 무료 주차와 겨울철 도로 조건도 확인하는 편이 좋습니다.' },
  { category: '예약', question: `${name} 객실 조건은 무엇을 비교해야 하나요?`, answer: '침대 구성과 금연 여부, 객실 욕실, 온천 이용 시간, 취소 기한과 추가 요금은 객실별로 다를 수 있습니다. 결제 전 아고다 최신 조건을 다시 확인하세요.' },
]; }
