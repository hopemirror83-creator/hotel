import type { Hotel } from './hotels';

type Profile = {
  label: string;
  terms: string[];
  recommendedFor: string[];
  notRecommendedFor: string[];
  focus: string;
};

const profiles: Record<string, Profile> = {
  station: { label: '니가타역·반다이', terms: ['역세권', '교통', '조식', '체크인'], recommendedFor: ['JR 중심 일정', '반다이·도심 관광', '출장과 짧은 숙박'], notRecommendedFor: ['온천과 자연 속 휴양만 원하는 여행자'], focus: '니가타역과 반다이시티 접근성' },
  yuzawa: { label: '에치고유자와·나에바', terms: ['스키장', '온천', '셔틀', '가족'], recommendedFor: ['스키·스노보드 여행', '온천과 설경', '가족 겨울여행'], notRecommendedFor: ['니가타 도심 관광이 중심인 여행자'], focus: '스키장 이동과 온천·셔틀 조건' },
  myoko: { label: '묘코·아카쿠라', terms: ['스키', '온천', '석식', '교통'], recommendedFor: ['묘코 스키 여행', '아카쿠라 온천', '장기 설원 체류'], notRecommendedFor: ['철도역 바로 앞 숙소만 원하는 여행자'], focus: '슬로프 접근성과 식사·온천 조건' },
  nagaoka: { label: '나가오카', terms: ['역근처', '주차', '조식', '출장'], recommendedFor: ['나가오카역 중심 일정', '출장 숙박', '렌터카 여행'], notRecommendedFor: ['리조트 부대시설을 우선하는 여행자'], focus: '나가오카역과 주차·출장 편의' },
  sado: { label: '사도섬', terms: ['항구', '렌터카', '식사', '전망'], recommendedFor: ['사도섬 일주', '해안 풍경과 식도락', '렌터카 여행'], notRecommendedFor: ['짧은 환승 일정이나 도심 쇼핑 여행자'], focus: '항구 이동과 섬 내 교통·식사 조건' },
  onsen: { label: '이와무로·쓰키오카온천', terms: ['온천', '노천탕', '석식', '송영'], recommendedFor: ['온천 료칸 숙박', '가이세키·식사 포함 휴식', '커플·가족 여행'], notRecommendedFor: ['늦은 밤 도심 상권이 필요한 여행자'], focus: '대욕장과 식사·송영 조건' },
  niigata: { label: '니가타현', terms: ['위치', '객실', '조식', '예약조건'], recommendedFor: ['니가타 자유여행', '호텔 비교', '가족·커플 여행'], notRecommendedFor: ['조건 확인 없이 최저가만 찾는 여행자'], focus: '위치와 객실·교통 조건' },
};

export function getNiigataSearchIntent(hotel: Hotel) {
  if (!hotel.slug.startsWith('niigata-')) return undefined;
  const profile = pickProfile(hotel);
  const name = hotel.hotelName.trim();
  const title = `${name} ${profile.label} 후기 모음 ${profile.terms.join(' ')}`;
  return {
    title,
    seoTitle: `${title} | 예약 전 FAQ`,
    metaDescription: `${name} 후기를 ${profile.focus} 중심으로 정리했습니다. 체크인과 식사, 교통 및 예약 조건을 예약 전에 확인하세요.`,
    intentChips: profile.terms,
    faqs: makeFaqs(name, profile),
    recommendedFor: profile.recommendedFor,
    notRecommendedFor: profile.notRecommendedFor,
  };
}

function pickProfile(hotel: Hotel) {
  const text = [hotel.hotelName, hotel.address, hotel.region, hotel.analysis?.summary].filter(Boolean).join(' ');
  if (/에치고유자와|유자와|나에바|Echigo.?Yuzawa|Yuzawa|Naeba|湯沢|苗場/i.test(text)) return profiles.yuzawa;
  if (/묘코|아카쿠라|Myoko|Akakura|妙高|赤倉/i.test(text)) return profiles.myoko;
  if (/나가오카|Nagaoka|長岡/i.test(text)) return profiles.nagaoka;
  if (/사도|료쓰|오기|Sado|Ryotsu|Ogi|佐渡|両津/i.test(text)) return profiles.sado;
  if (/이와무로|쓰키오카|츠키오카|Iwamuro|Tsukioka|岩室|月岡/i.test(text)) return profiles.onsen;
  if (/니가타역|반다이|Niigata Station|Bandai|에키마에|万代|新潟駅/i.test(text)) return profiles.station;
  return profiles.niigata;
}

function makeFaqs(name: string, profile: Profile) {
  return [
    { category: '위치', question: `${name} 위치는 ${profile.label} 여행 동선에 맞나요?`, answer: `${profile.focus}을 먼저 확인하세요. 지도상의 거리보다 역 출구, 버스 정류장, 항구나 스키장까지의 실제 이동 시간이 더 중요할 수 있습니다.` },
    { category: '체크인', question: `${name} 체크인 전에 무엇을 확인해야 하나요?`, answer: '프런트 운영 시간과 짐 보관, 늦은 도착 가능 여부를 확인하세요. 료칸이나 산간 숙소는 식사 시작 시간 때문에 체크인 마감이 빠를 수 있습니다.' },
    { category: '조식·식사', question: `${name} 조식이나 석식 포함 예약이 유리할까요?`, answer: '역 주변은 외부 식당을 이용하기 쉽지만 온천·스키·섬 지역은 식사 포함 조건이 편리할 수 있습니다. 메뉴와 시작 시간, 요금 차이를 함께 비교하세요.' },
    { category: '교통·주차', question: `${name} 교통편과 주차는 무엇을 확인해야 하나요?`, answer: '철도와 렌터카 중 실제 일정에 맞는 이동 수단을 기준으로 보세요. 무료 주차, 송영 예약, 겨울철 도로와 항구·스키장 이동 조건은 숙박 전에 확인하는 편이 좋습니다.' },
    { category: '예약', question: `${name} 객실과 예약 조건은 무엇을 비교해야 하나요?`, answer: '침대 구성과 금연 여부, 객실 전망, 온천 이용 조건, 취소 기한과 추가 요금은 객실별로 다를 수 있습니다. 결제 전 아고다 최신 조건을 다시 확인하세요.' },
  ];
}
