import type { Hotel } from './hotels';

type Profile = { label: string; terms: string[]; recommendedFor: string[]; notRecommendedFor: string[]; focus: string };
const profiles: Record<string, Profile> = {
  kusatsu: { label: '구사쓰온천', terms: ['온천', '유바타케', '석식', '송영'], recommendedFor: ['구사쓰 온천여행', '료칸 식사와 대욕장 이용', '유바타케 도보 관광'], notRecommendedFor: ['도심 상권과 철도역 바로 앞 숙소만 필요한 여행자'], focus: '유바타케 거리와 온천·석식·송영 조건' },
  ikaho: { label: '이카호온천', terms: ['온천', '석단거리', '주차', '조식'], recommendedFor: ['이카호 석단거리 관광', '렌터카 온천여행', '료칸 식사 선호'], notRecommendedFor: ['평지 이동과 철도역 접근만 중시하는 여행자'], focus: '이카호 석단거리 접근성과 언덕·주차·식사 조건' },
  minakami: { label: '미나카미', terms: ['노천온천', '자연', '송영', '가족'], recommendedFor: ['노천온천과 자연 휴식', '가족·커플 리조트 여행', '렌터카 여행'], notRecommendedFor: ['늦은 밤 도심 식당과 쇼핑이 중요한 여행자'], focus: '미나카미역 송영과 노천온천·자연·식사 조건' },
  shima: { label: '시마온천', terms: ['온천료칸', '석식', '주차', '조용함'], recommendedFor: ['조용한 온천 료칸 휴식', '가이세키·석식 포함 숙박', '렌터카 여행'], notRecommendedFor: ['대중교통 배차와 번화가 접근이 중요한 여행자'], focus: '시마온천 버스 접근성과 료칸 식사·온천·주차 조건' },
  city: { label: '다카사키·마에바시', terms: ['역근처', '출장', '주차', '조식'], recommendedFor: ['다카사키·마에바시 출장', 'JR역 중심 이동', '합리적인 도심 숙박'], notRecommendedFor: ['온천 료칸 자체가 여행 목적인 여행자'], focus: 'JR역과 도심 이동, 주차·조식·체크인 조건' },
  all: { label: '군마현', terms: ['위치', '객실', '온천', '예약조건'], recommendedFor: ['군마 자유여행', '온천·료칸 비교', '렌터카 여행'], notRecommendedFor: ['교통과 식사 조건 확인 없이 최저가만 찾는 여행자'], focus: '군마 위치와 객실·온천·교통·식사 조건' },
};

export function getGunmaSearchIntent(hotel: Hotel) {
  if (!hotel.slug.startsWith('gunma-')) return undefined;
  const profile = pickProfile(hotel); const name = hotel.hotelName.trim(); const title = `${name} ${profile.label} 후기 모음 ${profile.terms.join(' ')}`;
  return { title, seoTitle: `${title} | 예약 전 FAQ`, metaDescription: `${name} 후기를 ${profile.focus} 중심으로 정리했습니다. 체크인과 식사, 교통 및 예약 조건을 예약 전에 확인하세요.`, intentChips: profile.terms, faqs: makeFaqs(name, profile), recommendedFor: profile.recommendedFor, notRecommendedFor: profile.notRecommendedFor };
}
function pickProfile(hotel: Hotel) { const text = [hotel.hotelName, hotel.address, hotel.region, hotel.analysis?.summary].filter(Boolean).join(' '); if (/구사쓰|쿠사츠|Kusatsu|草津/i.test(text)) return profiles.kusatsu; if (/이카호|Ikaho|伊香保/i.test(text)) return profiles.ikaho; if (/미나카미|Minakami|水上|다니가와|Tanigawa/i.test(text)) return profiles.minakami; if (/시마|Shima|四万|나카노조|Nakanojo/i.test(text)) return profiles.shima; if (/다카사키|마에바시|Takasaki|Maebashi|高崎|前橋/i.test(text)) return profiles.city; return profiles.all; }
function makeFaqs(name: string, profile: Profile) { return [
  { category: '위치', question: `${name} 위치는 ${profile.label} 여행 동선에 맞나요?`, answer: `${profile.focus}을 먼저 확인하세요. 군마 온천 지역은 지도상 거리보다 버스 배차와 역 송영, 언덕길의 실제 이동 시간이 중요할 수 있습니다.` },
  { category: '체크인', question: `${name} 체크인 전에 무엇을 확인해야 하나요?`, answer: '프런트 운영 시간과 짐 보관, 늦은 도착 가능 여부를 확인하세요. 료칸은 석식 시간 때문에 체크인 마감이 빠를 수 있습니다.' },
  { category: '조식·석식', question: `${name} 식사 포함 예약이 유리할까요?`, answer: '온천 마을은 저녁 식당 선택과 영업시간이 제한적일 수 있습니다. 메뉴와 식사 시작 시간, 알레르기 대응과 요금 차이를 함께 비교하세요.' },
  { category: '교통·주차', question: `${name} 송영과 주차는 무엇을 확인해야 하나요?`, answer: '역 송영은 사전 예약과 운행 시간이 정해진 경우가 많습니다. 렌터카라면 무료 주차와 겨울철 도로 조건도 확인하는 편이 좋습니다.' },
  { category: '예약', question: `${name} 객실과 온천 조건은 무엇을 비교해야 하나요?`, answer: '침대 구성과 금연 여부, 객실 욕실, 전세탕·노천탕 이용 시간, 취소 기한과 추가 요금은 객실별로 다를 수 있습니다. 결제 전 아고다 최신 조건을 다시 확인하세요.' },
]; }
