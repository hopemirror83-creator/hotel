import type { Hotel } from './hotels';

type IntentFaq = {
  question: string;
  answer: string;
  category: string;
};

type JeonnamAreaType = 'yeosu' | 'mokpo' | 'suncheon' | 'damyang' | 'wando' | 'gwangyang-naju' | 'jeonnam';

type JeonnamAreaProfile = {
  label: string;
  titleKeyword: string;
  locationQuestion: string;
  locationAnswer: string;
  recommendedFor: string[];
  notRecommendedFor: string[];
  areaType: JeonnamAreaType;
};

const SOURCE_NOTE =
  '네이버와 구글 자동완성에서 반복되는 전남 호텔 검색 의도와 호텔로그의 공개 후기 분석 데이터를 함께 반영했습니다.';

export function getJeonnamSearchIntent(hotel: Hotel) {
  if (!isJeonnamHotel(hotel)) return undefined;

  const area = pickJeonnamArea(hotel);
  const hotelName = hotel.hotelName;
  const text = searchableText(hotel);
  const hasBreakfast = /조식|뷔페|breakfast/i.test(text);
  const hasOcean = /오션|바다|해변|해수욕장|돌산|목포|완도|신안|고흥|sea|ocean/i.test(text);
  const hasFamily = /가족|리조트|펜션|풀빌라|수영장|아이|family/i.test(text);

  const faqs: IntentFaq[] = [
    {
      category: '위치',
      question: `${hotelName}은 ${area.locationQuestion}`,
      answer: area.locationAnswer
    },
    {
      category: '교통',
      question: `${hotelName} 예약 전 이동 동선은 무엇을 봐야 하나요?`,
      answer: buildTransportAnswer(area.areaType)
    },
    {
      category: '체크인',
      question: `${hotelName} 체크인 전에는 무엇을 확인해야 하나요?`,
      answer:
        '전남 여행지는 KTX역, 항구, 관광지 이동 시간이 숙소마다 크게 다릅니다. 체크인 가능 시간, 짐 보관, 주차장 위치, 늦은 도착 가능 여부를 함께 확인하는 편이 좋습니다.'
    },
    {
      category: '주차',
      question: `${hotelName} 주차는 예약 전에 확인해야 하나요?`,
      answer:
        '여수 돌산, 목포 평화광장, 순천만, 담양 관광지 주변은 성수기와 주말에 주차 체감이 달라질 수 있습니다. 무료 주차 여부, 객실당 차량 제한, 만차 시 대체 주차장을 확인해두는 것이 안전합니다.'
    },
    {
      category: hasBreakfast ? '조식' : '객실',
      question: hasBreakfast
        ? `${hotelName} 조식 포함 예약이 유리할까요?`
        : `${hotelName} 객실은 어떤 점을 봐야 하나요?`,
      answer: hasBreakfast
        ? '조식을 중요하게 본다면 포함 요금과 현장 결제 요금을 비교해보세요. 여수나 목포처럼 아침 식사 선택지가 있는 지역은 이동 시간과 조식 시작 시간도 같이 보는 것이 좋습니다.'
        : '객실은 면적, 침대 구성, 욕실 구조, 방음, 전망 여부를 함께 봐야 합니다. 펜션이나 리조트형 숙소라면 취사 가능 여부와 객실별 시설 차이도 확인해야 합니다.'
    }
  ];

  if (hasOcean) {
    faqs.push({
      category: '오션뷰',
      question: `${hotelName} 오션뷰는 예약 전에 어떻게 확인해야 하나요?`,
      answer:
        '오션뷰 표기는 객실 타입과 층수에 따라 체감이 크게 달라질 수 있습니다. 바다 정면 전망인지, 부분 전망인지, 객실명에 전망 보장이 포함되는지 확인하는 것이 좋습니다.'
    });
  }

  const titleTail = buildSpecificTitleKeyword(hotel, area)
    .split(' ')
    .filter((part) => part && !hotelName.includes(part))
    .join(' ');
  const titleTerms = buildTitleTerms(area.areaType, { hasOcean, hasBreakfast, hasFamily });
  const title = `${hotelName}${titleTail ? ` ${titleTail}` : ''} 후기 모음 ${titleTerms.join(' ')}`;

  return {
    slug: hotel.slug,
    title,
    seoTitle: `${title}｜예약 전 FAQ`,
    metaDescription: `${hotelName} 후기를 ${area.label} 위치, 교통, 주차, 체크인, 조식, 객실 조건 중심으로 정리했습니다. 예약 전 자주 묻는 질문까지 함께 확인하세요.`,
    lead: `${hotelName}은 ${area.label} 여행에서 위치와 이동 조건을 함께 봐야 하는 숙소입니다.`,
    intentChips: buildIntentChips(area.areaType, { hasOcean, hasBreakfast, hasFamily }),
    bodyOrder: ['위치와 이동', '체크인과 짐 보관', '주차 조건', hasBreakfast ? '조식' : '객실 조건', '추천 여행자'],
    repeatedQuestions: faqs.map((faq) => faq.question),
    recommendedFor: area.recommendedFor,
    notRecommendedFor: area.notRecommendedFor,
    faqs,
    sourceNote: SOURCE_NOTE
  };
}

