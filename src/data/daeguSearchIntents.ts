import type { Hotel } from './hotels';

type DaeguAreaType = 'dongseongro' | 'dongdaegu' | 'suseong' | 'exco' | 'seongseo' | 'palgongsan' | 'hyeonpung' | 'daegu';

type IntentFaq = {
  question: string;
  answer: string;
  category: string;
};

const areaProfiles: Record<DaeguAreaType, {
  label: string;
  titleKeyword: string;
  terms: string[];
  recommendedFor: string[];
  notRecommendedFor: string[];
}> = {
  dongseongro: {
    label: '대구 동성로',
    titleKeyword: '대구 동성로',
    terms: ['위치', '체크인', '주차', '조식'],
    recommendedFor: ['동성로 도보 일정', '반월당·중앙로 이동', '대구 시내 여행'],
    notRecommendedFor: ['조용한 외곽 휴식', '넓은 리조트형 숙소 선호']
  },
  dongdaegu: {
    label: '동대구역',
    titleKeyword: '동대구역',
    terms: ['교통', '체크인', '주차', '출장'],
    recommendedFor: ['KTX 이용', '대구 출장', '늦은 도착 일정'],
    notRecommendedFor: ['관광지만 도보로 다닐 여행자', '한적한 숙소 선호']
  },
  suseong: {
    label: '수성구·수성못',
    titleKeyword: '대구 수성못',
    terms: ['호캉스', '가족', '주차', '객실'],
    recommendedFor: ['수성못 일정', '가족 여행', '차량 이동 여행'],
    notRecommendedFor: ['동성로 도보 접근만 중시하는 여행자']
  },
  exco: {
    label: '대구 엑스코',
    titleKeyword: '대구 엑스코',
    terms: ['출장', '주차', '체크인', '조식'],
    recommendedFor: ['엑스코 행사', '경북대 인근 일정', '비즈니스 숙박'],
    notRecommendedFor: ['동성로 야간 일정 중심 여행자']
  },
  seongseo: {
    label: '성서·달서구',
    titleKeyword: '대구 성서',
    terms: ['출장', '주차', '가성비', '객실'],
    recommendedFor: ['성서산단 출장', '달서구 일정', '차량 이동 숙박'],
    notRecommendedFor: ['대구역·동성로 도보 여행자']
  },
  palgongsan: {
    label: '팔공산',
    titleKeyword: '대구 팔공산',
    terms: ['가족', '조용함', '주차', '휴식'],
    recommendedFor: ['팔공산 나들이', '조용한 휴식', '차량 이동 여행'],
    notRecommendedFor: ['대중교통 중심 시내 여행자']
  },
  hyeonpung: {
    label: '현풍·달성군',
    titleKeyword: '대구 현풍',
    terms: ['출장', '주차', '가성비', '체크인'],
    recommendedFor: ['달성군 출장', '현풍 일정', '차량 이동 숙박'],
    notRecommendedFor: ['대구 중심가 도보 여행자']
  },
  daegu: {
    label: '대구',
    titleKeyword: '대구',
    terms: ['위치', '체크인', '주차', '조식'],
    recommendedFor: ['대구 여행', '대구 출장', '가성비 숙박'],
    notRecommendedFor: ['지역 동선이 아직 정해지지 않은 여행자']
  }
};

export function getDaeguSearchIntent(hotel: Hotel) {
  if (!isDaeguHotel(hotel)) return undefined;

  const areaType = pickDaeguArea(hotel);
  const profile = areaProfiles[areaType];
  const hotelName = hotel.hotelName.trim();
  const text = searchableText(hotel);
  const dynamicTerms = [...profile.terms];
  if (/조식|breakfast/i.test(text) && !dynamicTerms.includes('조식')) dynamicTerms.push('조식');
  if (/공항|airport/i.test(text) && !dynamicTerms.includes('대구공항')) dynamicTerms.push('대구공항');

  const title = composeTitle(hotelName, profile.titleKeyword, dynamicTerms);
  const faqs = buildFaqs(hotelName, profile, areaType);

  return {
    title,
    seoTitle: `${title} | 예약 전 FAQ`,
    metaDescription: `${hotelName} 후기를 ${profile.label} 위치, 체크인, 주차, 조식, 객실 조건 중심으로 정리했습니다.`,
    intentChips: dynamicTerms.slice(0, 5),
    faqs,
    recommendedFor: profile.recommendedFor,
    notRecommendedFor: profile.notRecommendedFor
  };
}

