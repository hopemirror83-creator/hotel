import type { Hotel, HotelAnalysis } from './hotels';

type IntentFaq = {
  question: string;
  answer: string;
  category: string;
};

type IncheonAreaProfile = {
  label: string;
  titleKeyword: string;
  locationQuestion: string;
  locationAnswer: string;
  recommendedFor: string[];
  notRecommendedFor: string[];
  areaType:
    | 'songdo'
    | 'airport'
    | 'bupyeong'
    | 'guwol'
    | 'wolmido'
    | 'ganghwa'
    | 'cheongna'
    | 'gyeyang'
    | 'michuhol'
    | 'incheon';
};

const SOURCE_NOTE = 'Google 자동완성, 네이버 검색 자동완성에서 반복되는 지역·교통·주차·조식·객실 검색 패턴을 호텔로그 데이터와 함께 반영했습니다.';

export function getIncheonSearchIntent(hotel: Hotel) {
  if (!isIncheonHotel(hotel)) return undefined;

  const analysis = hotel.analysis;
  const area = pickIncheonArea(hotel, analysis);
  const hotelName = hotel.hotelName;
  const hasBreakfast = hasAny(hotel, ['조식', '뷔페', 'breakfast']);
  const hasAirport = area.areaType === 'airport';
  const hasOcean = area.areaType === 'airport' || area.areaType === 'wolmido' || area.areaType === 'ganghwa' || hasAny(hotel, ['오션뷰', '바다']);

  const faqs: IntentFaq[] = [
    {
      category: '위치',
      question: `${hotelName}은 ${area.locationQuestion}`,
      answer: area.locationAnswer
    },
    {
      category: '체크인',
      question: `${hotelName} 체크인 전에 무엇을 확인해야 하나요?`,
      answer: '도착 시간이 늦거나 짐보관이 필요한 일정이라면 체크인 가능 시간, 프런트 운영 방식, 짐보관 가능 여부를 먼저 확인하는 것이 좋습니다. 주말이나 성수기에는 체크인 대기가 생길 수 있습니다.'
    },
    {
      category: '주차',
      question: `${hotelName} 주차는 예약 전에 확인해야 하나요?`,
      answer: buildParkingAnswer(area.areaType)
    },
    {
      category: hasBreakfast ? '조식' : '객실',
      question: hasBreakfast ? `${hotelName} 조식 포함으로 예약하는 게 좋을까요?` : `${hotelName} 객실은 어떤 점을 봐야 하나요?`,
      answer: hasBreakfast
        ? '조식을 중요하게 본다면 포함 요금과 현장 결제 요금을 비교해보는 것이 좋습니다. 아이 동반이나 이른 출발 일정이라면 운영 시간과 혼잡 시간도 함께 확인해야 합니다.'
        : '객실은 전망, 침대 구성, 방 크기, 방음 후기를 같이 보는 것이 좋습니다. 같은 호텔이라도 객실 타입에 따라 만족도가 달라질 수 있습니다.'
    }
  ];

  if (hasAirport) {
    faqs.push({
      category: '교통',
      question: `${hotelName}은 새벽 비행 전후 숙박에 괜찮나요?`,
      answer: '공항권 호텔은 거리보다 실제 이동 방식이 더 중요합니다. 셔틀, 택시 소요 시간, 새벽 체크아웃 가능 여부를 확인하면 일정 실패 가능성을 줄일 수 있습니다.'
    });
  } else if (hasOcean) {
    faqs.push({
      category: '전망',
      question: `${hotelName} 전망이나 주변 분위기는 객실마다 차이가 있나요?`,
      answer: '전망은 객실 타입과 배정 방향에 따라 차이가 날 수 있습니다. 전망을 중요하게 본다면 예약 단계에서 객실명, 층수, 전망 조건을 다시 확인하는 편이 좋습니다.'
    });
  }

  const titleTail = buildSpecificTitleKeyword(hotel, area)
    .split(' ')
    .filter((part) => !hotelName.includes(part))
    .join(' ');
  const title = `${hotelName}${titleTail ? ` ${titleTail}` : ''} 후기 모음`;

  return {
    slug: hotel.slug,
    title,
    seoTitle: `${title}｜위치·주차·조식·체크인 FAQ`,
    metaDescription: `${hotelName} 후기를 ${area.label} 위치, 체크인, 주차, 조식, 객실 조건 중심으로 정리했습니다. 예약 전 자주 묻는 질문까지 함께 확인하세요.`,
    lead: `${hotelName}은 ${area.label} 숙박을 검토할 때 위치와 일정 조건을 함께 봐야 하는 호텔입니다.`,
    intentChips: buildIntentChips(hotel, area.areaType),
    bodyOrder: ['위치와 교통', '체크인과 짐보관', '주차 조건', hasBreakfast ? '조식' : '객실 조건', '추천 여행자'],
    repeatedQuestions: faqs.map((faq) => faq.question),
    recommendedFor: area.recommendedFor,
    notRecommendedFor: area.notRecommendedFor,
    faqs,
    sourceNote: SOURCE_NOTE
  };
}

