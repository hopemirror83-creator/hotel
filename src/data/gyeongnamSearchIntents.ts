import type { Hotel } from './hotels';

type IntentFaq = {
  question: string;
  answer: string;
  category: string;
};

type GyeongnamAreaType = 'tongyeong' | 'geoje' | 'changwon' | 'jinju' | 'gimhae-yangsan' | 'namhae-hadong' | 'sacheon-goseong' | 'gyeongnam';

type GyeongnamAreaProfile = {
  label: string;
  titleKeyword: string;
  locationQuestion: string;
  locationAnswer: string;
  recommendedFor: string[];
  notRecommendedFor: string[];
  areaType: GyeongnamAreaType;
};

const SOURCE_NOTE =
  '네이버와 구글 자동완성에서 반복되는 경남 호텔 검색 의도와 호텔로그의 공개 후기 분석 데이터를 함께 반영했습니다.';

export function getGyeongnamSearchIntent(hotel: Hotel) {
  if (!isGyeongnamHotel(hotel)) return undefined;

  const area = pickGyeongnamArea(hotel);
  const hotelName = hotel.hotelName.trim();
  const text = searchableText(hotel);
  const hasBreakfast = /조식|뷔페|breakfast/i.test(text);
  const hasOcean = /오션|바다|해변|마리나|항|통영|거제|남해|사천|고성|뷰|ocean|sea/i.test(text);
  const hasFamily = /가족|키즈|리조트|풀빌라|펜션|family/i.test(text);
  const hasBusiness = /창원|진주|김해|양산|마산|출장|비즈니스|터미널|역|business/i.test(text);

  const titleTerms = buildTitleTerms(text, area.areaType, { hasBreakfast, hasOcean, hasFamily, hasBusiness });
  const titleTail = buildSpecificTitleKeyword(hotel)
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
        '경남은 통영·거제·남해처럼 차량 이동형 여행지가 많고, 창원·진주·김해처럼 출장형 숙소도 섞여 있습니다. 체크인 가능 시간, 짐보관, 늦은 도착 가능 여부, 주차장 위치를 함께 확인하는 편이 좋습니다.'
    },
    {
      category: '주차',
      question: `${hotelName} 주차는 예약 전에 확인해야 하나요?`,
      answer:
        '경남 여행은 차량 이동 비중이 높습니다. 무료 주차 여부, 객실당 차량 제한, 성수기 만차 가능성, 주변 대체 주차장을 미리 확인하면 일정이 훨씬 편해집니다.'
    },
    {
      category: hasBreakfast ? '조식' : '객실',
      question: hasBreakfast
        ? `${hotelName} 조식 포함 예약이 유리할까요?`
        : `${hotelName} 객실은 어떤 기준으로 봐야 하나요?`,
      answer: hasBreakfast
        ? '조식을 중요하게 본다면 포함 요금과 현장 결제 요금을 비교하세요. 통영·거제·남해처럼 관광 이동이 빠른 지역은 조식 시작 시간과 대기 가능성도 함께 확인하는 것이 좋습니다.'
        : '객실은 면적, 침대 구성, 방음, 욕실 컨디션, 창문 방향을 함께 봐야 합니다. 펜션·풀빌라·리조트형 숙소라면 취사 가능 여부와 객실별 시설 차이도 확인하세요.'
    }
  ];

  if (hasOcean) {
    faqs.push({
      category: '오션뷰',
      question: `${hotelName} 오션뷰나 바다 전망은 어떻게 확인해야 하나요?`,
      answer:
        '오션뷰는 객실 타입과 층수에 따라 차이가 큽니다. 객실명에 오션뷰가 명확히 들어가는지, 부분 전망인지 정면 전망인지, 항구뷰인지 바다뷰인지까지 확인하는 편이 안전합니다.'
    });
  }

  return {
    slug: hotel.slug,
    title,
    seoTitle: `${title}｜예약 전 FAQ`,
    metaDescription: `${hotelName} 후기를 ${area.label} 위치, 교통, 체크인, 주차, 조식, 객실 조건 중심으로 정리했습니다. 예약 전 자주 묻는 질문까지 함께 확인하세요.`,
    lead: `${hotelName}은 ${area.label} 여행에서 위치와 이동 조건을 함께 봐야 하는 숙소입니다.`,
    intentChips: buildIntentChips(area.areaType, { hasBreakfast, hasOcean, hasFamily, hasBusiness }),
    bodyOrder: ['위치와 이동', '체크인과 짐보관', '주차 조건', hasBreakfast ? '조식' : '객실 조건', '추천 여행자'],
    repeatedQuestions: faqs.map((faq) => faq.question),
    recommendedFor: area.recommendedFor,
    notRecommendedFor: area.notRecommendedFor,
    faqs,
    sourceNote: SOURCE_NOTE
  };
}

