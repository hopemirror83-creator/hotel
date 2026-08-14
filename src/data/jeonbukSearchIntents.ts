import type { Hotel } from './hotels';

type IntentFaq = {
  question: string;
  answer: string;
  category: string;
};

type JeonbukAreaType =
  | 'jeonju'
  | 'gunsan'
  | 'buan'
  | 'namwon-muju'
  | 'iksan-wanju'
  | 'gochang-jeongeup'
  | 'jeonbuk';

type JeonbukAreaProfile = {
  label: string;
  titleKeyword: string;
  areaType: JeonbukAreaType;
  locationQuestion: string;
  locationAnswer: string;
  recommendedFor: string[];
  notRecommendedFor: string[];
};

export function getJeonbukSearchIntent(hotel: Hotel) {
  if (!isJeonbukHotel(hotel)) return undefined;

  const area = pickJeonbukArea(hotel);
  const hotelName = hotel.hotelName.trim();
  const text = searchableText(hotel);
  const hasBreakfast = /조식|뷔페|breakfast/i.test(text);
  const hasHanok = /한옥|객리단길|전동성당|경기전|전주/i.test(text);
  const hasBeach = /변산|채석강|격포|부안|바다|오션|해수욕|beach|sea/i.test(text);
  const hasBusiness = /군산|익산|완주|덕진|터미널|출장|비즈니스|business/i.test(text);
  const hasFamily = /가족|리조트|펜션|남원|무주|덕유산|변산/i.test(text);

  const terms = buildTitleTerms(area.areaType, { hasBreakfast, hasHanok, hasBeach, hasBusiness, hasFamily });
  const title = `${hotelName} ${area.titleKeyword} 후기 모음 ${terms.join(' ')}`;

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
        '전북 여행은 차량 이동 비중이 높습니다. 무료 주차 여부, 객실당 차량 제한, 만차 시 대체 주차장, 한옥마을 주변 보행 구간을 함께 확인해두는 것이 안전합니다.'
    },
    {
      category: hasBreakfast ? '조식' : '객실',
      question: hasBreakfast
        ? `${hotelName} 조식 포함 예약이 유리할까요?`
        : `${hotelName} 객실은 어떤 기준으로 봐야 하나요?`,
      answer: hasBreakfast
        ? '조식을 중요하게 본다면 포함 요금과 현장 결제 요금을 비교해보는 것이 좋습니다. 전주·군산처럼 주변 식당 선택지가 많은 지역은 일정과 출발 시간을 함께 고려하세요.'
        : '객실은 면적, 침대 구성, 방음, 욕실 컨디션, 난방과 냉방 후기를 함께 보는 편이 좋습니다. 한옥형 숙소라면 방음과 욕실 구조 차이를 특히 확인하세요.'
    }
  ];

  if (hasBeach) {
    faqs.push({
      category: '바다전망',
      question: `${hotelName} 바다 전망은 어떻게 확인해야 하나요?`,
      answer:
        '변산·격포·채석강 인근 숙소는 객실 타입과 층수에 따라 전망 차이가 큽니다. 예약 전 객실명에 오션뷰가 명시되어 있는지, 실제 배정 기준이 있는지 확인하는 것이 좋습니다.'
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

export function isJeonbukHotel(hotel: Hotel) {
  const region = String(hotel.region || '').trim();
  return (
    hotel.slug.startsWith('jeonbuk-')
    || region === '\uC804\uBD81'
    || region === '\uC804\uB77C\uBD81\uB3C4'
    || region === '\uC804\uBD81\uD2B9\uBCC4\uC790\uCE58\uB3C4'
  );
}

function pickJeonbukArea(hotel: Hotel): JeonbukAreaProfile {
  const text = searchableText(hotel);
  if (/전주|한옥마을|객리단길|덕진|완산|경기전/.test(text)) {
    return {
      label: '전주',
      titleKeyword: '전주 한옥마을',
      areaType: 'jeonju',
      locationQuestion: '전주 한옥마을과 시내 이동에 맞나요?',
      locationAnswer:
        '전주 숙소는 한옥마을 도보권인지, 객리단길·전동성당·전주역 이동이 편한지에 따라 만족도가 갈립니다. 차량 이동이라면 주차 조건을 먼저 확인하는 편이 좋습니다.',
      recommendedFor: ['전주 한옥마을 여행', '커플 여행', '가족 여행', '짧은 주말 여행'],
      notRecommendedFor: ['조용한 외곽 휴양을 원하는 여행자', '대형 리조트형 시설을 기대하는 여행자']
    };
  }
  if (/군산|은파|근대화|장미|나운/.test(text)) {
    return {
      label: '군산',
      titleKeyword: '군산 근대화거리',
      areaType: 'gunsan',
      locationQuestion: '군산 근대화거리와 은파호수공원 일정에 맞나요?',
      locationAnswer:
        '군산은 근대화거리, 은파호수공원, 터미널 이동 동선이 중요합니다. 출장과 여행 목적에 따라 시내 접근성과 주차 편의성을 함께 비교하는 것이 좋습니다.',
      recommendedFor: ['군산 여행', '출장 숙박', '근대화거리 일정', '주차를 중시하는 여행자'],
      notRecommendedFor: ['한옥마을 중심 여행자', '바다 바로 앞 전망만 기대하는 여행자']
    };
  }
  if (/부안|변산|격포|채석강|모항|솔레이|비치/.test(text)) {
    return {
      label: '부안·변산',
      titleKeyword: '부안 변산 채석강',
      areaType: 'buan',
      locationQuestion: '변산반도와 채석강 여행에 맞나요?',
      locationAnswer:
        '부안과 변산 숙소는 채석강, 격포항, 모항, 해변 접근성이 핵심입니다. 오션뷰 기대가 있다면 객실 타입과 전망 조건을 따로 확인해야 합니다.',
      recommendedFor: ['바다 여행', '가족 여행', '드라이브 여행', '조용한 휴식'],
      notRecommendedFor: ['전주 도심 일정 중심 여행자', '대중교통만 이용하는 여행자']
    };
  }
  if (/남원|무주|덕유산|지리산|춘향/.test(text)) {
    return {
      label: '남원·무주',
      titleKeyword: '남원 무주 덕유산',
      areaType: 'namwon-muju',
      locationQuestion: '덕유산·지리산·남원 여행에 맞나요?',
      locationAnswer:
        '남원과 무주는 자연 관광, 스키장, 지리산·덕유산 일정에 따라 숙소 선택 기준이 달라집니다. 차량 이동 시간과 조식 운영 여부를 함께 보는 편이 좋습니다.',
      recommendedFor: ['자연 휴양', '가족 여행', '스키장 이용', '드라이브 여행'],
      notRecommendedFor: ['도심 식당과 카페 접근성을 중시하는 여행자', '늦은 밤 대중교통 이동 여행자']
    };
  }
  if (/익산|완주|김제/.test(text)) {
    return {
      label: '익산·완주',
      titleKeyword: '익산 완주 출장',
      areaType: 'iksan-wanju',
      locationQuestion: '익산역·완주 출장 동선에 맞나요?',
      locationAnswer:
        '익산과 완주는 역, 산업단지, 전주 접근성이 중요합니다. 출장 목적이라면 주차, 조식, 객실 책상과 방음 후기를 함께 확인하는 것이 좋습니다.',
      recommendedFor: ['출장 숙박', '익산역 이용', '가성비 숙박', '차량 이동 여행'],
      notRecommendedFor: ['전통 한옥 분위기를 기대하는 여행자', '해변 휴양 목적 여행자']
    };
  }
  if (/고창|정읍|선운산|내장산/.test(text)) {
    return {
      label: '고창·정읍',
      titleKeyword: '고창 정읍 선운산',
      areaType: 'gochang-jeongeup',
      locationQuestion: '선운산·내장산 여행에 맞나요?',
      locationAnswer:
        '고창과 정읍 숙소는 선운산, 내장산, 읍내 식당 접근성, 차량 이동 시간이 중요합니다. 성수기에는 주차와 체크인 시간을 미리 확인하는 편이 좋습니다.',
      recommendedFor: ['선운산 여행', '내장산 여행', '가족 드라이브', '조용한 숙박'],
      notRecommendedFor: ['도심형 호텔 서비스를 기대하는 여행자', '늦은 밤 이동이 많은 여행자']
    };
  }
  return {
    label: '전북',
    titleKeyword: '전북 여행',
    areaType: 'jeonbuk',
    locationQuestion: '전북 여행 동선에 맞나요?',
    locationAnswer:
      '전북은 전주, 군산, 부안, 남원, 무주처럼 여행 목적에 따라 이동 거리가 크게 달라집니다. 숙소를 고를 때는 도시명보다 실제 방문지와 주차 조건을 먼저 확인하는 편이 좋습니다.',
    recommendedFor: ['전북 여행', '가족 여행', '차량 이동 여행', '가성비 숙박'],
    notRecommendedFor: ['방문 지역이 아직 정해지지 않은 여행자', '대중교통만으로 여러 지역을 이동하는 여행자']
  };
}

function buildTitleTerms(
  areaType: JeonbukAreaType,
  flags: { hasBreakfast: boolean; hasHanok: boolean; hasBeach: boolean; hasBusiness: boolean; hasFamily: boolean }
) {
  const terms: string[] = [];
  if (areaType === 'jeonju') terms.push(flags.hasHanok ? '한옥마을' : '전주역', '체크인', '주차');
  if (areaType === 'gunsan') terms.push('근대화거리', flags.hasBusiness ? '출장' : '위치', '주차');
  if (areaType === 'buan') terms.push(flags.hasBeach ? '오션뷰' : '변산반도', '가족', '주차');
  if (areaType === 'namwon-muju') terms.push('가족', '리조트', '조식');
  if (areaType === 'iksan-wanju') terms.push('출장', '익산역', '주차');
  if (areaType === 'gochang-jeongeup') terms.push('선운산', '가족', '주차');
  if (areaType === 'jeonbuk') terms.push('위치', '체크인', '주차');
  if (flags.hasBreakfast && !terms.includes('조식')) terms.push('조식');
  if (flags.hasFamily && !terms.includes('가족')) terms.push('가족');
  return [...new Set(terms)].slice(0, 5);
}

function buildTransportAnswer(areaType: JeonbukAreaType) {
  if (areaType === 'jeonju') {
    return '전주 한옥마을 일정이라면 도보권인지, 전주역·터미널에서 택시 이동이 편한지, 한옥마을 내부 차량 진입 제한이 있는지 확인하는 것이 좋습니다.';
  }
  if (areaType === 'gunsan') {
    return '군산은 근대화거리, 은파호수공원, 터미널 사이 이동이 핵심입니다. 차량이 있다면 주차가 편한 숙소가 일정 부담을 줄여줍니다.';
  }
  if (areaType === 'buan') {
    return '부안·변산은 대중교통보다 차량 이동이 편한 지역입니다. 채석강, 격포항, 해변까지 실제 이동 시간을 지도에서 확인하는 편이 좋습니다.';
  }
  if (areaType === 'namwon-muju') {
    return '남원·무주는 관광지 간 거리가 있는 편입니다. 덕유산, 지리산, 광한루 등 목적지별 이동 시간을 먼저 잡고 숙소를 비교하세요.';
  }
  return '전북 여행은 도시 간 이동 시간이 길어질 수 있습니다. 실제 방문지, 주차장, 체크인 가능 시간을 함께 보고 예약하는 편이 안전합니다.';
}

function searchableText(hotel: Hotel) {
  return [
    hotel.slug,
    hotel.hotelName,
    hotel.region,
    hotel.address,
    hotel.analysis?.seoTitle,
    hotel.analysis?.metaDescription,
    hotel.analysis?.summary,
    ...(hotel.analysis?.pros ?? []),
    ...(hotel.analysis?.checkPoints ?? [])
  ]
    .filter(Boolean)
    .join(' ');
}
