import type { Hotel } from './hotels';

type IntentFaq = {
  question: string;
  answer: string;
  category: string;
};

type GangwonAreaType =
  | 'sokcho'
  | 'gangneung'
  | 'goseong'
  | 'yangyang'
  | 'chuncheon'
  | 'wonju'
  | 'pyeongchang'
  | 'hongcheon'
  | 'inje'
  | 'gangwon';

type GangwonAreaProfile = {
  label: string;
  titleKeyword: string;
  locationQuestion: string;
  locationAnswer: string;
  recommendedFor: string[];
  notRecommendedFor: string[];
  areaType: GangwonAreaType;
};

const SOURCE_NOTE =
  '네이버와 구글 자동완성에서 반복되는 강원 호텔 검색 의도와 호텔로그의 공개 후기 분석 데이터를 함께 반영했습니다.';

export function getGangwonSearchIntent(hotel: Hotel) {
  if (!isGangwonHotel(hotel)) return undefined;

  const area = pickGangwonArea(hotel);
  const hotelName = hotel.hotelName;
  const hasBreakfast = hasAny(hotel, ['조식', '뷔페', 'breakfast']);
  const hasView = hasAny(hotel, ['오션', '바다', '해변', '산', '뷰', '전망', 'lake', 'ocean', 'sea', 'mountain']);

  const faqs: IntentFaq[] = [
    {
      category: '위치',
      question: `${hotelName}은 ${area.locationQuestion}`,
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
        '강원 지역 숙소는 주말과 성수기에 도착 시간이 몰릴 수 있습니다. 체크인 가능 시간, 늦은 입실 가능 여부, 짐보관, 주변 식당 운영 시간을 함께 확인하는 편이 좋습니다.'
    },
    {
      category: '주차',
      question: `${hotelName} 주차는 예약 전에 어떻게 봐야 하나요?`,
      answer:
        '강원 여행은 차량 이동 비중이 높아 주차 조건이 중요합니다. 무료 주차 여부, 객실당 차량 제한, 성수기 만차 가능성, 해변이나 관광지까지 실제 이동 시간을 같이 확인하세요.'
    },
    {
      category: hasBreakfast ? '조식' : '객실',
      question: hasBreakfast
        ? `${hotelName} 조식 포함 예약이 나을까요?`
        : `${hotelName} 객실은 어떤 점을 봐야 하나요?`,
      answer: hasBreakfast
        ? '조식 포함 요금과 현장 결제 요금을 비교해보세요. 가족 여행이나 이른 출발 일정이라면 조식 시작 시간, 대기 가능성, 아이 동반 이용 편의까지 함께 보는 것이 좋습니다.'
        : '객실은 면적, 침대 구성, 방음, 난방과 냉방, 욕실 상태를 함께 보는 것이 좋습니다. 펜션이나 리조트형 숙소라면 취사 가능 여부와 어메니티도 예약 전에 확인하세요.'
    }
  ];

  if (hasView) {
    faqs.push({
      category: '전망',
      question: `${hotelName} 전망은 예약 전에 어떻게 확인해야 하나요?`,
      answer:
        '전망은 객실 타입과 층수에 따라 체감 차이가 큽니다. 바다뷰나 산뷰가 중요하다면 객실명, 전망 보장 여부, 부분 전망인지 정면 전망인지까지 확인하는 편이 안전합니다.'
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
    seoTitle: `${title}｜위치·주차·체크인 예약 전 FAQ`,
    metaDescription: `${hotelName} 후기를 ${area.label} 위치, 차량 이동, 주차, 체크인, 조식과 객실 조건 중심으로 정리했습니다. 예약 전 자주 묻는 질문까지 함께 확인하세요.`,
    lead: `${hotelName}은 ${area.label} 여행을 검토할 때 위치와 차량 이동 조건을 함께 봐야 하는 숙소입니다.`,
    intentChips: buildIntentChips(hotel, area.areaType),
    bodyOrder: ['위치와 이동 동선', '체크인과 짐보관', '주차 조건', hasBreakfast ? '조식' : '객실 조건', '추천 여행자'],
    repeatedQuestions: faqs.map((faq) => faq.question),
    recommendedFor: area.recommendedFor,
    notRecommendedFor: area.notRecommendedFor,
    faqs,
    sourceNote: SOURCE_NOTE
  };
}

export function isGangwonHotel(hotel: Hotel) {
  const text = realLocationText(hotel);
  return /^gangwon-/.test(hotel.slug) || /강원|gangwon|속초|강릉|고성|양양|춘천|원주|평창|홍천|인제/i.test(text);
}

function pickGangwonArea(hotel: Hotel): GangwonAreaProfile {
  const text = searchableText(hotel);

  if (/속초|sokcho|대포항|청초호|설악/i.test(text)) return areaProfiles.sokcho;
  if (/강릉|gangneung|경포|안목|주문진|정동진/i.test(text)) return areaProfiles.gangneung;
  if (/고성|goseong|삼포|화진포|거진|현내|죽왕/i.test(text)) return areaProfiles.goseong;
  if (/양양|yangyang|낙산|서피비치|하조대/i.test(text)) return areaProfiles.yangyang;
  if (/춘천|chuncheon|남이섬|소양강/i.test(text)) return areaProfiles.chuncheon;
  if (/원주|wonju/i.test(text)) return areaProfiles.wonju;
  if (/평창|pyeongchang|휘닉스|용평|알펜시아/i.test(text)) return areaProfiles.pyeongchang;
  if (/홍천|hongcheon|비발디/i.test(text)) return areaProfiles.hongcheon;
  if (/인제|inje|내린천/i.test(text)) return areaProfiles.inje;
  return areaProfiles.gangwon;
}

const areaProfiles: Record<GangwonAreaType, GangwonAreaProfile> = {
  sokcho: {
    label: '강원 속초',
    titleKeyword: '속초 강원',
    locationQuestion: '속초 해변이나 설악산 일정에 맞나요?',
    locationAnswer:
      '속초 숙소는 해변, 중앙시장, 설악산, 대포항 중 어디를 중심으로 움직일지에 따라 만족도가 달라집니다. 차량 이동과 주차, 성수기 교통을 함께 확인하세요.',
    recommendedFor: ['속초 해변과 시장 동선을 함께 보려는 여행자', '차량으로 설악산이나 대포항을 함께 둘러볼 여행자'],
    notRecommendedFor: ['대중교통만으로 여러 관광지를 촘촘히 이동하려는 여행자', '객실 전망을 확정하지 않고 오션뷰를 기대하는 여행자'],
    areaType: 'sokcho'
  },
  gangneung: {
    label: '강원 강릉',
    titleKeyword: '강릉 강원',
    locationQuestion: '강릉 해변이나 강릉역 일정에 맞나요?',
    locationAnswer:
      '강릉은 경포, 안목, 주문진, 강릉역처럼 목적지에 따라 숙소 권역 선택이 달라집니다. 바다 접근성, 주차, 카페거리 이동 시간을 함께 확인하는 편이 좋습니다.',
    recommendedFor: ['강릉 해변과 카페거리 중심으로 머물 여행자', '기차 또는 차량 동선을 함께 보는 여행자'],
    notRecommendedFor: ['해변 바로 앞 객실을 별도 확인하지 않고 예약하려는 여행자', '주차 없이 성수기 해변권을 이동하려는 여행자'],
    areaType: 'gangneung'
  },
  goseong: {
    label: '강원 고성',
    titleKeyword: '고성 강원',
    locationQuestion: '고성 해변이나 조용한 휴식 일정에 맞나요?',
    locationAnswer:
      '고성 숙소는 조용한 해변, 가족 단위 펜션, 차량 이동 중심 일정에 잘 맞는 경우가 많습니다. 주변 식당과 편의시설 거리, 바다 접근성을 예약 전에 확인하세요.',
    recommendedFor: ['조용한 바다 여행을 원하는 가족 또는 커플', '차량으로 고성 해변을 여유롭게 이동할 여행자'],
    notRecommendedFor: ['도보권 번화가와 늦은 밤 편의시설을 기대하는 여행자', '차량 없이 여러 해변을 이동하려는 여행자'],
    areaType: 'goseong'
  },
  yangyang: {
    label: '강원 양양',
    titleKeyword: '양양 강원',
    locationQuestion: '양양 해변이나 서핑 일정에 맞나요?',
    locationAnswer:
      '양양은 낙산, 하조대, 서피비치처럼 해변 목적지가 뚜렷합니다. 서핑이나 해변 일정이라면 거리와 샤워, 주차, 성수기 혼잡도를 함께 확인하세요.',
    recommendedFor: ['해변과 서핑 일정을 중심으로 움직이는 여행자', '차량으로 양양과 속초를 함께 둘러볼 여행자'],
    notRecommendedFor: ['도심형 호텔 서비스를 기대하는 여행자', '해변 접근성을 확인하지 않고 예약하려는 여행자'],
    areaType: 'yangyang'
  },
  chuncheon: {
    label: '강원 춘천',
    titleKeyword: '춘천 강원',
    locationQuestion: '춘천 도심이나 남이섬 일정에 맞나요?',
    locationAnswer:
      '춘천 숙소는 도심, 호수, 남이섬 방향에 따라 이동 시간이 달라집니다. 차량 이동 여부와 주변 식당, 체크인 시간, 주차 조건을 함께 보는 것이 좋습니다.',
    recommendedFor: ['춘천 도심과 근교 드라이브를 함께 계획한 여행자', '가족이나 커플로 조용한 1박을 찾는 여행자'],
    notRecommendedFor: ['역 바로 앞 접근성만 기대하는 여행자', '늦은 밤 주변 편의시설이 많은 숙소를 원하는 여행자'],
    areaType: 'chuncheon'
  },
  wonju: {
    label: '강원 원주',
    titleKeyword: '원주 강원',
    locationQuestion: '원주 출장이나 도심 일정에 맞나요?',
    locationAnswer:
      '원주 숙소는 관광보다 출장, 병원, 도심 이동 수요가 많은 편입니다. 주차, 체크인, 주변 식당, 목적지까지 차량 이동 시간을 먼저 확인하세요.',
    recommendedFor: ['원주 출장이나 단기 체류를 계획한 여행자', '차량 이동과 주차를 중시하는 여행자'],
    notRecommendedFor: ['바다나 리조트형 휴양을 기대하는 여행자', '관광지 도보 접근성을 우선하는 여행자'],
    areaType: 'wonju'
  },
  pyeongchang: {
    label: '강원 평창',
    titleKeyword: '평창 강원',
    locationQuestion: '평창 리조트나 스키장 일정에 맞나요?',
    locationAnswer:
      '평창 숙소는 리조트, 스키장, 가족 휴양 목적에 따라 만족도가 갈립니다. 셔틀 여부, 주차, 부대시설 운영 시간, 성수기 가격을 함께 확인하세요.',
    recommendedFor: ['스키장이나 리조트 휴양을 계획한 가족 여행자', '차량으로 평창 일대를 이동할 여행자'],
    notRecommendedFor: ['도심형 편의시설을 기대하는 여행자', '차량 없이 여러 관광지를 이동하려는 여행자'],
    areaType: 'pyeongchang'
  },
  hongcheon: {
    label: '강원 홍천',
    titleKeyword: '홍천 강원',
    locationQuestion: '홍천 리조트나 드라이브 일정에 맞나요?',
    locationAnswer:
      '홍천은 리조트형 휴양과 차량 이동 중심 일정이 많습니다. 목적지까지 거리, 주차, 주변 식당, 체크인 시간을 예약 전에 확인하는 편이 좋습니다.',
    recommendedFor: ['가족 단위 리조트 휴양을 계획한 여행자', '차량으로 여유롭게 이동하는 여행자'],
    notRecommendedFor: ['도보권 번화가를 기대하는 여행자', '대중교통으로 촘촘한 일정을 계획한 여행자'],
    areaType: 'hongcheon'
  },
  inje: {
    label: '강원 인제',
    titleKeyword: '인제 강원',
    locationQuestion: '인제 자연 여행이나 펜션 휴식에 맞나요?',
    locationAnswer:
      '인제 숙소는 자연 휴식, 계곡, 드라이브 중심 일정에 잘 맞습니다. 차량 이동, 주변 식당 운영 여부, 객실 난방과 취사 조건을 함께 확인하세요.',
    recommendedFor: ['조용한 자연 여행을 원하는 여행자', '차량으로 계곡이나 산악 지역을 이동할 여행자'],
    notRecommendedFor: ['도심형 호텔 서비스와 늦은 밤 편의시설을 기대하는 여행자', '차량 없이 이동하려는 여행자'],
    areaType: 'inje'
  },
  gangwon: {
    label: '강원',
    titleKeyword: '강원',
    locationQuestion: '강원 여행 일정에 맞나요?',
    locationAnswer:
      '강원 숙소는 바다, 산, 스키장, 도심 출장처럼 목적이 넓습니다. 호텔명만 보기보다 실제 주소와 목적지까지 이동 시간, 주차, 주변 편의시설을 함께 확인하세요.',
    recommendedFor: ['강원 지역에서 차량 이동을 기준으로 숙소를 고르는 여행자', '가격과 위치를 함께 비교하려는 여행자'],
    notRecommendedFor: ['주소 확인 없이 지역명만 보고 예약하려는 여행자', '객실 타입별 차이를 확인하지 않는 여행자'],
    areaType: 'gangwon'
  }
};

function buildTransportAnswer(areaType: GangwonAreaType) {
  if (areaType === 'sokcho' || areaType === 'gangneung' || areaType === 'yangyang' || areaType === 'goseong') {
    return '해변권 숙소는 도보 거리처럼 보여도 실제로는 차량 이동이 더 편한 경우가 있습니다. 해변, 시장, 터미널, 주요 관광지까지 이동 시간과 성수기 주차를 함께 확인하세요.';
  }
  if (areaType === 'pyeongchang' || areaType === 'hongcheon') {
    return '리조트나 산악 지역은 셔틀 여부와 차량 이동 시간이 중요합니다. 렌터카나 자차 이용 여부, 눈 오는 계절의 이동 조건까지 함께 보는 것이 좋습니다.';
  }
  return '강원 지역은 대중교통보다 차량 이동이 편한 숙소가 많습니다. 목적지와 숙소 사이 거리, 택시 이용 가능성, 주차 조건을 예약 전에 확인하세요.';
}

function buildIntentChips(hotel: Hotel, areaType: GangwonAreaType) {
  const text = searchableText(hotel);
  const chips = new Set<string>(['위치', '주차', '체크인']);

  if (areaType === 'sokcho' || areaType === 'gangneung' || areaType === 'goseong' || areaType === 'yangyang') chips.add('해변');
  if (areaType === 'pyeongchang' || areaType === 'hongcheon') chips.add('리조트');
  if (/가족|아이|family/i.test(text)) chips.add('가족');
  if (/커플|데이트|couple/i.test(text)) chips.add('커플');
  if (/조식|뷔페|breakfast/i.test(text)) chips.add('조식');
  if (/오션|바다|해변|산|전망|뷰/i.test(text)) chips.add('전망');
  if (/펜션|독채|villa|pension/i.test(text)) chips.add('펜션');

  return [...chips].slice(0, 6);
}

function hasAny(hotel: Hotel, keywords: string[]) {
  const text = searchableText(hotel).toLowerCase();
  return keywords.some((keyword) => text.includes(keyword.toLowerCase()));
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
    ...(analysis?.notRecommendedFor || []),
    ...(analysis?.checkPoints || [])
  ].join(' ');
}

function realLocationText(hotel: Hotel) {
  return [hotel.slug, hotel.region, hotel.address, hotel.hotelName].join(' ');
}
