import type { Hotel } from './hotels';

const profiles = {
  sendai: { label: '센다이역', terms: ['위치', '조식', '체크인', '교통'], recommendedFor: ['센다이 도심 관광', '센다이역 철도 이동', '출장과 짧은 숙박'], notRecommendedFor: ['온천 휴양만을 원하는 여행자'] },
  matsushima: { label: '마쓰시마', terms: ['전망', '관광 동선', '조식', '주차'], recommendedFor: ['마쓰시마 관광', '바다 전망과 료칸 숙박', '렌터카 여행'], notRecommendedFor: ['센다이역 도보권 숙소를 찾는 여행자'] },
  onsen: { label: '아키우·사쿠나미', terms: ['온천', '석식', '셔틀', '가족'], recommendedFor: ['온천과 휴식 중심 일정', '식사 포함 료칸 숙박', '가족·커플 여행'], notRecommendedFor: ['도심 야간 이동을 우선하는 여행자'] },
  coast: { label: '미야기 해안', terms: ['주차', '관광', '조식', '가성비'], recommendedFor: ['이시노마키·게센누마 여행', '렌터카 해안 일정', '지역 관광 거점 숙박'], notRecommendedFor: ['센다이 도심만 여행하는 일정'] },
  miyagi: { label: '미야기', terms: ['위치', '체크인', '조식', '가성비'], recommendedFor: ['미야기현 여행', '숙박 조건 비교', '도시와 관광지를 함께 보는 일정'], notRecommendedFor: ['특정 관광지 바로 앞만 찾는 여행자'] }
};

export function getMiyagiSearchIntent(hotel: Hotel) {
  if (!hotel.slug.startsWith('miyagi-')) return undefined;
  const profile = pickProfile(hotel);
  const name = hotel.hotelName.trim();
  const title = `${name} ${profile.label} 후기 모음 ${profile.terms.join(' ')}`;
  return { title, seoTitle: `${title} | 예약 전 FAQ`, metaDescription: `${name} 후기를 ${profile.label} 위치, 교통, 체크인, 조식과 예약 조건 중심으로 정리했습니다.`, intentChips: profile.terms, faqs: buildFaqs(name, profile.label), recommendedFor: profile.recommendedFor, notRecommendedFor: profile.notRecommendedFor };
}

function pickProfile(hotel: Hotel) {
  const text = [hotel.hotelName, hotel.address, hotel.analysis?.summary].filter(Boolean).join(' ');
  if (/마쓰시마|matsushima|松島|시오가마|shiogama/i.test(text)) return profiles.matsushima;
  if (/아키우|akiu|秋保|사쿠나미|sakunami|作並|나루코|naruko|鳴子|자오|zao|蔵王/i.test(text)) return profiles.onsen;
  if (/이시노마키|ishinomaki|게센누마|kesennuma|오나가와|onagawa/i.test(text)) return profiles.coast;
  if (/센다이|sendai/i.test(text)) return profiles.sendai;
  return profiles.miyagi;
}

function buildFaqs(name: string, label: string) {
  return [
    { category: '위치', question: `${name} 위치는 여행 동선에 맞나요?`, answer: `${label} 일정이라면 숙소에서 역, 관광지 또는 온천가까지의 실제 이동 시간을 확인하세요. 미야기현은 센다이 도심과 마쓰시마·해안·온천 권역의 거리가 달라 숙박 목적에 맞는 위치 선택이 중요합니다.` },
    { category: '교통', question: `${name} 예약 전 교통편은 무엇을 확인해야 하나요?`, answer: '가까운 역과 버스 정류장까지의 도보 거리, 막차 시간과 호텔 셔틀 운행 여부를 확인하세요. 렌터카 일정이라면 주차 요금과 사전 예약 조건도 함께 비교하는 편이 좋습니다.' },
    { category: '체크인', question: `${name} 체크인 전에 확인할 점은 무엇인가요?`, answer: '늦은 도착이라면 프런트 운영 시간과 짐 보관 여부를 확인하세요. 온천 료칸은 석식 제공 마감 시간이 체크인 시간보다 빠를 수 있어 식사 포함 예약이라면 도착 조건을 꼭 살펴봐야 합니다.' },
    { category: '조식', question: `${name} 조식 포함 예약이 유리할까요?`, answer: '조식 시작 시간이 열차나 관광 일정과 맞는지, 포함 요금과 현장 결제 요금의 차이가 어느 정도인지 비교하세요. 주변 식당이 적은 온천·해안 지역에서는 식사 포함 조건의 편의성이 더 커질 수 있습니다.' },
    { category: '예약', question: `${name} 객실과 예약 조건은 무엇을 비교해야 하나요?`, answer: '객실 크기와 침대 타입, 금연 여부, 취소 가능 기한, 세금과 추가 요금은 객실별로 다를 수 있습니다. 결제 전 아고다의 최신 객실 조건을 다시 확인하세요.' }
  ];
}
