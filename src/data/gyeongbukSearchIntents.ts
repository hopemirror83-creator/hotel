import type { Hotel } from './hotels';

type IntentFaq = {
  question: string;
  answer: string;
  category: string;
};

type GyeongbukAreaType = 'gyeongju' | 'pohang' | 'andong' | 'gumi' | 'mungyeong-yeongju' | 'east-coast' | 'gyeongbuk';

type GyeongbukAreaProfile = {
  label: string;
  titleKeyword: string;
  locationQuestion: string;
  locationAnswer: string;
  recommendedFor: string[];
  notRecommendedFor: string[];
  areaType: GyeongbukAreaType;
};

const SOURCE_NOTE =
  '네이버와 구글 자동완성에서 반복되는 경북 호텔 검색 의도와 호텔로그의 공개 후기 분석 데이터를 함께 반영했습니다.';

export function getGyeongbukSearchIntent(hotel: Hotel) {
  if (!isGyeongbukHotel(hotel)) return undefined;

  const area = pickGyeongbukArea(hotel);
  const hotelName = hotel.hotelName.trim();
  const text = searchableText(hotel);
  const hasBreakfast = /조식|뷔페|breakfast/i.test(text);
  const hasView = /오션|바다|해변|영일대|구룡포|강구항|울진|영덕|울릉|뷰|view|ocean|sea/i.test(text);
  const hasFamily = /가족|키즈|리조트|풀빌라|펜션|family/i.test(text);
  const hasBusiness = /구미|상주|김천|비즈니스|출장|터미널|역|business/i.test(text);

  const titleTerms = buildTitleTerms(area.areaType, { hasBreakfast, hasView, hasFamily, hasBusiness });
  const titleTail = area.titleKeyword
    .split(' ')
    .filter((part) => part && !hotelName.includes(part))
    .join(' ');
  const title = `${hotelName}${titleTail ? ` ${titleTail}` : ''} 후기 모음 ${titleTerms.join(' ')}`;

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
        '경북 여행지는 경주 황리단길, 보문단지, 포항 영일대, 안동 하회마을처럼 목적지가 넓게 나뉩니다. 체크인 가능 시간, 짐보관, 주차장 위치, 늦은 도착 가능 여부를 함께 확인하는 편이 좋습니다.'
    },
    {
      category: '주차',
      question: `${hotelName} 주차는 예약 전에 확인해야 하나요?`,
      answer:
        '경북은 차량 이동 비중이 높은 지역입니다. 무료 주차 여부, 객실당 차량 제한, 성수기 만차 가능성, 주변 대체 주차장을 미리 확인하면 일정이 훨씬 편해집니다.'
    },
    {
      category: hasBreakfast ? '조식' : '객실',
      question: hasBreakfast
        ? `${hotelName} 조식 포함 예약이 유리할까요?`
        : `${hotelName} 객실은 어떤 기준으로 봐야 하나요?`,
      answer: hasBreakfast
        ? '조식을 중요하게 본다면 포함 요금과 현장 결제 요금을 비교해보는 것이 좋습니다. 아이 동반, 이른 출발, 관광지 이동 일정이 있다면 조식 시작 시간과 혼잡 시간도 함께 확인하세요.'
        : '객실은 면적, 침대 구성, 방음, 욕실 컨디션, 창문 방향을 함께 봐야 합니다. 한옥·펜션·리조트형 숙소라면 취사 가능 여부와 객실별 시설 차이도 확인하는 것이 좋습니다.'
    }
  ];

  if (hasView) {
    faqs.push({
      category: '전망',
      question: `${hotelName} 전망이나 오션뷰는 어떻게 확인해야 하나요?`,
      answer:
        '전망은 객실 타입과 층수에 따라 차이가 큽니다. 오션뷰, 시티뷰, 마운틴뷰가 객실명에 명확히 들어가는지 확인하고, 부분 전망인지 정면 전망인지까지 보는 편이 안전합니다.'
    });
  }

  return {
    slug: hotel.slug,
    title,
    seoTitle: `${title}｜예약 전 FAQ`,
    metaDescription: `${hotelName} 후기를 ${area.label} 위치, 교통, 체크인, 주차, 조식, 객실 조건 중심으로 정리했습니다. 예약 전 자주 묻는 질문까지 함께 확인하세요.`,
    lead: `${hotelName}은 ${area.label} 여행에서 위치와 이동 조건을 함께 봐야 하는 숙소입니다.`,
    intentChips: buildIntentChips(area.areaType, { hasBreakfast, hasView, hasFamily, hasBusiness }),
    bodyOrder: ['위치와 이동', '체크인과 짐보관', '주차 조건', hasBreakfast ? '조식' : '객실 조건', '추천 여행자'],
    repeatedQuestions: faqs.map((faq) => faq.question),
    recommendedFor: area.recommendedFor,
    notRecommendedFor: area.notRecommendedFor,
    faqs,
    sourceNote: SOURCE_NOTE
  };
}

