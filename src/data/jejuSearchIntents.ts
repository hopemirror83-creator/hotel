import type { Hotel } from './hotels';

type IntentFaq = {
  question: string;
  answer: string;
  category: string;
};

type JejuAreaType =
  | 'jeju-city'
  | 'jeju-airport'
  | 'seogwipo'
  | 'jungmun'
  | 'aewol'
  | 'hamdeok'
  | 'seongsan'
  | 'hyeopjae'
  | 'jeju';

type JejuAreaProfile = {
  label: string;
  titleKeyword: string;
  locationQuestion: string;
  locationAnswer: string;
  recommendedFor: string[];
  notRecommendedFor: string[];
  areaType: JejuAreaType;
};

const SOURCE_NOTE =
  '네이버와 구글 자동완성에서 반복되는 제주 호텔 검색 의도와 호텔로그의 공개 후기 분석 데이터를 함께 반영했습니다.';

export function getJejuSearchIntent(hotel: Hotel) {
  if (!isJejuHotel(hotel)) return undefined;

  const area = pickJejuArea(hotel);
  const hotelName = hotel.hotelName;
  const hasBreakfast = hasAny(hotel, ['조식', '뷔페', 'breakfast']);
  const hasOcean = hasAny(hotel, ['오션', '바다', '해안', '뷰', 'ocean', 'sea']);

  const faqs: IntentFaq[] = [
    {
      category: '위치',
      question: `${hotelName}은 ${area.locationQuestion}`,
      answer: area.locationAnswer
    },
    {
      category: '교통',
      question: `${hotelName} 예약 전 렌터카 이동과 대중교통 중 무엇을 확인해야 하나요?`,
      answer: buildTransportAnswer(area.areaType)
    },
    {
      category: '체크인',
      question: `${hotelName} 체크인 전에 확인할 점은 무엇인가요?`,
      answer:
        '제주 숙소는 항공편 도착 시간과 렌터카 수령 시간이 일정에 큰 영향을 줍니다. 늦은 체크인 가능 여부, 짐보관, 주차장 위치, 주변 식당 마감 시간을 함께 확인하는 편이 좋습니다.'
    },
    {
      category: '주차',
      question: `${hotelName} 주차는 예약 전에 어떻게 봐야 하나요?`,
      answer:
        '제주 여행은 렌터카 이용이 많기 때문에 무료 주차 여부, 만차 시 대체 주차장, 기계식 주차 여부를 먼저 확인하는 것이 좋습니다. 제주시 중심부와 서귀포 시내 숙소는 주차 후 도보 동선도 함께 봐야 합니다.'
    },
    {
      category: hasBreakfast ? '조식' : '객실',
      question: hasBreakfast
        ? `${hotelName} 조식 포함 예약이 나을까요?`
        : `${hotelName} 객실은 어떤 점을 봐야 하나요?`,
      answer: hasBreakfast
        ? '조식이 중요하다면 포함 요금과 현장 결제 요금을 비교해보세요. 제주 일정은 이른 출발이 많아 조식 시작 시간, 대기, 아이 동반 이용 편의성을 같이 확인하는 것이 좋습니다.'
        : '객실은 면적, 침대 구성, 욕실 구조, 방음, 냉난방 후기를 함께 보는 것이 좋습니다. 해안가 숙소는 전망과 습도, 시내 숙소는 주차와 소음 후기를 같이 확인해보세요.'
    }
  ];

  if (hasOcean) {
    faqs.push({
      category: '전망',
      question: `${hotelName} 오션뷰는 예약 전에 어떻게 확인해야 하나요?`,
      answer:
        '오션뷰 표기가 있어도 객실 타입과 층수에 따라 체감이 달라질 수 있습니다. 바다 전망이 중요하다면 객실명, 전망 보장 여부, 부분 전망인지 정면 전망인지까지 확인하는 편이 좋습니다.'
    });
  }

  const titleTail = area.titleKeyword
    .split(' ')
    .filter((part) => part && !hotelName.includes(part))
    .join(' ');
  const title = `${hotelName}${titleTail ? ` ${titleTail}` : ''} 후기 모음`;

  return {
    slug: hotel.slug,
    title,
    seoTitle: `${title}｜위치·렌터카·주차 예약 전 FAQ`,
    metaDescription: `${hotelName} 후기를 ${area.label} 위치, 렌터카 이동, 주차, 조식, 객실 조건 중심으로 정리했습니다. 예약 전 자주 묻는 질문까지 함께 확인하세요.`,
    lead: `${hotelName}은 ${area.label} 일정에서 위치와 이동 조건을 함께 봐야 하는 숙소입니다.`,
    intentChips: buildIntentChips(hotel, area.areaType),
    bodyOrder: ['위치와 이동', '렌터카와 주차', '체크인과 짐보관', hasBreakfast ? '조식' : '객실 조건', '추천 여행자'],
    repeatedQuestions: faqs.map((faq) => faq.question),
    recommendedFor: area.recommendedFor,
    notRecommendedFor: area.notRecommendedFor,
    faqs,
    sourceNote: SOURCE_NOTE
  };
}

