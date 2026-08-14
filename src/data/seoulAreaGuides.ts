import { activeHotels as hotels } from './hotels';
import type { Hotel } from './hotels';
import { isSeoulHotel } from './seoulSearchIntents';

export type SeoulAreaGuide = {
  slug: string;
  path: string;
  title: string;
  eyebrow: string;
  intro: string;
  purpose: string;
  intentQuestion: string;
  metaDescription: string;
  criteria: string[];
  tableColumns: string[];
  keywords: string[];
  negativeKeywords?: string[];
};

export type SeoulAreaGuideHotel = {
  hotel: Hotel;
  guideScore: number;
  reasons: string[];
  caution: string;
  target: string;
  tags: string[];
  tableCells: string[];
};

export const seoulAreaGuides: SeoulAreaGuide[] = [
  {
    slug: 'myeongdong-hotels',
    path: '/seoul/myeongdong-hotels/',
    title: '명동 호텔 후기 모음',
    eyebrow: 'MYEONGDONG HOTEL GUIDE',
    intro: '명동 호텔은 쇼핑, 남대문, 을지로, 서울역 이동을 함께 보는 여행자에게 자주 비교됩니다. 위치만 보지 않고 객실 크기, 주차, 조식, 도보 동선을 함께 정리했습니다.',
    purpose: '명동에서 쇼핑과 서울 중심 관광을 함께 계획하는 여행자가 숙소를 고르기 위한 페이지입니다.',
    intentQuestion: '명동에서 위치와 후기 균형이 좋은 호텔은 어디일까?',
    metaDescription: '명동 호텔 후기를 위치, 조식, 객실, 주차, 서울 도심 관광 동선 기준으로 비교했습니다.',
    criteria: ['명동 위치', '도보 관광', '지하철 접근', '객실 컨디션', '주차 확인'],
    tableColumns: ['위치', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['명동', '을지로', '남대문', '회현', '충무로', '중구', 'myeongdong', 'euljiro', 'namdaemun']
  },
  {
    slug: 'gangnam-hotels',
    path: '/seoul/gangnam-hotels/',
    title: '강남 호텔 후기 모음',
    eyebrow: 'GANGNAM HOTEL GUIDE',
    intro: '강남 호텔은 출장, 코엑스 방문, 쇼핑, 약속 동선에 따라 만족도가 달라집니다. 역삼, 삼성, 선릉, 신논현 주변 호텔을 교통과 주차 관점에서 함께 비교합니다.',
    purpose: '강남권 출장이나 일정이 있는 여행자가 이동 실패를 줄이기 위한 페이지입니다.',
    intentQuestion: '강남에서 출장과 여행에 모두 무난한 호텔은 어디일까?',
    metaDescription: '강남 호텔 후기를 역삼, 삼성, 코엑스, 신논현, 주차, 객실, 조식 기준으로 비교했습니다.',
    criteria: ['강남 위치', '출장 적합', '지하철 접근', '주차', '가격대'],
    tableColumns: ['강남 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['강남', '역삼', '삼성', '선릉', '논현', '신논현', '코엑스', '테헤란', 'gangnam', 'yeoksam', 'samseong', 'coex']
  },
  {
    slug: 'hongdae-mapo-hotels',
    path: '/seoul/hongdae-mapo-hotels/',
    title: '홍대 마포 호텔 후기 모음',
    eyebrow: 'HONGDAE & MAPO GUIDE',
    intro: '홍대와 마포 호텔은 공항철도, 맛집, 공연, 한강 서쪽 이동을 함께 보는 경우가 많습니다. 밤 시간대 소음과 역 접근성을 함께 확인하는 것이 중요합니다.',
    purpose: '홍대·마포권에서 분위기와 이동 편의를 함께 보고 싶은 여행자를 위한 페이지입니다.',
    intentQuestion: '홍대와 마포에서 교통과 후기 만족도가 괜찮은 호텔은 어디일까?',
    metaDescription: '홍대 마포 호텔 후기를 공항철도, 맛집, 소음, 객실, 가격 기준으로 비교했습니다.',
    criteria: ['홍대·마포 위치', '공항철도', '소음 확인', '맛집 동선', '가성비'],
    tableColumns: ['권역', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['홍대', '합정', '상수', '연남', '마포', '공덕', '상암', 'hongdae', 'hapjeong', 'mapo', 'gongdeok']
  },
  {
    slug: 'dongdaemun-hotels',
    path: '/seoul/dongdaemun-hotels/',
    title: '동대문 호텔 후기 모음',
    eyebrow: 'DONGDAEMUN HOTEL GUIDE',
    intro: '동대문 호텔은 DDP, 쇼핑, 야간 이동 일정과 함께 비교됩니다. 지하철 접근성과 주변 상권, 객실 방음 후기를 같이 보는 것이 좋습니다.',
    purpose: '동대문 쇼핑이나 DDP 방문을 앞둔 여행자가 숙소를 고르기 위한 페이지입니다.',
    intentQuestion: '동대문에서 야간 이동까지 고려할 만한 호텔은 어디일까?',
    metaDescription: '동대문 호텔 후기를 DDP, 쇼핑, 야간 이동, 방음, 객실 조건 기준으로 비교했습니다.',
    criteria: ['동대문 위치', 'DDP 접근', '야간 이동', '방음', '가격대'],
    tableColumns: ['동대문 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['동대문', 'DDP', '동묘', '신당', '청량리', 'dongdaemun', 'ddp', 'cheongnyangni']
  },
  {
    slug: 'jongno-insadong-hotels',
    path: '/seoul/jongno-insadong-hotels/',
    title: '종로 인사동 호텔 후기 모음',
    eyebrow: 'JONGNO & INSADONG GUIDE',
    intro: '종로와 인사동 호텔은 고궁, 북촌, 광화문, 청계천 일정을 묶어 보기 좋습니다. 도보 관광과 지하철 접근, 객실 크기 차이를 함께 확인합니다.',
    purpose: '서울 전통 관광과 도심 이동을 함께 계획하는 여행자를 위한 페이지입니다.',
    intentQuestion: '종로와 인사동에서 서울 관광에 편한 호텔은 어디일까?',
    metaDescription: '종로 인사동 호텔 후기를 고궁, 광화문, 북촌, 객실, 주차 기준으로 비교했습니다.',
    criteria: ['종로 위치', '인사동·고궁', '도보 관광', '객실 크기', '주차 확인'],
    tableColumns: ['관광 동선', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['종로', '인사동', '광화문', '시청', '북촌', '익선', 'jongno', 'jongro', 'insadong', 'gwanghwamun']
  },
  {
    slug: 'seoul-station-yongsan-hotels',
    path: '/seoul/seoul-station-yongsan-hotels/',
    title: '서울역 용산 호텔 후기 모음',
    eyebrow: 'SEOUL STATION & YONGSAN GUIDE',
    intro: '서울역과 용산 호텔은 KTX, 공항철도, 짧은 서울 체류 일정에서 자주 비교됩니다. 캐리어 이동과 역 출구 동선까지 함께 보는 것이 좋습니다.',
    purpose: '기차나 공항철도 이동 전후 숙박을 찾는 여행자를 위한 페이지입니다.',
    intentQuestion: '서울역과 용산에서 이동이 편한 호텔은 어디일까?',
    metaDescription: '서울역 용산 호텔 후기를 KTX, 공항철도, 캐리어 이동, 체크인, 객실 기준으로 비교했습니다.',
    criteria: ['서울역·용산', 'KTX', '공항철도', '캐리어 이동', '체크인'],
    tableColumns: ['교통 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['서울역', '용산', '남영', '숙대', '이태원', 'yongsan', 'itaewon', 'seoul station', 'namyeong']
  },
  {
    slug: 'yeouido-yeongdeungpo-hotels',
    path: '/seoul/yeouido-yeongdeungpo-hotels/',
    title: '여의도 영등포 호텔 후기 모음',
    eyebrow: 'YEOUIDO & YEONGDEUNGPO GUIDE',
    intro: '여의도와 영등포 호텔은 출장, 한강, 더현대, 타임스퀘어 일정과 연결됩니다. 주말 혼잡과 주차 조건을 함께 보는 것이 좋습니다.',
    purpose: '서남권 비즈니스와 쇼핑 일정을 함께 계획하는 여행자를 위한 페이지입니다.',
    intentQuestion: '여의도와 영등포에서 출장과 쇼핑에 맞는 호텔은 어디일까?',
    metaDescription: '여의도 영등포 호텔 후기를 출장, 한강, 쇼핑, 주차, 객실 조건 기준으로 비교했습니다.',
    criteria: ['여의도·영등포', '출장', '쇼핑몰 접근', '주차', '한강 동선'],
    tableColumns: ['권역', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['여의도', '영등포', '당산', '국회의사당', '문래', 'yeouido', 'yeongdeungpo', 'dangsan']
  },
  {
    slug: 'jamsil-songpa-hotels',
    path: '/seoul/jamsil-songpa-hotels/',
    title: '잠실 송파 호텔 후기 모음',
    eyebrow: 'JAMSIL & SONGPA GUIDE',
    intro: '잠실과 송파 호텔은 롯데월드, 석촌호수, 올림픽공원 일정에서 자주 비교됩니다. 가족 여행은 객실 크기와 주차, 조식 조건을 함께 봐야 합니다.',
    purpose: '롯데월드나 잠실권 가족 여행을 준비하는 사용자를 위한 페이지입니다.',
    intentQuestion: '잠실과 송파에서 가족 여행에 맞는 호텔은 어디일까?',
    metaDescription: '잠실 송파 호텔 후기를 롯데월드, 가족 여행, 객실, 조식, 주차 기준으로 비교했습니다.',
    criteria: ['잠실·송파', '롯데월드', '가족 여행', '객실 크기', '주차'],
    tableColumns: ['잠실 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['잠실', '송파', '석촌', '롯데월드', '방이', '올림픽공원', 'jamsil', 'songpa', 'lotte world', 'seokchon']
  },
  {
    slug: 'gimpo-airport-gangseo-hotels',
    path: '/seoul/gimpo-airport-gangseo-hotels/',
    title: '김포공항 강서 호텔 후기 모음',
    eyebrow: 'GIMPO AIRPORT & GANGSEO GUIDE',
    intro: '김포공항과 강서 호텔은 국내선 전후 숙박, 마곡 출장, 서부권 이동에서 자주 비교됩니다. 거리보다 실제 이동 시간과 새벽 이동 가능 여부가 중요합니다.',
    purpose: '김포공항 전후 숙박이나 마곡 업무 일정을 준비하는 사용자를 위한 페이지입니다.',
    intentQuestion: '김포공항과 강서에서 이동 부담이 적은 호텔은 어디일까?',
    metaDescription: '김포공항 강서 호텔 후기를 공항 이동, 마곡 출장, 체크인, 주차, 객실 기준으로 비교했습니다.',
    criteria: ['김포공항', '강서·마곡', '새벽 이동', '주차', '출장'],
    tableColumns: ['공항 접근', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['김포공항', '강서', '마곡', '화곡', '발산', 'gimpo airport', 'gangseo', 'magok', 'balsan'],
    negativeKeywords: ['인천공항', '영종도', '운서']
  },
  {
    slug: 'seoul-hotel-comparison',
    path: '/seoul/seoul-hotel-comparison/',
    title: '서울 호텔 비교',
    eyebrow: 'SEOUL HOTEL COMPARISON',
    intro: '서울 호텔은 권역 선택이 만족도를 크게 좌우합니다. 명동, 강남, 홍대, 동대문, 종로, 잠실, 여의도처럼 목적지가 달라지면 좋은 호텔 기준도 달라집니다.',
    purpose: '서울 호텔을 권역별로 먼저 좁힌 뒤 개별 호텔을 비교하기 위한 페이지입니다.',
    intentQuestion: '서울 호텔은 어느 지역부터 비교해야 할까?',
    metaDescription: '서울 호텔을 명동, 강남, 홍대, 동대문, 종로, 서울역, 잠실, 여의도, 김포공항 권역으로 비교했습니다.',
    criteria: ['서울 권역', '평점', '후기 수', '가격대', '추천 목적'],
    tableColumns: ['권역', '평점', '후기 수', '가격대', '추천 대상'],
    keywords: ['서울', 'seoul']
  }
];

export const seoulHotels = hotels
  .filter(isSeoulHotel)
  .sort((a, b) => popularity(b) - popularity(a));

export function getSeoulAreaGuide(slug: string) {
  return seoulAreaGuides.find((guide) => guide.slug === slug);
}

export function getSeoulAreaGuideHotels(guide: SeoulAreaGuide, limit = 20): SeoulAreaGuideHotel[] {
  return seoulHotels
    .map((hotel) => buildGuideHotel(hotel, guide))
    .filter((item) => item.guideScore > 0)
    .sort((a, b) => b.guideScore - a.guideScore)
    .slice(0, limit);
}

export function getRelatedSeoulAreaGuides(hotel: Hotel) {
  if (!isSeoulHotel(hotel)) return [];
  const text = hotelText(hotel);
  return seoulAreaGuides
    .map((guide) => ({
      guide,
      score: keywordScore(text, guide.keywords) - keywordScore(text, guide.negativeKeywords || [])
    }))
    .filter((item) => item.score > 0 || item.guide.slug === 'seoul-hotel-comparison')
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => item.guide);
}

function buildGuideHotel(hotel: Hotel, guide: SeoulAreaGuide): SeoulAreaGuideHotel {
  const text = hotelText(hotel);
  const directScore =
    guide.slug === 'seoul-hotel-comparison'
      ? 1
      : keywordScore(text, guide.keywords) - keywordScore(text, guide.negativeKeywords || []);
  const guideScore = directScore > 0 ? directScore * 10 + popularity(hotel) : 0;
  const area = pickAreaLabel(hotel);
  const price = priceText(hotel);
  const score = hotel.reviewScore ? `${hotel.reviewScore}` : '확인 필요';
  const reviews = hotel.reviewCount ? `${hotel.reviewCount.toLocaleString('ko-KR')}건` : '후기 부족';

  return {
    hotel,
    guideScore,
    reasons: buildReasons(hotel, guide, area),
    caution: buildCaution(hotel, guide),
    target: buildTarget(guide, area),
    tags: [...new Set([area, ...guide.criteria.slice(0, 3)])].slice(0, 5),
    tableCells: buildTableCells(guide, area, score, reviews, price)
  };
}

function buildReasons(hotel: Hotel, guide: SeoulAreaGuide, area: string) {
  const reasons = [
    `${area} 일정에서 위치와 이동 동선을 먼저 비교하기 좋은 후보입니다.`,
    hotel.reviewScore && hotel.reviewScore >= 8.5
      ? '평점이 높은 편이라 후기 기반으로 우선 검토할 만합니다.'
      : '평점과 후기 수를 함께 보며 기대치를 조정하기 좋습니다.',
    hotel.reviewCount && hotel.reviewCount >= 3000
      ? '후기 수가 많아 반복되는 장단점을 비교하기 쉽습니다.'
      : '후기 수가 아주 많지는 않아 객실 타입과 최신 후기를 추가 확인하는 편이 좋습니다.'
  ];

  if (guide.slug.includes('gangnam')) reasons[0] = '강남권 출장, 코엑스, 역삼·삼성 이동을 함께 보기 좋은 후보입니다.';
  if (guide.slug.includes('myeongdong')) reasons[0] = '명동 쇼핑과 서울 도심 관광 동선을 함께 보기 좋은 후보입니다.';
  if (guide.slug.includes('jamsil')) reasons[0] = '잠실·송파 가족 일정과 롯데월드 방문을 함께 비교하기 좋은 후보입니다.';
  if (guide.slug.includes('gimpo')) reasons[0] = '김포공항 이동과 강서·마곡 일정을 함께 보기 좋은 후보입니다.';

  return reasons;
}

function buildCaution(hotel: Hotel, guide: SeoulAreaGuide) {
  const firstCon = hotel.analysis.cons[0];
  if (firstCon) return firstCon;
  if (guide.slug.includes('myeongdong') || guide.slug.includes('jongno')) return '도심 호텔은 객실 크기와 주차 조건 차이가 커서 예약 단계에서 다시 확인하는 것이 좋습니다.';
  if (guide.slug.includes('gangnam') || guide.slug.includes('seocho')) return '출퇴근 시간대 차량 정체와 주차 요금을 함께 확인해야 합니다.';
  if (guide.slug.includes('hongdae')) return '밤 시간대 주변 소음과 객실 방음 후기를 함께 확인하는 편이 좋습니다.';
  return '객실 타입별 면적, 조식 포함 여부, 체크인 시간을 예약 단계에서 다시 확인해야 합니다.';
}

function buildTarget(guide: SeoulAreaGuide, area: string) {
  if (guide.slug.includes('myeongdong')) return '명동 쇼핑·도심 관광';
  if (guide.slug.includes('gangnam')) return '강남 출장·코엑스';
  if (guide.slug.includes('hongdae')) return '홍대·마포 여행';
  if (guide.slug.includes('dongdaemun')) return '동대문 쇼핑';
  if (guide.slug.includes('jongno')) return '고궁·인사동 관광';
  if (guide.slug.includes('seoul-station')) return 'KTX·공항철도';
  if (guide.slug.includes('yeouido')) return '여의도 출장·쇼핑';
  if (guide.slug.includes('jamsil')) return '잠실 가족 여행';
  if (guide.slug.includes('gimpo')) return '김포공항·마곡 출장';
  return `${area} 호텔 비교`;
}

function buildTableCells(guide: SeoulAreaGuide, area: string, score: string, reviews: string, price: string) {
  if (guide.slug === 'seoul-hotel-comparison') return [area, score, reviews, price, buildTarget(guide, area)];
  return ['높음', score, reviews, price, buildTarget(guide, area)];
}

function pickAreaLabel(hotel: Hotel) {
  const text = hotelText(hotel);
  if (/명동|을지로|남대문|회현|충무로|중구|myeongdong|euljiro|namdaemun/.test(text)) return '명동·중구';
  if (/강남|역삼|삼성|선릉|논현|신논현|코엑스|테헤란|gangnam|yeoksam|samseong|coex/.test(text)) return '강남·역삼';
  if (/홍대|합정|상수|연남|마포|공덕|상암|hongdae|hapjeong|mapo|gongdeok/.test(text)) return '홍대·마포';
  if (/동대문|ddp|동묘|신당|청량리|dongdaemun|cheongnyangni/.test(text)) return '동대문';
  if (/종로|인사동|광화문|시청|북촌|익선|jongno|insadong|gwanghwamun/.test(text)) return '종로·인사동';
  if (/서울역|용산|남영|숙대|이태원|yongsan|itaewon|seoul station/.test(text)) return '서울역·용산';
  if (/여의도|영등포|당산|문래|yeouido|yeongdeungpo/.test(text)) return '여의도·영등포';
  if (/잠실|송파|석촌|롯데월드|방이|올림픽공원|jamsil|songpa|lotte world/.test(text)) return '잠실·송파';
  if (/김포공항|강서|마곡|화곡|발산|gimpo airport|gangseo|magok/.test(text)) return '김포공항·강서';
  return '서울';
}

function keywordScore(text: string, keywords: string[]) {
  return keywords.reduce((sum, keyword) => sum + (text.includes(keyword.toLowerCase()) ? 1 : 0), 0);
}

function popularity(hotel: Hotel) {
  return (hotel.reviewScore || 0) * 2 + Math.log10((hotel.reviewCount || 0) + 10);
}

function priceText(hotel: Hotel) {
  const price = hotel.averageNightlyRate ?? hotel.dailyRate;
  return price ? `${price.toLocaleString('ko-KR')}원~` : '가격 확인';
}

function hotelText(hotel: Hotel) {
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