export function isJeonnamHotel(hotel: Hotel) {
  if (/^gwangju-/.test(hotel.slug)) return false;
  const text = realLocationText(hotel);
  return /^jeonnam-/.test(hotel.slug) || /전남|전라남도|Jeollanam|여수|목포|순천|담양|완도|해남|신안|광양|나주/i.test(text);
}

function pickJeonnamArea(hotel: Hotel): JeonnamAreaProfile {
  const text = realLocationText(hotel);
  if (/여수|돌산|오동도|엑스포|여천|yeosu/i.test(text)) return areaProfiles.yeosu;
  if (/목포|평화광장|갓바위|하당|남악|mokpo/i.test(text)) return areaProfiles.mokpo;
  if (/순천|순천만|국가정원|suncheon/i.test(text)) return areaProfiles.suncheon;
  if (/담양|죽녹원|메타|damyang/i.test(text)) return areaProfiles.damyang;
  if (/완도|해남|진도|신안|자은도|무안|wando|haenam|sinan/i.test(text)) return areaProfiles.wando;
  if (/광양|나주|화순|구례|보성|고흥|강진|장흥|gwangyang|naju/i.test(text)) return areaProfiles['gwangyang-naju'];
  return areaProfiles.jeonnam;
}

function buildSpecificTitleKeyword(hotel: Hotel, area: JeonnamAreaProfile) {
  const text = realLocationText(hotel);
  const cities = [
    '\uc5ec\uc218', '\ubaa9\ud3ec', '\uc21c\ucc9c', '\ub2f4\uc591', '\uc644\ub3c4', '\ud574\ub0a8',
    '\uc2e0\uc548', '\uad11\uc591', '\ub098\uc8fc', '\uad6c\ub840', '\ubcf4\uc131', '\uace0\ud765',
    '\uc601\uad11', '\uc601\uc554', '\ubb34\uc548', '\uc9c4\ub3c4', '\ud654\uc21c', '\uc7a5\ud765',
    '\uc7a5\uc131', '\uace1\uc131', '\uac15\uc9c4', '\ud568\ud3c9'
  ];
  const city = cities.find((candidate) => text.includes(candidate));
  return city ? `${city} \uc804\ub0a8` : area.titleKeyword;
}