export function isJejuHotel(hotel: Hotel) {
  const text = realLocationText(hotel);
  return /^jeju-/.test(hotel.slug) || /제주|서귀포|jeju|seogwipo/i.test(text);
}

function pickJejuArea(hotel: Hotel): JejuAreaProfile {
  const realText = realLocationText(hotel);
  const fullText = searchableText(hotel);

  const matchedByRealLocation =
    matchJejuAirport(realText) ||
    matchJungmun(realText) ||
    matchSeogwipo(realText) ||
    matchAewol(realText) ||
    matchHamdeok(realText) ||
    matchSeongsan(realText) ||
    matchHyeopjae(realText) ||
    matchJejuCity(realText);

  if (matchedByRealLocation) return matchedByRealLocation;

  return (
    matchJejuAirport(fullText) ||
    matchJungmun(fullText) ||
    matchSeogwipo(fullText) ||
    matchAewol(fullText) ||
    matchHamdeok(fullText) ||
    matchSeongsan(fullText) ||
    matchHyeopjae(fullText) ||
    matchJejuCity(fullText) ||
    jejuProfile()
  );
}

function matchJejuAirport(text: string) {
  if (!/제주공항|공항|연동|노형|도령로|신대로|airport|yeondong|nohyeong/i.test(text)) return undefined;
  return {
    label: '제주공항 근처',
    titleKeyword: '제주공항 근처 제주',
    locationQuestion: '제주공항 도착 전후 1박에 맞나요?',
    locationAnswer:
      '제주공항 근처 숙소는 늦은 도착, 이른 출발, 렌터카 인수 전후 일정에 맞춰 보기 좋습니다. 다만 바다 전망이나 리조트형 휴식보다는 이동 편의와 주차 조건을 먼저 보는 편이 좋습니다.',
    recommendedFor: ['늦은 제주 도착', '이른 항공편', '렌터카 인수 전후 1박'],
    notRecommendedFor: ['조용한 휴양형 숙소를 원하는 여행자', '바다 전망을 가장 중요하게 보는 여행자'],
    areaType: 'jeju-airport' as const
  };
}

function matchJejuCity(text: string) {
  if (!/제주시|탑동|동문|서부두|용담|삼도|건입|jeju-si|topdong/i.test(text)) return undefined;
  return {
    label: '제주시',
    titleKeyword: '제주시 제주',
    locationQuestion: '제주시 일정에 맞나요?',
    locationAnswer:
      '제주시 숙소는 공항, 동문시장, 탑동, 시내 식당 접근성이 장점입니다. 대신 관광지 중심 일정이라면 동쪽이나 서귀포까지 이동 시간이 길어질 수 있어 하루 동선을 같이 봐야 합니다.',
    recommendedFor: ['제주시 맛집 일정', '공항 접근을 중시하는 여행자', '짧은 제주 여행'],
    notRecommendedFor: ['중문이나 성산 중심 여행자', '리조트형 휴식이 우선인 여행자'],
    areaType: 'jeju-city' as const
  };
}

