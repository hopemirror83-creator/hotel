import type { Hotel } from './hotels';

type IntentFaq = {
  question: string;
  answer: string;
  category: string;
};

type ChungnamAreaType =
  | 'cheonan-asan'
  | 'boryeong-daecheon'
  | 'taean-anmyeondo'
  | 'gongju-buyeo'
  | 'seosan-dangjin'
  | 'yesan-deoksan'
  | 'nonsan-geumsan'
  | 'chungnam';

type ChungnamAreaProfile = {
  label: string;
  titleKeyword: string;
  areaType: ChungnamAreaType;
  locationQuestion: string;
  locationAnswer: string;
  recommendedFor: string[];
  notRecommendedFor: string[];
};

export function getChungnamSearchIntent(hotel: Hotel) {
  if (!isChungnamHotel(hotel)) return undefined;

  const area = pickChungnamArea(hotel);
  const hotelName = hotel.hotelName.trim();
  const text = searchableText(hotel);
  const hasBreakfast = /조식|뷔페|breakfast/i.test(text);
  const hasBeach = /대천|보령|태안|안면도|만리포|몽산포|꽃지|바다|오션|해수욕장|beach|ocean|sea/i.test(text);
  const hasBusiness = /천안|아산|서산|당진|비즈니스|출장|터미널|산업|business/i.test(text);
  const hasFamily = /가족|리조트|펜션|풀빌라|스파|온천|해변|바다|resort|pool/i.test(text);
  const hasSpa = /온천|스파|덕산|도고|리솜|spa/i.test(text);

  const terms = buildTitleTerms(area.areaType, { hasBreakfast, hasBeach, hasBusiness, hasFamily, hasSpa });
  const title = composeIntentTitle(hotelName, area.titleKeyword, terms);

  const faqs: IntentFaq[] = [
    {
      category: '위치',
      question: `${hotelName}은 ${area.locationQuestion}`,
      answer: area.locationAnswer
    },
    {
      category: '교통',
      question: `${hotelName} 예약 전에 이동 동선은 무엇을 확인해야 하나요?`,
      answer: buildTransportAnswer(area.areaType)
    },
    {
      category: '체크인',
      question: `${hotelName} 체크인 전에는 어떤 점을 봐야 하나요?`,
      answer:
        '도착 시간이 늦거나 짐보관이 필요한 일정이라면 체크인 가능 시간, 프런트 운영 방식, 주차장 위치를 먼저 확인하는 편이 좋습니다. 주말과 성수기에는 대기 시간이 생길 수 있습니다.'
    },
    {
      category: '주차',
      question: `${hotelName} 주차는 예약 전에 확인해야 하나요?`,
      answer:
        '충남 여행은 차량 이동 비중이 높은 편입니다. 무료 주차 여부, 객실당 차량 제한, 만차 시 대체 주차장, 해변이나 관광지까지의 실제 이동 거리를 함께 확인해두는 것이 안전합니다.'
    },
    {
      category: hasBreakfast ? '조식' : '객실',
      question: hasBreakfast
        ? `${hotelName} 조식 포함 예약이 유리할까요?`
        : `${hotelName} 객실은 어떤 기준으로 봐야 하나요?`,
      answer: hasBreakfast
        ? '조식을 중요하게 본다면 포함 요금과 현장 결제 요금을 비교해보는 것이 좋습니다. 천안·아산 출장 일정이나 대천·태안 여행처럼 아침 이동이 빠른 일정이라면 조식 시작 시간도 함께 확인하세요.'
        : '객실은 면적, 침대 구성, 방음, 욕실 컨디션, 냉난방 평가를 함께 보는 편이 좋습니다. 펜션이나 리조트형 숙소라면 객실 타입과 부대시설 이용 조건 차이가 클 수 있습니다.'
    }
  ];

  if (hasBeach) {
    faqs.push({
      category: '바다전망',
      question: `${hotelName} 바다전망은 어떻게 확인해야 하나요?`,
      answer:
        '대천·태안·안면도 숙소는 객실 타입과 층수에 따라 전망 차이가 큽니다. 예약 전 객실명에 오션뷰가 명시되어 있는지, 실제 배정 기준이 있는지 확인하는 것이 좋습니다.'
    });
  }

  if (hasSpa) {
    faqs.push({
      category: '온천·스파',
      question: `${hotelName} 온천이나 스파 이용 조건은 무엇을 봐야 하나요?`,
      answer:
        '덕산·도고·스파형 숙소는 투숙객 무료 이용 여부, 운영 시간, 성수기 혼잡도, 아이 동반 가능 여부를 확인해야 합니다. 객실 요금과 부대시설 요금이 분리될 수 있습니다.'
    });
  }

  return {
    title,
    seoTitle: `${title} | 예약 전 FAQ`,
    metaDescription: `${hotelName} 후기를 ${area.label} 위치, 체크인, 주차, 조식, 객실 조건 중심으로 정리했습니다.`,
    intentChips: terms,
    faqs,
    recommendedFor: area.recommendedFor,
    notRecommendedFor: area.notRecommendedFor
  };
}

