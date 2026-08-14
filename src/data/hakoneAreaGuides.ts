import { activeHotels as hotels } from './hotels';
import type { Hotel } from './hotels';

export type HakoneAreaGuide = { slug: string; path: string; title: string; eyebrow: string; intro: string; purpose: string; intentQuestion: string; metaDescription: string; criteria: string[]; keywords: string[] };

export const hakoneAreaGuides: HakoneAreaGuide[] = [
  guide('hakone-yumoto-hotels', 'HAKONE YUMOTO GUIDE', '하코네 유모토 호텔 료칸 후기 모음 온천·교통·식사 비교', '하코네 유모토는 도쿄에서 접근하기 편하지만 역과 숙소 사이의 경사, 셔틀과 식사 마감 시간을 함께 확인해야 합니다.', '대중교통으로 하코네 온천여행을 시작하는 여행자를 위한 가이드입니다.', '하코네 유모토 숙소는 온천과 이동 조건을 어떻게 비교해야 할까요?', ['온천', '역·셔틀', '석식', '체크인', '짐 보관'], ['유모토', 'Yumoto', '湯本', '토노사와', 'Tonosawa']),
  guide('gora-hotels', 'GORA GUIDE', '하코네 고라 호텔 료칸 후기 모음 노천탕·케이블카·조식 비교', '고라는 온천과 미술관 접근성이 좋지만 케이블카·버스 시간과 숙소까지의 경사를 먼저 확인하는 편이 좋습니다.', '고라공원과 미술관, 온천을 함께 즐기려는 여행자를 위한 가이드입니다.', '하코네 고라 숙소는 노천탕과 교통을 어떻게 비교해야 할까요?', ['노천탕', '케이블카', '미술관', '조식', '객실'], ['고라', 'Gora', '強羅', '미야노시타', 'Miyanoshita', '고와쿠다니', 'Kowakudani']),
  guide('sengokuhara-hotels', 'SENGOKUHARA GUIDE', '하코네 센고쿠하라 호텔 후기 모음 온천·미술관·버스 비교', '센고쿠하라는 자연과 미술관 여행에 좋지만 하코네유모토와 거리가 있어 버스 막차와 차량 이동 조건이 중요합니다.', '센고쿠하라 자연·미술관 여행을 위한 숙박 가이드입니다.', '센고쿠하라 숙소는 위치와 교통을 어떻게 비교해야 할까요?', ['온천', '미술관', '버스', '주차', '가족'], ['센고쿠하라', 'Sengokuhara', '仙石原']),
  guide('ashinoko-hotels', 'ASHINOKO GUIDE', '하코네 아시노코 호텔 후기 모음 호수전망·유람선·주차 비교', '아시노코 숙소는 호수 전망과 관광 동선이 장점이지만 객실 방향과 저녁 식사, 막차 조건을 함께 봐야 합니다.', '아시노코와 하코네신사 관광을 중심으로 머물 여행자를 위한 가이드입니다.', '아시노코 호텔은 전망과 이동 편의를 어떻게 비교해야 할까요?', ['호수 전망', '유람선', '하코네신사', '주차', '식사'], ['아시노코', 'Ashinoko', '芦ノ湖', '모토하코네', 'Moto-Hakone', '도겐다이', 'Togendai']),
  guide('odawara-hotels', 'ODAWARA GUIDE', '오다와라 호텔 후기 모음 역세권·체크인·조식 비교', '오다와라는 신칸센과 하코네 이동의 거점으로 편리하지만 온천 휴양 목적이라면 시설과 이동 비용을 따로 비교해야 합니다.', '하코네 전후 이동과 짧은 숙박을 계획하는 여행자를 위한 가이드입니다.', '오다와라 호텔은 역 접근성과 가격을 어떻게 비교해야 할까요?', ['오다와라역', '신칸센', '체크인', '조식', '가성비'], ['오다와라', 'Odawara', '小田原', '가모노미야', 'Kamonomiya']),
  guide('hakone-ryokan-onsen', 'HAKONE RYOKAN GUIDE', '하코네 온천 료칸 후기 모음 노천탕·가이세키·객실탕 비교', '온천 료칸은 평점만 보기보다 대욕장과 객실탕, 석식 포함 여부, 체크인 마감과 입욕 규정을 함께 확인해야 합니다.', '온천과 식사를 중심으로 하코네 료칸을 고르는 여행자를 위한 가이드입니다.', '하코네 온천 료칸은 어떤 조건을 먼저 비교해야 할까요?', ['노천탕', '객실탕', '가이세키', '석식', '체크인'], ['료칸', 'Ryokan', '온천', 'Onsen', '노천', '유노', '湯']),
  guide('hakone-family-hotels', 'HAKONE FAMILY GUIDE', '하코네 가족호텔 후기 모음 객실·온천·식사·교통 비교', '가족 숙소는 침대와 다다미 구성, 아이 식사, 전용탕과 유모차·짐 이동 동선을 함께 비교해야 합니다.', '아이와 하코네를 여행하는 가족을 위한 선택 가이드입니다.', '하코네 가족호텔은 어떤 조건을 우선해야 할까요?', ['가족 객실', '아이 식사', '객실탕', '교통', '주차'], ['가족', 'family', 'suite', 'villa', '리조트', 'resort', '키즈']),
  guide('hakone-hotel-comparison', 'HAKONE COMPARISON', '하코네 호텔 료칸 비교 후기 모음 유모토·고라·아시노코·오다와라', '하코네는 유모토와 고라, 센고쿠하라, 아시노코, 오다와라의 숙박 목적과 이동 방식이 서로 다릅니다.', '하코네 주요 권역의 숙소를 일정과 예산에 맞게 비교하는 페이지입니다.', '하코네 숙소는 어느 지역부터 비교하는 것이 좋을까요?', ['숙박 지역', '평점', '후기 수', '가격대', '추천 대상'], ['하코네', 'Hakone', '오다와라', 'Odawara'])
];

