import type { Hotel } from './hotels';

const profiles = {
  city: { label: '아오모리역', terms: ['역근처', '조식', '주차', '체크인'], focus: '아오모리역과 신아오모리역 이동, 조식·주차 조건' },
  hirosaki: { label: '히로사키', terms: ['벚꽃여행', '조식', '주차', '체크인'], focus: '히로사키성과 역 이동, 벚꽃철 교통·주차 조건' },
  hachinohe: { label: '하치노헤', terms: ['역근처', '출장', '조식', '주차'], focus: '신칸센역과 혼하치노헤 도심 이동, 출장·조식 조건' },
  towada: { label: '도와다호·오이라세', terms: ['온천', '송영', '석식', '교통'], focus: '도와다호와 오이라세 이동, 온천·송영·식사 조건' },
  onsen: { label: '아오모리 온천', terms: ['온천료칸', '대욕장', '석식', '송영'], focus: '온천 운영 시간과 석식·송영·객실 조건' },
  shimokita: { label: '무쓰·시모키타', terms: ['렌터카', '주차', '조식', '관광'], focus: '시모키타반도 렌터카 동선과 주차·식사 조건' },
  all: { label: '아오모리현', terms: ['위치', '객실', '교통', '예약조건'], focus: '아오모리 위치와 객실·교통·식사·예약 조건' },
};

export function getAomoriSearchIntent(hotel: Hotel) { if (!hotel.slug.startsWith('aomori-')) return; const profile = pick(hotel); const name = hotel.hotelName.trim(); const title = `${name} ${profile.label} 후기 모음 ${profile.terms.join(' ')}`; return { title, seoTitle: `${title} | 예약 전 FAQ`, metaDescription: `${name} 후기를 ${profile.focus} 중심으로 정리했습니다. 예약 전에 최신 조건을 확인하세요.`, intentChips: profile.terms, recommendedFor: ['아오모리 자유여행', '온천·자연 관광', '철도·렌터카 여행'], notRecommendedFor: ['교통과 식사 조건을 확인하지 않는 여행자'], faqs: faq(name, profile) }; }
function pick(hotel: Hotel) { const source = [hotel.hotelName, hotel.address, hotel.analysis?.summary].filter(Boolean).join(' '); if (/히로사키|Hirosaki|弘前/i.test(source)) return profiles.hirosaki; if (/하치노헤|Hachinohe|八戸|혼하치노헤/i.test(source)) return profiles.hachinohe; if (/도와다|Towada|十和田|오이라세|Oirase|奥入瀬/i.test(source)) return profiles.towada; if (/아사무시|Asamushi|浅虫|핫코다|Hakkoda|스카유|Sukayu|온천|Onsen|료칸|Ryokan/i.test(source)) return profiles.onsen; if (/무쓰|Mutsu|시모키타|Shimokita/i.test(source)) return profiles.shimokita; if (/아오모리|Aomori|青森/i.test(source)) return profiles.city; return profiles.all; }
function faq(name: string, profile: any) { return [{ category: '위치', question: `${name} 위치는 ${profile.label} 일정에 맞나요?`, answer: `${profile.focus}을 먼저 확인하세요. 열차·버스 배차와 실제 이동 시간도 중요합니다.` }, { category: '체크인', question: `${name} 체크인 전 무엇을 확인해야 하나요?`, answer: '프런트 운영 시간과 짐 보관, 늦은 도착 가능 여부를 확인하세요. 료칸은 석식 때문에 마감이 빠를 수 있습니다.' }, { category: '식사', question: `${name} 조식·석식 포함이 유리할까요?`, answer: '온천과 자연 지역은 주변 식당이 적을 수 있습니다. 메뉴와 식사 시간, 요금 차이를 비교하세요.' }, { category: '교통·주차', question: `${name} 교통과 주차는 무엇을 볼까요?`, answer: '역 송영과 셔틀은 사전 예약과 운행 시간을 확인하세요. 렌터카라면 무료 주차와 겨울철 도로 조건도 중요합니다.' }, { category: '예약', question: `${name} 객실 조건은 무엇을 비교할까요?`, answer: '침대 구성과 금연, 객실 욕실, 온천 이용 시간과 취소 기한을 결제 전 확인하세요.' }]; }