const areaProfiles: Record<JeonnamAreaType, JeonnamAreaProfile> = {
  yeosu: {
    label: '전남 여수',
    titleKeyword: '여수 전남',
    locationQuestion: '여수엑스포역, 돌산, 오동도 여행 동선에 맞나요?',
    locationAnswer:
      '여수 숙소는 엑스포역과 오동도 근처인지, 돌산 쪽 오션뷰 숙소인지에 따라 이동 방식이 달라집니다. 뚜벅이 여행이면 역과 관광지 접근성을, 차량 여행이면 주차와 돌산 이동 시간을 함께 확인하세요.',
    recommendedFor: ['여수 오션뷰와 관광지 접근성을 함께 보는 여행자', '여수엑스포역이나 오동도 중심으로 움직이는 여행자', '가족 또는 커플 여수 여행'],
    notRecommendedFor: ['차량 없이 돌산 외곽 숙소를 고르려는 여행자', '오션뷰 객실 타입을 확인하지 않고 예약하려는 여행자'],
    areaType: 'yeosu'
  },
  mokpo: {
    label: '전남 목포',
    titleKeyword: '목포 전남',
    locationQuestion: '목포역, 평화광장, 갓바위 여행에 맞나요?',
    locationAnswer:
      '목포 숙소는 평화광장과 갓바위 주변, 목포역 접근형, 남악권 숙소로 체감이 나뉩니다. 야경과 식당 접근성을 보려면 평화광장, 이동 편의를 보려면 역과 터미널 동선을 우선 확인하는 것이 좋습니다.',
    recommendedFor: ['목포 평화광장과 바다분수 주변을 보려는 여행자', '목포역과 택시 이동을 함께 고려하는 여행자', '가성비 좋은 전남 숙소를 찾는 여행자'],
    notRecommendedFor: ['모든 관광지를 도보로 해결하려는 여행자', '객실 전망을 확인하지 않고 바다 전망을 기대하는 여행자'],
    areaType: 'mokpo'
  },
  suncheon: {
    label: '전남 순천',
    titleKeyword: '순천 전남',
    locationQuestion: '순천만국가정원이나 순천역 여행에 맞나요?',
    locationAnswer:
      '순천 숙소는 순천역 접근형과 순천만국가정원·습지 방문형으로 나눠 보는 것이 좋습니다. 대중교통 위주라면 역 근처, 자연 관광이 목적이라면 차량 이동과 주차 조건을 함께 확인하세요.',
    recommendedFor: ['순천만국가정원과 순천만습지를 방문하는 여행자', '순천역 중심으로 움직이는 여행자', '조용한 전남 여행을 원하는 가족 여행자'],
    notRecommendedFor: ['늦은 밤 이동 동선을 확인하지 않는 여행자', '차량 없이 외곽 펜션을 고르려는 여행자'],
    areaType: 'suncheon'
  },
  damyang: {
    label: '전남 담양',
    titleKeyword: '담양 전남',
    locationQuestion: '죽녹원, 메타세쿼이아길 여행에 맞나요?',
    locationAnswer:
      '담양 숙소는 죽녹원, 메타세쿼이아길, 카페·맛집 동선과의 거리가 중요합니다. 한옥이나 펜션형 숙소가 많아 객실 구성, 주차, 취사 여부도 함께 확인하는 편이 좋습니다.',
    recommendedFor: ['담양 죽녹원과 메타세쿼이아길을 천천히 보려는 여행자', '한옥·펜션형 숙소를 선호하는 가족 여행자', '차량으로 전남 근교를 둘러보는 여행자'],
    notRecommendedFor: ['호텔식 서비스만 기대하는 여행자', '차량 없이 외곽 숙소를 고르려는 여행자'],
    areaType: 'damyang'
  },
  wando: {
    label: '전남 해안권',
    titleKeyword: '완도 목포 신안 전남',
    locationQuestion: '섬 여행, 해안 드라이브, 항구 이동에 맞나요?',
    locationAnswer:
      '완도, 해남, 신안, 무안권 숙소는 항구 이동, 해안 드라이브, 섬 여행 일정과 함께 봐야 합니다. 체크인 시간보다 배 시간과 차량 이동 시간을 먼저 맞춰보는 것이 좋습니다.',
    recommendedFor: ['완도·신안·해남 해안 여행을 계획하는 여행자', '차량으로 전남 해안권을 이동하는 여행자', '조용한 숙소와 전망을 중시하는 여행자'],
    notRecommendedFor: ['대중교통만으로 촘촘한 일정을 계획하는 여행자', '주변 식당과 편의시설을 확인하지 않는 여행자'],
    areaType: 'wando'
  },
  'gwangyang-naju': {
    label: '전남 내륙권',
    titleKeyword: '광양 나주 전남',
    locationQuestion: '출장, 지리산, 전남 내륙 이동에 맞나요?',
    locationAnswer:
      '광양, 나주, 화순, 구례, 보성권 숙소는 관광보다 차량 이동, 출장, 지리산·남도 여행 거점 성격이 강합니다. 목적지까지 실제 이동 시간과 주차, 조식 시작 시간을 함께 보는 것이 좋습니다.',
    recommendedFor: ['전남 출장이나 차량 이동이 많은 여행자', '지리산·보성·화순 등 내륙 여행을 계획하는 여행자', '깔끔한 가성비 숙소를 찾는 여행자'],
    notRecommendedFor: ['바다 전망을 우선하는 여행자', '도보 관광 동선만 기대하는 여행자'],
    areaType: 'gwangyang-naju'
  },
  jeonnam: {
    label: '전남',
    titleKeyword: '전남',
    locationQuestion: '전남 여행 일정에 맞나요?',
    locationAnswer:
      '전남 숙소는 여수, 목포, 순천, 담양, 완도처럼 목적지가 넓게 나뉩니다. 호텔명보다 실제 주소와 여행 동선, 주차 가능 여부, 조식과 체크인 조건을 먼저 확인하는 편이 좋습니다.',
    recommendedFor: ['전남 주요 여행지를 차량으로 둘러보는 여행자', '가격과 위치를 함께 비교하려는 여행자'],
    notRecommendedFor: ['지역명을 확인하지 않고 숙소를 고르려는 여행자', '이동 시간을 과소평가하는 여행자'],
    areaType: 'jeonnam'
  }
};

