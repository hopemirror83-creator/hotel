import type { Hotel } from './hotels';

type IntentFaq = {
  question: string;
  answer: string;
  category: string;
};

type BusanAreaType =
  | 'haeundae'
  | 'seomyeon'
  | 'busan-station'
  | 'gwangalli'
  | 'nampo'
  | 'gijang'
  | 'songdo'
  | 'busan';

type BusanAreaProfile = {
  label: string;
  titleKeyword: string;
  locationQuestion: string;
  locationAnswer: string;
  recommendedFor: string[];
  notRecommendedFor: string[];
  areaType: BusanAreaType;
};

const SOURCE_NOTE =
  '네이버와 구글 자동완성에서 반복되는 부산 호텔 검색 의도와 호텔로그의 공개 후기 분석 데이터를 함께 반영했습니다.';

export function getBusanSearchIntent(hotel: Hotel) {
  if (!isBusanHotel(hotel)) return undefined;

  const area = pickBusanArea(hotel);
  const hotelName = hotel.hotelName;
  const hasBreakfast = hasAny(hotel, ['조식', '뷔페', 'breakfast']);
  const hasOcean = hasAny(hotel, ['오션', '바다', '해변', '광안대교', '해운대', '송도', 'ocean', 'sea']);

  const faqs: IntentFaq[] = [
    {
      category: '위치',
      question: `${hotelName}은 ${area.locationQuestion}`,
      answer: area.locationAnswer
    },
    {
      category: '교통',
      question: `${hotelName} 예약 전 지하철과 택시 이동 중 무엇을 확인해야 하나요?`,
      answer: buildTransportAnswer(area.areaType)
    },
    {
      category: '체크인',
      question: `${hotelName} 체크인 전에 확인할 점은 무엇인가요?`,
      answer:
        '부산은 주말과 성수기 이동 시간이 길어질 수 있습니다. 체크인 가능 시간, 짐보관, 주차장 위치, 해변이나 역까지 실제 이동 시간을 함께 확인하는 편이 좋습니다.'
    },
    {
      category: '주차',
      question: `${hotelName} 주차는 예약 전에 어떻게 봐야 하나요?`,
      answer:
        '해운대, 광안리, 남포동처럼 혼잡한 지역은 무료 주차 여부뿐 아니라 만차 시 대체 주차장과 입출차 편의성을 같이 확인해야 합니다. 대중교통 일정이면 역 접근성을 우선해도 좋습니다.'
    },
    {
      category: hasBreakfast ? '조식' : '객실',
      question: hasBreakfast
        ? `${hotelName} 조식 포함 예약이 나을까요?`
        : `${hotelName} 객실은 어떤 점을 봐야 하나요?`,
      answer: hasBreakfast
        ? '조식 포함 요금과 현장 결제 요금을 비교해보세요. 해변 지역은 아침 동선이 여유로울 수 있지만, 부산역이나 서면 숙소는 이른 이동 일정과 조식 시작 시간을 함께 보는 편이 좋습니다.'
        : '객실은 면적, 침대 구성, 욕실 구조, 방음, 전망을 함께 보는 것이 좋습니다. 해변 숙소는 오션뷰 객실 타입, 도심 숙소는 소음과 주차 후기를 같이 확인해보세요.'
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
  const title = `${hotelName}${titleTail ? ` ${titleTail}` : ''} 후기 모음`
    .replace(/\s+/g, ' ')
    .trim();

  return {
    slug: hotel.slug,
    title,
    seoTitle: `${title}｜위치·교통·주차 예약 전 FAQ`,
    metaDescription: `${hotelName} 후기를 ${area.label} 위치, 교통, 주차, 조식, 객실 조건 중심으로 정리했습니다. 예약 전 자주 묻는 질문까지 함께 확인하세요.`,
    lead: `${hotelName}은 ${area.label} 일정에서 위치와 이동 조건을 함께 봐야 하는 숙소입니다.`,
    intentChips: buildIntentChips(hotel, area.areaType),
    bodyOrder: ['위치와 이동', '체크인과 짐보관', '주차 조건', hasBreakfast ? '조식' : '객실 조건', '추천 여행자'],
    repeatedQuestions: faqs.map((faq) => faq.question),
    recommendedFor: area.recommendedFor,
    notRecommendedFor: area.notRecommendedFor,
    faqs,
    sourceNote: SOURCE_NOTE
  };
}

export function isBusanHotel(hotel: Hotel) {
  const text = [hotel.region, hotel.address].filter(Boolean).join(' ');
  return /^busan-/.test(hotel.slug) || /부산|busan/i.test(text);
}

function pickBusanArea(hotel: Hotel): BusanAreaProfile {
  const realText = [hotel.region, hotel.address].filter(Boolean).join(' ');
  const fullText = searchableText(hotel);

  return (
    matchHaeundae(realText) ||
    matchSeomyeon(realText) ||
    matchBusanStation(realText) ||
    matchGwangalli(realText) ||
    matchNampo(realText) ||
    matchGijang(realText) ||
    matchSongdo(realText) ||
    matchHaeundae(fullText) ||
    matchSeomyeon(fullText) ||
    matchBusanStation(fullText) ||
    matchGwangalli(fullText) ||
    matchNampo(fullText) ||
    matchGijang(fullText) ||
    matchSongdo(fullText) ||
    busanProfile()
  );
}

function matchHaeundae(text: string) {
  if (!/해운대|마린시티|센텀|동백|달맞이|haeundae|centum/i.test(text)) return undefined;
  return {
    label: '부산 해운대',
    titleKeyword: '해운대 부산',
    locationQuestion: '해운대 해변이나 센텀 일정에 맞나요?',
    locationAnswer:
      '해운대 숙소는 해변, 동백섬, 센텀시티 일정과 묶기 좋습니다. 성수기에는 가격과 주차, 체크인 대기, 오션뷰 객실 타입을 함께 확인하는 편이 좋습니다.',
    recommendedFor: ['해운대 해변 여행', '커플 여행', '센텀 일정'],
    notRecommendedFor: ['부산역 중심 이동이 많은 여행자', '숙박비를 최대한 줄이려는 여행자'],
    areaType: 'haeundae' as const
  };
}

function matchSeomyeon(text: string) {
  if (!/서면|부산진구|전포|범천|seomyeon|jeonpo/i.test(text)) return undefined;
  return {
    label: '부산 서면',
    titleKeyword: '서면 부산',
    locationQuestion: '서면 중심 일정에 맞나요?',
    locationAnswer:
      '서면 숙소는 지하철 환승과 식당, 쇼핑 접근성이 좋아 부산 도심 여행에 맞습니다. 해변 휴양보다는 이동 효율과 야간 소음 후기를 함께 보는 편이 좋습니다.',
    recommendedFor: ['부산 도심 여행', '대중교통 여행', '맛집과 쇼핑 일정'],
    notRecommendedFor: ['해변 바로 앞 숙소를 원하는 여행자', '조용한 휴양형 숙소를 원하는 여행자'],
    areaType: 'seomyeon' as const
  };
}

function matchBusanStation(text: string) {
  if (!/부산역|동구|초량|중앙대로|busan station|choryang/i.test(text)) return undefined;
  return {
    label: '부산역',
    titleKeyword: '부산역 부산',
    locationQuestion: 'KTX나 부산역 이동 일정에 맞나요?',
    locationAnswer:
      '부산역 숙소는 KTX 도착 전후 1박, 출장, 남포동 이동에 편합니다. 해운대나 광안리 해변까지는 거리가 있어 목적지가 해변인지 도심인지 먼저 나누어 보세요.',
    recommendedFor: ['KTX 이용 여행자', '출장', '짧은 부산 숙박'],
    notRecommendedFor: ['해운대 해변 중심 여행자', '리조트형 휴식을 원하는 여행자'],
    areaType: 'busan-station' as const
  };
}

function matchGwangalli(text: string) {
  if (!/광안리|수영구|광안|민락|gwangalli|gwangan/i.test(text)) return undefined;
  return {
    label: '부산 광안리',
    titleKeyword: '광안리 부산',
    locationQuestion: '광안리 해변과 광안대교 일정에 맞나요?',
    locationAnswer:
      '광안리 숙소는 해변 산책, 광안대교 야경, 카페와 식당 일정에 잘 맞습니다. 주말에는 주차와 주변 소음, 오션뷰 객실 타입을 함께 확인하세요.',
    recommendedFor: ['커플 여행', '광안대교 야경', '해변 산책'],
    notRecommendedFor: ['부산역 중심 일정이 많은 여행자', '아주 조용한 숙소를 원하는 여행자'],
    areaType: 'gwangalli' as const
  };
}

function matchNampo(text: string) {
  if (!/남포|자갈치|광복|중구|영도|nampo|jagalchi|yeongdo/i.test(text)) return undefined;
  return {
    label: '부산 남포동',
    titleKeyword: '남포동 부산',
    locationQuestion: '남포동과 자갈치 일정에 맞나요?',
    locationAnswer:
      '남포동 숙소는 자갈치시장, 국제시장, 영도, 부산역 이동과 묶기 좋습니다. 해변 휴양보다는 시장과 도심 관광 중심 일정에 잘 맞습니다.',
    recommendedFor: ['시장 관광', '영도 일정', '부산역과 남포동을 함께 보는 여행'],
    notRecommendedFor: ['해운대 해변 휴양이 중심인 여행자', '리조트형 숙소를 원하는 여행자'],
    areaType: 'nampo' as const
  };
}

function matchGijang(text: string) {
  if (!/기장|송정|오시리아|롯데월드|gijang|songjeong|osiria/i.test(text)) return undefined;
  return {
    label: '부산 기장',
    titleKeyword: '기장 부산',
    locationQuestion: '기장이나 오시리아 일정에 맞나요?',
    locationAnswer:
      '기장 숙소는 오시리아, 송정, 해안 드라이브, 가족 여행 일정에 맞습니다. 부산 도심과는 거리가 있어 차량 이동과 주차 조건을 함께 봐야 합니다.',
    recommendedFor: ['가족 여행', '오시리아 일정', '차량 이동 여행'],
    notRecommendedFor: ['서면이나 부산역 중심 일정이 많은 여행자', '대중교통만 이용하는 여행자'],
    areaType: 'gijang' as const
  };
}

function matchSongdo(text: string) {
  if (!/송도|암남|songdo|amnam/i.test(text)) return undefined;
  return {
    label: '부산 송도',
    titleKeyword: '송도 부산',
    locationQuestion: '송도 해수욕장 일정에 맞나요?',
    locationAnswer:
      '송도 숙소는 송도해수욕장, 케이블카, 남포동과 함께 보기 좋습니다. 해운대와는 다른 동선이므로 목적지를 먼저 나누어 선택하는 편이 좋습니다.',
    recommendedFor: ['송도 해변', '남포동 연계 일정', '가족 여행'],
    notRecommendedFor: ['해운대 중심 여행자', '서면 도심 일정이 많은 여행자'],
    areaType: 'songdo' as const
  };
}

function busanProfile(): BusanAreaProfile {
  return {
    label: '부산',
    titleKeyword: '부산',
    locationQuestion: '부산 여행 일정에 맞나요?',
    locationAnswer:
      '부산 숙소는 해운대, 서면, 부산역, 광안리, 남포동처럼 지역별 성격이 뚜렷합니다. 실제 일정과 가까운지 먼저 보고 교통과 주차 조건을 함께 확인하세요.',
    recommendedFor: ['부산 여행', '후기 비교 후 예약하려는 여행자'],
    notRecommendedFor: ['지역 동선 확인 없이 숙소만 고르는 여행자'],
    areaType: 'busan'
  };
}

function buildTransportAnswer(areaType: BusanAreaType) {
  if (areaType === 'haeundae') return '해운대는 지하철 접근과 해변까지 도보 거리를 함께 봐야 합니다. 성수기 차량 이동은 오래 걸릴 수 있어 주차와 대중교통 대안을 같이 확인하세요.';
  if (areaType === 'seomyeon') return '서면은 지하철 환승과 도심 이동에 유리합니다. 해변 접근보다 부산 전역 이동 효율을 중시하는 일정에 잘 맞습니다.';
  if (areaType === 'busan-station') return '부산역 숙소는 KTX와 짧은 숙박에 편합니다. 해운대나 광안리까지는 이동 시간이 있으니 해변 일정이 많은 경우에는 위치를 다시 비교해보세요.';
  if (areaType === 'gwangalli') return '광안리는 해변과 야경 접근성이 장점입니다. 주말 차량 이동과 주차가 어려울 수 있어 지하철역 또는 택시 동선을 함께 보세요.';
  if (areaType === 'gijang') return '기장은 차량 이동 만족도가 중요합니다. 오시리아나 송정 일정에는 좋지만 서면, 남포동, 부산역까지는 시간이 걸릴 수 있습니다.';
  return '부산은 지역별 이동 시간이 크게 다릅니다. 해운대, 서면, 부산역, 광안리, 남포동 중 실제 목적지와 가까운지 먼저 확인하는 것이 좋습니다.';
}

function buildIntentChips(hotel: Hotel, areaType: BusanAreaType) {
  const chips = new Set<string>();
  if (areaType === 'haeundae') chips.add('해운대');
  if (areaType === 'seomyeon') chips.add('서면');
  if (areaType === 'busan-station') chips.add('부산역');
  if (areaType === 'gwangalli') chips.add('광안리');
  if (areaType === 'nampo') chips.add('남포동');
  if (areaType === 'gijang') chips.add('기장');
  if (areaType === 'songdo') chips.add('송도');
  chips.add('부산여행');
  if (hotel.includeBreakfast || hasAny(hotel, ['조식', '뷔페'])) chips.add('조식');
  if (hasAny(hotel, ['오션', '바다', '해변', '광안대교'])) chips.add('오션뷰');
  if ((hotel.reviewCount || 0) >= 1000) chips.add('후기많음');
  return [...chips].slice(0, 5);
}

function hasAny(hotel: Hotel, patterns: string[]) {
  const text = searchableText(hotel).toLowerCase();
  return patterns.some((pattern) => text.includes(pattern.toLowerCase()));
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