export function isChungnamHotel(hotel: Hotel) {
  return hotel.slug.startsWith('chungnam-') || /충남|충청남도|천안|아산|보령|대천|태안|안면도|공주|부여|서산|당진|논산|예산|덕산|금산|서천|홍성|계룡/.test(searchableText(hotel));
}

function pickChungnamArea(hotel: Hotel): ChungnamAreaProfile {
  const text = searchableText(hotel);
  if (/천안|아산|불당|성정|신부|두정|도고|온양/.test(text)) {
    return {
      label: '천안·아산',
      titleKeyword: '천안 아산',
      areaType: 'cheonan-asan',
      locationQuestion: '천안아산역, 불당, 온양온천 일정에 맞나요?',
      locationAnswer:
        '천안·아산 숙소는 KTX 천안아산역, 불당 업무지구, 온양온천, 도고온천 중 어디를 중심으로 움직이는지에 따라 만족도가 달라집니다. 출장이라면 주차와 조식, 여행이라면 역과 온천 접근성을 함께 확인하는 것이 좋습니다.',
      recommendedFor: ['천안·아산 출장', 'KTX 이동 여행', '온천 일정', '차량 이동 여행'],
      notRecommendedFor: ['바다 전망을 기대하는 여행자', '도보 관광지 중심 일정을 원하는 여행자']
    };
  }
  if (/보령|대천|머드|무창포|해수욕장/.test(text)) {
    return {
      label: '보령·대천',
      titleKeyword: '보령 대천해수욕장',
      areaType: 'boryeong-daecheon',
      locationQuestion: '대천해수욕장과 머드광장 일정에 맞나요?',
      locationAnswer:
        '보령·대천 숙소는 해수욕장 접근성, 주차, 성수기 가격, 객실 전망 차이가 중요합니다. 바다를 보려는 여행이라면 객실 타입에 오션뷰가 명확히 적혀 있는지 확인해야 합니다.',
      recommendedFor: ['대천해수욕장 여행', '가족 여행', '커플 바다 여행', '여름 성수기 여행'],
      notRecommendedFor: ['조용한 산림 휴식을 원하는 여행자', '대중교통만으로 여러 지역을 이동하는 여행자']
    };
  }
  if (/태안|안면도|만리포|몽산포|꽃지|리솜|오션|바다/.test(text)) {
    return {
      label: '태안·안면도',
      titleKeyword: '태안 안면도 오션뷰',
      areaType: 'taean-anmyeondo',
      locationQuestion: '안면도, 만리포, 몽산포 바다 일정에 맞나요?',
      locationAnswer:
        '태안·안면도 숙소는 해변까지의 실제 거리와 객실 전망, 바비큐나 스파 같은 부대시설 조건이 중요합니다. 성수기에는 주차와 체크인 대기가 생길 수 있어 미리 확인하는 편이 안전합니다.',
      recommendedFor: ['오션뷰 여행', '가족 펜션 여행', '커플 여행', '바비큐·스파 숙소 선호 여행자'],
      notRecommendedFor: ['대중교통 접근성을 가장 중시하는 여행자', '도심형 호텔 서비스를 기대하는 여행자']
    };
  }
  if (/공주|부여|백제|동학사|구드래|한옥/.test(text)) {
    return {
      label: '공주·부여',
      titleKeyword: '공주 부여 백제문화',
      areaType: 'gongju-buyeo',
      locationQuestion: '백제문화단지, 공산성, 동학사 일정에 맞나요?',
      locationAnswer:
        '공주·부여 숙소는 백제문화단지, 공산성, 동학사, 구드래 일정을 기준으로 위치를 보는 것이 좋습니다. 한옥이나 게스트하우스형 숙소는 방음, 욕실 구조, 주차 조건을 함께 확인하세요.',
      recommendedFor: ['역사 여행', '가족 여행', '공주·부여 주말 여행', '한옥 분위기 숙소 선호 여행자'],
      notRecommendedFor: ['대형 리조트 부대시설을 기대하는 여행자', '늦은 밤 도심 편의시설을 중시하는 여행자']
    };
  }
  if (/서산|당진|대산|삽교|한진포구|해미/.test(text)) {
    return {
      label: '서산·당진',
      titleKeyword: '서산 당진 출장 주차',
      areaType: 'seosan-dangjin',
      locationQuestion: '서산, 당진, 대산 출장이나 차량 이동 일정에 맞나요?',
      locationAnswer:
        '서산·당진 숙소는 대산 산업단지, 당진터미널, 삽교호, 한진포구 등 목적지와의 차량 이동 시간이 중요합니다. 출장이라면 주차와 객실 책상, 조식 운영 여부를 먼저 확인하는 것이 좋습니다.',
      recommendedFor: ['서산·당진 출장', '차량 이동 여행', '가성비 숙소 선호 여행자', '터미널 근처 숙박'],
      notRecommendedFor: ['도보 관광 중심 여행자', '리조트형 부대시설을 기대하는 여행자']
    };
  }
  if (/예산|덕산|스플라스|리솜|온천|삽교/.test(text)) {
    return {
      label: '예산·덕산',
      titleKeyword: '예산 덕산온천',
      areaType: 'yesan-deoksan',
      locationQuestion: '덕산온천, 스플라스 리솜, 예산 여행에 맞나요?',
      locationAnswer:
        '예산·덕산 숙소는 온천이나 스파 이용 조건, 가족 동반 편의성, 주차와 주변 식당 접근성을 함께 보는 것이 좋습니다. 리조트형 숙소는 부대시설 포함 여부에 따라 체감 가격이 달라질 수 있습니다.',
      recommendedFor: ['온천 여행', '가족 여행', '스파 리조트 선호 여행자', '예산 주말 여행'],
      notRecommendedFor: ['해변 접근을 기대하는 여행자', '도심 야간 이동이 많은 여행자']
    };
  }
  if (/논산|금산|서천|계룡|청양|칠갑산/.test(text)) {
    return {
      label: '논산·금산·서천',
      titleKeyword: '논산 금산 서천',
      areaType: 'nonsan-geumsan',
      locationQuestion: '논산, 금산, 서천 여행이나 출장 일정에 맞나요?',
      locationAnswer:
        '논산·금산·서천 숙소는 방문 목적지가 분산되어 있어 차량 이동 시간이 중요합니다. 조용한 숙박을 원한다면 주차, 객실 방음, 주변 식당 운영 시간을 함께 확인하세요.',
      recommendedFor: ['차량 이동 여행', '조용한 숙박', '출장 숙박', '지역 관광 일정'],
      notRecommendedFor: ['도보 중심 관광을 원하는 여행자', '대형 호텔 서비스를 기대하는 여행자']
    };
  }
  return {
    label: '충남',
    titleKeyword: '충남 여행',
    areaType: 'chungnam',
    locationQuestion: '충남 여행 동선에 맞나요?',
    locationAnswer:
      '충남은 천안·아산, 보령·대천, 태안·안면도, 공주·부여처럼 목적지가 넓게 퍼져 있습니다. 숙소를 고를 때는 지역명보다 실제 방문지와 차량 이동 시간을 먼저 확인하는 편이 좋습니다.',
    recommendedFor: ['충남 여행', '차량 이동 여행', '가족 여행', '가성비 숙소 선호 여행자'],
    notRecommendedFor: ['방문 지역이 아직 정해지지 않은 여행자', '대중교통만으로 여러 지역을 이동하려는 여행자']
  };
}

