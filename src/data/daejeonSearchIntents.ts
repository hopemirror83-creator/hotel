import type { Hotel } from './hotels';

type DaejeonAreaType = 'yuseong' | 'dunsan' | 'daejeonStation' | 'expo' | 'shintanjin' | 'daeheung' | 'daejeon';

type IntentFaq = {
  question: string;
  answer: string;
  category: string;
};

const areaProfiles: Record<DaejeonAreaType, {
  label: string;
  titleKeyword: string;
  terms: string[];
  recommendedFor: string[];
  notRecommendedFor: string[];
}> = {
  yuseong: {
    label: '대전 유성온천',
    titleKeyword: '대전 유성온천',
    terms: ['온천', '체크인', '주차', '조식'],
    recommendedFor: ['유성온천 여행', '가족 여행', '차량 이동 숙박'],
    notRecommendedFor: ['대전역 바로 앞 이동만 필요한 여행자']
  },
  dunsan: {
    label: '대전 둔산동',
    titleKeyword: '대전 둔산동',
    terms: ['출장', '정부청사', '주차', '체크인'],
    recommendedFor: ['대전 출장', '정부청사 일정', '둔산 상권 이용'],
    notRecommendedFor: ['조용한 외곽 휴식만 원하는 여행자']
  },
  daejeonStation: {
    label: '대전역 중앙로',
    titleKeyword: '대전역 중앙로',
    terms: ['교통', '성심당', '체크인', '가성비'],
    recommendedFor: ['KTX 이동', '성심당 방문', '짧은 대전 숙박'],
    notRecommendedFor: ['온천이나 리조트형 휴식을 기대하는 여행자']
  },
  expo: {
    label: '대전 엑스포 컨벤션',
    titleKeyword: '대전 엑스포',
    terms: ['컨벤션', '출장', '주차', '조식'],
    recommendedFor: ['DCC 행사', '엑스포과학공원 일정', '비즈니스 숙박'],
    notRecommendedFor: ['대전역 도보 접근을 최우선으로 보는 여행자']
  },
  shintanjin: {
    label: '대전 신탄진 대덕',
    titleKeyword: '대전 신탄진 대덕',
    terms: ['가성비', '주차', '출장', '체크인'],
    recommendedFor: ['대덕구 출장', '신탄진역 주변 숙박', '차량 이동 여행'],
    notRecommendedFor: ['둔산·유성 중심 상권을 도보로 이용하려는 여행자']
  },
  daeheung: {
    label: '대전 대흥동 은행동',
    titleKeyword: '대전 대흥동 은행동',
    terms: ['성심당', '가성비', '체크인', '주차'],
    recommendedFor: ['중앙로 상권 이용', '성심당 방문', '대전 원도심 여행'],
    notRecommendedFor: ['넓은 주차장과 조용한 외곽 숙소를 우선하는 여행자']
  },
  daejeon: {
    label: '대전',
    titleKeyword: '대전',
    terms: ['위치', '체크인', '주차', '조식'],
    recommendedFor: ['대전 여행', '대전 출장', '가성비 숙박'],
    notRecommendedFor: ['방문지가 아직 정해지지 않은 여행자']
  }
};

export function getDaejeonSearchIntent(hotel: Hotel) {
  if (!isDaejeonHotel(hotel)) return undefined;

  const areaType = pickDaejeonArea(hotel);
  const profile = areaProfiles[areaType];
  const hotelName = hotel.hotelName.trim();
  const text = searchableText(hotel);
  const dynamicTerms = [...profile.terms];

  if (/조식|breakfast/i.test(text) && !dynamicTerms.includes('조식')) dynamicTerms.push('조식');
  if (/가족|family/i.test(text) && !dynamicTerms.includes('가족')) dynamicTerms.push('가족');
  if (/출장|정부청사|컨벤션|DCC|business/i.test(text) && !dynamicTerms.includes('출장')) dynamicTerms.push('출장');

  const title = composeTitle(hotelName, profile.titleKeyword, dynamicTerms);
  const faqs = buildFaqs(hotelName, profile, areaType);

  return {
    title,
    seoTitle: `${title} | 예약 전 FAQ`,
    metaDescription: `${hotelName} 후기를 ${profile.label} 위치, 체크인, 주차, 조식, 이동 동선 중심으로 정리했습니다.`,
    intentChips: dynamicTerms.slice(0, 5),
    faqs,
    recommendedFor: profile.recommendedFor,
    notRecommendedFor: profile.notRecommendedFor
  };
}