export function isGyeongnamHotel(hotel: Hotel) {
  const text = realLocationText(hotel);
  return (
    /^gyeongnam-/.test(hotel.slug) ||
    /경남|경상남도|Gyeongnam|Gyeongsangnam|통영|거제|창원|진주|김해|양산|남해|하동|사천|고성|밀양|창녕/i.test(text)
  );
}

function pickGyeongnamArea(hotel: Hotel): GyeongnamAreaProfile {
  const text = [hotel.hotelName, realLocationText(hotel)].filter(Boolean).join(' ');
  if (/통영|한산|충무|동피랑|서피랑|tongyeong/i.test(text)) return areaProfiles.tongyeong;
  if (/거제|옥포|장승포|고현|geoje/i.test(text)) return areaProfiles.geoje;
  if (/창원|마산|진해|상남동|용원|changwon|masan|jinhae/i.test(text)) return areaProfiles.changwon;
  if (/진주|남강|혁신|jinju/i.test(text)) return areaProfiles.jinju;
  if (/김해|양산|부산신항|녹산|gimhae|yangsan/i.test(text)) return areaProfiles['gimhae-yangsan'];
  if (/남해|하동|독일마을|지리산|namhae|hadong/i.test(text)) return areaProfiles['namhae-hadong'];
  if (/사천|고성|삼천포|sacheon|goseong/i.test(text)) return areaProfiles['sacheon-goseong'];
  return areaProfiles.gyeongnam;
}