function matchSeogwipo(text: string) {
  if (!/서귀포|서귀동|동홍|천지연|이중섭|seogwipo/i.test(text)) return undefined;
  return {
    label: '서귀포',
    titleKeyword: '서귀포 제주',
    locationQuestion: '서귀포 시내 여행에 맞나요?',
    locationAnswer:
      '서귀포 숙소는 올레시장, 천지연폭포, 남쪽 해안 일정과 묶기 좋습니다. 공항과는 거리가 있어 첫날과 마지막 날에는 이동 시간을 넉넉히 잡는 것이 좋습니다.',
    recommendedFor: ['서귀포 남쪽 일정', '올레시장 주변 여행', '제주 남부 숙박'],
    notRecommendedFor: ['공항 근처 1박을 원하는 여행자', '제주시 중심 일정이 많은 여행자'],
    areaType: 'seogwipo' as const
  };
}

function matchJungmun(text: string) {
  if (!/중문|색달|예래|중문관광|jungmun/i.test(text)) return undefined;
  return {
    label: '중문',
    titleKeyword: '중문 제주',
    locationQuestion: '중문 관광단지 일정에 맞나요?',
    locationAnswer:
      '중문 숙소는 리조트, 가족 여행, 기념일 일정과 잘 맞습니다. 가격대가 높아질 수 있으니 조식, 수영장, 전망 포함 여부를 함께 비교하는 것이 좋습니다.',
    recommendedFor: ['가족 여행', '커플 기념일', '리조트형 휴식'],
    notRecommendedFor: ['숙박비를 최대한 줄이려는 여행자', '제주시 중심 일정이 많은 여행자'],
    areaType: 'jungmun' as const
  };
}

function matchAewol(text: string) {
  if (!/애월|곽지|한담|aewol|gwalkji/i.test(text)) return undefined;
  return {
    label: '애월',
    titleKeyword: '애월 제주',
    locationQuestion: '애월 해안 드라이브 일정에 맞나요?',
    locationAnswer:
      '애월 숙소는 서쪽 해안 드라이브와 카페 일정에 어울립니다. 렌터카 이동이 사실상 중요하므로 주차와 주변 식당 접근성을 함께 확인하는 편이 좋습니다.',
    recommendedFor: ['커플 여행', '서쪽 해안 드라이브', '카페 투어'],
    notRecommendedFor: ['대중교통 위주 여행자', '동쪽 관광지가 중심인 여행자'],
    areaType: 'aewol' as const
  };
}

function matchHamdeok(text: string) {
  if (!/함덕|조천|조함해안|hamdeok|jocheon/i.test(text)) return undefined;
  return {
    label: '함덕',
    titleKeyword: '함덕 제주',
    locationQuestion: '함덕 해수욕장 일정에 맞나요?',
    locationAnswer:
      '함덕 숙소는 해변 접근성과 동쪽 여행의 출발점으로 보기 좋습니다. 여름 성수기에는 주차와 주변 혼잡, 객실 전망 차이를 함께 확인해야 합니다.',
    recommendedFor: ['해변 산책', '가족 여행', '제주 동쪽 여행'],
    notRecommendedFor: ['서귀포 남부 일정이 많은 여행자', '조용한 산간 숙소를 원하는 여행자'],
    areaType: 'hamdeok' as const
  };
}

function matchSeongsan(text: string) {
  if (!/성산|일출봉|섭지코지|성산읍|seongsan|seopjikoji/i.test(text)) return undefined;
  return {
    label: '성산',
    titleKeyword: '성산 제주',
    locationQuestion: '성산 일출봉이나 우도 일정에 맞나요?',
    locationAnswer:
      '성산 숙소는 성산일출봉, 섭지코지, 우도 일정에 잘 맞습니다. 제주시나 중문과는 거리가 있어 동쪽 일정을 확실히 잡은 경우에 선택하는 편이 좋습니다.',
    recommendedFor: ['성산일출봉 일정', '우도 여행', '제주 동쪽 여행'],
    notRecommendedFor: ['제주시 맛집과 쇼핑 중심 여행자', '중문 리조트형 휴식을 원하는 여행자'],
    areaType: 'seongsan' as const
  };
}