export function isGyeongbukHotel(hotel: Hotel) {
  const text = realLocationText(hotel);
  return (
    /^gyeongbuk-/.test(hotel.slug) ||
    /경북|경상북도|Gyeongbuk|Gyeongsangbuk|경주|포항|안동|구미|영덕|울진|문경|영주|상주|김천|울릉/i.test(text)
  );
}

function pickGyeongbukArea(hotel: Hotel): GyeongbukAreaProfile {
  const text = searchableText(hotel);
  if (/경주|보문|황리단|불국사|첨성대|gyeongju/i.test(text)) return areaProfiles.gyeongju;
  if (/포항|영일대|죽도|구룡포|송도해수욕장|pohang/i.test(text)) return areaProfiles.pohang;
  if (/안동|하회|월영교|andong/i.test(text)) return areaProfiles.andong;
  if (/구미|김천|상주|칠곡|gumi|gimcheon|sangju/i.test(text)) return areaProfiles.gumi;
  if (/문경|영주|풍기|소백산|mungyeong|yeongju/i.test(text)) return areaProfiles['mungyeong-yeongju'];
  if (/영덕|울진|울릉|강구항|후포항|덕구|yeongdeok|uljin|ulleung/i.test(text)) return areaProfiles['east-coast'];
  return areaProfiles.gyeongbuk;
}

