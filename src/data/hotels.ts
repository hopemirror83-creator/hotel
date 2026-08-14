import { generatedHotels } from './generatedHotels';
import { manualHotels } from './manualHotels';

export interface HotelAnalysis {
  summary: string;
  pros: string[];
  cons: string[];
  recommendedFor: string[];
  notRecommendedFor: string[];
  checkPoints: string[];
  seoTitle: string;
  metaDescription: string;
  blogReview?: BlogReview;
}

export interface ReferenceLink {
  title: string;
  url: string;
  query?: string;
  source?: string;
}

export interface BlogReviewSection {
  heading: string;
  paragraphs: string[];
  image?: BlogReviewImage;
}

export interface BlogReviewImage {
  url: string;
  alt: string;
  source?: string;
  query?: string;
}

export interface BlogReview {
  intro: string[];
  sections: BlogReviewSection[];
}

export interface Hotel {
  slug: string;
  hotelName: string;
  region: string;
  address: string;
  latitude?: number;
  longitude?: number;
  starRating?: number;
  reviewScore?: number;
  reviewCount?: number;
  dailyRate?: number;
  averageNightlyRate?: number;
  averageNightlyRateSampleCount?: number;
  crossedOutRate?: number;
  discountPercentage?: number;
  imageUrl: string;
  landingUrl?: string;
  includeBreakfast?: boolean;
  freeWifi?: boolean;
  lastUpdated?: string;
  searchResultCount?: number;
  referenceLinks?: ReferenceLink[];
  analysis: HotelAnalysis;
}

export const site = {
  name: '호텔로그',
  englishName: 'HotelLog',
  region: '인천 영종도',
  domain: 'https://hotel.product-pack.com',
  devDomain: 'https://hotel.hopemirror83.workers.dev'
};