export function isDaejeonHotel(hotel: Hotel) {
  return hotel.slug.startsWith('daejeon-') || /대전|daejeon|유성|둔산|대흥|은행|중앙로|신탄진|대덕|엑스포|DCC/i.test(searchableText(hotel));
}

function pickDaejeonArea(hotel: Hotel): DaejeonAreaType {
  const text = searchableText(hotel);
  if (/유성|온천|봉명|궁동|구암|월평|도안/i.test(text)) return 'yuseong';
  if (/둔산|정부청사|시청|탄방|갈마|만년/i.test(text)) return 'dunsan';
  if (/대전역|중앙로|은행|선화|소제|역전|성심당/i.test(text)) return 'daejeonStation';
  if (/엑스포|DCC|컨벤션|오노마|ICC|신세계|과학공원/i.test(text)) return 'expo';
  if (/신탄진|대덕|중리|오정|송촌/i.test(text)) return 'shintanjin';
  if (/대흥|문창|유천|오류|용문/i.test(text)) return 'daeheung';
  return 'daejeon';
}

function composeTitle(hotelName: string, titleKeyword: string, terms: string[]) {
  const base = `${hotelName} ${titleKeyword} 후기 모음`;
  const normalized = normalizeSearchText(base);
  const picked = terms
    .filter((term) => !normalized.includes(normalizeSearchText(term)))
    .slice(0, 4);
  return `${base} ${picked.join(' ')}`.trim();
}

function buildFaqs(hotelName: string, profile: typeof areaProfiles[DaejeonAreaType], areaType: DaejeonAreaType): IntentFaq[] {
  return [
    {
      category: '위치',
      question: `${hotelName} 위치는 ${profile.label} 일정에 맞나요?`,
      answer: buildLocationAnswer(areaType)
    },
    {
      category: '교통',
      question: `${hotelName} 예약 전 교통 동선은 무엇을 봐야 하나요?`,
      answer: buildTransportAnswer(areaType)
    },
    {
      category: '체크인',
      question: `${hotelName} 체크인 전에 무엇을 확인해야 하나요?`,
      answer: '도착 시간이 늦거나 짐 보관이 필요한 일정이라면 체크인 가능 시간, 프런트 운영 방식, 짐 보관 가능 여부를 먼저 확인하는 편이 좋습니다. 주말이나 행사 기간에는 체크인 대기가 생길 수 있습니다.'
    },
    {
      category: '주차',
      question: `${hotelName} 주차는 예약 전에 확인해야 하나요?`,
      answer: '대전은 차량 이동 일정이 많은 편이라 무료 주차 여부, 만차 시 대체 주차장, 객실당 차량 제한을 확인해두는 것이 안전합니다. 둔산·중앙로처럼 상권이 가까운 곳은 주차 조건 차이가 더 크게 느껴질 수 있습니다.'
    },
    {
      category: areaType === 'yuseong' ? '온천' : '조식',
      question: areaType === 'yuseong' ? `${hotelName} 온천 이용을 기대해도 될까요?` : `${hotelName} 조식 포함 예약이 유리할까요?`,
      answer:
        areaType === 'yuseong'
          ? '유성온천권 숙소라도 실제 온천 시설, 대중탕 운영 여부, 객실 내 욕조 조건은 숙소마다 다릅니다. 온천 목적이라면 객실 사진과 부대시설 운영 시간을 함께 확인해야 합니다.'
          : '조식을 중요하게 본다면 포함 요금과 현장 결제 요금을 비교하는 것이 좋습니다. 출장이나 이른 이동 일정이라면 조식 시작 시간과 혼잡 시간도 함께 확인해야 합니다.'
    }
  ];
}