function isIncheonHotel(hotel: Hotel) {
  const text = realLocationText(hotel);
  return /^incheon-/.test(hotel.slug) || /인천|incheon/i.test(text);
}

function pickIncheonArea(hotel: Hotel, analysis: HotelAnalysis): IncheonAreaProfile {
  const realText = realLocationText(hotel);
  const fullText = searchableText(hotel, analysis);

  const matchedByRealLocation =
    matchSongdo(realText) ||
    matchGanghwa(realText) ||
    matchWolmido(realText) ||
    matchAirport(realText) ||
    matchBupyeong(realText) ||
    matchGuwol(realText) ||
    matchCheongna(realText) ||
    matchGyeyang(realText) ||
    matchMichuhol(realText);

  if (matchedByRealLocation) return matchedByRealLocation;
  if (hasConcreteIncheonLocation(realText)) return incheonProfile();

  return (
    matchSongdo(fullText) ||
    matchGanghwa(fullText) ||
    matchWolmido(fullText) ||
    matchAirport(fullText) ||
    matchBupyeong(fullText) ||
    matchGuwol(fullText) ||
    matchCheongna(fullText) ||
    matchGyeyang(fullText) ||
    matchMichuhol(fullText) ||
    incheonProfile()
  );
}

function buildSpecificTitleKeyword(hotel: Hotel, area: IncheonAreaProfile) {
  const text = realLocationText(hotel);
  const specificAreas: Array<[RegExp, string]> = [
    [/소래포구|소래역|sorae/i, '소래포구 인천'],
    [/구월|인천터미널|guwol/i, '구월동 인천'],
    [/간석|ganseok/i, '간석동 인천'],
    [/송도|songdo/i, '송도 인천'],
    [/석모도|seokmodo/i, '석모도 강화'],
    [/강화|ganghwa/i, '강화도 인천'],
    [/을왕리|왕산|eurwang/i, '을왕리 인천'],
    [/영흥도|yeongheung/i, '영흥도 인천'],
    [/선재도|seonjae/i, '선재도 인천'],
    [/덕적도|deokjeok/i, '덕적도 인천'],
    [/백령도|baengnyeong/i, '백령도 인천'],
    [/무의도|muui/i, '무의도 인천공항'],
    [/영종|운서|인천공항|airport|unseo/i, '인천공항 영종도'],
    [/월미도|wolmido/i, '월미도 인천'],
    [/차이나타운|개항장/i, '차이나타운 인천'],
    [/부평|bupyeong/i, '부평역 인천'],
    [/주안|juan/i, '주안역 인천'],
    [/청라|cheongna/i, '청라 인천'],
    [/검단|geomdan/i, '검단 인천'],
    [/석남|seongnam/i, '석남동 인천'],
    [/계양|작전|gyeyang|jakjeon/i, '계양구 인천'],
    [/연수|yeonsu/i, '연수구 인천']
  ];
  return specificAreas.find(([pattern]) => pattern.test(text))?.[1] || area.titleKeyword;
}

function matchSongdo(text: string) {
  if (!/송도|연수구|센트럴파크|컨벤시아|테크노파크|songdo|yeonsu/i.test(text)) return undefined;
  return {
    label: '인천 송도',
    titleKeyword: '송도 인천',
    locationQuestion: '송도 여행이나 출장 일정에 맞나요?',
    locationAnswer: '송도권은 센트럴파크, 컨벤시아, 업무지구 이동을 함께 보는 여행자에게 맞습니다. 대중교통만 이용한다면 역과 호텔 사이의 실제 이동 시간을 확인하는 것이 좋습니다.',
    recommendedFor: ['송도 출장', '센트럴파크 근처 숙박', '차량 이동 여행자'],
    notRecommendedFor: ['인천공항 바로 앞 숙소를 원하는 여행자', '월미도·차이나타운 도보 관광 중심 일정'],
    areaType: 'songdo' as const
  };
}

function matchGanghwa(text: string) {
  if (!/강화|ganghwa/i.test(text)) return undefined;
  return {
    label: '인천 강화도',
    titleKeyword: '강화도 인천',
    locationQuestion: '강화도 여행 숙소로 괜찮나요?',
    locationAnswer: '강화도 숙소는 관광지 간 거리가 있어 차량 이동 계획이 중요합니다. 바다 전망, 펜션형 객실, 바비큐 조건은 객실 타입별로 차이가 날 수 있습니다.',
    recommendedFor: ['강화도 드라이브 여행', '가족·커플 주말 숙박', '조용한 외곽 숙소'],
    notRecommendedFor: ['대중교통만으로 이동하는 여행자', '인천공항 접근성이 최우선인 여행자'],
    areaType: 'ganghwa' as const
  };
}

