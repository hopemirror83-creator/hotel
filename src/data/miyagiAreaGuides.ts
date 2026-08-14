import { activeHotels as hotels } from './hotels';
import type { Hotel } from './hotels';

export type MiyagiAreaGuide = { slug: string; path: string; title: string; eyebrow: string; intro: string; purpose: string; intentQuestion: string; metaDescription: string; criteria: string[]; keywords: string[] };

export const miyagiAreaGuides: MiyagiAreaGuide[] = [
  guide('sendai-station-hotels', 'SENDAI STATION GUIDE', '센다이역 호텔 후기 모음 위치·조식·체크인 비교', '센다이역 주변은 신칸센과 공항철도, 도심 관광 이동이 편리하지만 역 출구와 실제 도보 동선을 함께 확인해야 합니다.', '센다이 도심 관광과 철도 이동을 효율적으로 구성하려는 여행자를 위한 가이드입니다.', '센다이역 호텔은 위치와 객실 조건을 어떻게 비교해야 할까요?', ['센다이역', '교통', '조식', '체크인', '짐 보관'], ['센다이', 'Sendai', 'Chuo', 'Aoba', 'Tsutsujigaoka']),
  guide('matsushima-hotels', 'MATSUSHIMA GUIDE', '마쓰시마 호텔 후기 모음 전망·온천·조식 비교', '마쓰시마 숙소는 바다 전망과 온천뿐 아니라 관광 선착장, 역과 숙소 사이의 이동 방법을 함께 봐야 합니다.', '마쓰시마 관광과 료칸 휴식을 함께 계획하는 여행자를 위한 가이드입니다.', '마쓰시마 호텔은 전망과 이동 편의를 어떻게 비교해야 할까요?', ['바다 전망', '온천', '조식·석식', '주차', '관광 동선'], ['마쓰시마', 'Matsushima', '시오가마', 'Shiogama']),
  guide('akiu-onsen-hotels', 'AKIU ONSEN GUIDE', '아키우온천 호텔 후기 모음 석식·셔틀·가족 비교', '아키우온천은 센다이 도심에서 접근할 수 있지만 셔틀 예약, 식사 마감과 객실 내 욕실 조건을 먼저 확인해야 합니다.', '온천과 식사를 중심으로 쉬려는 가족·커플 여행자를 위한 가이드입니다.', '아키우온천 숙소는 식사와 교통 조건을 어떻게 비교해야 할까요?', ['온천', '석식', '셔틀', '가족', '객실'], ['아키우', 'Akiu', '秋保']),
  guide('sakunami-naruko-hotels', 'MIYAGI ONSEN GUIDE', '사쿠나미·나루코 온천호텔 후기 모음 노천탕·식사·교통 비교', '사쿠나미와 나루코는 온천 휴양에 적합하지만 철도·셔틀 시간과 식사 포함 조건에 따라 체감 편의가 크게 달라집니다.', '미야기 온천 여행을 계획하는 여행자를 위한 숙소 선택 가이드입니다.', '사쿠나미·나루코 온천호텔은 무엇을 먼저 확인해야 할까요?', ['노천탕', '식사', '셔틀', '객실', '체크인'], ['사쿠나미', 'Sakunami', '나루코', 'Naruko', 'Onsen']),
  guide('ishinomaki-kesennuma-hotels', 'MIYAGI COAST GUIDE', '이시노마키·게센누마 호텔 후기 모음 주차·조식·관광 비교', '미야기 해안권은 차량 이동 비중이 높아 주차와 도로 접근성, 주변 식사 선택지를 함께 확인하는 것이 좋습니다.', '이시노마키와 게센누마 해안 여행을 위한 숙박 가이드입니다.', '미야기 해안 호텔은 주차와 관광 동선을 어떻게 비교해야 할까요?', ['주차', '해안 관광', '조식', '주변 식당', '가성비'], ['이시노마키', 'Ishinomaki', '게센누마', 'Kesennuma', '오나가와', 'Onagawa']),
  guide('miyagi-family-hotels', 'MIYAGI FAMILY GUIDE', '미야기 가족호텔 후기 모음 객실·조식·주차 비교', '가족 숙소는 객실 크기와 침대 구성, 아이 동반 식사, 주차와 관광지 이동을 함께 비교해야 합니다.', '아이와 센다이·마쓰시마·온천 지역을 여행하는 가족을 위한 가이드입니다.', '미야기 가족호텔은 어떤 조건을 우선해야 할까요?', ['가족 객실', '침대 구성', '아이 조식', '주차', '교통'], ['가족', 'family', 'triple', 'suite', 'resort', '리조트']),
  guide('miyagi-value-hotels', 'MIYAGI VALUE GUIDE', '센다이·미야기 가성비 호텔 후기 모음 위치·객실·조식 비교', '가성비는 표시 요금뿐 아니라 역까지의 이동 비용과 객실 크기, 조식·취소 조건까지 함께 봐야 판단할 수 있습니다.', '기본 객실 품질을 유지하며 숙박비를 조절하려는 여행자를 위한 가이드입니다.', '미야기 가성비 호텔은 가격 외에 무엇을 비교해야 할까요?', ['가격대', '역 접근성', '객실', '조식', '후기 수'], ['APA', 'Toyoko', '토요코', 'Route Inn', '루트 인', 'Livemax', '라이브맥스', 'Smile', '스마일']),
  guide('miyagi-hotel-comparison', 'MIYAGI COMPARISON', '센다이·미야기 호텔 비교 후기 모음 역세권·마쓰시마·온천·해안', '미야기현은 센다이 도심과 마쓰시마, 아키우·나루코 온천, 해안 지역의 숙박 목적과 이동 방식이 서로 다릅니다.', '미야기 주요 권역의 호텔을 일정과 예산에 맞게 비교하는 페이지입니다.', '미야기 호텔은 어느 지역부터 비교하는 것이 좋을까요?', ['숙박 지역', '평점', '후기 수', '가격대', '추천 대상'], ['미야기', 'Miyagi', '센다이', 'Sendai'])
];

