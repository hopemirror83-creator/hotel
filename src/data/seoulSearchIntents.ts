import type { Hotel } from './hotels';

type IntentFaq = {
  question: string;
  answer: string;
  category: string;
};

type SeoulAreaType =
  | 'myeongdong'
  | 'gangnam'
  | 'hongdae'
  | 'dongdaemun'
  | 'jongno'
  | 'seoul-station'
  | 'yeouido'
  | 'jamsil'
  | 'gimpo-airport'
  | 'sinchon'
  | 'seocho'
  | 'seoul';

type SeoulAreaProfile = {
  label: string;
  titleKeyword: string;
  locationQuestion: string;
  locationAnswer: string;
  recommendedFor: string[];
  notRecommendedFor: string[];
  areaType: SeoulAreaType;
};

const SOURCE_NOTE =
  'Google 자동완성, 네이버 검색 자동완성에서 반복되는 서울 호텔 검색 의도와 호텔로그 데이터를 함께 반영했습니다.';

export function getSeoulSearchIntent(hotel: Hotel) {
  if (!isSeoulHotel(hotel)) return undefined;

  const area = pickSeoulArea(hotel);
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
      question: `${hotelName} 예약 전 교통은 무엇을 확인해야 하나요?`,
      answer: buildTransportAnswer(area.areaType)
    },
    {
      category: '체크인',
      question: `${hotelName} 체크인 전에 확인할 점은 무엇인가요?`,
      answer:
        '도착 시간이 늦거나 짐을 먼저 맡길 계획이라면 체크인 가능 시간, 짐보관 가능 여부, 프런트 운영 시간을 먼저 확인하는 것이 좋습니다. 주말이나 성수기에는 대기 시간이 생길 수 있습니다.'
    },
    {
      category: '주차',
      question: `${hotelName} 주차는 예약 전에 어떻게 봐야 하나요?`,
      answer: buildParkingAnswer(area.areaType)
    },
    {
      category: hasBreakfast ? '조식' : '객실',
      question: hasBreakfast
        ? `${hotelName} 조식 포함으로 예약하는 것이 좋을까요?`
        : `${hotelName} 객실은 어떤 점을 봐야 하나요?`,
      answer: hasBreakfast
        ? '조식이 중요하다면 포함 요금과 현장 결제 요금을 비교해보는 것이 좋습니다. 아이 동반, 이른 일정, 비즈니스 일정이라면 운영 시간과 혼잡 시간도 함께 확인해야 합니다.'
        : '객실은 면적, 침대 구성, 욕실 구조, 방음 후기를 같이 보는 것이 좋습니다. 서울 도심 호텔은 같은 호텔 안에서도 객실 타입에 따라 체감 만족도가 달라질 수 있습니다.'
    }
  ];

  if (area.areaType === 'myeongdong' || area.areaType === 'jongno' || area.areaType === 'dongdaemun') {
    faqs.push({
      category: '관광',
      question: `${hotelName} 위치는 서울 관광 동선에 맞는 편인가요?`,
      answer:
        '명동, 종로, 동대문 권역은 지하철 이동과 도보 관광을 함께 보는 것이 중요합니다. 쇼핑이나 야시장 중심 일정인지, 고궁과 광화문 중심 일정인지에 따라 더 편한 권역이 달라집니다.'
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
    seoTitle: `${title}｜위치·교통·체크인 예약 전 FAQ`,
    metaDescription: `${hotelName} 후기를 ${area.label} 위치, 교통, 체크인, 주차, 조식과 객실 조건 중심으로 정리했습니다. 예약 전 자주 묻는 질문까지 함께 확인하세요.`,
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

export function isSeoulHotel(hotel: Hotel) {
  const text = realLocationText(hotel);
  return /^seoul-/.test(hotel.slug) || /서울|seoul/i.test(text);
}

function pickSeoulArea(hotel: Hotel): SeoulAreaProfile {
  const realText = realLocationText(hotel);
  const fullText = searchableText(hotel);

  const matchedByRealLocation =
    matchMyeongdong(realText) ||
    matchGangnam(realText) ||
    matchHongdae(realText) ||
    matchDongdaemun(realText) ||
    matchJongno(realText) ||
    matchSeoulStation(realText) ||
    matchYeouido(realText) ||
    matchJamsil(realText) ||
    matchGimpoAirport(realText) ||
    matchSinchon(realText) ||
    matchSeocho(realText);

  if (matchedByRealLocation) return matchedByRealLocation;
  if (hasConcreteSeoulLocation(realText)) return seoulProfile();

  return (
    matchMyeongdong(fullText) ||
    matchGangnam(fullText) ||
    matchHongdae(fullText) ||
    matchDongdaemun(fullText) ||
    matchJongno(fullText) ||
    matchSeoulStation(fullText) ||
    matchYeouido(fullText) ||
    matchJamsil(fullText) ||
    matchGimpoAirport(fullText) ||
    matchSinchon(fullText) ||
    matchSeocho(fullText) ||
    seoulProfile()
  );
}

function matchMyeongdong(text: string) {
  if (!/명동|을지로|남대문|회현|충무로|중구|myeongdong|euljiro|namdaemun|jung-gu/i.test(text)) return undefined;
  return {
    label: '서울 명동·중구',
    titleKeyword: '명동 서울',
    locationQuestion: '명동 쇼핑이나 서울 중심 관광에 맞나요?',
    locationAnswer:
      '명동·중구 권역은 쇼핑, 남대문, 을지로, 서울역 이동을 함께 보기 좋은 위치입니다. 다만 차량 이동보다 지하철과 도보 동선이 편한 경우가 많아 주차 조건은 별도로 확인하는 것이 좋습니다.',
    recommendedFor: ['명동 쇼핑 일정', '서울 첫 방문', '도보와 지하철 중심 여행'],
    notRecommendedFor: ['조용한 리조트형 숙소를 원하는 여행자', '차량 이동과 무료 주차가 최우선인 여행자'],
    areaType: 'myeongdong' as const
  };
}

function matchGangnam(text: string) {
  if (!/강남|역삼|삼성|선릉|논현|신논현|코엑스|테헤란|gangnam|yeoksam|samseong|coex/i.test(text)) return undefined;
  return {
    label: '서울 강남·역삼',
    titleKeyword: '강남 서울',
    locationQuestion: '강남 일정이나 출장에 맞나요?',
    locationAnswer:
      '강남·역삼·삼성 권역은 비즈니스 일정, 코엑스 방문, 강남권 약속이 있을 때 이동 효율이 좋습니다. 출퇴근 시간대 교통 정체가 잦아 지하철역 거리와 주차 조건을 함께 보는 것이 좋습니다.',
    recommendedFor: ['강남 출장', '코엑스 방문', '비즈니스와 쇼핑을 함께 보는 여행'],
    notRecommendedFor: ['고궁·북촌 중심 관광 일정', '숙박비를 최대한 낮추려는 여행자'],
    areaType: 'gangnam' as const
  };
}

function matchHongdae(text: string) {
  if (!/홍대|합정|상수|연남|마포|공덕|상암|hongdae|hapjeong|mapo|gongdeok/i.test(text)) return undefined;
  return {
    label: '서울 홍대·마포',
    titleKeyword: '홍대 마포 서울',
    locationQuestion: '홍대나 마포 일정에 맞나요?',
    locationAnswer:
      '홍대·마포 권역은 공항철도, 맛집, 공연, 젊은 분위기의 일정을 함께 잡기 좋습니다. 밤 시간대 유동 인구가 많은 지역은 소음과 객실 방음 후기를 같이 확인하는 것이 좋습니다.',
    recommendedFor: ['홍대 맛집·공연 일정', '공항철도 이용', '친구 여행'],
    notRecommendedFor: ['매우 조용한 숙소를 원하는 여행자', '강남권 일정이 대부분인 여행자'],
    areaType: 'hongdae' as const
  };
}

function matchDongdaemun(text: string) {
  if (!/동대문|DDP|동묘|신당|청량리|dongdaemun|ddp|cheongnyangni/i.test(text)) return undefined;
  return {
    label: '서울 동대문',
    titleKeyword: '동대문 서울',
    locationQuestion: '동대문 쇼핑이나 야간 일정에 맞나요?',
    locationAnswer:
      '동대문 권역은 DDP, 쇼핑, 야간 이동 일정에 맞춰 보기 좋습니다. 늦은 시간 이동이 있다면 역과 호텔 사이의 거리, 주변 상권, 객실 방음 후기를 함께 확인하는 것이 좋습니다.',
    recommendedFor: ['동대문 쇼핑', 'DDP 방문', '야간 이동이 있는 여행'],
    notRecommendedFor: ['한강 남쪽 일정이 대부분인 여행자', '차량 주차 편의가 최우선인 여행자'],
    areaType: 'dongdaemun' as const
  };
}

function matchJongno(text: string) {
  if (!/종로|인사동|광화문|시청|북촌|익선|jongno|jongro|insadong|gwanghwamun|city hall/i.test(text)) return undefined;
  return {
    label: '서울 종로·인사동',
    titleKeyword: '종로 인사동 서울',
    locationQuestion: '고궁이나 광화문 중심 관광에 맞나요?',
    locationAnswer:
      '종로·인사동·광화문 권역은 경복궁, 북촌, 청계천, 시청 일정을 묶기 좋습니다. 도심 관광에는 유리하지만 객실 크기와 주차 조건은 호텔별 차이가 커서 예약 전 확인이 필요합니다.',
    recommendedFor: ['고궁·북촌 관광', '서울 도심 도보 여행', '외국인 동반 여행'],
    notRecommendedFor: ['강남 약속이 대부분인 여행자', '넓은 객실을 우선하는 가족 여행자'],
    areaType: 'jongno' as const
  };
}

function matchSeoulStation(text: string) {
  if (!/서울역|용산|남영|숙대|이태원|yongsan|itaewon|seoul station|namyeong/i.test(text)) return undefined;
  return {
    label: '서울역·용산',
    titleKeyword: '서울역 용산 서울',
    locationQuestion: 'KTX나 공항철도 이동에 맞나요?',
    locationAnswer:
      '서울역·용산 권역은 KTX, 공항철도, 서울 도심 이동을 함께 볼 때 편합니다. 캐리어 이동이 있다면 역 출구와 호텔 사이의 실제 도보 거리, 엘리베이터 동선을 확인하는 것이 좋습니다.',
    recommendedFor: ['KTX 이용', '공항철도 이동', '짧은 서울 체류'],
    notRecommendedFor: ['홍대·강남 밤 일정이 중심인 여행자', '리조트형 부대시설을 원하는 여행자'],
    areaType: 'seoul-station' as const
  };
}

function matchYeouido(text: string) {
  if (!/여의도|영등포|당산|국회의사당|문래|yeouido|yeongdeungpo|dangsan/i.test(text)) return undefined;
  return {
    label: '서울 여의도·영등포',
    titleKeyword: '여의도 영등포 서울',
    locationQuestion: '여의도 출장이나 한강 일정에 맞나요?',
    locationAnswer:
      '여의도·영등포 권역은 비즈니스 일정, 한강, 더현대, 타임스퀘어 방문에 맞춰 보기 좋습니다. 주말에는 쇼핑몰 주변 혼잡과 주차 조건을 함께 확인하는 것이 좋습니다.',
    recommendedFor: ['여의도 출장', '한강·쇼핑 일정', '서남권 이동'],
    notRecommendedFor: ['명동·종로 도보 관광 중심 일정', '한적한 동네 숙소를 원하는 여행자'],
    areaType: 'yeouido' as const
  };
}

function matchJamsil(text: string) {
  if (!/잠실|송파|석촌|롯데월드|방이|올림픽공원|jamsil|songpa|lotte world|seokchon/i.test(text)) return undefined;
  return {
    label: '서울 잠실·송파',
    titleKeyword: '잠실 송파 서울',
    locationQuestion: '롯데월드나 잠실 일정에 맞나요?',
    locationAnswer:
      '잠실·송파 권역은 롯데월드, 석촌호수, 올림픽공원 일정에 맞춰 보기 좋습니다. 가족 여행은 객실 크기와 주차, 조식, 이동 동선을 함께 비교하는 것이 좋습니다.',
    recommendedFor: ['롯데월드 방문', '가족 여행', '석촌호수·올림픽공원 일정'],
    notRecommendedFor: ['서울 북촌·명동 위주 일정', '최저가 중심의 짧은 숙박'],
    areaType: 'jamsil' as const
  };
}

function matchGimpoAirport(text: string) {
  if (!/김포공항|강서|마곡|화곡|발산|gimpo airport|gangseo|magok|balsan/i.test(text)) return undefined;
  return {
    label: '서울 김포공항·강서',
    titleKeyword: '김포공항 강서 서울',
    locationQuestion: '김포공항 이동에 맞나요?',
    locationAnswer:
      '김포공항·강서 권역은 국내선 전후 숙박, 마곡 업무 일정, 서부권 이동에 맞춰 보기 좋습니다. 공항 이동 시간은 거리보다 지하철·택시 동선과 새벽 이동 가능 여부가 중요합니다.',
    recommendedFor: ['김포공항 전후 숙박', '마곡 출장', '서부권 일정'],
    notRecommendedFor: ['강남·동대문 관광 위주 일정', '도심 도보 관광을 원하는 여행자'],
    areaType: 'gimpo-airport' as const
  };
}

function matchSinchon(text: string) {
  if (!/신촌|서대문|이대|연희|홍제|sinchon|seodaemun|ewha/i.test(text)) return undefined;
  return {
    label: '서울 신촌·서대문',
    titleKeyword: '신촌 서대문 서울',
    locationQuestion: '신촌이나 서대문 일정에 맞나요?',
    locationAnswer:
      '신촌·서대문 권역은 대학가, 병원, 서북권 이동 일정에 맞춰 보기 좋습니다. 밤 시간대 상권 소음과 지하철역 거리, 객실 방음 후기를 함께 확인하는 것이 좋습니다.',
    recommendedFor: ['신촌·이대 일정', '서북권 방문', '가성비 숙박'],
    notRecommendedFor: ['잠실·강남 일정이 대부분인 여행자', '조용한 고급 호텔을 우선하는 여행자'],
    areaType: 'sinchon' as const
  };
}

function matchSeocho(text: string) {
  if (!/서초|교대|양재|반포|고속터미널|seocho|gyodae|yangjae|banpo/i.test(text)) return undefined;
  return {
    label: '서울 서초',
    titleKeyword: '서초 서울',
    locationQuestion: '서초나 교대 일정에 맞나요?',
    locationAnswer:
      '서초·교대·양재 권역은 강남권 업무와 고속터미널, 예술의전당 일정에 맞춰 보기 좋습니다. 차량 이동이 많다면 주차와 출퇴근 시간대 정체를 함께 고려해야 합니다.',
    recommendedFor: ['서초·교대 출장', '고속터미널 이용', '강남권 차량 이동'],
    notRecommendedFor: ['명동 쇼핑 중심 일정', '공항철도 직접 이동을 원하는 여행자'],
    areaType: 'seocho' as const
  };
}

function seoulProfile(): SeoulAreaProfile {
  return {
    label: '서울',
    titleKeyword: '서울',
    locationQuestion: '서울 여행 일정에 맞나요?',
    locationAnswer:
      '서울 호텔은 권역별 이동 동선이 크게 달라집니다. 명동·종로는 도심 관광, 강남은 출장과 쇼핑, 홍대·마포는 공항철도와 맛집, 잠실은 가족 일정에 맞춰 비교하는 것이 좋습니다.',
    recommendedFor: ['서울 도심 여행', '출장', '짧은 숙박'],
    notRecommendedFor: ['특정 권역 이동 시간이 확정되지 않은 여행자', '객실 크기만 보고 예약하려는 여행자'],
    areaType: 'seoul'
  };
}

function buildIntentChips(hotel: Hotel, areaType: SeoulAreaType) {
  const chips = ['서울 후기', '체크인', '주차'];
  if (areaType === 'gangnam') chips.push('강남 출장');
  if (areaType === 'myeongdong') chips.push('명동 위치');
  if (areaType === 'hongdae') chips.push('홍대 교통');
  if (areaType === 'jamsil') chips.push('가족 여행');
  if (areaType === 'gimpo-airport') chips.push('김포공항');
  if (hasAny(hotel, ['조식', '뷔페', 'breakfast'])) chips.push('조식');
  return [...new Set(chips)].slice(0, 6);
}

function buildTransportAnswer(areaType: SeoulAreaType) {
  if (areaType === 'seoul-station') return '서울역·용산 권역은 KTX와 공항철도 이용 여부가 핵심입니다. 역 출구와 호텔 사이의 실제 도보 거리, 캐리어 이동 동선을 확인하는 것이 좋습니다.';
  if (areaType === 'gimpo-airport') return '김포공항 이동이 목적이라면 지하철·택시 소요 시간, 새벽 이동 가능 여부, 항공편 시간대와 체크인 시간을 함께 확인해야 합니다.';
  if (areaType === 'gangnam' || areaType === 'seocho') return '강남권은 출퇴근 시간대 차량 정체가 잦습니다. 지하철역 거리와 주차 조건을 함께 확인하면 일정 실패 가능성을 줄일 수 있습니다.';
  if (areaType === 'myeongdong' || areaType === 'jongno') return '도심 관광은 도보와 지하철 동선이 중요합니다. 호텔에서 가장 가까운 역, 엘리베이터 출구, 주요 관광지까지의 이동 시간을 함께 보는 것이 좋습니다.';
  return '서울 호텔은 같은 거리라도 지하철 노선과 환승 횟수에 따라 체감 이동 시간이 달라집니다. 주요 일정지까지의 실제 이동 동선을 먼저 확인하는 것이 좋습니다.';
}

function buildParkingAnswer(areaType: SeoulAreaType) {
  if (areaType === 'myeongdong' || areaType === 'jongno' || areaType === 'dongdaemun') {
    return '서울 도심 호텔은 주차 공간이 제한적이거나 유료인 경우가 많습니다. 차량 이용 예정이라면 객실 예약 전 주차 가능 여부, 1박 요금, 입출차 조건을 확인해야 합니다.';
  }
  if (areaType === 'gangnam' || areaType === 'seocho' || areaType === 'yeouido') {
    return '비즈니스 권역은 주차 가능 여부뿐 아니라 만차 가능성과 추가 요금이 중요합니다. 행사일이나 주말에는 주변 주차장까지 함께 확인하는 것이 안전합니다.';
  }
  return '주차는 호텔별 차이가 큽니다. 무료 여부, 기계식 주차 제한, SUV 가능 여부, 체크아웃 후 주차 가능 시간을 함께 확인하는 것이 좋습니다.';
}

function hasAny(hotel: Hotel, keywords: string[]) {
  const text = searchableText(hotel);
  return keywords.some((keyword) => text.includes(keyword.toLowerCase()));
}

function hasConcreteSeoulLocation(text: string) {
  return /서울|중구|강남구|마포구|종로구|동대문구|영등포구|송파구|용산구|강서구|서초구|서대문구|구로구|관악구|광진구|성동구|성북구|강동구|노원구|seoul/i.test(text);
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
