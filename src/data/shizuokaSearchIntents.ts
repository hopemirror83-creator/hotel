import type { Hotel } from './hotels';

type Profile = { label: string; terms: string[]; recommendedFor: string[]; notRecommendedFor: string[]; focus: string };
const profiles: Record<string, Profile> = {
  atami: { label: '아타미', terms: ['온천', '오션뷰', '석식', '역근처'], recommendedFor: ['아타미 온천여행', '커플·가족 휴식', '도쿄 근교 짧은 여행'], notRecommendedFor: ['최저가 비즈니스 숙박만 원하는 여행자'], focus: '아타미역과 온천·오션뷰·식사 조건' },
  izu: { label: '이즈·이토', terms: ['온천', '노천탕', '조식', '송영'], recommendedFor: ['이즈반도 온천여행', '료칸 식사', '렌터카 자유여행'], notRecommendedFor: ['도심 상권과 늦은 밤 이동이 중요한 여행자'], focus: '이즈·이토 관광과 온천·식사·송영 조건' },
  shimoda: { label: '시모다·가와즈', terms: ['바다', '오션뷰', '주차', '가족'], recommendedFor: ['해변과 오션뷰 여행', '가와즈 벚꽃 일정', '렌터카 가족여행'], notRecommendedFor: ['철도역 바로 앞 숙소만 필요한 여행자'], focus: '시모다·가와즈 해변과 교통·주차 조건' },
  gotemba: { label: '고텐바·후지산', terms: ['후지산뷰', '아울렛', '주차', '조식'], recommendedFor: ['후지산 전망 여행', '고텐바 아울렛', '렌터카 가족여행'], notRecommendedFor: ['바닷가 온천 료칸을 우선하는 여행자'], focus: '후지산 전망과 고텐바 아울렛·주차 조건' },
  shizuoka: { label: '시즈오카역', terms: ['역세권', '조식', '주차', '체크인'], recommendedFor: ['시즈오카역 중심 일정', '출장과 짧은 숙박', '철도 자유여행'], notRecommendedFor: ['온천 료칸 부대시설이 필요한 여행자'], focus: '시즈오카역 접근성과 조식·주차·체크인 조건' },
  hamamatsu: { label: '하마마쓰', terms: ['역근처', '조식', '주차', '가성비'], recommendedFor: ['하마마쓰 관광', '출장 숙박', '철도·렌터카 여행'], notRecommendedFor: ['이즈반도 관광이 중심인 여행자'], focus: '하마마쓰역과 관광지·조식·주차 조건' },
  all: { label: '시즈오카현', terms: ['위치', '객실', '조식', '예약조건'], recommendedFor: ['시즈오카 자유여행', '호텔·료칸 비교', '가족·커플 여행'], notRecommendedFor: ['조건 확인 없이 최저가만 찾는 여행자'], focus: '위치와 객실·교통·식사 조건' },
};

export function getShizuokaSearchIntent(hotel: Hotel) {
  if (!hotel.slug.startsWith('shizuoka-')) return undefined;
  const profile = pickProfile(hotel); const name = hotel.hotelName.trim(); const title = `${name} ${profile.label} 후기 모음 ${profile.terms.join(' ')}`;
  return { title, seoTitle: `${title} | 예약 전 FAQ`, metaDescription: `${name} 후기를 ${profile.focus} 중심으로 정리했습니다. 체크인과 식사, 교통 및 예약 조건을 예약 전에 확인하세요.`, intentChips: profile.terms, faqs: makeFaqs(name, profile), recommendedFor: profile.recommendedFor, notRecommendedFor: profile.notRecommendedFor };
}
function pickProfile(hotel: Hotel) { const text = [hotel.hotelName, hotel.address, hotel.region, hotel.analysis?.summary].filter(Boolean).join(' '); if (/아타미|Atami|熱海/i.test(text)) return profiles.atami; if (/시모다|가와즈|Shimoda|Kawazu|下田|河津/i.test(text)) return profiles.shimoda; if (/고텐바|후지산|후지노미야|Gotemba|Fujinomiya|御殿場|富士宮/i.test(text)) return profiles.gotemba; if (/이즈|이토|슈젠지|도가시마|토이|Izu|Ito|Shuzenji|Dogashima|伊豆|伊東|修善寺|堂ヶ島/i.test(text)) return profiles.izu; if (/하마마쓰|Hamamatsu|浜松/i.test(text)) return profiles.hamamatsu; if (/시즈오카역|Shizuoka Station|静岡駅/i.test(text)) return profiles.shizuoka; return profiles.all; }
function makeFaqs(name: string, profile: Profile) { return [
  { category: '위치', question: `${name} 위치는 ${profile.label} 여행 동선에 맞나요?`, answer: `${profile.focus}을 먼저 확인하세요. 이즈반도와 온천 지역은 지도상 거리보다 철도·버스·송영의 실제 이동 시간이 중요할 수 있습니다.` },
  { category: '체크인', question: `${name} 체크인 전에 무엇을 확인해야 하나요?`, answer: '프런트 운영 시간과 짐 보관, 늦은 도착 가능 여부를 확인하세요. 료칸은 석식 시간 때문에 체크인 마감이 빠를 수 있습니다.' },
  { category: '조식·식사', question: `${name} 조식이나 석식 포함 예약이 유리할까요?`, answer: '역 주변은 외부 식당 선택지가 있지만 온천·해변 지역은 식사 포함 조건이 편리할 수 있습니다. 메뉴와 시작 시간, 요금 차이를 함께 비교하세요.' },
  { category: '교통·주차', question: `${name} 교통편과 주차는 무엇을 확인해야 하나요?`, answer: '철도와 렌터카 중 실제 일정에 맞는 이동 수단을 기준으로 보세요. 무료 주차, 역 송영 예약과 관광지까지 이동 시간도 확인하는 편이 좋습니다.' },
  { category: '예약', question: `${name} 객실과 예약 조건은 무엇을 비교해야 하나요?`, answer: '침대 구성과 금연 여부, 객실 전망, 온천 이용 조건, 취소 기한과 추가 요금은 객실별로 다를 수 있습니다. 결제 전 아고다 최신 조건을 다시 확인하세요.' },
]; }
