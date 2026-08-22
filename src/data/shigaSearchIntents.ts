import type { Hotel } from './hotels';

const profiles = {
  otsu: { label: '오쓰·교토 접근', terms: ['역근처', '조식', '주차', '체크인'], focus: '오쓰역과 교토 이동, 조식·주차·체크인 조건' },
  biwa: { label: '비와호·오고토 온천', terms: ['레이크뷰', '온천', '조식', '가족여행'], focus: '비와호 전망과 오고토 온천, 식사·가족 객실 조건' },
  hikone: { label: '히코네성·히코네역', terms: ['역근처', '조식', '주차', '가성비'], focus: '히코네역과 히코네성 이동, 조식·주차 조건' },
  south: { label: '구사쓰·모리야마', terms: ['역근처', '출장', '교토이동', '주차'], focus: '구사쓰·모리야마역과 교토 이동, 출장·조식·주차 조건' },
  north: { label: '나가하마·마이바라', terms: ['역근처', '비와호', '온천', '주차'], focus: '나가하마·마이바라역과 비와호 북부 이동, 온천·주차 조건' },
  east: { label: '오미하치만·히가시오미', terms: ['하치만보리', '렌터카', '주차', '가족여행'], focus: '하치만보리와 시가 동부 이동, 렌터카·주차·가족 객실 조건' },
  outer: { label: '다카시마·고카', terms: ['자연여행', '렌터카', '주차', '식사'], focus: '시가 외곽 자연 관광과 렌터카 이동, 주차·식사 조건' },
  all: { label: '시가현', terms: ['위치', '객실', '교통', '예약조건'], focus: '시가현 위치와 객실·교통·식사·예약 조건' }
};

export function getShigaSearchIntent(hotel: Hotel) { if (!hotel.slug.startsWith('shiga-')) return; const profile = pickProfile(hotel); const name = hotel.hotelName.trim(); const title = `${name} ${profile.label} 후기 모음 ${profile.terms.join(' ')}`; return { title, seoTitle: `${title} | 예약 전 FAQ`, metaDescription: `${name} 후기를 ${profile.focus} 중심으로 정리했습니다. 예약 전에 최신 조건을 확인하세요.`, intentChips: profile.terms, recommendedFor: ['시가·비와호 자유여행', '교토 연계 여행', '철도·렌터카 여행'], notRecommendedFor: ['교통과 식사 조건을 확인하지 않는 여행자'], faqs: makeFaq(name, profile) }; }
function pickProfile(hotel: Hotel) { const value = [hotel.hotelName, hotel.address, hotel.analysis?.summary].filter(Boolean).join(' '); if (/히코네|Hikone|彦根/i.test(value)) return profiles.hikone; if (/나가하마|Nagahama|長浜|마이바라|Maibara|米原/i.test(value)) return profiles.north; if (/구사쓰|Kusatsu|草津|모리야마|Moriyama|守山|릿토|Ritto/i.test(value)) return profiles.south; if (/오미하치만|Omihachiman|近江八幡|요카이치|히가시오미/i.test(value)) return profiles.east; if (/다카시마|Takashima|高島|고카|Koka|甲賀|고난|Konan/i.test(value)) return profiles.outer; if (/비와|Biwa|琵琶湖|오고토|Ogoto/i.test(value)) return profiles.biwa; if (/오쓰|오츠|Otsu|大津|세타|Seta/i.test(value)) return profiles.otsu; return profiles.all; }
function makeFaq(name: string, profile: any) { return [{ category: '위치', question: `${name} 위치는 ${profile.label} 일정에 맞나요?`, answer: `${profile.focus}을 먼저 확인하세요. 비와호 주변은 열차와 버스 배차 간격도 중요합니다.` }, { category: '체크인', question: `${name} 체크인 전 무엇을 확인해야 하나요?`, answer: '프런트 운영 시간과 짐 보관, 늦은 도착 가능 여부를 확인하세요. 온천 숙소는 석식 마감 시간도 빠를 수 있습니다.' }, { category: '조식·온천', question: `${name} 조식과 온천 조건은 어떻게 확인할까요?`, answer: '식사 포함 여부와 제공 시간, 대욕장 운영 시간 및 객실 욕실 유무를 예약 조건에서 비교하세요.' }, { category: '교통·주차', question: `${name} 교통과 주차는 무엇을 볼까요?`, answer: '역과 관광지 이동, 셔틀 시간을 확인하세요. 렌터카라면 무료 주차 여부와 진입 동선도 중요합니다.' }, { category: '예약', question: `${name} 객실 조건은 무엇을 비교할까요?`, answer: '침대 구성과 금연, 호수 전망, 식사 포함 여부와 취소 기한을 결제 전에 확인하세요.' }]; }