export function isDaeguHotel(hotel: Hotel) {
  return hotel.slug.startsWith('daegu-') || /대구|동성로|동대구|수성|엑스코|성서|달서|팔공산|현풍/.test(searchableText(hotel));
}

function pickDaeguArea(hotel: Hotel): DaeguAreaType {
  const text = searchableText(hotel);
  if (/동성로|반월당|중앙로|서문시장|대구역/.test(text)) return 'dongseongro';
  if (/동대구|동구|대구공항|신천|동촌유원지/.test(text)) return 'dongdaegu';
  if (/수성|수성못|범어|황금|라이온즈파크|알파시티/.test(text)) return 'suseong';
  if (/엑스코|EXCO|경북대|북구/.test(text)) return 'exco';
  if (/성서|달서|상인|두류|월배|대명|앞산/.test(text)) return 'seongseo';
  if (/팔공산|이시아/.test(text)) return 'palgongsan';
  if (/현풍|달성|테크노폴리스|혁신도시/.test(text)) return 'hyeonpung';
  return 'daegu';
}

function composeTitle(hotelName: string, titleKeyword: string, terms: string[]) {
  const base = `${hotelName} ${titleKeyword} 후기 모음`;
  const normalized = base.replace(/\s+/g, '');
  const picked = terms.filter((term) => !normalized.includes(term.replace(/\s+/g, ''))).slice(0, 4);
  return `${base} ${picked.join(' ')}`.trim();
}

function buildFaqs(hotelName: string, profile: typeof areaProfiles[DaeguAreaType], areaType: DaeguAreaType): IntentFaq[] {
  return [
    {
      category: '위치',
      question: `${hotelName} 위치는 ${profile.label} 일정에 맞나요?`,
      answer: buildLocationAnswer(areaType)
    },
    {
      category: '교통',
      question: `${hotelName} 예약 전 교통 동선은 무엇을 확인해야 하나요?`,
      answer: buildTransportAnswer(areaType)
    },
    {
      category: '체크인',
      question: `${hotelName} 체크인 전에 무엇을 봐야 하나요?`,
      answer: '도착 시간이 늦거나 짐 보관이 필요한 일정이라면 체크인 가능 시간, 프런트 운영 방식, 짐 보관 가능 여부를 먼저 확인하는 편이 좋습니다. 주말이나 행사 기간에는 체크인 대기가 생길 수 있습니다.'
    },
    {
      category: '주차',
      question: `${hotelName} 주차는 예약 전에 확인해야 하나요?`,
      answer: '대구는 차량 이동 일정이 많은 편이라 무료 주차 여부, 객실당 차량 제한, 만차 시 대체 주차장을 확인해두는 편이 안전합니다. 동성로·중앙로 쪽은 특히 주차 조건 차이가 큽니다.'
    },
    {
      category: areaType === 'dongseongro' ? '소음' : '조식',
      question: areaType === 'dongseongro' ? `${hotelName} 주변 소음은 괜찮을까요?` : `${hotelName} 조식 포함 예약이 유리할까요?`,
      answer:
        areaType === 'dongseongro'
          ? '동성로·반월당 인근은 음식점과 번화가 접근성이 좋은 대신 객실 위치에 따라 야간 소음 체감이 달라질 수 있습니다. 조용함을 중시한다면 고층·안쪽 객실 요청 가능 여부를 확인해보는 것이 좋습니다.'
          : '조식을 중요하게 본다면 포함 요금과 현장 결제 요금을 비교하는 것이 좋습니다. 출장 일정이나 이른 이동이 있다면 조식 시작 시간과 대기 가능성도 함께 확인해야 합니다.'
    }
  ];
}