const areaProfiles: Record<GyeongnamAreaType, GyeongnamAreaProfile> = {
  tongyeong: {
    label: '경남 통영',
    titleKeyword: '통영 경남',
    locationQuestion: '통영항, 동피랑, 케이블카 일정에 맞나요?',
    locationAnswer:
      '통영은 통영항, 동피랑·서피랑, 케이블카, 섬 여행 동선에 따라 숙소 위치 만족도가 달라집니다. 항구 접근성과 주차, 바다 전망 여부를 함께 확인하세요.',
    recommendedFor: ['통영항과 동피랑 일정을 준비하는 여행자', '섬 여행 전후로 숙박하는 여행자', '오션뷰와 주차를 함께 보는 여행자'],
    notRecommendedFor: ['항구 이동 시간을 확인하지 않는 여행자', '오션뷰 객실 타입을 확인하지 않고 예약하려는 여행자'],
    areaType: 'tongyeong'
  },
  geoje: {
    label: '경남 거제',
    titleKeyword: '거제 경남',
    locationQuestion: '장승포, 고현, 바다 여행 일정에 맞나요?',
    locationAnswer:
      '거제는 고현·옥포·장승포·해안권의 동선이 다릅니다. 출장형 숙박인지 바다 여행인지에 따라 위치와 주차, 객실 전망을 다르게 봐야 합니다.',
    recommendedFor: ['거제 바다 여행과 차량 이동을 함께 준비하는 여행자', '고현·옥포 출장 또는 짧은 숙박 여행자', '가족 단위 리조트형 숙소를 찾는 여행자'],
    notRecommendedFor: ['대중교통만으로 거제 외곽을 이동하려는 여행자', '객실 전망을 확인하지 않고 오션뷰를 기대하는 여행자'],
    areaType: 'geoje'
  },
  changwon: {
    label: '경남 창원·마산·진해',
    titleKeyword: '창원 마산 진해 경남',
    locationQuestion: '상남동, 창원중앙역, 마산, 진해 이동에 맞나요?',
    locationAnswer:
      '창원·마산·진해권은 출장, 역·터미널, 상남동, 진해 용원 이동 목적에 따라 숙소 선택이 달라집니다. 주차와 조식, 주변 식당 접근성을 함께 보는 것이 좋습니다.',
    recommendedFor: ['창원 출장이나 짧은 숙박을 준비하는 여행자', '마산·진해 이동이 필요한 여행자', '주차와 조식 조건을 중시하는 여행자'],
    notRecommendedFor: ['휴양형 리조트 시설을 기대하는 여행자', '목적지까지 실제 이동 시간을 확인하지 않는 여행자'],
    areaType: 'changwon'
  },
  jinju: {
    label: '경남 진주',
    titleKeyword: '진주 경남',
    locationQuestion: '남강, 진주성, 혁신도시 일정에 맞나요?',
    locationAnswer:
      '진주는 남강·진주성 관광과 혁신도시·출장 동선이 나뉩니다. 관광 목적이면 남강 접근성, 출장 목적이면 주차와 조식, 목적지까지 이동 시간을 먼저 확인하세요.',
    recommendedFor: ['진주 남강과 진주성 여행자', '혁신도시나 출장 숙소를 찾는 여행자', '주차와 실용성을 중시하는 여행자'],
    notRecommendedFor: ['관광지와 출장 목적지를 구분하지 않고 숙소를 고르는 여행자'],
    areaType: 'jinju'
  },
  'gimhae-yangsan': {
    label: '경남 김해·양산',
    titleKeyword: '김해 양산 경남',
    locationQuestion: '김해공항, 부산신항, 양산 이동에 맞나요?',
    locationAnswer:
      '김해·양산권은 김해공항, 부산신항, 산업단지, 양산 시내 이동이 중요합니다. 실제 주소와 목적지까지 시간을 먼저 확인하는 것이 좋습니다.',
    recommendedFor: ['김해공항이나 부산신항 주변 숙소를 찾는 여행자', '김해·양산 출장 숙소를 찾는 여행자', '주차와 가성비를 함께 보는 여행자'],
    notRecommendedFor: ['부산 도심 접근성을 기대하고 위치를 확인하지 않는 여행자'],
    areaType: 'gimhae-yangsan'
  },
  'namhae-hadong': {
    label: '경남 남해·하동',
    titleKeyword: '남해 하동 경남',
    locationQuestion: '남해 독일마을, 바다 전망, 하동 지리산 일정에 맞나요?',
    locationAnswer:
      '남해·하동은 차량 이동과 전망, 펜션·풀빌라형 숙소 조건이 중요합니다. 독일마을, 해안도로, 지리산 방향 동선을 함께 확인하세요.',
    recommendedFor: ['남해 바다 전망과 독일마을 일정을 준비하는 여행자', '하동 지리산권 휴식 여행자', '가족·커플 풀빌라형 숙소를 찾는 여행자'],
    notRecommendedFor: ['차량 없이 외곽 숙소를 이용하려는 여행자', '취사와 객실별 시설 차이를 확인하지 않는 여행자'],
    areaType: 'namhae-hadong'
  },
  'sacheon-goseong': {
    label: '경남 사천·고성',
    titleKeyword: '사천 고성 경남',
    locationQuestion: '삼천포, 고성, 남일대 바다 여행에 맞나요?',
    locationAnswer:
      '사천·고성권은 삼천포, 남일대, 고성 해안 이동이 핵심입니다. 바다 전망과 주차, 주변 식당 운영 시간, 가족 여행 적합도를 함께 확인하세요.',
    recommendedFor: ['사천 삼천포와 고성 해안 여행자', '가족 단위 바다 여행 숙소를 찾는 여행자', '조용한 해안권 숙소를 선호하는 여행자'],
    notRecommendedFor: ['번화가와 대중교통 접근성을 우선하는 여행자'],
    areaType: 'sacheon-goseong'
  },
  gyeongnam: {
    label: '경남',
    titleKeyword: '경남',
    locationQuestion: '경남 여행 일정에 맞나요?',
    locationAnswer:
      '경남 숙소는 통영, 거제, 창원, 진주, 김해, 남해처럼 목적지별 성격이 크게 다릅니다. 호텔명보다 먼저 여행 지역과 이동 방식을 정하고, 주차·체크인·조식 조건을 함께 비교하는 것이 좋습니다.',
    recommendedFor: ['경남 여러 지역을 차량으로 이동하는 여행자', '지역별 호텔을 먼저 비교하고 싶은 여행자'],
    notRecommendedFor: ['목적지를 정하지 않은 상태에서 가격만 보고 고르는 여행자'],
    areaType: 'gyeongnam'
  }
};