function buildTitleTerms(
  areaType: ChungnamAreaType,
  flags: { hasBreakfast: boolean; hasBeach: boolean; hasBusiness: boolean; hasFamily: boolean; hasSpa: boolean }
) {
  const terms: string[] = [];
  if (areaType === 'cheonan-asan') terms.push(flags.hasBusiness ? '출장' : '천안아산역', '주차', '조식');
  if (areaType === 'boryeong-daecheon') terms.push('대천해수욕장', flags.hasBeach ? '오션뷰' : '위치', '주차');
  if (areaType === 'taean-anmyeondo') terms.push('오션뷰', '가족', '스파');
  if (areaType === 'gongju-buyeo') terms.push('백제문화', '가족', '주차');
  if (areaType === 'seosan-dangjin') terms.push('출장', '주차', '가성비');
  if (areaType === 'yesan-deoksan') terms.push('온천', '가족', '조식');
  if (areaType === 'nonsan-geumsan') terms.push('위치', '주차', '가성비');
  if (areaType === 'chungnam') terms.push('위치', '체크인', '주차');
  if (flags.hasBreakfast && !terms.includes('조식')) terms.push('조식');
  if (flags.hasFamily && !terms.includes('가족')) terms.push('가족');
  return [...new Set(terms)].slice(0, 5);
}

