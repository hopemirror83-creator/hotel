import type { Hotel } from './hotels';

type Profile = { label: string; terms: string[]; recommendedFor: string[]; notRecommendedFor: string[]; focus: string };

const profiles: Record<string, Profile> = {
  nagano: { label: '나가노역·젠코지', terms: ['역세권', '교통', '조식', '체크인'], recommendedFor: ['나가노역 중심 일정', '젠코지 관광', '출장과 짧은 숙박'], notRecommendedFor: ['스키장 바로 앞 리조트만 원하는 여행자'], focus: '나가노역과 젠코지·버스 이동 접근성' },
  hakuba: { label: '하쿠바', terms: ['스키장', '셔틀', '가족', '온천'], recommendedFor: ['하쿠바 스키 여행', '가족 겨울여행', '장기 설원 체류'], notRecommendedFor: ['도심 쇼핑과 철도역 바로 앞 숙소가 필요한 여행자'], focus: '슬로프 접근성과 셔틀·장비 보관 조건' },
  karuizawa: { label: '가루이자와', terms: ['역근처', '리조트', '가족', '주차'], recommendedFor: ['가루이자와 휴양', '아울렛 쇼핑', '커플·가족 여행'], notRecommendedFor: ['최저가 비즈니스 숙소만 찾는 여행자'], focus: '가루이자와역과 아울렛·리조트 이동 조건' },
  matsumoto: { label: '마쓰모토·가미코치', terms: ['교통', '주차', '조식', '관광'], recommendedFor: ['마쓰모토성 관광', '가미코치 이동', '렌터카 여행'], notRecommendedFor: ['스키 리조트 부대시설을 우선하는 여행자'], focus: '마쓰모토역과 가미코치·알펜루트 교통' },
  nozawa: { label: '노자와온천·시가고원', terms: ['스키', '온천', '석식', '셔틀'], recommendedFor: ['노자와온천 스키 여행', '시가고원 설원 일정', '온천 료칸 숙박'], notRecommendedFor: ['늦은 밤 도심 상권이 필요한 여행자'], focus: '스키장 이동과 온천·식사·송영 조건' },
  suwa: { label: '스와·다테시나', terms: ['온천', '호수전망', '주차', '가족'], recommendedFor: ['스와호 여행', '온천 휴식', '렌터카 가족여행'], notRecommendedFor: ['나가노 북부 관광이 중심인 여행자'], focus: '스와호와 온천·주차·객실 전망 조건' },
  naganoAll: { label: '나가노현', terms: ['위치', '객실', '조식', '예약조건'], recommendedFor: ['나가노 자유여행', '호텔 비교', '가족·커플 여행'], notRecommendedFor: ['조건 확인 없이 최저가만 찾는 여행자'], focus: '위치와 객실·교통·식사 조건' },
};

export function getNaganoSearchIntent(hotel: Hotel) {
  if (!hotel.slug.startsWith('nagano-')) return undefined;
  const profile = pickProfile(hotel);
  const name = hotel.hotelName.trim();
  const title = `${name} ${profile.label} 후기 모음 ${profile.terms.join(' ')}`;
  return { title, seoTitle: `${title} | 예약 전 FAQ`, metaDescription: `${name} 후기를 ${profile.focus} 중심으로 정리했습니다. 체크인과 식사, 교통 및 예약 조건을 예약 전에 확인하세요.`, intentChips: profile.terms, faqs: makeFaqs(name, profile), recommendedFor: profile.recommendedFor, notRecommendedFor: profile.notRecommendedFor };
}

function pickProfile(hotel: Hotel) {
  const text = [hotel.hotelName, hotel.address, hotel.region, hotel.analysis?.summary].filter(Boolean).join(' ');
  if (/하쿠바|Hakuba|白馬/i.test(text)) return profiles.hakuba;
  if (/가루이자와|Karuizawa|軽井沢/i.test(text)) return profiles.karuizawa;
  if (/마쓰모토|마츠모토|가미코치|Matsumoto|Kamikochi|松本|上高地/i.test(text)) return profiles.matsumoto;
  if (/노자와|시가고원|유다나카|시부온천|Nozawa|Shiga.?Kogen|Yudanaka|Shibu|野沢|志賀高原|湯田中|渋温泉/i.test(text)) return profiles.nozawa;
  if (/스와|다테시나|Suwa|Tateshina|諏訪|蓼科/i.test(text)) return profiles.suwa;
  if (/나가노역|젠코지|Nagano Station|Zenkoji|長野駅|善光寺/i.test(text)) return profiles.nagano;
  return profiles.naganoAll;
}

function makeFaqs(name: string, profile: Profile) {
  return [
    { category: '위치', question: `${name} 위치는 ${profile.label} 여행 동선에 맞나요?`, answer: `${profile.focus}을 먼저 확인하세요. 지도상 거리보다 역 출구, 버스 정류장, 스키장과 관광지까지의 실제 이동 시간이 중요할 수 있습니다.` },
    { category: '체크인', question: `${name} 체크인 전에 무엇을 확인해야 하나요?`, answer: '프런트 운영 시간과 짐 보관, 늦은 도착 가능 여부를 확인하세요. 료칸과 산간 숙소는 석식 시간 때문에 체크인 마감이 빠를 수 있습니다.' },
    { category: '조식·식사', question: `${name} 조식이나 석식 포함 예약이 유리할까요?`, answer: '역 주변은 외부 식당 선택지가 있지만 스키·온천 지역은 식사 포함 조건이 편리할 수 있습니다. 메뉴와 시작 시간, 요금 차이를 함께 비교하세요.' },
    { category: '교통·주차', question: `${name} 교통편과 주차는 무엇을 확인해야 하나요?`, answer: '철도와 렌터카 중 실제 일정에 맞는 이동 수단을 기준으로 보세요. 무료 주차, 송영 예약, 겨울철 도로와 스키장 이동 조건도 숙박 전에 확인하는 편이 좋습니다.' },
    { category: '예약', question: `${name} 객실과 예약 조건은 무엇을 비교해야 하나요?`, answer: '침대 구성과 금연 여부, 객실 전망, 온천 이용 조건, 취소 기한과 추가 요금은 객실별로 다를 수 있습니다. 결제 전 아고다 최신 조건을 다시 확인하세요.' },
  ];
}
