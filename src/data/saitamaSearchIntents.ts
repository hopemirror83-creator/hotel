import type { Hotel } from './hotels';

type Profile = { label: string; terms: string[]; recommendedFor: string[]; notRecommendedFor: string[]; focus: string };
const profiles: Record<string, Profile> = {
  omiya: { label: '오미야·사이타마신토신', terms: ['역근처', '출장', '공연', '조식'], recommendedFor: ['오미야역 환승과 출장', '사이타마 슈퍼 아레나 공연', '도쿄 북부와 근교 이동'], notRecommendedFor: ['전통 온천마을 자체가 목적인 여행자'], focus: '오미야역·사이타마신토신역과 슈퍼 아레나 이동, 조식·체크인 조건' },
  urawa: { label: '우라와·가와구치', terms: ['도쿄접근', '역거리', '출장', '주차'], recommendedFor: ['도쿄 접근과 숙박비를 함께 보는 여행', '우라와·가와구치 출장', 'JR선 중심 이동'], notRecommendedFor: ['관광지 도보 여행만 원하는 여행자'], focus: '우라와·가와구치역과 도쿄 이동, 주차·객실·체크인 조건' },
  kawagoe: { label: '가와고에', terms: ['에도거리', '역근처', '가족', '주차'], recommendedFor: ['가와고에 옛거리 관광', '도쿄 근교 당일·1박 여행', '가족과 소도시 산책'], notRecommendedFor: ['심야 도심 상권이 중요한 여행자'], focus: '가와고에역·혼카와고에역과 옛거리 이동, 가족 객실·주차 조건' },
  tokorozawa: { label: '도코로자와', terms: ['벨루나돔', '역거리', '공연', '주차'], recommendedFor: ['벨루나돔 야구·공연 관람', '도코로자와 출장', '세이부선 중심 이동'], notRecommendedFor: ['도쿄 동부 관광 동선이 중요한 여행자'], focus: '도코로자와역과 벨루나돔 이동, 막차·주차·체크인 조건' },
  chichibu: { label: '지치부·나가토로', terms: ['온천', '자연', '렌터카', '석식'], recommendedFor: ['지치부·나가토로 자연여행', '온천과 료칸 식사', '렌터카 가족·커플 여행'], notRecommendedFor: ['도쿄 도심 관광만 계획하는 여행자'], focus: '지치부역·나가토로 관광지 이동, 온천·석식·송영 조건' },
  north: { label: '구마가야·혼조', terms: ['역근처', '출장', '주차', '조식'], recommendedFor: ['구마가야·혼조 출장', 'JR·신칸센 환승', '합리적인 도심 숙박'], notRecommendedFor: ['리조트 부대시설이 중요한 여행자'], focus: '구마가야·혼조역 접근과 출장 동선, 주차·조식 조건' },
  all: { label: '사이타마현', terms: ['위치', '객실', '교통', '예약조건'], recommendedFor: ['사이타마 자유여행', '도쿄 근교 숙박', '철도·렌터카 여행'], notRecommendedFor: ['교통 조건 확인 없이 최저가만 찾는 여행자'], focus: '사이타마 위치와 객실·교통·식사·예약 조건' },
};

export function getSaitamaSearchIntent(hotel: Hotel) {
  if (!hotel.slug.startsWith('saitama-')) return undefined;
  const profile = pickProfile(hotel); const name = hotel.hotelName.trim(); const title = `${name} ${profile.label} 후기 모음 ${profile.terms.join(' ')}`;
  return { title, seoTitle: `${title} | 예약 전 FAQ`, metaDescription: `${name} 후기를 ${profile.focus} 중심으로 정리했습니다. 체크인과 교통, 객실 및 예약 조건을 예약 전에 확인하세요.`, intentChips: profile.terms, faqs: makeFaqs(name, profile), recommendedFor: profile.recommendedFor, notRecommendedFor: profile.notRecommendedFor };
}
function pickProfile(hotel: Hotel) { const text = [hotel.hotelName, hotel.address, hotel.region, hotel.analysis?.summary].filter(Boolean).join(' '); if (/오미야|Omiya|大宮|사이타마신토신|Saitama.?Shintoshin|さいたま新都心/i.test(text)) return profiles.omiya; if (/우라와|Urawa|浦和|가와구치|Kawaguchi|川口|와라비|Warabi|蕨|도다|Toda|戸田/i.test(text)) return profiles.urawa; if (/가와고에|Kawagoe|川越/i.test(text)) return profiles.kawagoe; if (/도코로자와|Tokorozawa|所沢|한노|Hanno|飯能/i.test(text)) return profiles.tokorozawa; if (/지치부|Chichibu|秩父|나가토로|Nagatoro|長瀞/i.test(text)) return profiles.chichibu; if (/구마가야|Kumagaya|熊谷|혼조|Honjo|本庄|후카야|Fukaya|深谷/i.test(text)) return profiles.north; return profiles.all; }
function makeFaqs(name: string, profile: Profile) { return [
  { category: '위치', question: `${name} 위치는 ${profile.label} 여행 동선에 맞나요?`, answer: `${profile.focus}을 먼저 확인하세요. 사이타마는 노선과 환승역에 따라 도쿄 및 관광지까지 실제 이동 시간이 크게 달라질 수 있습니다.` },
  { category: '체크인', question: `${name} 체크인과 짐 보관은 가능한가요?`, answer: '프런트 운영 시간과 늦은 도착, 체크인 전후 짐 보관 조건을 확인하세요. 공연일에는 역과 숙소 주변이 혼잡할 수 있습니다.' },
  { category: '조식·식사', question: `${name} 조식 포함 예약이 유리할까요?`, answer: '주변 식당의 영업시간과 이동 거리를 함께 보세요. 조식 메뉴와 운영 시간, 객실 요금 차이는 예약 시점에 다시 확인하는 편이 좋습니다.' },
  { category: '교통·주차', question: `${name} 교통과 주차에서 확인할 점은 무엇인가요?`, answer: '가장 가까운 역과 이용 노선, 막차 시간을 함께 확인하세요. 렌터카라면 주차 요금과 입출차 가능 시간을 비교해야 합니다.' },
  { category: '예약', question: `${name} 객실 조건은 무엇을 비교해야 하나요?`, answer: '침대 구성과 금연 여부, 객실 크기, 취소 기한과 추가 요금은 객실별로 다를 수 있습니다. 결제 전 아고다 최신 조건을 다시 확인하세요.' },
]; }
