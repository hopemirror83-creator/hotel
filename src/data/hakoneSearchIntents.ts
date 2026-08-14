import type { Hotel } from './hotels';

const profiles = {
  yumoto: { label: '하코네 유모토', terms: ['온천', '교통', '석식', '체크인'], recommendedFor: ['도쿄 근교 온천여행', '대중교통 중심 일정', '료칸 숙박'], notRecommendedFor: ['늦은 밤 도심 상권을 원하는 여행자'] },
  gora: { label: '하코네 고라', terms: ['노천탕', '케이블카', '조식', '객실'], recommendedFor: ['고라공원·미술관 일정', '온천과 휴식 중심 여행', '커플여행'], notRecommendedFor: ['평지 이동만 원하는 여행자'] },
  sengokuhara: { label: '센고쿠하라', terms: ['미술관', '버스', '온천', '가족'], recommendedFor: ['미술관과 자연 관광', '렌터카 여행', '가족·커플 숙박'], notRecommendedFor: ['하코네유모토역 도보권을 원하는 여행자'] },
  lake: { label: '아시노코', terms: ['호수전망', '유람선', '주차', '조식'], recommendedFor: ['아시노코·하코네신사 관광', '호수 전망 숙박', '렌터카 여행'], notRecommendedFor: ['늦은 시간 식당 선택이 중요한 여행자'] },
  odawara: { label: '오다와라', terms: ['역세권', '체크인', '조식', '가성비'], recommendedFor: ['신칸센·철도 이동', '하코네 전후 1박', '출장과 짧은 숙박'], notRecommendedFor: ['숙소 안 온천 휴양만 원하는 여행자'] },
  hakone: { label: '하코네', terms: ['온천', '위치', '식사', '예약조건'], recommendedFor: ['하코네 온천여행', '료칸과 호텔 비교', '도쿄 근교 여행'], notRecommendedFor: ['도심형 야간 관광을 원하는 여행자'] }
};

export function getHakoneSearchIntent(hotel: Hotel) {
  if (!hotel.slug.startsWith('hakone-')) return undefined;
  const profile = pickProfile(hotel);
  const name = hotel.hotelName.trim();
  const title = `${name} ${profile.label} 후기 모음 ${profile.terms.join(' ')}`;
  return { title, seoTitle: `${title} | 예약 전 FAQ`, metaDescription: `${name} 후기를 ${profile.label} 위치와 온천, 식사, 교통 및 예약 조건 중심으로 정리했습니다.`, intentChips: profile.terms, faqs: buildFaqs(name, profile.label), recommendedFor: profile.recommendedFor, notRecommendedFor: profile.notRecommendedFor };
}

function pickProfile(hotel: Hotel) {
  const text = [hotel.hotelName, hotel.address, hotel.analysis?.summary].filter(Boolean).join(' ');
  if (/유모토|Yumoto|湯本|토노사와|Tonosawa/i.test(text)) return profiles.yumoto;
  if (/고라|Gora|強羅|미야노시타|Miyanoshita|고와쿠다니|Kowakudani/i.test(text)) return profiles.gora;
  if (/센고쿠하라|Sengokuhara|仙石原/i.test(text)) return profiles.sengokuhara;
  if (/아시노코|Ashinoko|芦ノ湖|모토하코네|Moto.?Hakone|하코네마치/i.test(text)) return profiles.lake;
  if (/오다와라|Odawara|小田原|가모노미야|Kamonomiya/i.test(text)) return profiles.odawara;
  return profiles.hakone;
}

function buildFaqs(name: string, label: string) {
  return [
    { category: '위치', question: `${name} 위치는 하코네 여행 동선에 맞나요?`, answer: `${label} 일정이라면 가까운 역이나 버스 정류장, 관광지까지의 실제 이동 시간을 확인하세요. 하코네는 산악 지형이라 지도상 거리보다 이동 시간이 길어질 수 있습니다.` },
    { category: '온천', question: `${name} 온천 이용 전에 무엇을 확인해야 하나요?`, answer: '대욕장과 노천탕 운영 시간, 객실 전용탕 여부, 문신 관련 이용 규정과 입욕세 포함 여부를 확인하세요. 시설은 객실 유형과 운영 일정에 따라 달라질 수 있습니다.' },
    { category: '식사', question: `${name} 조식·석식 포함 예약이 유리할까요?`, answer: '료칸은 주변 식당이 일찍 문을 닫는 경우가 있어 식사 포함 조건이 편리할 수 있습니다. 메뉴 구성, 식사 시작 시간, 알레르기 대응과 포함 요금 차이를 예약 전에 비교하세요.' },
    { category: '교통', question: `${name} 체크인 전 교통편은 무엇을 봐야 하나요?`, answer: '열차·버스 막차와 호텔 셔틀 예약 여부를 확인하세요. 늦은 도착이라면 프런트 운영 시간과 석식 마감, 짐 보관 가능 여부도 함께 문의하는 편이 안전합니다.' },
    { category: '예약', question: `${name} 객실과 예약 조건은 무엇을 비교해야 하나요?`, answer: '침대 또는 다다미 구성, 객실 내 욕실·온천 여부, 금연 조건, 취소 기한과 추가 요금은 객실별로 다를 수 있습니다. 결제 전 아고다 최신 조건을 다시 확인하세요.' }
  ];
}