function buildLocationAnswer(areaType: DaeguAreaType) {
  if (areaType === 'dongseongro') return '동성로·반월당·중앙로 일정이라면 도보 접근성과 주차 조건을 함께 봐야 합니다. 번화가 접근성은 좋지만 객실 위치에 따라 소음 체감이 다를 수 있습니다.';
  if (areaType === 'dongdaegu') return '동대구역과 대구공항 이동이 중요하다면 실제 이동 시간, 택시 접근성, 늦은 체크인 가능 여부를 먼저 확인하는 편이 좋습니다.';
  if (areaType === 'suseong') return '수성구·수성못 일정은 차량 이동과 주변 식당 접근성이 중요합니다. 가족 여행이라면 객실 크기와 주차 편의성을 함께 보는 편이 좋습니다.';
  if (areaType === 'exco') return '엑스코·경북대 일정은 행사장 접근성과 주차 조건이 핵심입니다. 행사 기간에는 가격과 체크인 대기 변동이 생길 수 있습니다.';
  if (areaType === 'seongseo') return '성서·달서구 일정은 산업단지·출장 목적지가 어디인지에 따라 만족도가 달라집니다. 차량 이동 기준으로 위치를 확인하는 편이 좋습니다.';
  if (areaType === 'palgongsan') return '팔공산 쪽은 시내 접근성보다 조용한 휴식과 차량 이동 편의가 중요합니다. 주변 식당 운영 시간도 함께 확인해두면 좋습니다.';
  if (areaType === 'hyeonpung') return '현풍·달성군은 출장 목적지와 차량 이동 시간이 중요합니다. 대구 중심가와는 거리가 있으니 방문 목적에 맞춰 선택해야 합니다.';
  return '대구 숙소는 동성로, 동대구역, 수성구, 성서, 팔공산처럼 목적지별 동선 차이가 큽니다. 먼저 방문지를 정한 뒤 위치를 비교하는 것이 좋습니다.';
}

function buildTransportAnswer(areaType: DaeguAreaType) {
  if (areaType === 'dongseongro') return '동성로는 지하철과 도보 이동이 편하지만 차량 이용 시 주차 조건을 먼저 확인해야 합니다.';
  if (areaType === 'dongdaegu') return '동대구역·대구공항 이동은 택시 접근성, 늦은 도착 체크인, 역까지 실제 거리 확인이 중요합니다.';
  if (areaType === 'suseong') return '수성구는 차량 이동이 편한 편이지만 목적지가 동성로라면 이동 시간이 생깁니다. 주차와 택시 이동성을 함께 봐야 합니다.';
  if (areaType === 'exco') return '엑스코 행사가 있는 날에는 주변 교통과 주차가 혼잡할 수 있어 도착 시간 여유를 두는 것이 좋습니다.';
  if (areaType === 'seongseo') return '성서·달서구는 차량 이동 기준으로 편한 숙소가 많습니다. 대중교통만 이용한다면 역과 버스 정류장 거리를 확인해야 합니다.';
  if (areaType === 'palgongsan') return '팔공산은 차량 이동을 전제로 보는 편이 안전합니다. 밤 시간대 이동과 주변 편의시설도 함께 확인하세요.';
  if (areaType === 'hyeonpung') return '현풍·달성군은 대구 중심가보다 목적지 접근성이 중요합니다. 출장지까지 실제 이동 시간을 기준으로 비교하는 편이 좋습니다.';
  return '대구는 목적지에 따라 동선 차이가 커서 동성로, 동대구역, 수성구, 성서 중 어디를 중심으로 움직일지 먼저 정하는 것이 좋습니다.';
}

function searchableText(hotel: Hotel) {
  return [
    hotel.slug,
    hotel.hotelName,
    hotel.region,
    hotel.address,
    hotel.analysis?.summary,
    hotel.analysis?.seoTitle,
    hotel.analysis?.metaDescription,
    ...(hotel.analysis?.pros ?? []),
    ...(hotel.analysis?.checkPoints ?? [])
  ]
    .filter(Boolean)
    .join(' ');
}
