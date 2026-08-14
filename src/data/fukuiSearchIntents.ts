import type { Hotel } from './hotels';

const profiles = {
  station: { label: '후쿠이역', terms: ['역세권', '교통', '조식', '체크인'], recommendedFor: ['JR 중심 일정', '후쿠이 첫 방문', '출장과 짧은 숙박'], notRecommendedFor: ['온천 휴양만 원하는 여행자'] },
  awara: { label: '아와라온천', terms: ['온천', '석식', '셔틀', '노천탕'], recommendedFor: ['온천 료칸 숙박', '식사 포함 휴식', '커플·가족 여행'], notRecommendedFor: ['늦은 밤 도심 상권을 원하는 여행자'] },
  echizen: { label: '에치젠·사바에', terms: ['주차', '가성비', '조식', '관광동선'], recommendedFor: ['렌터카 여행', '에치젠·사바에 관광', '가성비 숙박'], notRecommendedFor: ['후쿠이역 도보권만 원하는 여행자'] },
  tsuruga: { label: '쓰루가', terms: ['역', '항구', '체크인', '교통'], recommendedFor: ['쓰루가역 중심 이동', '항구·해안 여행', '이른 출발 일정'], notRecommendedFor: ['아와라온천을 중심으로 보는 여행자'] },
  katsuyama: { label: '카쓰야마·에이헤이지', terms: ['공룡박물관', '사찰', '주차', '가족'], recommendedFor: ['공룡박물관 가족 여행', '에이헤이지 방문', '렌터카 일정'], notRecommendedFor: ['도심 야간 일정이 중요한 여행자'] },
  coast: { label: '미쿠니·도진보', terms: ['바다전망', '주차', '식사', '객실'], recommendedFor: ['도진보·미쿠니 여행', '해안 풍경', '해산물 식도락'], notRecommendedFor: ['철도만으로 촬촬히 이동하는 여행자'] },
  fukui: { label: '후쿠이현', terms: ['위치', '객실', '조식', '예약조건'], recommendedFor: ['후쿠이 자유여행', '호텔 비교', '가족·커플 여행'], notRecommendedFor: ['조건 확인 없이 최저가만 찾는 여행자'] },
};

export function getFukuiSearchIntent(hotel: Hotel) {
  if (!hotel.slug.startsWith('fukui-')) return undefined;
  const profile = pickProfile(hotel);
  const name = hotel.hotelName.trim();
  const title = `${name} ${profile.label} 후기 모음 ${profile.terms.join(' ')}`;
  return { title, seoTitle: `${title} | 예약 전 FAQ`, metaDescription: `${name} 후기를 ${profile.label} 위치와 객실, 식사, 교통 및 예약 조건 중심으로 정리했습니다.`, intentChips: profile.terms, faqs: makeFaqs(name, profile.label), recommendedFor: profile.recommendedFor, notRecommendedFor: profile.notRecommendedFor };
}

function pickProfile(hotel: Hotel) {
  const text = [hotel.hotelName, hotel.address, hotel.analysis?.summary].filter(Boolean).join(' ');
  if (/아와라|Awara|아와라온센/i.test(text)) return profiles.awara;
  if (/쓰루가|Tsuruga|돈구하/i.test(text)) return profiles.tsuruga;
  if (/카쓰야마|Katsuyama|에이헤이지|Eiheiji|오노|Ono/i.test(text)) return profiles.katsuyama;
  if (/미쿠니|Mikuni|도진보|Tojinbo|다카하마|Takahama|오바마|Obama/i.test(text)) return profiles.coast;
  if (/에치젠|Echizen|사바에|Sabae|다케후|Takefu/i.test(text)) return profiles.echizen;
  if (/후쿠이역|Fukui Station|에키마에|Ekimae/i.test(text)) return profiles.station;
  return profiles.fukui;
}

function makeFaqs(name: string, label: string) {
  return [
    { category: '위치', question: `${name} 위치는 ${label} 여행 동선에 맞나요?`, answer: '가까운 역과 버스 정류장, 관광지까지의 실제 이동 시간을 확인하세요. 후쿠이는 도심과 온천·해안 권역의 이동 방식이 다릅니다.' },
    { category: '체크인', question: `${name} 체크인 전에 무엇을 확인해야 하나요?`, answer: '프런트 운영 시간과 짐 보관, 늦은 도착 가능 여부를 확인하세요. 료칸은 석식 시작 시간 때문에 체크인 마감이 빠를 수 있습니다.' },
    { category: '조식·식사', question: `${name} 조식이나 석식 포함 예약이 유리할까요?`, answer: '도심 호텔은 주변 식당을 이용하기 쉽지만, 온천과 해안 지역은 식사 포함 조건이 편리할 수 있습니다. 메뉴와 시작 시간, 요금 차이를 비교하세요.' },
    { category: '교통·주차', question: `${name} 교통편과 주차는 무엇을 확인해야 하나요?`, answer: '렌터카 일정이면 무료 주차와 만차 시 대체 주차장을 확인하세요. 철도 이용 시에는 역까지의 실제 도보 시간과 셔틀 예약 여부를 보는 편이 좋습니다.' },
    { category: '예약', question: `${name} 객실과 예약 조건은 무엇을 비교해야 하나요?`, answer: '침대 구성과 전망, 금연 여부, 취소 기한과 추가 요금은 객실별로 다를 수 있습니다. 결제 전 아고다 최신 조건을 다시 확인하세요.' },
  ];
}
