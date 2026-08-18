import type { Hotel } from './hotels';

type Profile = { label: string; terms: string[]; recommendedFor: string[]; notRecommendedFor: string[]; focus: string };
const profiles: Record<string, Profile> = {
  mito: { label: '미토', terms: ['역근처', '출장', '주차', '조식'], recommendedFor: ['미토역 중심 관광과 출장', '가이라쿠엔·시내 이동', '철도 중심 일정'], notRecommendedFor: ['해변 리조트 자체가 목적인 여행자'], focus: '미토역과 가이라쿠엔 이동, 주차·조식·체크인 조건' },
  tsukuba: { label: '쓰쿠바', terms: ['역거리', '출장', '가족', '주차'], recommendedFor: ['쓰쿠바 출장과 연구단지 방문', '쓰쿠바산 관광', '렌터카 가족여행'], notRecommendedFor: ['도쿄 도심 관광만 계획하는 여행자'], focus: '쓰쿠바역·연구단지와 쓰쿠바산 이동, 주차와 객실 조건' },
  oarai: { label: '오아라이', terms: ['해변', '가족', '조식', '주차'], recommendedFor: ['오아라이 해변과 아쿠아월드 관광', '아이 동반 가족여행', '렌터카 해안 일정'], notRecommendedFor: ['도심 상권과 심야 교통이 중요한 여행자'], focus: '오아라이 해변·아쿠아월드 거리와 가족 객실·식사·주차 조건' },
  hitachi: { label: '히타치·히타치나카', terms: ['바다', '공원', '역근처', '조식'], recommendedFor: ['히타치 해안과 국영 히타치해변공원 여행', '기차와 렌터카를 함께 쓰는 일정', '조용한 해안 숙박'], notRecommendedFor: ['밤늦게까지 이어지는 번화가가 중요한 여행자'], focus: '히타치역과 히타치해변공원 이동, 바다 전망·주차·조식 조건' },
  kashima: { label: '가시마·가미스', terms: ['출장', '주차', '교통', '객실'], recommendedFor: ['가시마 신궁 관광', '가시마·가미스 출장', '렌터카 이동'], notRecommendedFor: ['철도역 도보만으로 모든 일정을 해결하려는 여행자'], focus: '가시마 신궁과 가미스 산업지역 이동, 주차·객실·체크인 조건' },
  all: { label: '이바라키현', terms: ['위치', '객실', '교통', '예약조건'], recommendedFor: ['이바라키 자유여행', '도쿄 근교 렌터카 일정', '해안·자연 관광'], notRecommendedFor: ['교통 조건 확인 없이 최저가만 찾는 여행자'], focus: '이바라키 위치와 객실·교통·식사·예약 조건' },
};

export function getIbarakiSearchIntent(hotel: Hotel) {
  if (!hotel.slug.startsWith('ibaraki-')) return undefined;
  const profile = pickProfile(hotel); const name = hotel.hotelName.trim(); const title = `${name} ${profile.label} 후기 모음 ${profile.terms.join(' ')}`;
  return { title, seoTitle: `${title} | 예약 전 FAQ`, metaDescription: `${name} 후기를 ${profile.focus} 중심으로 정리했습니다. 체크인과 식사, 교통 및 예약 조건을 예약 전에 확인하세요.`, intentChips: profile.terms, faqs: makeFaqs(name, profile), recommendedFor: profile.recommendedFor, notRecommendedFor: profile.notRecommendedFor };
}
function pickProfile(hotel: Hotel) { const text = [hotel.hotelName, hotel.address, hotel.region, hotel.analysis?.summary].filter(Boolean).join(' '); if (/미토|Mito|水戸/i.test(text)) return profiles.mito; if (/쓰쿠바|츠쿠바|Tsukuba|つくば|筑波|츠치우라|Tsuchiura|土浦/i.test(text)) return profiles.tsukuba; if (/오아라이|Oarai|大洗/i.test(text)) return profiles.oarai; if (/히타치|Hitachi|日立|히타치나카|Hitachinaka|ひたちなか/i.test(text)) return profiles.hitachi; if (/가시마|Kashima|鹿嶋|가미스|Kamisu|神栖/i.test(text)) return profiles.kashima; return profiles.all; }
function makeFaqs(name: string, profile: Profile) { return [
  { category: '위치', question: `${name} 위치는 ${profile.label} 여행 동선에 맞나요?`, answer: `${profile.focus}을 먼저 확인하세요. 이바라키는 철도역에서 관광지까지 버스나 렌터카 이동이 필요한 곳이 적지 않습니다.` },
  { category: '체크인', question: `${name} 체크인과 짐 보관은 어떻게 확인하나요?`, answer: '프런트 운영 시간과 늦은 도착 가능 여부, 체크인 전후 짐 보관 조건을 예약 전에 확인하세요.' },
  { category: '조식', question: `${name} 조식 포함 예약이 유리할까요?`, answer: '주변 식당의 영업시간과 이동 거리를 함께 보세요. 조식 메뉴와 운영 시간, 객실 요금 차이는 예약 시점에 다시 확인하는 편이 좋습니다.' },
  { category: '교통·주차', question: `${name} 교통과 주차에서 볼 점은 무엇인가요?`, answer: '역 도보 거리만 아니라 목적지까지 실제 이동 시간도 비교하세요. 렌터카라면 무료 주차 여부와 입출차 시간을 확인해야 합니다.' },
  { category: '예약', question: `${name} 객실 조건은 무엇을 비교해야 하나요?`, answer: '침대 구성과 금연 여부, 전망, 취소 기한과 추가 요금은 객실별로 다를 수 있습니다. 결제 전 아고다 최신 조건을 다시 확인하세요.' },
]; }