const areaProfiles: Record<GyeongbukAreaType, GyeongbukAreaProfile> = {
  gyeongju: {
    label: '경북 경주',
    titleKeyword: '경주 경북',
    locationQuestion: '황리단길, 보문단지, 불국사 일정에 맞나요?',
    locationAnswer:
      '경주는 황리단길·대릉원 중심 숙소와 보문단지 리조트형 숙소의 성격이 다릅니다. 도보 관광이 목적이면 황리단길 접근성을, 가족 여행이나 리조트 휴식이 목적이면 보문단지 이동과 주차 조건을 먼저 보세요.',
    recommendedFor: ['경주 황리단길과 보문단지를 함께 보려는 여행자', '가족 여행이나 한옥 감성 숙소를 찾는 여행자', '차량으로 경주 관광지를 이동하는 여행자'],
    notRecommendedFor: ['도보 동선만으로 모든 관광지를 이동하려는 여행자', '객실 타입별 차이를 확인하지 않고 한옥·펜션형 숙소를 고르는 여행자'],
    areaType: 'gyeongju'
  },
  pohang: {
    label: '경북 포항',
    titleKeyword: '포항 경북',
    locationQuestion: '영일대, 죽도시장, 구룡포 일정에 맞나요?',
    locationAnswer:
      '포항은 영일대 해수욕장, 죽도시장, 구룡포 쪽 이동 목적에 따라 숙소 위치 체감이 달라집니다. 바다 전망을 기대한다면 객실 타입을, 식당·시장 접근성을 원한다면 죽도시장과 터미널 동선을 함께 확인하세요.',
    recommendedFor: ['포항 영일대와 죽도시장 접근성을 보는 여행자', '오션뷰나 바다 근처 숙소를 찾는 여행자', '차량 이동으로 구룡포까지 둘러보려는 여행자'],
    notRecommendedFor: ['오션뷰 객실 여부를 확인하지 않고 바다 전망을 기대하는 여행자', '대중교통만으로 포항 외곽까지 이동하려는 여행자'],
    areaType: 'pohang'
  },
  andong: {
    label: '경북 안동',
    titleKeyword: '안동 경북',
    locationQuestion: '하회마을, 월영교, 안동역 일정에 맞나요?',
    locationAnswer:
      '안동은 안동역·시내권 숙소와 하회마을 방향 숙소의 동선이 다릅니다. 관광 목적이면 하회마을 이동 시간을, 짧은 숙박이나 출장이라면 시내 접근성과 주차를 우선 확인하는 편이 좋습니다.',
    recommendedFor: ['안동 하회마을과 월영교 일정을 준비하는 여행자', '시내 접근성과 주차를 함께 보는 여행자', '한옥 감성 숙소를 비교하는 여행자'],
    notRecommendedFor: ['하회마을까지의 이동 시간을 고려하지 않는 여행자', '늦은 체크인 가능 여부를 확인하지 않는 여행자'],
    areaType: 'andong'
  },
  gumi: {
    label: '경북 구미·김천·상주',
    titleKeyword: '구미 김천 상주 경북',
    locationQuestion: '출장, 터미널, 역 이동에 맞나요?',
    locationAnswer:
      '구미·김천·상주권 숙소는 관광보다 출장, 산업단지, 역·터미널 접근성이 중요한 경우가 많습니다. 주차, 조식 시작 시간, 주변 식당, 체크인 가능 시간을 함께 보는 것이 좋습니다.',
    recommendedFor: ['구미·김천·상주 출장 숙소를 찾는 여행자', '역·터미널과 주차 조건을 함께 보는 여행자', '짧은 숙박에서 가성비를 중시하는 여행자'],
    notRecommendedFor: ['리조트형 휴양 시설을 기대하는 여행자', '주변 식당과 이동 동선을 확인하지 않는 여행자'],
    areaType: 'gumi'
  },
  'mungyeong-yeongju': {
    label: '경북 문경·영주',
    titleKeyword: '문경 영주 경북',
    locationQuestion: '문경새재, 소백산, 온천 일정에 맞나요?',
    locationAnswer:
      '문경·영주는 문경새재, 소백산, 풍기온천처럼 차량 이동 중심 일정이 많습니다. 관광지까지 거리, 주차, 조식 시간, 객실 온돌·침대 구성을 함께 확인하세요.',
    recommendedFor: ['문경새재나 소백산 여행을 준비하는 여행자', '온천·리조트형 숙소를 비교하는 가족 여행자', '차량 이동 중심으로 경북 내륙을 여행하는 여행자'],
    notRecommendedFor: ['대중교통만으로 외곽 관광지를 이동하려는 여행자', '주변 편의시설을 확인하지 않고 숙소를 고르는 여행자'],
    areaType: 'mungyeong-yeongju'
  },
  'east-coast': {
    label: '경북 동해안',
    titleKeyword: '영덕 울진 울릉 경북',
    locationQuestion: '강구항, 울진, 울릉도 일정에 맞나요?',
    locationAnswer:
      '영덕·울진·울릉권은 바다 전망, 항구 이동, 차량 동선, 배편 시간이 중요합니다. 오션뷰 객실 여부와 항구까지 이동 시간, 주변 식당 운영 시간을 미리 보는 편이 안전합니다.',
    recommendedFor: ['경북 동해안 오션뷰 숙소를 찾는 여행자', '강구항·후포항·울릉도 이동을 준비하는 여행자', '차량으로 해안 드라이브를 계획하는 여행자'],
    notRecommendedFor: ['객실 전망을 확인하지 않고 오션뷰를 기대하는 여행자', '배편 시간과 체크인 시간을 맞춰보지 않는 여행자'],
    areaType: 'east-coast'
  },
  gyeongbuk: {
    label: '경북',
    titleKeyword: '경북',
    locationQuestion: '경북 여행 일정에 맞나요?',
    locationAnswer:
      '경북 숙소는 경주, 포항, 안동, 구미, 문경, 울진처럼 목적지별 성격이 크게 다릅니다. 호텔명보다 먼저 여행 지역과 이동 방식을 정하고, 주차·체크인·조식 조건을 함께 비교하는 것이 좋습니다.',
    recommendedFor: ['경북 여러 지역을 차량으로 이동하는 여행자', '지역별 호텔을 먼저 비교하고 싶은 여행자'],
    notRecommendedFor: ['목적지를 정하지 않은 상태에서 가격만 보고 고르는 여행자', '이동 시간을 과소평가하는 여행자'],
    areaType: 'gyeongbuk'
  }
};