function matchHyeopjae(text: string) {
  if (!/협재|한림|금능|hyeopjae|hallim|geumneung/i.test(text)) return undefined;
  return {
    label: '협재·한림',
    titleKeyword: '협재 한림 제주',
    locationQuestion: '협재나 한림 서쪽 여행에 맞나요?',
    locationAnswer:
      '협재와 한림 숙소는 서쪽 바다, 금능, 비양도 전망 일정에 어울립니다. 렌터카 이동과 주변 식당 영업시간을 같이 보는 것이 좋습니다.',
    recommendedFor: ['서쪽 바다 여행', '커플 여행', '조용한 제주 일정'],
    notRecommendedFor: ['공항 근처 숙박을 원하는 여행자', '성산과 동쪽 일정이 많은 여행자'],
    areaType: 'hyeopjae' as const
  };
}

function jejuProfile(): JejuAreaProfile {
  return {
    label: '제주',
    titleKeyword: '제주',
    locationQuestion: '제주 여행 일정에 맞나요?',
    locationAnswer:
      '제주 숙소는 지역 선택이 가장 중요합니다. 공항, 제주시, 서귀포, 중문, 성산, 애월 중 실제 일정과 가까운지 먼저 보고 렌터카와 주차 조건을 함께 확인하세요.',
    recommendedFor: ['제주 여행', '렌터카 여행', '후기 비교 후 예약하려는 여행자'],
    notRecommendedFor: ['지역 동선 확인 없이 숙소만 고르는 여행자'],
    areaType: 'jeju'
  };
}

function buildTransportAnswer(areaType: JejuAreaType) {
  if (areaType === 'jeju-airport') {
    return '공항 근처 숙소라면 택시 이동 시간, 렌터카 셔틀 위치, 늦은 체크인 가능 여부가 중요합니다. 첫날과 마지막 날 숙소로 쓰기 좋은지 항공편 시간과 함께 보세요.';
  }
  if (areaType === 'seogwipo' || areaType === 'jungmun') {
    return '서귀포와 중문은 공항에서 이동 시간이 꽤 걸립니다. 첫날 바로 이동할지, 중간 일정에 배치할지에 따라 만족도가 달라지므로 렌터카 기준 이동 시간을 먼저 확인하세요.';
  }
  if (areaType === 'seongsan' || areaType === 'hamdeok') {
    return '동쪽 숙소는 성산, 우도, 함덕 일정에는 좋지만 서쪽이나 중문 일정과는 거리가 있습니다. 하루 동선을 동쪽으로 묶을 때 선택하는 편이 좋습니다.';
  }
  if (areaType === 'aewol' || areaType === 'hyeopjae') {
    return '서쪽 숙소는 렌터카 이동 만족도가 중요합니다. 해안도로, 카페, 바다 일정에는 좋지만 성산이나 서귀포 남쪽까지는 시간이 걸릴 수 있습니다.';
  }
  return '제주 숙소는 대중교통보다 렌터카 이동을 기준으로 보는 경우가 많습니다. 실제 목적지와 숙소 사이 이동 시간, 주차, 주변 식당 접근성을 함께 확인하세요.';
}

function buildIntentChips(hotel: Hotel, areaType: JejuAreaType) {
  const chips = new Set<string>();
  chips.add(areaType === 'jeju-airport' ? '공항근처' : '제주여행');
  if (areaType === 'seogwipo') chips.add('서귀포');
  if (areaType === 'jungmun') chips.add('중문');
  if (areaType === 'aewol') chips.add('애월');
  if (areaType === 'hamdeok') chips.add('함덕');
  if (areaType === 'seongsan') chips.add('성산');
  if (areaType === 'hyeopjae') chips.add('협재');
  if (hotel.includeBreakfast || hasAny(hotel, ['조식', '뷔페'])) chips.add('조식');
  if (hasAny(hotel, ['오션', '바다', '해안', '뷰'])) chips.add('오션뷰');
  if ((hotel.reviewCount || 0) >= 1000) chips.add('후기많음');
  return [...chips].slice(0, 5);
}

function hasAny(hotel: Hotel, patterns: string[]) {
  const text = searchableText(hotel).toLowerCase();
  return patterns.some((pattern) => text.includes(pattern.toLowerCase()));
}

function realLocationText(hotel: Hotel) {
  return [hotel.region, hotel.address].filter(Boolean).join(' ');
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
    ...(hotel.analysis?.pros || []),
    ...(hotel.analysis?.cons || [])
  ]
    .filter(Boolean)
    .join(' ');
}
