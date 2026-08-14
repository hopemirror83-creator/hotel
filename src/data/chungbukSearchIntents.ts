import type { Hotel } from './hotels';

type IntentFaq = {
  question: string;
  answer: string;
  category: string;
};

type ChungbukAreaType =
  | 'cheongju-osong'
  | 'chungju'
  | 'jecheon-cheongpung'
  | 'danyang'
  | 'boeun-sokrisan'
  | 'jincheon-eumseong'
  | 'chungbuk';

type ChungbukAreaProfile = {
  label: string;
  titleKeyword: string;
  areaType: ChungbukAreaType;
  locationQuestion: string;
  locationAnswer: string;
  recommendedFor: string[];
  notRecommendedFor: string[];
};

export function getChungbukSearchIntent(hotel: Hotel) {
  if (!isChungbukHotel(hotel)) return undefined;

  const area = pickChungbukArea(hotel);
  const hotelName = hotel.hotelName.trim();
  const text = searchableText(hotel);
  const hasBreakfast = /조식|뷔페|breakfast/i.test(text);
  const hasBusiness = /청주|오송|오창|충북대|터미널|출장|비즈니스|business/i.test(text);
  const hasLake = /청풍|제천|충주호|호수|리솜|리조트|lake|resort/i.test(text);
  const hasNature = /단양|소백산|도담|속리산|월악산|계곡|펜션|캠핑|자연/i.test(text);
  const hasFamily = /가족|리조트|펜션|풀빌라|카라반|캠핑|한옥|스파|resort|pool/i.test(text);

  const terms = buildTitleTerms(area.areaType, { hasBreakfast, hasBusiness, hasLake, hasNature, hasFamily });
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
        '도착 시간이 늦거나 짐 보관이 필요한 일정이라면 체크인 가능 시간, 프런트 운영 방식, 주차장 위치를 먼저 확인하는 것이 좋습니다. 주말이나 성수기에는 체크인 대기가 생길 수 있습니다.'
    },
    {
      category: '주차',
      question: `${hotelName} 주차는 예약 전에 확인해야 하나요?`,
      answer:
        '충북 여행은 차량 이동 비중이 높은 편입니다. 무료 주차 여부, 객실당 차량 제한, 만차 시 대체 주차장, 관광지까지 실제 이동 거리를 함께 확인해두는 편이 안전합니다.'
    },
    {
      category: hasBreakfast ? '조식' : '객실',
      question: hasBreakfast
        ? `${hotelName} 조식 포함 예약이 유리할까요?`
        : `${hotelName} 객실은 어떤 기준으로 봐야 하나요?`,
      answer: hasBreakfast
        ? '조식을 중요하게 본다면 포함 요금과 현장 결제 요금을 비교해보는 것이 좋습니다. 청주·오송 출장 일정이나 단양·제천 여행처럼 아침 이동이 빠른 일정이라면 조식 시작 시간도 함께 확인해야 합니다.'
        : '객실은 면적, 침대 구성, 방음, 욕실 컨디션, 냉난방 후기를 함께 보는 편이 좋습니다. 펜션이나 리조트형 숙소라면 객실 타입과 부대시설 이용 조건 차이가 있을 수 있습니다.'
    }
  ];

  if (hasNature) {
    faqs.push({
      category: '관광지',
      question: `${hotelName} 주변 관광지는 어떻게 확인해야 하나요?`,
      answer:
        '단양, 제천, 속리산, 월악산처럼 자연 관광지가 중심인 지역은 실제 이동 시간이 중요합니다. 지도상 거리보다 산길, 주차, 성수기 혼잡 여부가 체감 만족도에 더 큰 영향을 줄 수 있습니다.'
    });
  }

  if (hasLake) {
    faqs.push({
      category: '전망',
      question: `${hotelName} 호수 전망이나 리조트 분위기는 기대해도 될까요?`,
      answer:
        '청풍·제천·충주호 주변 숙소는 객실 타입과 층수에 따라 전망 차이가 큽니다. 예약 전 객실명에 전망 조건이 명시되어 있는지, 실제 배정 기준이 따로 있는지 확인하는 것이 좋습니다.'
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

export function isChungbukHotel(hotel: Hotel) {
  return hotel.slug.startsWith('chungbuk-') || /충북|충청북도|청주|오송|오창|충주|제천|단양|보은|속리산|진천|음성|괴산|증평|옥천|영동/.test(searchableText(hotel));
}

function pickChungbukArea(hotel: Hotel): ChungbukAreaProfile {
  const text = searchableText(hotel);
  if (/청주|오송|오창|충북대|성안길|청주대|터미널/.test(text)) {
    return {
      label: '청주·오송',
      titleKeyword: '청주 오송',
      areaType: 'cheongju-osong',
      locationQuestion: '청주공항, 오송역, 청주터미널 일정에 맞나요?',
      locationAnswer:
        '청주·오송 숙소는 오송역, 청주터미널, 청주공항, 오창산단 중 어디를 중심으로 움직이는지에 따라 만족도가 달라집니다. 출장이라면 주차와 조식, 여행이라면 성안길이나 주변 식당 접근성을 함께 보는 편이 좋습니다.',
      recommendedFor: ['청주 출장', '오송역 이동', '청주공항 이용', '청주 시내 숙박'],
      notRecommendedFor: ['자연 경관 중심 여행자', '리조트형 휴식을 기대하는 여행자']
    };
  }
  if (/충주|수안보|중앙탑|탄금/.test(text)) {
    return {
      label: '충주',
      titleKeyword: '충주 수안보',
      areaType: 'chungju',
      locationQuestion: '충주역, 수안보, 중앙탑 일정에 맞나요?',
      locationAnswer:
        '충주 숙소는 충주 시내, 수안보, 중앙탑·탄금대 방향에 따라 이동 동선이 다릅니다. 차량 이동이라면 주차와 도로 접근성, 대중교통이라면 역·터미널과의 거리를 우선 확인하는 것이 좋습니다.',
      recommendedFor: ['충주 출장', '수안보 여행', '차량 이동 여행', '가성비 숙박'],
      notRecommendedFor: ['청주·오송 일정 중심 여행자', '도보 관광만 원하는 여행자']
    };
  }
  if (/제천|청풍|리솜|충주호|의림지|월악산/.test(text)) {
    return {
      label: '제천·청풍',
      titleKeyword: '제천 청풍호',
      areaType: 'jecheon-cheongpung',
      locationQuestion: '청풍호, 의림지, 월악산 일정에 맞나요?',
      locationAnswer:
        '제천·청풍 숙소는 청풍호, 의림지, 월악산, 제천역 중 어디를 중심으로 볼지에 따라 선택 기준이 달라집니다. 전망과 리조트 분위기를 기대한다면 객실 타입과 부대시설 조건을 함께 확인해야 합니다.',
      recommendedFor: ['청풍호 여행', '제천 가족 여행', '리조트 휴식', '월악산 일정'],
      notRecommendedFor: ['청주 도심 일정 여행자', '대중교통만 이용하는 여행자']
    };
  }
  if (/단양|소백산|도담|고수동굴|만천하|구경시장/.test(text)) {
    return {
      label: '단양',
      titleKeyword: '단양 소백산',
      areaType: 'danyang',
      locationQuestion: '도담삼봉, 구경시장, 소백산 일정에 맞나요?',
      locationAnswer:
        '단양 숙소는 도담삼봉, 만천하스카이워크, 구경시장, 소백산 방향에 따라 실제 이동 시간이 달라집니다. 펜션형 숙소가 많아 객실 구조, 취사 가능 여부, 주차 조건을 같이 보는 것이 좋습니다.',
      recommendedFor: ['단양 가족 여행', '자연 관광', '펜션 숙박', '차량 이동 여행'],
      notRecommendedFor: ['도심형 호텔 서비스를 기대하는 여행자', '대중교통 중심 여행자']
    };
  }
  if (/보은|속리산|말티|정이품송/.test(text)) {
    return {
      label: '보은·속리산',
      titleKeyword: '보은 속리산',
      areaType: 'boeun-sokrisan',
      locationQuestion: '속리산과 보은 여행 일정에 맞나요?',
      locationAnswer:
        '보은·속리산 숙소는 등산, 가족 여행, 조용한 휴식 목적에 따라 만족도가 달라집니다. 주변 식당과 편의시설 운영 시간이 제한적일 수 있어 체크인 전 동선을 미리 보는 편이 좋습니다.',
      recommendedFor: ['속리산 여행', '조용한 휴식', '가족 여행', '차량 이동 여행'],
      notRecommendedFor: ['야간 도심 편의시설을 기대하는 여행자', '청주 시내 일정 여행자']
    };
  }
  if (/진천|음성|충북혁신|증평|괴산|옥천|영동/.test(text)) {
    return {
      label: '진천·음성·혁신도시',
      titleKeyword: '진천 음성 충북혁신도시',
      areaType: 'jincheon-eumseong',
      locationQuestion: '충북혁신도시, 진천, 음성 출장 일정에 맞나요?',
      locationAnswer:
        '진천·음성·충북혁신도시 숙소는 출장과 차량 이동 수요가 많습니다. 목적지까지 이동 시간, 주차, 주변 식당, 객실 책상과 방음 후기를 함께 확인하는 것이 좋습니다.',
      recommendedFor: ['충북혁신도시 출장', '진천·음성 출장', '차량 이동 숙박', '가성비 숙박'],
      notRecommendedFor: ['관광지 도보 접근을 원하는 여행자', '리조트형 휴식을 기대하는 여행자']
    };
  }
  return {
    label: '충북',
    titleKeyword: '충북 여행',
    areaType: 'chungbuk',
    locationQuestion: '충북 여행 동선에 맞나요?',
    locationAnswer:
      '충북은 청주·오송, 충주, 제천·청풍, 단양, 속리산처럼 목적지가 넓게 나뉩니다. 숙소를 고를 때는 지역명보다 실제 방문지와 차량 이동 시간을 먼저 맞추는 것이 좋습니다.',
    recommendedFor: ['충북 여행', '차량 이동 여행', '가족 여행', '가성비 숙박'],
    notRecommendedFor: ['방문 지역이 아직 정해지지 않은 여행자', '대중교통만으로 여러 지역을 이동하려는 여행자']
  };
}

function buildTitleTerms(
  areaType: ChungbukAreaType,
  flags: { hasBreakfast: boolean; hasBusiness: boolean; hasLake: boolean; hasNature: boolean; hasFamily: boolean }
) {
  const terms: string[] = [];
  if (areaType === 'cheongju-osong') terms.push(flags.hasBusiness ? '출장' : '위치', '주차', '조식');
  if (areaType === 'chungju') terms.push('충주역', '주차', '가성비');
  if (areaType === 'jecheon-cheongpung') terms.push(flags.hasLake ? '청풍호' : '제천역', '가족', '주차');
  if (areaType === 'danyang') terms.push('가족', flags.hasNature ? '소백산' : '위치', '취사');
  if (areaType === 'boeun-sokrisan') terms.push('속리산', '가족', '주차');
  if (areaType === 'jincheon-eumseong') terms.push('출장', '주차', '가성비');
  if (areaType === 'chungbuk') terms.push('위치', '체크인', '주차');
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

function buildTransportAnswer(areaType: ChungbukAreaType) {
  if (areaType === 'cheongju-osong') return '청주·오송은 오송역, 청주공항, 터미널, 오창산단의 방향이 서로 다릅니다. 출장이라면 목적지와 주차 조건을 먼저 맞추고, 여행이라면 주변 식당과 이동 시간을 함께 확인하는 것이 좋습니다.';
  if (areaType === 'chungju') return '충주는 충주역, 충주터미널, 수안보, 중앙탑 방향에 따라 이동 시간이 달라집니다. 차량 이동이 편한 숙소인지, 대중교통 접근성이 필요한지 먼저 정리해두는 편이 좋습니다.';
  if (areaType === 'jecheon-cheongpung') return '제천·청풍은 청풍호와 월악산, 제천역 사이의 거리가 체감상 크게 느껴질 수 있습니다. 전망보다 실제 방문지와의 차량 이동 시간을 먼저 확인하세요.';
  if (areaType === 'danyang') return '단양은 자연 관광지가 분산되어 있어 차량 이동 계획이 중요합니다. 구경시장, 도담삼봉, 소백산, 만천하스카이워크 중 어디를 볼지 정한 뒤 숙소 위치를 맞추는 편이 좋습니다.';
  if (areaType === 'boeun-sokrisan') return '보은·속리산은 자가용 이동이 편한 지역입니다. 등산이나 가족 여행 일정이라면 주차와 주변 식당 운영 시간, 체크인 가능 시간을 함께 확인하세요.';
  if (areaType === 'jincheon-eumseong') return '진천·음성·충북혁신도시는 출장 목적지가 분산되어 있습니다. 목적지까지의 차량 이동 시간, 주차, 주변 편의시설을 우선 확인하는 것이 좋습니다.';
  return '충북은 지역 간 거리가 있어 숙소 위치가 일정 전체에 영향을 줍니다. 실제 방문지, 주차, 체크인 시간을 함께 보고 예약하는 것이 안전합니다.';
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
