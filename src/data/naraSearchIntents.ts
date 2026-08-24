import type { Hotel } from './hotels';

const profiles = {
  station: { label: '나라역·도심', terms: ['역근처', '조식', '체크인', '짐보관'], focus: 'JR·긴테쓰 나라역 접근과 조식, 체크인·짐 보관 조건' },
  park: { label: '나라공원·도다이지', terms: ['도보관광', '가족여행', '조식', '주차'], focus: '나라공원과 도다이지 도보 동선, 가족 객실·조식·주차 조건' },
  naramachi: { label: '나라마치·사루사와', terms: ['전통숙소', '커플여행', '방음', '체크인'], focus: '나라마치 산책과 사루사와 연못 이동, 전통 객실·방음·체크인 조건' },
  south: { label: '가시하라·아스카', terms: ['역근처', '렌터카', '주차', '조식'], focus: '가시하라·아스카 유적 이동과 철도·렌터카, 조식·주차 조건' },
  yoshino: { label: '요시노·나라 남부', terms: ['벚꽃', '온천', '석식', '송영'], focus: '요시노 산길 이동과 벚꽃철 교통, 온천·석식·송영 조건' },
  west: { label: '이코마·호류지', terms: ['오사카접근', '가족여행', '주차', '교통'], focus: '이코마·호류지와 오사카 이동, 가족 객실·교통·주차 조건' },
  all: { label: '나라현', terms: ['위치', '객실', '교통', '예약조건'], focus: '나라현 위치와 객실·교통·식사·예약 조건' }
};

export function getNaraSearchIntent(hotel: Hotel) { if (!hotel.slug.startsWith('nara-')) return; const profile = pickProfile(hotel); const name = hotel.hotelName.trim(); const title = `${name} ${profile.label} 후기 모음 ${profile.terms.join(' ')}`; return { title, seoTitle: `${title} | 예약 전 FAQ`, metaDescription: `${name} 후기를 ${profile.focus} 중심으로 정리했습니다. 예약 전에 최신 조건을 확인하세요.`, intentChips: profile.terms, recommendedFor: ['나라 자유여행', '교토·오사카 연계 여행', '철도·렌터카 여행'], notRecommendedFor: ['교통과 식사 조건을 확인하지 않는 여행자'], faqs: makeFaq(name, profile) }; }
function pickProfile(hotel: Hotel) { const value = [hotel.hotelName, hotel.address, hotel.analysis?.summary].filter(Boolean).join(' '); if (/가시하라|Kashihara|橿原|아스카|Asuka|明日香|사쿠라이|Sakurai/i.test(value)) return profiles.south; if (/요시노|Yoshino|吉野|노세가와|Nosegawa|도쓰가와|Totsukawa/i.test(value)) return profiles.yoshino; if (/이코마|Ikoma|生駒|호류지|Horyuji|法隆寺|이카루가|Ikaruga|오지|Oji/i.test(value)) return profiles.west; if (/나라마치|Naramachi|사루사와|Sarusawa/i.test(value)) return profiles.naramachi; if (/나라공원|Nara Park|도다이지|Todaiji|가스가|Kasuga|와카쿠사|Wakakusa/i.test(value)) return profiles.park; if (/나라|Nara|奈良/i.test(value)) return profiles.station; return profiles.all; }
function makeFaq(name: string, profile: any) { return [{ category: '위치', question: `${name} 위치는 ${profile.label} 일정에 맞나요?`, answer: `${profile.focus}을 먼저 확인하세요. 나라현 외곽은 열차와 버스 배차 간격도 중요합니다.` }, { category: '체크인', question: `${name} 체크인 전 무엇을 확인해야 하나요?`, answer: '프런트 운영 시간과 짐 보관, 늦은 도착 가능 여부를 확인하세요. 료칸은 석식 마감 시간이 빠를 수 있습니다.' }, { category: '조식·식사', question: `${name} 조식과 식사 조건은 어떻게 확인할까요?`, answer: '식사 포함 여부와 제공 시간, 알레르기 대응 가능 여부를 예약 조건에서 비교하세요.' }, { category: '교통·주차', question: `${name} 교통과 주차는 무엇을 볼까요?`, answer: '역과 관광지 이동, 버스·송영 시간을 확인하세요. 렌터카라면 무료 주차 여부와 진입 동선도 중요합니다.' }, { category: '예약', question: `${name} 객실 조건은 무엇을 비교할까요?`, answer: '침대 구성과 금연, 객실 욕실, 식사 포함 여부와 취소 기한을 결제 전에 확인하세요.' }]; }
