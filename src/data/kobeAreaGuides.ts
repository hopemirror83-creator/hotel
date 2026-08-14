import { activeHotels as hotels } from './hotels';
import type { Hotel } from './hotels';

export type KobeAreaGuide = {
  slug: string; path: string; title: string; eyebrow: string; intro: string;
  purpose: string; intentQuestion: string; metaDescription: string;
  criteria: string[]; keywords: string[];
};

export const kobeAreaGuides: KobeAreaGuide[] = [
  guide('sannomiya-hotels', 'SANNOMIYA GUIDE', '고베 산노미야 호텔 후기 모음 교통·조식·체크인·쇼핑 비교',
    '산노미야는 JR과 한큐·한신, 지하철 노선이 모여 고베 도심과 오사카 이동에 편리하지만 역 출구와 짐 이동 동선을 함께 봐야 합니다.',
    '고베 도심 관광과 오사카 이동을 함께 준비하는 여행자를 위한 선택 가이드입니다.',
    '산노미야 호텔은 역과의 거리 외에 무엇을 비교해야 할까요?', ['산노미야역', '교통', '짐 보관', '조식', '쇼핑'], ['산노미야', 'Sannomiya', '三宮', '이소가미', 'Isogami']),
  guide('kobe-station-hotels', 'KOBE STATION GUIDE', '고베역 호텔 후기 모음 하버랜드·교통·조식·체크인 비교',
    '고베역 주변은 하버랜드와 모자이크 접근이 좋지만 산노미야 이동, 역 출구와 야간 식사 동선도 확인해야 합니다.',
    '하버랜드 관광과 JR 이동을 중심으로 숙소를 찾는 여행자를 위한 가이드입니다.',
    '고베역 호텔은 하버랜드 접근성과 도심 이동 중 무엇을 먼저 봐야 할까요?', ['고베역', '하버랜드', 'JR 이동', '조식', '야간 동선'], ['고베역', 'Kobe Station', '하버랜드', 'Harborland', 'Higashikawasaki', '히가시카와사키']),
  guide('harborland-hotels', 'HARBORLAND GUIDE', '고베 하버랜드 호텔 후기 모음 오션뷰·야경·교통 비교',
    '하버랜드와 메리켄파크 숙소는 바다 전망과 야경이 강점이지만 객실 방향, 역까지의 이동과 조식 조건을 함께 확인해야 합니다.',
    '고베항 야경과 워터프런트 산책을 중요하게 보는 여행자를 위한 가이드입니다.',
    '고베 하버랜드 호텔은 오션뷰 예약 전에 무엇을 확인해야 할까요?', ['오션뷰', '야경', '메리켄파크', '교통', '객실 방향'], ['하버랜드', 'Harborland', '메리켄', 'Meriken', '고베항', 'Kobe Port', '해버']),
  guide('arima-onsen-hotels', 'ARIMA ONSEN GUIDE', '아리마온천 료칸·호텔 후기 모음 온천·석식·송영 비교',
    '아리마온천 숙소는 금천·은천 시설과 석식 포함 여부, 언덕길 이동과 송영 조건에 따라 체감 만족도가 달라집니다.',
    '고베 여행 중 온천과 료칸 숙박을 계획하는 여행자를 위한 선택 가이드입니다.',
    '아리마온천 숙소는 온천 시설 외에 무엇을 비교해야 할까요?', ['금천·은천', '석식', '송영', '언덕길', '료칸'], ['아리마', 'Arima', '有馬', '온천', 'Onsen', '료칸', 'Ryokan']),
  guide('rokko-hotels', 'ROKKO GUIDE', '고베 롯코 호텔 후기 모음 야경·리조트·가족여행 비교',
    '롯코산과 롯코아일랜드 숙소는 전망과 리조트 시설이 장점이지만 도심 접근, 셔틀과 주변 식사 선택지를 확인해야 합니다.',
    '고베 야경과 가족 리조트 숙박을 함께 고려하는 여행자를 위한 가이드입니다.',
    '롯코 호텔은 전망과 도심 접근성 중 어느 쪽을 우선해야 할까요?', ['롯코산', '야경', '셔틀', '가족여행', '리조트'], ['롯코', 'Rokko', '六甲', 'Rokko Island', '롯코아일랜드', 'Seishin', '세이신']),
  guide('kobe-family-hotels', 'KOBE FAMILY GUIDE', '고베 가족호텔 후기 모음 객실·조식·교통·주차 비교',
    '가족 숙소는 침대 구성과 객실 크기, 아이 동반 조식, 주차와 관광지 이동 동선을 함께 봐야 합니다.',
    '아이와 함께 고베를 여행하는 가족을 위한 숙소 선택 가이드입니다.',
    '고베 가족호텔은 객실 크기와 교통 중 무엇을 먼저 비교해야 할까요?', ['가족 객실', '침대 구성', '아이 조식', '주차', '교통'], ['가족', '패밀리', 'family', 'triple', '트리플', 'suite', '스위트', 'resort', '리조트']),
  guide('kobe-value-hotels', 'KOBE VALUE GUIDE', '고베 가성비 호텔 후기 모음 역 접근·객실·조식 비교',
    '가성비 숙소는 표시 요금만 보기보다 역까지의 거리와 객실 크기, 조식·대욕장 포함 여부를 함께 비교해야 합니다.',
    '교통과 기본 객실 품질을 유지하면서 숙박비를 조절하려는 여행자를 위한 가이드입니다.',
    '고베 가성비 호텔은 가격 외에 어떤 조건을 비교해야 할까요?', ['가격대', '역 접근', '객실', '조식', '후기 수'], ['APA', 'KOKO', 'Toyoko', '토요코', 'R&B', '루미너스', 'Luminous', 'Inn', '인']),
  guide('kobe-hotel-comparison', 'KOBE COMPARISON', '고베 호텔 비교 후기 모음 산노미야·하버랜드·아리마온천',
    '고베는 산노미야와 고베역, 하버랜드, 아리마온천처럼 지역마다 교통과 숙박 목적의 차이가 뚜렷합니다.',
    '고베 주요 지역 호텔을 일정과 이동 방식, 숙박 예산에 맞게 비교하는 페이지입니다.',
    '고베 호텔은 어느 지역부터 비교하는 것이 좋을까요?', ['숙박 지역', '평점', '후기 수', '가격대', '추천 대상'], ['고베', 'Kobe'])
];

