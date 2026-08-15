import type { Hotel } from './hotels';

type Profile = { label: string; terms: string[]; recommendedFor: string[]; notRecommendedFor: string[]; focus: string };
const profiles: Record<string, Profile> = {
  kawaguchiko: { label: '가와구치코', terms: ['후지산뷰', '온천', '셔틀', '조식'], recommendedFor: ['후지산 전망 여행', '가와구치코 호수 일정', '온천·료칸 숙박'], notRecommendedFor: ['도심 상권과 늦은 밤 이동이 중요한 여행자'], focus: '가와구치코역과 후지산 전망·온천·송영 조건' },
  yamanakako: { label: '야마나카코', terms: ['호수전망', '주차', '가족', '후지산'], recommendedFor: ['야마나카코 호수 휴식', '렌터카 가족여행', '후지산 전망'], notRecommendedFor: ['철도역 바로 앞 숙소만 필요한 여행자'], focus: '야마나카코 호수 전망과 버스·렌터카·주차 조건' },
  fujiyoshida: { label: '후지요시다', terms: ['후지산', '교통', '주차', '조식'], recommendedFor: ['후지큐 하이랜드', '후지산 등산·관광', '철도·렌터카 여행'], notRecommendedFor: ['호수 바로 앞 료칸만 원하는 여행자'], focus: '후지요시다 교통과 후지산·후지큐 하이랜드 접근성' },
  kofu: { label: '고후·이사와', terms: ['역근처', '온천', '석식', '주차'], recommendedFor: ['고후역 중심 일정', '이사와 온천여행', '요리 와이너리 관광'], notRecommendedFor: ['후지산 호수 일정만 집중하는 여행자'], focus: '고후역 접근성과 이사와 온천·식사·주차 조건' },
  kiyosato: { label: '기요사토·호쿠토', terms: ['고원', '주차', '가족', '조식'], recommendedFor: ['팔가악 고원 여행', '렌터카 가족여행', '조용한 자연 휴식'], notRecommendedFor: ['대중교통만으로 짧은 동선을 원하는 여행자'], focus: '기요사토·호쿠토 고원 관광과 주차·가족 객실 조건' },
  all: { label: '야마나시현', terms: ['위치', '객실', '조식', '예약조건'], recommendedFor: ['야마나시 자유여행', '호텔·료칸 비교', '후지산·온천 여행'], notRecommendedFor: ['교통과 식사 조건 확인 없이 최저가만 찾는 여행자'], focus: '야마나시 위치와 객실·교통·식사 조건' },
};

export function getYamanashiSearchIntent(hotel: Hotel) {
  if (!hotel.slug.startsWith('yamanashi-')) return undefined;
  const profile = pickProfile(hotel); const name = hotel.hotelName.trim(); const title = `${name} ${profile.label} 후기 모음 ${profile.terms.join(' ')}`;
  return { title, seoTitle: `${title} | 예약 전 FAQ`, metaDescription: `${name} 후기를 ${profile.focus} 중심으로 정리했습니다. 체크인과 식사, 교통 및 예약 조건을 예약 전에 확인하세요.`, intentChips: profile.terms, faqs: makeFaqs(name, profile), recommendedFor: profile.recommendedFor, notRecommendedFor: profile.notRecommendedFor };
}
function pickProfile(hotel: Hotel) { const text = [hotel.hotelName, hotel.address, hotel.region, hotel.analysis?.summary].filter(Boolean).join(' '); if (/야마나카코|Yamanakako|山中湖/i.test(text)) return profiles.yamanakako; if (/후지요시다|Fujiyoshida|富士吉田/i.test(text)) return profiles.fujiyoshida; if (/고후|이사와|후에후키|Kofu|Isawa|Fuefuki|甲府|石和|笛吹/i.test(text)) return profiles.kofu; if (/기요사토|호쿠토|Kiyosato|Hokuto|清里|北杜/i.test(text)) return profiles.kiyosato; if (/가와구치코|Fujikawaguchiko|Kawaguchiko|富士河口湖|河口湖/i.test(text)) return profiles.kawaguchiko; return profiles.all; }
function makeFaqs(name: string, profile: Profile) { return [
  { category: '위치', question: `${name} 위치는 ${profile.label} 여행 동선에 맞나요?`, answer: `${profile.focus}을 먼저 확인하세요. 후지산 호수와 고원 지역은 지도상 거리보다 버스·셔틀·렌터카의 실제 이동 시간이 중요할 수 있습니다.` },
  { category: '체크인', question: `${name} 체크인 전에 무엇을 확인해야 하나요?`, answer: '프런트 운영 시간과 짐 보관, 늦은 도착 가능 여부를 확인하세요. 료칸은 석식 시간 때문에 체크인 마감이 빠를 수 있습니다.' },
  { category: '조식·식사', question: `${name} 조식이나 석식 포함 예약이 유리할까요?`, answer: '역 주변은 외부 식당 선택지가 있지만 호수·고원 지역은 식사 포함 조건이 편리할 수 있습니다. 메뉴와 시작 시간, 요금 차이를 함께 비교하세요.' },
  { category: '교통·주차', question: `${name} 교통편과 주차는 무엇을 확인해야 하나요?`, answer: '버스·철도와 렌터카 중 실제 일정에 맞는 이동 수단을 기준으로 보세요. 무료 주차, 역 송영 예약과 관광지까지 이동 시간도 확인하는 편이 좋습니다.' },
  { category: '예약', question: `${name} 객실과 예약 조건은 무엇을 비교해야 하나요?`, answer: '침대 구성과 금연 여부, 후지산·호수 전망, 온천 이용 조건, 취소 기한과 추가 요금은 객실별로 다를 수 있습니다. 결제 전 아고다 최신 조건을 다시 확인하세요.' },
]; }