function buildLocationAnswer(areaType: DaejeonAreaType) {
  if (areaType === 'yuseong') return '유성온천 일정이라면 온천로, 봉명동, 구암역, 유성온천역 접근성을 함께 봐야 합니다. 차량 이동이라면 주차와 주변 식당 동선도 중요합니다.';
  if (areaType === 'dunsan') return '둔산동은 정부청사, 시청, 갤러리아 주변 일정에 맞는지 확인하는 것이 핵심입니다. 출장이라면 목적지까지 택시 이동 시간과 주차 조건을 같이 보는 편이 좋습니다.';
  if (areaType === 'daejeonStation') return '대전역·중앙로 일정은 KTX 이동, 성심당 방문, 원도심 도보 동선이 중요합니다. 다만 상권 주변은 주차와 야간 소음 조건을 함께 확인해야 합니다.';
  if (areaType === 'expo') return '엑스포·컨벤션권은 DCC, 신세계, 엑스포과학공원, 호텔 오노마 주변 행사를 기준으로 보면 좋습니다. 행사 기간에는 가격과 체크인 대기가 달라질 수 있습니다.';
  if (areaType === 'shintanjin') return '신탄진·대덕권은 대덕구 출장, 산업단지, 차량 이동 일정에 맞는지 확인하는 것이 좋습니다. 대전 중심지 관광 목적이라면 이동 시간이 길 수 있습니다.';
  if (areaType === 'daeheung') return '대흥동·은행동은 중앙로 상권과 성심당, 원도심 일정에 맞는 편입니다. 도보 이동은 편하지만 주차와 주변 소음 조건을 같이 봐야 합니다.';
  return '대전 호텔은 유성, 둔산, 대전역, 엑스포, 신탄진처럼 목적지별 동선 차이가 큽니다. 먼저 방문지를 정한 뒤 숙소 위치를 비교하는 것이 좋습니다.';
}

function buildTransportAnswer(areaType: DaejeonAreaType) {
  if (areaType === 'yuseong') return '유성권은 지하철과 차량 이동을 함께 봐야 합니다. 유성온천역·구암역 접근성과 주차 조건, 주변 식당 동선이 실제 만족도에 영향을 줍니다.';
  if (areaType === 'dunsan') return '둔산권은 정부청사·시청·탄방동 목적지까지의 이동 시간이 중요합니다. 출장 일정이라면 아침 이동 시간과 주차 출차 편의성을 함께 확인하세요.';
  if (areaType === 'daejeonStation') return '대전역·중앙로권은 KTX와 도보 이동이 편한 대신 차량 주차 조건은 숙소마다 차이가 큽니다. 짐이 많다면 역과 숙소 사이 실제 이동 거리를 확인하는 편이 좋습니다.';
  if (areaType === 'expo') return '엑스포·컨벤션 일정은 행사장까지 도보 또는 택시 이동이 쉬운지가 중요합니다. 행사일에는 주변 교통과 체크인 시간이 평소보다 빡빡할 수 있습니다.';
  if (areaType === 'shintanjin') return '신탄진·대덕권은 차량 이동 기준으로 보는 편이 안전합니다. 대전역이나 둔산 이동이 필요한 일정이면 이동 시간을 넉넉히 잡는 것이 좋습니다.';
  if (areaType === 'daeheung') return '대흥동·은행동은 중앙로 상권 도보 이동이 장점입니다. 차량 이용자는 주차장 위치와 만차 시 대체 주차 가능 여부를 먼저 확인해야 합니다.';
  return '대전은 목적지에 따라 유성, 둔산, 대전역, 엑스포, 신탄진의 체감 거리가 달라집니다. 예약 전 방문지와 숙소 사이 이동 시간을 먼저 비교하세요.';
}

function normalizeSearchText(value: string) {
  return value.replace(/\s+/g, '').toLowerCase();
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