function guide(slug: string, eyebrow: string, title: string, intro: string, purpose: string, intentQuestion: string, criteria: string[], keywords: string[]): KobeAreaGuide {
  return { slug, path: `/kobe/${slug}/`, eyebrow, title, intro, purpose, intentQuestion, criteria, keywords, metaDescription: `${title.replace('후기 모음 ', '')} 기준으로 예약 전 조건을 비교합니다.` };
}

export const kobeHotels = hotels.filter((hotel) => hotel.slug.startsWith('kobe-')).sort((a, b) => popularity(b) - popularity(a));

export function getKobeAreaGuideHotels(guide: KobeAreaGuide, limit = 20) {
  return kobeHotels.map((hotel) => buildGuideHotel(hotel, guide)).filter((item) => item.guideScore > 0).sort((a, b) => b.guideScore - a.guideScore).slice(0, limit);
}

export function getRelatedKobeAreaGuides(hotel: Hotel) {
  if (!hotel.slug.startsWith('kobe-')) return [];
  const text = hotelText(hotel).toLowerCase();
  return kobeAreaGuides.map((guide) => ({ guide, score: guide.slug === 'kobe-hotel-comparison' ? 1 : guide.keywords.filter((keyword) => text.includes(keyword.toLowerCase())).length }))
    .filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 4).map((item) => item.guide);
}

function buildGuideHotel(hotel: Hotel, guide: KobeAreaGuide) {
  const text = hotelText(hotel);
  const area = pickArea(text);
  const matches = guide.slug === 'kobe-hotel-comparison' ? 1 : guide.keywords.filter((keyword) => text.toLowerCase().includes(keyword.toLowerCase())).length;
  const price = hotel.averageNightlyRate ?? hotel.dailyRate;
  const target = guide.slug.includes('family') ? '가족여행' : guide.slug.includes('onsen') ? '온천여행' : guide.slug.includes('value') ? '가성비 여행' : `${area} 일정`;
  return {
    hotel, guideScore: matches ? matches * 10000 + popularity(hotel) : 0,
    reasons: [`${area} 일정에서 이동 동선을 줄이기 좋은 후보입니다.`, hotel.reviewCount && hotel.reviewCount >= 1000 ? '후기 수가 충분해 반복되는 장점과 주의점을 비교하기 좋습니다.' : '객실 조건과 위치 후기를 함께 확인하는 편이 좋습니다.', hotel.reviewScore && hotel.reviewScore >= 8.8 ? '아고다 평점이 높은 편이라 우선 비교 후보로 보기 좋습니다.' : '가격과 객실 크기를 함께 비교하면 선택이 쉬워집니다.'],
    caution: '객실 크기와 조식·취소 조건, 숙박세는 객실 유형과 날짜에 따라 다를 수 있으니 최종 예약 화면에서 확인하세요.',
    target, tags: [area, ...guide.criteria.slice(0, 3)],
    tableCells: [area, String(hotel.reviewScore ?? '확인 필요'), hotel.reviewCount ? `${hotel.reviewCount.toLocaleString('ko-KR')}건` : '후기 부족', price ? `${price.toLocaleString('ko-KR')}원~` : '가격 확인', target]
  };
}

function hotelText(hotel: Hotel) { return [hotel.hotelName, hotel.address, hotel.region, hotel.analysis?.summary, hotel.analysis?.pros?.join(' ')].filter(Boolean).join(' '); }
function pickArea(text: string) {
  if (/아리마|Arima|有馬|온천|Onsen/i.test(text)) return '아리마온천';
  if (/롯코|Rokko|六甲|세이신|Seishin/i.test(text)) return '롯코';
  if (/하버랜드|Harborland|메리켄|Meriken|고베항|Kobe Port/i.test(text)) return '하버랜드';
  if (/고베역|Kobe Station|Higashikawasaki|히가시카와사키/i.test(text)) return '고베역';
  if (/산노미야|Sannomiya|三宮|이소가미|Isogami/i.test(text)) return '산노미야';
  return '고베';
}
function popularity(hotel: Hotel) { return (hotel.reviewScore || 0) * 1000 + Math.min(hotel.reviewCount || 0, 50000) / 10; }