function buildTransportAnswer(areaType: GyeongbukAreaType) {
  if (areaType === 'gyeongju') return '경주는 황리단길·대릉원권과 보문단지·불국사권 동선이 다릅니다. 차량 이동인지 도보 관광인지에 따라 호텔 만족도가 크게 달라지므로 목적지를 먼저 정하세요.';
  if (areaType === 'pohang') return '포항은 영일대, 죽도시장, 구룡포의 위치가 떨어져 있습니다. 바다 전망, 시장 접근성, 터미널·역 이동 중 무엇이 중요한지 먼저 정하는 편이 좋습니다.';
  if (areaType === 'andong') return '안동은 시내권과 하회마을 방향 이동 시간이 다릅니다. 대중교통보다 차량 이동이 편한 일정이 많으니 주차와 목적지까지 시간을 함께 확인하세요.';
  if (areaType === 'gumi') return '구미·김천·상주권은 출장 동선이 중요합니다. 산업단지, 역, 터미널, 고속도로 접근성과 주차 가능 여부를 먼저 확인하세요.';
  if (areaType === 'mungyeong-yeongju') return '문경·영주는 문경새재, 소백산, 풍기온천처럼 외곽 이동이 많습니다. 차량 이동 시간과 야간 체크인 가능 여부를 함께 확인하는 것이 좋습니다.';
  if (areaType === 'east-coast') return '영덕·울진·울릉권은 항구 이동, 해안도로, 배편 시간이 중요합니다. 체크인 시간과 배편·식당 운영 시간을 함께 맞춰보세요.';
  return '경북은 지역 간 거리가 넓습니다. 경주·포항·안동·구미·문경·울진 중 실제 목적지를 먼저 정하고 숙소를 비교하는 것이 좋습니다.';
}

function buildTitleTerms(
  areaType: GyeongbukAreaType,
  flags: { hasBreakfast: boolean; hasView: boolean; hasFamily: boolean; hasBusiness: boolean }
) {
  const terms = new Set<string>();
  const add = (items: string[]) => items.forEach((item) => terms.add(item));
  if (areaType === 'gyeongju') add(['황리단길', '보문단지', '체크인', '주차']);
  else if (areaType === 'pohang') add(['영일대', '오션뷰', '주차', '조식']);
  else if (areaType === 'andong') add(['하회마을', '월영교', '주차', '체크인']);
  else if (areaType === 'gumi') add(['출장', '주차', '조식', '가성비']);
  else if (areaType === 'mungyeong-yeongju') add(['문경새재', '소백산', '가족', '주차']);
  else if (areaType === 'east-coast') add(['오션뷰', '항구', '가족', '주차']);
  else add(['위치', '주차', '체크인', '가성비']);
  if (flags.hasView) terms.add('전망');
  if (flags.hasBreakfast) terms.add('조식');
  if (flags.hasFamily) terms.add('가족');
  if (flags.hasBusiness) terms.add('출장');
  return [...terms].slice(0, 5);
}

function buildIntentChips(
  areaType: GyeongbukAreaType,
  flags: { hasBreakfast: boolean; hasView: boolean; hasFamily: boolean; hasBusiness: boolean }
) {
  const chips = new Set<string>(['위치', '주차', '체크인']);
  if (areaType === 'gyeongju') chips.add('경주여행');
  if (areaType === 'pohang') chips.add('영일대');
  if (areaType === 'andong') chips.add('하회마을');
  if (areaType === 'gumi') chips.add('출장');
  if (areaType === 'mungyeong-yeongju') chips.add('내륙여행');
  if (areaType === 'east-coast') chips.add('오션뷰');
  if (flags.hasBreakfast) chips.add('조식');
  if (flags.hasView) chips.add('전망');
  if (flags.hasFamily) chips.add('가족');
  if (flags.hasBusiness) chips.add('비즈니스');
  return [...chips].slice(0, 6);
}

function searchableText(hotel: Hotel) {
  return [hotel.slug, hotel.hotelName, hotel.region, hotel.address, hotel.analysis?.summary, hotel.analysis?.pros?.join(' '), hotel.analysis?.checkPoints?.join(' ')]
    .filter(Boolean)
    .join(' ');
}

function realLocationText(hotel: Hotel) {
  return [hotel.slug, hotel.region, hotel.address].filter(Boolean).join(' ');
}