function guide(slug: string, eyebrow: string, title: string, intro: string, purpose: string, intentQuestion: string, criteria: string[], keywords: string[]): HakoneAreaGuide {
  return { slug, path: `/hakone/${slug}/`, eyebrow, title, intro, purpose, intentQuestion, criteria, keywords, metaDescription: `${title.replace('후기 모음 ', '')} 기준으로 예약 전 조건을 비교합니다.` };
}

export const hakoneHotels = hotels.filter((hotel) => hotel.slug.startsWith('hakone-')).sort((a, b) => popularity(b) - popularity(a));
export function getHakoneAreaGuideHotels(guide: HakoneAreaGuide, limit = 20) { return hakoneHotels.map((hotel) => buildGuideHotel(hotel, guide)).filter((item) => item.guideScore > 0).sort((a, b) => b.guideScore - a.guideScore).slice(0, limit); }
export function getRelatedHakoneAreaGuides(hotel: Hotel) { if (!hotel.slug.startsWith('hakone-')) return []; const text = hotelText(hotel).toLowerCase(); return hakoneAreaGuides.map((guide) => ({ guide, score: guide.slug === 'hakone-hotel-comparison' ? 1 : guide.keywords.filter((keyword) => text.includes(keyword.toLowerCase())).length })).filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 4).map((item) => item.guide); }

function buildGuideHotel(hotel: Hotel, guide: HakoneAreaGuide) {
  const text = hotelText(hotel); const area = pickArea(text); const matches = guide.slug === 'hakone-hotel-comparison' ? 1 : guide.keywords.filter((keyword) => text.toLowerCase().includes(keyword.toLowerCase())).length; const price = hotel.averageNightlyRate ?? hotel.dailyRate; const target = guide.slug.includes('family') ? '가족여행' : guide.slug.includes('ryokan') ? '온천 료칸 여행' : `${area} 일정`;
  return { hotel, guideScore: matches ? matches * 10000 + popularity(hotel) : 0, reasons: [`${area} 일정에서 이동 동선을 줄이기 좋은 후보입니다.`, hotel.reviewCount && hotel.reviewCount >= 1000 ? '후기 수가 충분해 반복되는 장점과 주의점을 비교하기 좋습니다.' : '객실과 온천·식사 조건을 함께 확인하는 편이 좋습니다.', hotel.reviewScore && hotel.reviewScore >= 8.8 ? '아고다 평점이 높은 편이어서 우선 비교 후보로 보기 좋습니다.' : '가격과 객실 조건을 함께 비교하면 선택이 쉬워집니다.'], caution: '객실과 온천·식사·취소 조건, 셔틀과 숙박 요금은 날짜와 객실 유형에 따라 달라질 수 있으니 최종 예약 화면에서 확인하세요.', target, tags: [area, ...guide.criteria.slice(0, 3)], tableCells: [area, String(hotel.reviewScore ?? '확인 필요'), hotel.reviewCount ? `${hotel.reviewCount.toLocaleString('ko-KR')}건` : '후기 부족', price ? `${price.toLocaleString('ko-KR')}원~` : '가격 확인', target] };
}
function hotelText(hotel: Hotel) { return [hotel.hotelName, hotel.address, hotel.region, hotel.analysis?.summary, hotel.analysis?.pros?.join(' ')].filter(Boolean).join(' '); }
function pickArea(text: string) { if (/유모토|Yumoto|湯本|토노사와|Tonosawa/i.test(text)) return '하코네 유모토'; if (/고라|Gora|強羅|미야노시타|Miyanoshita|고와쿠다니|Kowakudani/i.test(text)) return '하코네 고라'; if (/센고쿠하라|Sengokuhara|仙石原/i.test(text)) return '센고쿠하라'; if (/아시노코|Ashinoko|芦ノ湖|모토하코네|Moto.?Hakone|도겐다이|Togendai/i.test(text)) return '아시노코'; if (/오다와라|Odawara|小田原|가모노미야|Kamonomiya/i.test(text)) return '오다와라'; if (/유가와라|Yugawara|湯河原/i.test(text)) return '유가와라'; return '하코네'; }
function popularity(hotel: Hotel) { return (hotel.reviewScore || 0) * 1000 + Math.min(hotel.reviewCount || 0, 50000) / 10; }