function matchWolmido(text: string) {
  if (!/월미|차이나타운|제물포|개항|하버|wolmi|chinatown/i.test(text)) return undefined;
  return {
    label: '월미도·차이나타운',
    titleKeyword: '월미도 차이나타운 인천',
    locationQuestion: '월미도와 차이나타운 관광에 좋나요?',
    locationAnswer: '월미도·차이나타운권은 인천 개항장, 하버파크, 월미도 관광을 함께 보는 일정에 맞습니다. 주말에는 차량 정체와 주차 난이도를 함께 고려해야 합니다.',
    recommendedFor: ['월미도 관광', '차이나타운·개항장 여행', '짧은 인천 시내 여행'],
    notRecommendedFor: ['조용한 휴양형 숙소를 원하는 여행자', '공항 셔틀이 꼭 필요한 여행자'],
    areaType: 'wolmido' as const
  };
}

function matchAirport(text: string) {
  if (!/공항|운서|영종|터미널|에어포트|airport|unseo|terminal|흰바위로|공항로|영종해안/i.test(text)) return undefined;
  return {
    label: '인천공항·영종도',
    titleKeyword: '인천공항 영종도',
    locationQuestion: '인천공항 이동에 편한가요?',
    locationAnswer: '공항권 숙소는 거리뿐 아니라 셔틀, 택시 소요 시간, 새벽 체크아웃 가능 여부가 중요합니다. 늦은 입국이나 이른 출국 일정이라면 이동 방식을 먼저 확인하세요.',
    recommendedFor: ['새벽 비행 전후 숙박', '영종도 호캉스', '공항 이동이 중요한 여행자'],
    notRecommendedFor: ['인천 시내 관광을 도보로 다니려는 여행자', '최저가만 우선하는 장기 숙박'],
    areaType: 'airport' as const
  };
}

function matchBupyeong(text: string) {
  if (!/부평|부평역|bupyeong/i.test(text)) return undefined;
  return {
    label: '인천 부평',
    titleKeyword: '부평역 인천',
    locationQuestion: '부평역 주변 이동에 괜찮나요?',
    locationAnswer: '부평권은 지하철과 상권 접근성을 함께 보는 숙박에 맞습니다. 다만 번화가와 가까운 숙소는 소음과 주차 조건을 같이 확인하는 편이 좋습니다.',
    recommendedFor: ['부평역 근처 숙박', '대중교통 중심 일정', '인천 시내 이동 여행자'],
    notRecommendedFor: ['조용한 리조트형 숙소를 원하는 여행자', '공항 바로 앞 숙박을 원하는 여행자'],
    areaType: 'bupyeong' as const
  };
}

function matchGuwol(text: string) {
  if (!/구월|남동구|인천터미널|간석|소래포구|소래역|sorae|soraeyeok|guwol|namdong/i.test(text)) return undefined;
  return {
    label: '인천 구월동·남동구',
    titleKeyword: '구월동 인천',
    locationQuestion: '구월동이나 남동구 일정에 맞나요?',
    locationAnswer: '구월동·남동구권은 터미널, 상권, 업무 이동을 함께 보는 숙박에 맞습니다. 차량 이동이 있다면 주차 조건과 주변 혼잡 시간대를 확인하세요.',
    recommendedFor: ['구월동 상권 이용', '인천터미널 근처 일정', '출장·시내 이동'],
    notRecommendedFor: ['바다 전망을 기대하는 여행자', '공항 이동만 중요한 여행자'],
    areaType: 'guwol' as const
  };
}

function matchCheongna(text: string) {
  if (!/청라|서구|서해구|검단|북항|cheongna|seo-gu/i.test(text)) return undefined;
  return {
    label: '인천 청라·서구',
    titleKeyword: '청라 서구 인천',
    locationQuestion: '청라나 서구 일정에 맞나요?',
    locationAnswer: '청라·서구권은 업무, 가족 방문, 차량 이동 일정에서 검토하기 좋습니다. 역세권 여부와 주차 조건을 함께 보면 선택이 쉬워집니다.',
    recommendedFor: ['청라·서구 일정', '차량 이동 숙박', '가족 방문'],
    notRecommendedFor: ['송도나 공항권 일정이 중심인 여행자', '관광지 도보 이동을 원하는 여행자'],
    areaType: 'cheongna' as const
  };
}