function buildTransportAnswer(areaType: GyeongnamAreaType) {
  if (areaType === 'tongyeong') return '통영은 항구와 케이블카, 동피랑·서피랑 동선이 나뉩니다. 섬 여행을 한다면 배편 시간과 항구까지 이동 시간을 먼저 확인하세요.';
  if (areaType === 'geoje') return '거제는 고현, 옥포, 장승포, 해안 관광지 간 거리가 있습니다. 차량 이동과 주차 조건을 먼저 확인하는 것이 좋습니다.';
  if (areaType === 'changwon') return '창원·마산·진해는 출장, 역·터미널, 상남동, 용원 이동 목적에 따라 숙소 위치가 달라집니다. 목적지까지 실제 이동 시간을 확인하세요.';
  if (areaType === 'jinju') return '진주는 남강·진주성과 혁신도시 동선이 다릅니다. 관광인지 출장인지 먼저 정하고 주차와 조식 조건을 함께 보세요.';
  if (areaType === 'gimhae-yangsan') return '김해·양산은 김해공항, 부산신항, 산업단지 이동이 중요합니다. 부산 도심과는 체감 거리가 다를 수 있어 목적지를 먼저 확인하세요.';
  if (areaType === 'namhae-hadong') return '남해·하동은 차량 이동 중심 일정이 많습니다. 해안도로, 독일마을, 지리산 방향까지의 이동 시간을 함께 확인하세요.';
  if (areaType === 'sacheon-goseong') return '사천·고성은 해안 이동과 주변 식당 운영 시간이 중요합니다. 차량 이동과 주차, 체크인 시간을 함께 맞춰보세요.';
  return '경남은 지역 간 거리가 넓습니다. 통영·거제·창원·진주·김해·남해 중 실제 목적지를 먼저 정하고 숙소를 비교하는 것이 좋습니다.';
}

function buildSpecificTitleKeyword(hotel: Hotel) {
  const text = [hotel.hotelName, realLocationText(hotel)].filter(Boolean).join(' ');
  const candidates = [
    ['통영', /통영|tongyeong/i],
    ['거제', /거제|geoje/i],
    ['창원', /창원|changwon/i],
    ['마산', /마산|masan/i],
    ['진해', /진해|jinhae/i],
    ['진주', /진주|jinju/i],
    ['김해', /김해|gimhae/i],
    ['양산', /양산|yangsan/i],
    ['남해', /남해|namhae/i],
    ['하동', /하동|hadong/i],
    ['사천', /사천|삼천포|sacheon/i],
    ['고성', /고성|goseong/i],
    ['밀양', /밀양|miryang/i],
    ['거창', /거창|geochang/i],
    ['산청', /산청|sancheong/i],
    ['합천', /합천|hapcheon/i]
  ] as const;
  const city = candidates.find(([, pattern]) => pattern.test(text))?.[0];
  return city ? `${city} 경남` : '경남';
}

function buildTitleTerms(
  text: string,
  areaType: GyeongnamAreaType,
  flags: { hasBreakfast: boolean; hasOcean: boolean; hasFamily: boolean; hasBusiness: boolean }
) {
  const terms = new Set<string>();
  const add = (items: string[]) => items.forEach((item) => terms.add(item));
  add(['위치', '주차', '체크인']);
  if (areaType === 'changwon' || areaType === 'jinju' || areaType === 'gimhae-yangsan') terms.add('출장');
  else terms.add('가성비');

  // 관광지와 시설명은 해당 호텔 데이터에서 확인될 때만 제목에 사용한다.
  if (/통영항|강구안|여객선터미널/i.test(text)) terms.add('통영항');
  if (/고현|고현버스터미널/i.test(text)) terms.add('고현');
  if (/상남동/i.test(text)) terms.add('상남동');
  if (/남강|진주성/i.test(text)) terms.add('남강');
  if (/김해공항/i.test(text)) terms.add('김해공항');
  if (/독일마을/i.test(text)) terms.add('독일마을');
  if (/풀빌라/i.test(text)) terms.add('풀빌라');
  if (flags.hasOcean) terms.add('전망');
  if (flags.hasBreakfast) terms.add('조식');
  if (flags.hasFamily) terms.add('가족');
  if (flags.hasBusiness) terms.add('출장');
  return [...terms].slice(0, 5);
}

function buildIntentChips(
  areaType: GyeongnamAreaType,
  flags: { hasBreakfast: boolean; hasOcean: boolean; hasFamily: boolean; hasBusiness: boolean }
) {
  const chips = new Set<string>(['위치', '주차', '체크인']);
  if (areaType === 'tongyeong') chips.add('통영항');
  if (areaType === 'geoje') chips.add('거제여행');
  if (areaType === 'changwon') chips.add('출장');
  if (areaType === 'jinju') chips.add('남강');
  if (areaType === 'gimhae-yangsan') chips.add('김해공항');
  if (areaType === 'namhae-hadong') chips.add('남해여행');
  if (areaType === 'sacheon-goseong') chips.add('해안여행');
  if (flags.hasBreakfast) chips.add('조식');
  if (flags.hasOcean) chips.add('오션뷰');
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