function composeIntentTitle(hotelName: string, titleKeyword: string, terms: string[]) {
  const base = `${hotelName} ${titleKeyword} 후기 모음`;
  const baseWords = new Set(base.split(/\s+/).filter(Boolean));
  const uniqueTerms = terms.filter((term) => term.split(/\s+/).every((word) => !baseWords.has(word)));

  return `${base} ${uniqueTerms.slice(0, 4).join(' ')}`.trim();
}

function buildTransportAnswer(areaType: ChungnamAreaType) {
  if (areaType === 'cheonan-asan') return '천안·아산은 KTX 천안아산역, 불당, 두정, 온양온천 사이 이동 시간이 중요합니다. 출장이라면 목적지와 주차 조건을 먼저 맞추는 편이 좋습니다.';
  if (areaType === 'boryeong-daecheon') return '보령·대천은 해수욕장 접근성과 성수기 주차가 핵심입니다. 바다와 가까운 숙소라도 실제 도보 거리와 주차장 위치는 따로 확인하세요.';
  if (areaType === 'taean-anmyeondo') return '태안·안면도는 차량 이동이 거의 필수인 지역입니다. 만리포, 몽산포, 꽃지 등 실제 방문 해변과 숙소 사이의 이동 시간을 먼저 확인하는 것이 좋습니다.';
  if (areaType === 'gongju-buyeo') return '공주·부여는 공산성, 동학사, 백제문화단지 등 목적지가 나뉘어 있습니다. 도보권 숙소인지 차량 이동형 숙소인지에 따라 만족도가 달라집니다.';
  if (areaType === 'seosan-dangjin') return '서산·당진은 터미널, 산업단지, 포구 이동 동선이 중요합니다. 출장 목적이라면 주차와 아침 이동 시간을 함께 보는 편이 좋습니다.';
  if (areaType === 'yesan-deoksan') return '예산·덕산은 온천, 스파, 리조트 이용 여부에 따라 동선이 달라집니다. 차량 이동 시간과 부대시설 운영 시간을 함께 확인하세요.';
  return '충남은 지역 간 거리가 넓어 숙소 위치가 일정 전체에 큰 영향을 줍니다. 실제 방문지, 주차, 체크인 시간을 함께 보고 예약하는 것이 안전합니다.';
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
