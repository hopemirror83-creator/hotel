import type { Hotel } from './hotels';

type Profile = { label: string; terms: string[]; recommendedFor: string[]; notRecommendedFor: string[]; focus: string };

const profiles: Record<string, Profile> = {
  takayama: { label: '다카야마', terms: ['역근처', '조식', '주차', '관광'], recommendedFor: ['다카야마 구시가지 여행', '히다 지역 관광', '철도·버스 자유여행'], notRecommendedFor: ['온천 료칸의 석식과 노천탕만 우선하는 여행자'], focus: '다카야마역과 구시가지·아침시장 이동 조건' },
  shirakawa: { label: '시라카와고', terms: ['버스', '주차', '가족', '겨울'], recommendedFor: ['시라카와고 관광', '렌터카 가족여행', '설경 여행'], notRecommendedFor: ['늦은 밤 도심 상권이 필요한 여행자'], focus: '시라카와고 버스와 렌터카·겨울 이동 조건' },
  gero: { label: '게로온천', terms: ['온천', '노천탕', '석식', '송영'], recommendedFor: ['온천 휴식', '료칸 식사', '커플·가족 여행'], notRecommendedFor: ['최저가 숙박과 늦은 체크인만 우선하는 여행자'], focus: '게로역 접근성과 온천·석식·송영 조건' },
  okuhida: { label: '오쿠히다·히라유', terms: ['온천', '교통', '석식', '전망'], recommendedFor: ['오쿠히다 온천 여행', '가미코치 이동', '산악 풍경과 노천탕'], notRecommendedFor: ['도심 쇼핑과 편의시설을 우선하는 여행자'], focus: '히라유·신호타카 교통과 온천·식사 조건' },
  gifuStation: { label: '기후역', terms: ['역세권', '조식', '주차', '체크인'], recommendedFor: ['기후역 중심 일정', '출장과 짧은 숙박', '나고야 연계 여행'], notRecommendedFor: ['전통 온천 료칸만 원하는 여행자'], focus: 'JR·메이테츠 기후역 접근성과 조식·주차 조건' },
  magome: { label: '마고메·나카쓰가와', terms: ['교통', '관광', '조식', '주차'], recommendedFor: ['나카센도 트레킹', '마고메 관광', '렌터카 여행'], notRecommendedFor: ['대형 리조트 부대시설이 필요한 여행자'], focus: '마고메와 나카쓰가와역·나카센도 이동 조건' },
  gifuAll: { label: '기후현', terms: ['위치', '객실', '조식', '예약조건'], recommendedFor: ['기후 자유여행', '호텔·료칸 비교', '가족·커플 여행'], notRecommendedFor: ['조건 확인 없이 최저가만 찾는 여행자'], focus: '위치와 객실·교통·식사 조건' },
};

export function getGifuSearchIntent(hotel: Hotel) {
  if (!hotel.slug.startsWith('gifu-')) return undefined;
  const profile = pickProfile(hotel);
  const name = hotel.hotelName.trim();
  const title = `${name} ${profile.label} 후기 모음 ${profile.terms.join(' ')}`;
  return { title, seoTitle: `${title} | 예약 전 FAQ`, metaDescription: `${name} 후기를 ${profile.focus} 중심으로 정리했습니다. 체크인과 식사, 교통 및 예약 조건을 예약 전에 확인하세요.`, intentChips: profile.terms, faqs: makeFaqs(name, profile), recommendedFor: profile.recommendedFor, notRecommendedFor: profile.notRecommendedFor };
}

function pickProfile(hotel: Hotel) {
  const text = [hotel.hotelName, hotel.address, hotel.region, hotel.analysis?.summary].filter(Boolean).join(' ');
  if (/시라카와|Shirakawa|白川/i.test(text)) return profiles.shirakawa;
  if (/게로|Gero|下呂/i.test(text)) return profiles.gero;
  if (/오쿠히다|히라유|신호타카|Okuhida|Hirayu|Shin.?Hotaka|奥飛騨|平湯|新穂高/i.test(text)) return profiles.okuhida;
  if (/마고메|나카쓰가와|에나|Magome|Nakatsugawa|Ena|馬籠|中津川|恵那/i.test(text)) return profiles.magome;
  if (/다카야마|타카야마|히다|Takayama|Hida|高山|飛騨/i.test(text)) return profiles.takayama;
  if (/기후역|Gifu Station|岐阜駅|메이테츠|Meitetsu/i.test(text)) return profiles.gifuStation;
  return profiles.gifuAll;
}

function makeFaqs(name: string, profile: Profile) {
  return [
    { category: '위치', question: `${name} 위치는 ${profile.label} 여행 동선에 맞나요?`, answer: `${profile.focus}을 먼저 확인하세요. 지도상 거리보다 역 출구, 버스 정류장, 관광지까지의 실제 이동 시간이 중요할 수 있습니다.` },
    { category: '체크인', question: `${name} 체크인 전에 무엇을 확인해야 하나요?`, answer: '프런트 운영 시간과 짐 보관, 늦은 도착 가능 여부를 확인하세요. 료칸과 산간 숙소는 석식 시간 때문에 체크인 마감이 빠를 수 있습니다.' },
    { category: '조식·식사', question: `${name} 조식이나 석식 포함 예약이 유리할까요?`, answer: '도심은 외부 식당 선택지가 있지만 온천·산간 지역은 식사 포함 조건이 편리할 수 있습니다. 메뉴와 시작 시간, 요금 차이를 함께 비교하세요.' },
    { category: '교통·주차', question: `${name} 교통편과 주차는 무엇을 확인해야 하나요?`, answer: '철도·버스와 렌터카 중 일정에 맞는 이동 수단을 기준으로 보세요. 무료 주차, 송영 예약, 겨울철 도로 조건도 숙박 전에 확인하는 편이 좋습니다.' },
    { category: '예약', question: `${name} 객실과 예약 조건은 무엇을 비교해야 하나요?`, answer: '침대 구성과 금연 여부, 객실 전망, 온천 이용 조건, 취소 기한과 추가 요금은 객실별로 다를 수 있습니다. 결제 전 아고다 최신 조건을 다시 확인하세요.' },
  ];
}