export const hotels: Hotel[] = [
  {
    slug: 'inspire-entertainment-resort',
    hotelName: '인스파이어 엔터테인먼트 리조트',
    region: '인천 영종도',
    address: '인천 중구 공항문화로 일대',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    includeBreakfast: false,
    freeWifi: true,
    searchResultCount: 0,
    analysis: {
      summary: '아고다와 네이버 신호 수집 전입니다. 이 페이지는 위치, 객실, 조식, 체크인, 짐보관 정보를 분석해 예약 전 판단용 요약으로 채워질 예정입니다.',
      pros: ['신규 리조트형 숙소 여부 확인 예정', '공항 접근성과 부대시설 신호 수집 예정', '가족/커플 여행 적합도 분석 예정'],
      cons: ['객실 이동 동선 관련 언급 확인 예정', '주말 혼잡도 관련 신호 확인 예정'],
      recommendedFor: ['리조트형 휴식을 원하는 여행자', '공항 근처에서 여유 있게 머물 여행자'],
      notRecommendedFor: ['최저가 위주로 숙소를 고르는 여행자'],
      checkPoints: ['체크인 시간', '공항 이동 방식', '조식 포함 여부', '부대시설 이용 조건'],
      seoTitle: '인스파이어 엔터테인먼트 리조트 후기 분석｜영종도 호텔 예약 전 체크',
      metaDescription: '인스파이어 엔터테인먼트 리조트 후기를 AI로 분석해 위치, 조식, 객실, 체크인, 추천 여행자 유형을 정리합니다.'
    }
  },
  {
    slug: 'paradise-city',
    hotelName: '파라다이스시티',
    region: '인천 영종도',
    address: '인천 중구 영종해안남로 일대',
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
    includeBreakfast: false,
    freeWifi: true,
    searchResultCount: 0,
    analysis: {
      summary: '후기 분석 데이터 수집 전입니다. 공항 접근성, 부대시설, 조식, 객실 크기 관련 신호를 모아 예약 전 체크포인트로 정리할 예정입니다.',
      pros: ['공항 인근 대형 호텔 장점 확인 예정', '부대시설 만족도 신호 수집 예정', '커플/가족 여행 적합도 분석 예정'],
      cons: ['가격대와 혼잡도 관련 반복 언급 확인 예정', '객실 타입별 차이 확인 예정'],
      recommendedFor: ['특별한 기념일 여행', '가족 휴식 여행', '공항 전후 1박'],
      notRecommendedFor: ['숙박비를 강하게 줄이고 싶은 여행자'],
      checkPoints: ['객실 타입별 포함 혜택', '조식 예약 조건', '체크인 대기 가능성', '공항 셔틀 여부'],
      seoTitle: '파라다이스시티 후기 분석｜영종도 위치·조식·객실 예약 전 체크',
      metaDescription: '파라다이스시티 후기를 AI로 분석해 위치, 조식, 객실 크기, 체크인, 추천 여행자 유형을 정리합니다.'
    }
  },
  {
    slug: 'nest-hotel-incheon',
    hotelName: '네스트호텔 인천',
    region: '인천 영종도',
    address: '인천 중구 영종해안남로 일대',
    imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80',
    includeBreakfast: false,
    freeWifi: true,
    searchResultCount: 0,
    analysis: {
      summary: '후기 분석 데이터 수집 전입니다. 바다 전망, 조식, 객실 분위기, 주변 이동 편의성을 중심으로 신호를 수집할 예정입니다.',
      pros: ['전망과 분위기 관련 긍정 신호 확인 예정', '조식 만족도 확인 예정', '커플 여행 적합도 분석 예정'],
      cons: ['대중교통 이동 편의성 확인 예정', '객실 크기 관련 언급 확인 예정'],
      recommendedFor: ['조용한 휴식을 원하는 커플', '전망을 중요하게 보는 여행자'],
      notRecommendedFor: ['도보 관광 동선을 중시하는 여행자'],
      checkPoints: ['객실 전망 타입', '조식 포함 여부', '공항 이동 시간', '주변 식당 접근성'],
      seoTitle: '네스트호텔 인천 후기 분석｜영종도 바다 전망·조식 예약 전 체크',
      metaDescription: '네스트호텔 인천 후기를 AI로 분석해 위치, 조식, 객실 분위기, 추천 여행자 유형을 정리합니다.'
    }
  },
  {
    slug: 'grand-hyatt-incheon',
    hotelName: '그랜드 하얏트 인천',
    region: '인천 영종도',
    address: '인천 중구 영종해안남로 일대',
    imageUrl: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80',
    includeBreakfast: false,
    freeWifi: true,
    searchResultCount: 0,
    analysis: {
      summary: '후기 분석 데이터 수집 전입니다. 공항 접근성, 셔틀, 객실 컨디션, 체크인 편의성을 중심으로 예약 전 정보를 정리할 예정입니다.',
      pros: ['공항 접근성 관련 신호 수집 예정', '비즈니스/환승 숙박 적합도 분석 예정', '객실 컨디션 언급 확인 예정'],
      cons: ['건물/동선 관련 불편 신호 확인 예정', '가격 대비 만족도 확인 예정'],
      recommendedFor: ['환승 전후 숙박', '비즈니스 여행', '이른 출국 일정'],
      notRecommendedFor: ['영종도 관광 중심 여행자'],
      checkPoints: ['셔틀 운행 시간', '터미널 이동 거리', '체크인 대기', '조식 시작 시간'],
      seoTitle: '그랜드 하얏트 인천 후기 분석｜공항 접근성·체크인 예약 전 체크',
      metaDescription: '그랜드 하얏트 인천 후기를 AI로 분석해 공항 접근성, 체크인, 조식, 객실 컨디션을 정리합니다.'
    }
  },
  {
    slug: 'golden-tulip-incheon-airport',
    hotelName: '골든튤립 인천공항 호텔&스위트',
    region: '인천 영종도',
    address: '인천 중구 운서동 일대',
    imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    includeBreakfast: false,
    freeWifi: true,
    searchResultCount: 0,
    analysis: {
      summary: '후기 분석 데이터 수집 전입니다. 운서역 접근성, 공항 이동, 객실 크기, 짐보관 가능 여부를 중심으로 확인할 예정입니다.',
      pros: ['운서역 접근성 확인 예정', '가성비 관련 신호 수집 예정', '공항 전후 1박 적합도 분석 예정'],
      cons: ['방음과 객실 노후도 관련 언급 확인 예정', '체크인 혼잡도 확인 예정'],
      recommendedFor: ['공항 전후 짧은 숙박', '혼자 여행', '가성비를 보는 여행자'],
      notRecommendedFor: ['리조트형 부대시설을 원하는 여행자'],
      checkPoints: ['짐보관 가능 여부', '공항 이동 수단', '객실 크기', '조식 운영 시간'],
      seoTitle: '골든튤립 인천공항 호텔&스위트 후기 분석｜운서역·짐보관 체크',
      metaDescription: '골든튤립 인천공항 호텔&스위트 후기를 AI로 분석해 위치, 짐보관, 체크인, 객실 크기를 정리합니다.'
    }
  }
];

const publishableGeneratedHotels = generatedHotels.filter((hotel) => hotel.analysis);
const generatedSlugs = new Set(publishableGeneratedHotels.map((hotel) => hotel.slug));
const missingManualHotels = manualHotels.filter((hotel) => !generatedSlugs.has(hotel.slug));

export const activeHotels: Hotel[] = publishableGeneratedHotels.length > 0 ? [...publishableGeneratedHotels, ...missingManualHotels] : hotels;

export function getHotelBySlug(slug: string) {
  return activeHotels.find((hotel) => hotel.slug === slug);
}
