import type { Hotel } from './hotels';

const profiles = {
  city: { label: '와카야마역·도심', terms: ['역근처', '조식', '주차', '체크인'], focus: '와카야마역과 와카야마성 이동, 조식·주차·체크인 조건' },
  shirahama: { label: '시라하마 온천·해변', terms: ['오션뷰', '온천', '조식', '가족여행'], focus: '시라하마 해변과 온천, 객실 전망·조식·가족 객실 조건' },
  koya: { label: '고야산·슈쿠보', terms: ['사찰체험', '정진요리', '공용욕실', '체크인'], focus: '고야산 이동과 사찰 체험, 정진요리·공용 욕실·체크인 조건' },
  kumano: { label: '구마노고도·다나베', terms: ['트레킹', '온천', '석식', '송영'], focus: '구마노고도 출발점과 버스, 온천·석식·송영 조건' },
  nachi: { label: '나치카쓰우라·신구', terms: ['나치폭포', '온천', '교통', '조식'], focus: '나치폭포와 신구 이동, 온천·대중교통·조식 조건' },
  coast: { label: '구시모토·남부해안', terms: ['오션뷰', '렌터카', '주차', '가족여행'], focus: '구시모토·스사미 해안 이동과 전망, 렌터카·주차·가족 객실 조건' },
  all: { label: '와카야마현', terms: ['위치', '객실', '교통', '예약조건'], focus: '와카야마현 위치와 객실·교통·식사·예약 조건' }
};

export function getWakayamaSearchIntent(hotel: Hotel) { if (!hotel.slug.startsWith('wakayama-')) return; const profile = pickProfile(hotel); const name = hotel.hotelName.trim(); const title = `${name} ${profile.label} 후기 모음 ${profile.terms.join(' ')}`; return { title, seoTitle: `${title} | 예약 전 FAQ`, metaDescription: `${name} 후기를 ${profile.focus} 중심으로 정리했습니다. 예약 전에 최신 조건을 확인하세요.`, intentChips: profile.terms, recommendedFor: ['와카야마 자유여행', '오사카 연계 여행', '철도·렌터카 여행'], notRecommendedFor: ['교통과 식사 조건을 확인하지 않는 여행자'], faqs: makeFaq(name, profile) }; }
function pickProfile(hotel: Hotel) { const value = [hotel.hotelName, hotel.address, hotel.analysis?.summary].filter(Boolean).join(' '); if (/시라하마|Shirahama|白浜/i.test(value)) return profiles.shirahama; if (/고야산|Koyasan|高野山|슈쿠보|Shukubo/i.test(value)) return profiles.koya; if (/구마노|Kumano|熊野|다나베|Tanabe|혼구|Hongu|유노미네|Yunomine|가와유|Kawayu/i.test(value)) return profiles.kumano; if (/나치|Nachi|那智|가쓰우라|Katsuura|勝浦|신구|Shingu|新宮/i.test(value)) return profiles.nachi; if (/구시모토|Kushimoto|串本|스사미|Susami|すさみ/i.test(value)) return profiles.coast; if (/와카야마|Wakayama|和歌山/i.test(value)) return profiles.city; return profiles.all; }
function makeFaq(name: string, profile: any) { return [{ category: '위치', question: `${name} 위치는 ${profile.label} 일정에 맞나요?`, answer: `${profile.focus}을 먼저 확인하세요. 와카야마 외곽은 열차와 버스 배차 간격도 중요합니다.` }, { category: '체크인', question: `${name} 체크인 전 무엇을 확인해야 하나요?`, answer: '프런트 운영 시간과 짐 보관, 늦은 도착 가능 여부를 확인하세요. 슈쿠보와 료칸은 석식 마감이 빠를 수 있습니다.' }, { category: '식사·온천', question: `${name} 식사와 온천 조건은 어떻게 확인할까요?`, answer: '조식·석식 포함 여부와 제공 시간, 대욕장 운영 시간과 객실 욕실 유무를 예약 조건에서 비교하세요.' }, { category: '교통·주차', question: `${name} 교통과 주차는 무엇을 볼까요?`, answer: '역과 관광지 이동, 버스·셔틀 시간을 확인하세요. 렌터카라면 무료 주차 여부와 진입 동선도 중요합니다.' }, { category: '예약', question: `${name} 객실 조건은 무엇을 비교할까요?`, answer: '침대 구성과 금연, 바다 전망, 식사 포함 여부와 취소 기한을 결제 전에 확인하세요.' }]; }
