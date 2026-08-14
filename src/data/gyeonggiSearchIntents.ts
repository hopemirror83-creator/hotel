import type { Hotel } from './hotels';

type IntentFaq = {
  question: string;
  answer: string;
  category: string;
};

type GyeonggiAreaType =
  | 'suwon'
  | 'gimpo'
  | 'goyang'
  | 'seongnam'
  | 'yongin'
  | 'hwaseong'
  | 'ansan'
  | 'yangpyeong'
  | 'pyeongtaek'
  | 'gyeonggi';

type GyeonggiAreaProfile = {
  label: string;
  titleKeyword: string;
  locationQuestion: string;
  locationAnswer: string;
  recommendedFor: string[];
  notRecommendedFor: string[];
  areaType: GyeonggiAreaType;
};

const SOURCE_NOTE =
  'Google 자동완성, 네이버 검색 자동완성에서 반복되는 경기 호텔 검색 의도와 호텔로그 데이터를 함께 반영했습니다.';

export function getGyeonggiSearchIntent(hotel: Hotel) {
  if (!isGyeonggiHotel(hotel)) return undefined;

  const area = pickGyeonggiArea(hotel);
  const hotelName = hotel.hotelName;
  const hasBreakfast = hasAny(hotel, ['조식', '뷔페', 'breakfast']);

  const faqs: IntentFaq[] = [
    {
      category: '위치',
      question: `${hotelName} 위치는 ${area.locationQuestion}`,
      answer: area.locationAnswer
    },
    {
      category: '교통',
      question: `${hotelName} 예약 전 이동 동선은 무엇을 확인해야 하나요?`,
      answer: buildTransportAnswer(area.areaType)
    },
    {
      category: '체크인',
      question: `${hotelName} 체크인 전에 확인할 점은 무엇인가요?`,
      answer:
        '도착 시간이 늦거나 차량 이동이 있는 일정이라면 체크인 가능 시간, 짐보관 가능 여부, 프런트 운영 시간, 주차 입출차 조건을 먼저 확인하는 것이 좋습니다.'
    },
    {
      category: '주차',
      question: `${hotelName} 주차는 예약 전에 어떻게 봐야 하나요?`,
      answer: buildParkingAnswer(area.areaType)
    },
    {
      category: hasBreakfast ? '조식' : '객실',
      question: hasBreakfast
        ? `${hotelName} 조식 포함 예약이 나을까요?`
        : `${hotelName} 객실은 어떤 점을 봐야 하나요?`,
      answer: hasBreakfast
        ? '조식이 중요하다면 포함 요금과 현장 결제 요금을 비교해보는 것이 좋습니다. 경기 지역 숙소는 출장형, 드라이브형, 펜션형에 따라 조식 운영 방식이 달라질 수 있습니다.'
        : '객실은 면적, 침대 구성, 욕실 구조, 방음, 난방과 냉방 후기를 함께 보는 것이 좋습니다. 경기 지역은 도심형 호텔과 외곽형 숙소의 기대치가 다릅니다.'
    }
  ];

  if (area.areaType === 'suwon') {
    faqs.push({
      category: '관광',
      question: `${hotelName} 위치는 수원역이나 행궁동 일정에 맞나요?`,
      answer:
        '수원 숙소는 수원역, 인계동, 행궁동 중 어디가 목적지인지에 따라 체감 편의가 달라집니다. 대중교통 중심이면 역 거리, 차량 이동이면 주차와 도로 접근성을 먼저 보세요.'
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
    seoTitle: `${title}｜위치·교통·주차 예약 전 FAQ`,
    metaDescription: `${hotelName} 후기를 ${area.label} 위치, 교통, 체크인, 주차, 조식과 객실 조건 중심으로 정리했습니다. 예약 전 자주 묻는 질문까지 함께 확인하세요.`,
    lead: `${hotelName}은 ${area.label} 숙박을 검토할 때 위치와 이동 조건을 함께 봐야 하는 호텔입니다.`,
    intentChips: buildIntentChips(hotel, area.areaType),
    bodyOrder: ['위치와 이동', '체크인과 짐보관', '주차 조건', hasBreakfast ? '조식' : '객실 조건', '추천 여행자'],
    repeatedQuestions: faqs.map((faq) => faq.question),
    recommendedFor: area.recommendedFor,
    notRecommendedFor: area.notRecommendedFor,
    faqs,
    sourceNote: SOURCE_NOTE
  };
}

export function isGyeonggiHotel(hotel: Hotel) {
  const text = realLocationText(hotel);
  if (/양평로|월드컵경기장|경기전|스포츠 경기|경기 관람/.test(text)) return false;
  return /^gyeonggi-/.test(hotel.slug) || /경기도|경기 |gyeonggi-do|suwon-si|goyang-si|seongnam-si|yongin-si|gimpo-si/i.test(text);
}

function pickGyeonggiArea(hotel: Hotel): GyeonggiAreaProfile {
  const realText = realLocationText(hotel);
  const fullText = searchableText(hotel);

  // Gyeonggi Gwangju is a separate city and must not inherit nearby
  // Seongnam/Bundang intent terms from search snippets or station names.
  if (/광주시|광주\(|gwangju-si|samdong/i.test(realText)) return gyeonggiProfile();

  const matchedByRealLocation =
    matchSuwon(realText) ||
    matchGimpo(realText) ||
    matchGoyang(realText) ||
    matchSeongnam(realText) ||
    matchYongin(realText) ||
    matchHwaseong(realText) ||
    matchAnsan(realText) ||
    matchYangpyeong(realText) ||
    matchPyeongtaek(realText);

  if (matchedByRealLocation) return matchedByRealLocation;
  if (hasConcreteGyeonggiLocation(realText)) return gyeonggiProfile();

  return (
    matchSuwon(fullText) ||
    matchGimpo(fullText) ||
    matchGoyang(fullText) ||
    matchSeongnam(fullText) ||
    matchYongin(fullText) ||
    matchHwaseong(fullText) ||
    matchAnsan(fullText) ||
    matchYangpyeong(fullText) ||
    matchPyeongtaek(fullText) ||
    gyeonggiProfile()
  );
}

function matchSuwon(text: string) {
  if (!/수원|팔달구|권선구|인계동|매산로|행궁|suwon/i.test(text)) return undefined;
  return {
    label: '경기 수원',
    titleKeyword: '수원 경기',
    locationQuestion: '수원역이나 행궁동 일정에 맞나요?',
    locationAnswer:
      '수원 숙소는 수원역, 인계동, 행궁동 중 어느 동선에 가까운지가 중요합니다. 대중교통 이용자는 역 거리, 차량 이용자는 주차와 도로 접근성을 함께 확인하는 것이 좋습니다.',
    recommendedFor: ['수원역 근처 숙박', '수원 출장', '행궁동·화성 관광'],
    notRecommendedFor: ['서울 도심 관광이 중심인 여행자', '넓은 리조트형 숙소를 원하는 여행자'],
    areaType: 'suwon' as const
  };
}

function matchGimpo(text: string) {
  if (!/김포|gimpo-si|gimpo/i.test(text)) return undefined;
  return {
    label: '경기 김포',
    titleKeyword: '김포 경기',
    locationQuestion: '김포 일정이나 차량 이동에 맞나요?',
    locationAnswer:
      '김포 숙소는 김포공항이 아니라 김포시 일정인지 먼저 구분해야 합니다. 차량 이동, 주차, 주변 식당과 편의시설을 함께 보는 것이 좋습니다.',
    recommendedFor: ['김포 출장', '차량 이동 여행', '서울 서북권 일정'],
    notRecommendedFor: ['김포공항 바로 앞 숙박을 원하는 여행자', '서울 도심 도보 관광 여행자'],
    areaType: 'gimpo' as const
  };
}

function matchGoyang(text: string) {
  if (!/고양|일산|화정|라페스타|킨텍스|goyang|ilsan|kintex/i.test(text)) return undefined;
  return {
    label: '경기 고양·일산',
    titleKeyword: '일산 고양 경기',
    locationQuestion: '일산이나 킨텍스 일정에 맞나요?',
    locationAnswer:
      '고양·일산 숙소는 킨텍스, 라페스타, 화정, 대화역 중 목적지에 따라 편의가 달라집니다. 행사 일정이라면 체크인 대기와 주변 혼잡도 함께 확인하세요.',
    recommendedFor: ['킨텍스 행사', '일산 출장', '고양 공연·전시 일정'],
    notRecommendedFor: ['강남권 일정이 대부분인 여행자', '서울 중심 관광만 계획하는 여행자'],
    areaType: 'goyang' as const
  };
}

function matchSeongnam(text: string) {
  if (!/성남|분당|미금|판교|정자|seongnam|bundang|pangyo/i.test(text)) return undefined;
  return {
    label: '경기 성남·분당',
    titleKeyword: '분당 성남 경기',
    locationQuestion: '분당이나 판교 일정에 맞나요?',
    locationAnswer:
      '성남·분당 숙소는 판교 업무지구, 미금·정자, 수정구 도심 중 어느 권역인지가 중요합니다. 출퇴근 시간대 이동과 주차 조건을 함께 봐야 합니다.',
    recommendedFor: ['판교 출장', '분당 일정', '서울 남부권 이동'],
    notRecommendedFor: ['서울 북부 관광 일정', '대중교통만으로 넓게 이동하려는 여행자'],
    areaType: 'seongnam' as const
  };
}

function matchYongin(text: string) {
  if (!/용인|신갈|기흥|에버랜드|yongin|giheung|everland/i.test(text)) return undefined;
  return {
    label: '경기 용인',
    titleKeyword: '용인 경기',
    locationQuestion: '용인 출장이나 에버랜드 일정에 맞나요?',
    locationAnswer:
      '용인 숙소는 기흥·신갈, 수지, 에버랜드 권역이 나뉩니다. 차량 이동 여부와 목적지까지의 실제 소요 시간을 먼저 확인하는 것이 좋습니다.',
    recommendedFor: ['용인 출장', '기흥·신갈 일정', '차량 이동 여행'],
    notRecommendedFor: ['서울 도심 이동이 잦은 여행자', '대중교통만으로 이동하려는 여행자'],
    areaType: 'yongin' as const
  };
}

function matchHwaseong(text: string) {
  if (!/화성|동탄|향남|hwaseong|dongtan|hyangnam/i.test(text)) return undefined;
  return {
    label: '경기 화성·동탄',
    titleKeyword: '동탄 화성 경기',
    locationQuestion: '동탄이나 화성 일정에 맞나요?',
    locationAnswer:
      '화성·동탄 숙소는 산업단지, 동탄역, 향남 권역별 이동 시간이 다릅니다. 출장 목적이라면 목적지와 호텔 사이의 차량 소요 시간과 주차를 함께 확인하세요.',
    recommendedFor: ['동탄 출장', '화성 산업단지 일정', '차량 이동 숙박'],
    notRecommendedFor: ['서울 중심 관광 일정', '대중교통 접근만 보는 여행자'],
    areaType: 'hwaseong' as const
  };
}

function matchAnsan(text: string) {
  if (!/안산|대부도|단원구|시화|월곶|시흥|ansan|daebudo|siheung|wolgot/i.test(text)) return undefined;
  return {
    label: '경기 안산·대부도',
    titleKeyword: '안산 대부도 경기',
    locationQuestion: '대부도나 안산 일정에 맞나요?',
    locationAnswer:
      '안산·대부도 숙소는 차량 이동과 주변 관광지 거리가 중요합니다. 바다나 펜션형 숙소라면 객실 상태, 바베큐, 주차, 편의점 거리를 함께 확인하세요.',
    recommendedFor: ['대부도 여행', '안산 출장', '차량 이동 여행'],
    notRecommendedFor: ['서울 도심 관광 중심 일정', '대중교통만 이용하는 여행자'],
    areaType: 'ansan' as const
  };
}

function matchYangpyeong(text: string) {
  if (!/양평|yangpyeong/i.test(text)) return undefined;
  return {
    label: '경기 양평',
    titleKeyword: '양평 경기',
    locationQuestion: '양평 드라이브나 가족 모임에 맞나요?',
    locationAnswer:
      '양평 숙소는 도심 호텔보다 펜션과 드라이브형 숙소가 많습니다. 차량 이동, 바베큐 가능 여부, 주변 식당, 객실 독립성을 함께 확인하는 것이 좋습니다.',
    recommendedFor: ['양평 드라이브', '가족·친구 모임', '조용한 휴식'],
    notRecommendedFor: ['대중교통만으로 이동하려는 여행자', '도심형 호텔 서비스를 기대하는 여행자'],
    areaType: 'yangpyeong' as const
  };
}

function matchPyeongtaek(text: string) {
  if (!/평택|pyeongtaek/i.test(text)) return undefined;
  return {
    label: '경기 평택',
    titleKeyword: '평택 경기',
    locationQuestion: '평택 출장이나 역 주변 일정에 맞나요?',
    locationAnswer:
      '평택 숙소는 평택역, 송탄, 산업단지 이동 목적에 따라 위치 만족도가 달라집니다. 차량 이동 시간과 주차, 주변 식당 접근성을 함께 확인하세요.',
    recommendedFor: ['평택 출장', '평택역 근처 숙박', '차량 이동 일정'],
    notRecommendedFor: ['서울 관광 일정', '리조트형 부대시설을 원하는 여행자'],
    areaType: 'pyeongtaek' as const
  };
}

function gyeonggiProfile(): GyeonggiAreaProfile {
  return {
    label: '경기',
    titleKeyword: '경기',
    locationQuestion: '경기 지역 일정에 맞나요?',
    locationAnswer:
      '경기 호텔은 도시별 이동 거리가 넓기 때문에 지역명만 보고 예약하면 동선이 맞지 않을 수 있습니다. 목적지, 차량 이동, 주차, 체크인 시간을 함께 비교하세요.',
    recommendedFor: ['경기 지역 출장', '차량 이동 여행', '서울 근교 숙박'],
    notRecommendedFor: ['서울 도심 도보 관광만 계획한 여행자', '목적지가 아직 정해지지 않은 여행자'],
    areaType: 'gyeonggi'
  };
}

function buildIntentChips(hotel: Hotel, areaType: GyeonggiAreaType) {
  const chips = ['경기 후기', '주차', '체크인'];
  if (areaType === 'suwon') chips.push('수원역');
  if (areaType === 'goyang') chips.push('일산·킨텍스');
  if (areaType === 'seongnam') chips.push('분당·판교');
  if (areaType === 'hwaseong') chips.push('동탄·화성');
  if (areaType === 'yangpyeong') chips.push('양평 여행');
  if (hasAny(hotel, ['조식', '뷔페', 'breakfast'])) chips.push('조식');
  return [...new Set(chips)].slice(0, 6);
}

function buildTransportAnswer(areaType: GyeonggiAreaType) {
  if (areaType === 'suwon') return '수원은 수원역, 인계동, 행궁동 권역이 나뉩니다. 기차나 지하철 이용 여부, 택시 이동 시간, 주차 조건을 함께 확인하는 것이 좋습니다.';
  if (areaType === 'goyang') return '고양·일산은 킨텍스 행사나 라페스타 일정이면 행사 시간대 혼잡을 고려해야 합니다. 지하철역 거리와 택시 이동 시간을 함께 보세요.';
  if (areaType === 'yangpyeong' || areaType === 'ansan') return '외곽형 숙소는 차량 이동을 기준으로 보는 것이 좋습니다. 목적지까지 실제 거리, 주차, 주변 식당과 편의점 접근성을 확인하세요.';
  return '경기 지역은 같은 시 안에서도 이동 시간이 크게 달라질 수 있습니다. 목적지 주소와 호텔 주소를 지도에서 함께 찍어 실제 이동 시간을 확인하는 것이 좋습니다.';
}

function buildParkingAnswer(areaType: GyeonggiAreaType) {
  if (areaType === 'suwon' || areaType === 'seongnam' || areaType === 'goyang') return '도심형 경기 호텔은 주차 공간과 입출차 조건이 호텔마다 다릅니다. 무료 여부, 기계식 주차 제한, 만차 가능성을 예약 전에 확인하세요.';
  if (areaType === 'yangpyeong' || areaType === 'ansan' || areaType === 'hwaseong') return '차량 이동 비중이 큰 지역이므로 주차 가능 여부와 객실당 주차 대수, 늦은 시간 입차 가능 여부를 함께 확인하는 것이 좋습니다.';
  return '주차는 무료 여부뿐 아니라 SUV 가능 여부, 추가 요금, 체크아웃 후 이용 가능 시간을 함께 확인해야 합니다.';
}

function hasAny(hotel: Hotel, keywords: string[]) {
  const text = searchableText(hotel);
  return keywords.some((keyword) => text.includes(keyword.toLowerCase()));
}

function hasConcreteGyeonggiLocation(text: string) {
  return /경기도|경기 |수원|고양|성남|용인|김포|안산|양평|평택|화성|안성|구리|부천|동두천|시흥|오산|gyeonggi-do/i.test(text);
}

function realLocationText(hotel: Hotel) {
  return [hotel.hotelName, hotel.region, hotel.address].join(' ').toLowerCase();
}

function searchableText(hotel: Hotel) {
  const analysis = hotel.analysis;
  return [
    hotel.hotelName,
    hotel.region,
    hotel.address,
    analysis?.summary,
    analysis?.seoTitle,
    analysis?.metaDescription,
    ...(analysis?.pros || []),
    ...(analysis?.cons || []),
    ...(analysis?.recommendedFor || []),
    ...(analysis?.checkPoints || [])
  ]
    .join(' ')
    .toLowerCase();
}