function buildTransportAnswer(areaType: JeonnamAreaType) {
  if (areaType === 'yeosu') {
    return '여수는 엑스포역, 오동도, 돌산, 해상케이블카 방향에 따라 숙소 체감이 달라집니다. 뚜벅이 여행이면 역과 관광지 접근성을, 차량 여행이면 돌산 이동 시간과 주차를 우선 확인하세요.';
  }
  if (areaType === 'mokpo') {
    return '목포는 목포역, 평화광장, 갓바위, 남악권이 나뉩니다. 야경과 식당 접근성을 중시하면 평화광장, 이동 편의를 중시하면 역과 터미널 동선을 확인하는 것이 좋습니다.';
  }
  if (areaType === 'suncheon') {
    return '순천은 순천역과 순천만국가정원·습지 사이 이동을 먼저 봐야 합니다. 대중교통 이용 여부, 택시 이동 시간, 주차 가능 여부를 함께 확인하세요.';
  }
  if (areaType === 'damyang') {
    return '담양은 차량 이동 비중이 높습니다. 죽녹원, 메타세쿼이아길, 카페거리까지의 거리와 주차 조건을 확인하면 일정이 훨씬 편해집니다.';
  }
  if (areaType === 'wando') {
    return '해안권 숙소는 항구, 선착장, 해수욕장까지의 실제 이동 시간이 중요합니다. 배 시간이나 해안 드라이브 일정이 있다면 체크인보다 이동 동선을 먼저 맞춰보세요.';
  }
  return '전남은 지역 간 거리가 넓어 차량 이동 시간이 중요합니다. 목적지까지의 거리, 주차, 주변 식당과 편의시설, 늦은 체크인 가능 여부를 함께 확인하세요.';
}

function buildTitleTerms(
  areaType: JeonnamAreaType,
  flags: { hasOcean: boolean; hasBreakfast: boolean; hasFamily: boolean }
) {
  const terms = new Set<string>();
  if (areaType === 'yeosu') ['오션뷰', '체크인', '주차', '조식'].forEach((term) => terms.add(term));
  else if (areaType === 'mokpo') ['평화광장', '위치', '주차', '가성비'].forEach((term) => terms.add(term));
  else if (areaType === 'suncheon') ['순천만', '위치', '주차', '체크인'].forEach((term) => terms.add(term));
  else if (areaType === 'damyang') ['가족', '주차', '객실', '가성비'].forEach((term) => terms.add(term));
  else if (areaType === 'wando') ['오션뷰', '항구', '주차', '가족'].forEach((term) => terms.add(term));
  else ['위치', '주차', '체크인', '가성비'].forEach((term) => terms.add(term));

  if (flags.hasOcean) terms.add('오션뷰');
  if (flags.hasBreakfast) terms.add('조식');
  if (flags.hasFamily) terms.add('가족');
  return [...terms].slice(0, 4);
}

function buildIntentChips(
  areaType: JeonnamAreaType,
  flags: { hasOcean: boolean; hasBreakfast: boolean; hasFamily: boolean }
) {
  const chips = new Set<string>(['위치', '주차', '체크인']);
  if (areaType === 'yeosu' || areaType === 'wando') chips.add('오션뷰');
  if (areaType === 'mokpo') chips.add('평화광장');
  if (areaType === 'suncheon') chips.add('순천만');
  if (areaType === 'damyang') chips.add('담양여행');
  if (flags.hasBreakfast) chips.add('조식');
  if (flags.hasFamily) chips.add('가족');
  if (flags.hasOcean) chips.add('바다전망');
  return [...chips].slice(0, 6);
}

function searchableText(hotel: Hotel) {
  const analysis = hotel.analysis;
  return [
    hotel.slug,
    hotel.hotelName,
    hotel.region,
    hotel.address,
    analysis?.summary,
    analysis?.seoTitle,
    analysis?.metaDescription,
    analysis?.pros?.join(' '),
    analysis?.cons?.join(' '),
    analysis?.recommendedFor?.join(' '),
    analysis?.checkPoints?.join(' ')
  ].join(' ');
}

function realLocationText(hotel: Hotel) {
  return [hotel.slug, hotel.region, hotel.address, hotel.hotelName].filter(Boolean).join(' ');
}