function guide(slug: string, eyebrow: string, title: string, intro: string, purpose: string, intentQuestion: string, criteria: string[], keywords: string[]): MiyagiAreaGuide {
  return { slug, path: `/miyagi/${slug}/`, eyebrow, title, intro, purpose, intentQuestion, criteria, keywords, metaDescription: `${title.replace('후기 모음 ', '')} 기준으로 예약 전 조건을 비교합니다.` };
}

export const miyagiHotels = hotels.filter((hotel) => hotel.slug.startsWith('miyagi-')).sort((a, b) => popularity(b) - popularity(a));
export function getMiyagiAreaGuideHotels(guide: MiyagiAreaGuide, limit = 20) { return miyagiHotels.map((hotel) => buildGuideHotel(hotel, guide)).filter((item) => item.guideScore > 0).sort((a, b) => b.guideScore - a.guideScore).slice(0, limit); }
export function getRelatedMiyagiAreaGuides(hotel: Hotel) { if (!hotel.slug.startsWith('miyagi-')) return []; const text = hotelText(hotel).toLowerCase(); return miyagiAreaGuides.map((guide) => ({ guide, score: guide.slug === 'miyagi-hotel-comparison' ? 1 : guide.keywords.filter((keyword) => text.includes(keyword.toLowerCase())).length })).filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 4).map((item) => item.guide); }

function buildGuideHotel(hotel: Hotel, guide: MiyagiAreaGuide) {
  const text = hotelText(hotel); const area = pickArea(text); const matches = guide.slug === 'miyagi-hotel-comparison' ? 1 : guide.keywords.filter((keyword) => text.toLowerCase().includes(keyword.toLowerCase())).length; const price = hotel.averageNightlyRate ?? hotel.dailyRate; const target = guide.slug.includes('family') ? '가족여행' : guide.slug.includes('value') ? '가성비 여행' : `${area} 일정`;
  return { hotel, guideScore: matches ? matches * 10000 + popularity(hotel) : 0, reasons: [`${area} 일정에서 이동 동선을 줄이기 좋은 후보입니다.`, hotel.reviewCount && hotel.reviewCount >= 1000 ? '후기 수가 충분해 반복되는 장점과 주의점을 비교하기 좋습니다.' : '객실 조건과 위치 후기를 함께 확인하는 편이 좋습니다.', hotel.reviewScore && hotel.reviewScore >= 8.8 ? '아고다 평점이 높은 편이어서 우선 비교 후보로 보기 좋습니다.' : '가격과 객실 조건을 함께 비교하면 선택이 쉬워집니다.'], caution: '객실과 식사·취소 조건, 셔틀과 숙박 요금은 날짜와 객실 유형에 따라 달라질 수 있으니 최종 예약 화면에서 확인하세요.', target, tags: [area, ...guide.criteria.slice(0, 3)], tableCells: [area, String(hotel.reviewScore ?? '확인 필요'), hotel.reviewCount ? `${hotel.reviewCount.toLocaleString('ko-KR')}건` : '후기 부족', price ? `${price.toLocaleString('ko-KR')}원~` : '가격 확인', target] };
}
function hotelText(hotel: Hotel) { return [hotel.hotelName, hotel.address, hotel.region, hotel.analysis?.summary, hotel.analysis?.pros?.join(' ')].filter(Boolean).join(' '); }
function pickArea(text: string) { if (/마쓰시마|Matsushima|시오가마|Shiogama/i.test(text)) return '마쓰시마'; if (/아키우|Akiu|사쿠나미|Sakunami|나루코|Naruko/i.test(text)) return '미야기 온천'; if (/이시노마키|Ishinomaki|게센누마|Kesennuma/i.test(text)) return '미야기 해안'; if (/자오|Zao/i.test(text)) return '미야기 자오'; return '센다이'; }
function popularity(hotel: Hotel) { return (hotel.reviewScore || 0) * 1000 + Math.min(hotel.reviewCount || 0, 50000) / 10; }