function matchGyeyang(text: string) {
  if (!/계양|작전|gyeyang/i.test(text)) return undefined;
  return {
    label: '인천 계양구',
    titleKeyword: '계양구 인천',
    locationQuestion: '계양구 일정에 맞나요?',
    locationAnswer: '계양구권은 업무, 가족 방문, 차량 이동 일정에서 검토하기 좋습니다. 지하철역 접근성과 주차 조건을 함께 확인하면 숙소 선택이 쉬워집니다.',
    recommendedFor: ['계양구 일정', '인천 북부 이동', '차량 이동 숙박'],
    notRecommendedFor: ['송도나 월미도 관광이 중심인 여행자', '바다 전망을 기대하는 여행자'],
    areaType: 'gyeyang' as const
  };
}

function matchMichuhol(text: string) {
  if (!/미추홀|주안|도화|juan|michuhol/i.test(text)) return undefined;
  return {
    label: '인천 미추홀구',
    titleKeyword: '미추홀구 주안 인천',
    locationQuestion: '미추홀구나 주안 일정에 맞나요?',
    locationAnswer: '미추홀구와 주안권은 인천 시내 이동, 업무, 병원·가족 방문 일정에서 검토하기 좋습니다. 주변 상권과 주차 조건, 야간 소음 가능성을 함께 확인하세요.',
    recommendedFor: ['주안·미추홀구 일정', '인천 시내 이동', '가성비 숙박'],
    notRecommendedFor: ['공항 바로 앞 숙소를 원하는 여행자', '휴양형 리조트를 찾는 여행자'],
    areaType: 'michuhol' as const
  };
}

function incheonProfile(): IncheonAreaProfile {
  return {
    label: '인천',
    titleKeyword: '인천',
    locationQuestion: '인천 여행 일정에 맞나요?',
    locationAnswer: '인천 숙소는 송도, 부평, 구월동, 월미도, 강화도처럼 목적지에 따라 이동 시간이 크게 달라집니다. 호텔 위치와 실제 일정 동선을 함께 확인하는 것이 좋습니다.',
    recommendedFor: ['인천 숙박을 비교하는 여행자', '위치와 가격을 함께 보는 여행자', '후기 기반으로 고르는 여행자'],
    notRecommendedFor: ['지역 동선 확인 없이 최저가만 보는 여행자', '객실 조건 확인을 생략하려는 여행자'],
    areaType: 'incheon'
  };
}

function buildParkingAnswer(areaType: IncheonAreaProfile['areaType']) {
  if (areaType === 'ganghwa') {
    return '강화도 숙소는 차량 이동 비중이 높아 주차 가능 여부와 무료 적용 조건을 먼저 보는 것이 좋습니다. 주말에는 관광지 주변 이동 시간이 길어질 수 있습니다.';
  }
  if (areaType === 'airport') {
    return '공항권 숙소는 숙박 주차와 장기 주차가 다를 수 있습니다. 공항 이동 일정이라면 무료 주차 시간, 셔틀 이용 조건, 만차 가능성을 확인하세요.';
  }
  if (areaType === 'wolmido') {
    return '월미도·차이나타운권은 주말 차량 유입이 많아 주차장이 있는지, 만차 시 대체 주차가 가능한지 확인하는 편이 좋습니다.';
  }
  return '차량 이동이 있는 여행자라면 주차 가능 여부, 무료 적용 조건, 만차 시 대체 주차장을 확인해두는 편이 안전합니다.';
}

function hasConcreteIncheonLocation(text: string) {
  return /강화군|연수구|부평구|남동구|제물포구|중구|서구|서해구|계양구|미추홀구|동구|옹진군|논현|계양|작전|주안|도화|동인천|검암|검단|북항/i.test(text);
}

function buildIntentChips(hotel: Hotel, areaType: IncheonAreaProfile['areaType']) {
  const chips = ['예약', '위치', '체크인', '주차'];
  if (hasAny(hotel, ['조식', '뷔페', 'breakfast'])) chips.push('조식');
  if (areaType === 'airport') chips.push('교통');
  if (areaType === 'ganghwa') chips.push('강화도');
  if (areaType === 'songdo') chips.push('송도');
  if (hasAny(hotel, ['가족', '아이', '키즈'])) chips.push('가족');
  if (hasAny(hotel, ['커플', '오션뷰', '바다'])) chips.push('커플');
  return [...new Set(chips)];
}

function hasAny(hotel: Hotel, keywords: string[]) {
  const text = searchableText(hotel);
  return keywords.some((keyword) => text.includes(keyword.toLowerCase()));
}

function realLocationText(hotel: Hotel) {
  return [hotel.hotelName, hotel.region, hotel.address].join(' ').toLowerCase();
}

function searchableText(hotel: Hotel, analysis = hotel.analysis) {
  return [
    hotel.hotelName,
    hotel.region,
    hotel.address,
    analysis.summary,
    analysis.seoTitle,
    analysis.metaDescription,
    ...analysis.pros,
    ...analysis.cons,
    ...analysis.recommendedFor,
    ...analysis.notRecommendedFor,
    ...analysis.checkPoints
  ]
    .join(' ')
    .toLowerCase();
}
