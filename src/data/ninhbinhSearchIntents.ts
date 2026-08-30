import type { Hotel } from './hotels';

const profiles = {
  tamcoc: { label: '땀꼭', terms: ['보트투어', '조식', '자전거', '체크인'], focus: '땀꼭 보트투어와 식당가 이동, 자전거 대여 및 조식·체크인 조건' },
  trangan: { label: '짱안', terms: ['보트투어', '픽업', '조식', '이동'], focus: '짱안 보트 선착장과 픽업, 조식 및 닌빈 시내 이동 조건' },
  hangmua: { label: '항무아', terms: ['전망대', '위치', '조식', '자전거'], focus: '항무아 전망대 접근과 주변 이동, 조식 및 자전거 대여 조건' },
  baidinh: { label: '바이딘·호아루', terms: ['사원', '주차', '가족여행', '이동'], focus: '바이딘 사원과 호아루 이동, 주차 및 가족여행 조건' },
  city: { label: '닌빈 시내', terms: ['기차역', '위치', '조식', '체크인'], focus: '닌빈역과 시내 식당 접근, 조식 및 체크인 조건' },
  all: { label: '베트남 닌빈', terms: ['위치', '조식', '보트투어', '예약조건'], focus: '닌빈 위치와 객실·조식·관광지 이동·예약 조건' },
};
export function getNinhbinhSearchIntent(hotel: Hotel) {
  if (!hotel.slug.startsWith('ninhbinh-')) return;
  const p=pick(hotel), name=hotel.hotelName.trim(), title=`${name} ${p.label} 후기 모음 ${p.terms.join(' ')}`;
  return { title, seoTitle:`${title} | 예약 전 FAQ`, metaDescription:`${name} 후기를 ${p.focus} 중심으로 정리했습니다. 예약 전 최신 객실 조건과 요금을 확인하세요.`, intentChips:p.terms, recommendedFor:['닌빈 자유여행','자연·보트투어 일정','커플·가족 여행'], notRecommendedFor:['관광지 간 이동 거리를 확인하지 않고 예약하는 여행자'], faqs:[
    {category:'위치',question:`${name} 위치는 ${p.label} 일정에 맞나요?`,answer:`${p.focus}을 먼저 확인하세요. 닌빈 시내와 땀꼭·짱안·항무아는 이동 동선이 달라 지도상 거리와 차량 시간을 함께 살펴보는 편이 좋습니다.`},
    {category:'교통',question:`${name} 닌빈역과 관광지 이동은 어떻게 확인하나요?`,answer:'기차역·버스터미널 픽업 여부와 땀꼭·짱안 보트 선착장까지의 차량 시간, 자전거·오토바이 대여 조건을 확인하세요.'},
    {category:'객실',question:`${name} 산이나 논 전망 객실은 어떻게 확인하나요?`,answer:'객실명에 마운틴뷰·가든뷰·라이스필드뷰가 명시됐는지 확인하고 발코니와 창문 방향을 예약 화면에서 비교하세요.'},
    {category:'조식',question:`${name} 조식은 포함되나요?`,answer:'조식 포함 상품인지, 이른 관광 일정 전에 이용 가능한지, 홈스테이는 메뉴 선택과 제공 시간을 함께 확인하세요.'},
    {category:'예약',question:`${name} 예약 전 무엇을 비교할까요?`,answer:'침대 구성과 조식, 무료 취소 기한, 픽업·대여 비용, 늦은 체크인 가능 여부를 확인하세요.'},
  ]};
}
function pick(h:Hotel){const v=[h.hotelName,h.address,h.analysis?.summary].filter(Boolean).join(' ');if(/Tam Coc|Tam Cốc|땀꼭|탐 콕/i.test(v))return profiles.tamcoc;if(/Trang An|Tràng An|짱안|트랑 안/i.test(v))return profiles.trangan;if(/Hang Mua|Hang Múa|항무아|항 무아/i.test(v))return profiles.hangmua;if(/Bai Dinh|Bái Đính|바이딘|Hoa Lu|Hoa Lư|호아루/i.test(v))return profiles.baidinh;if(/Ninh Binh|Ninh Bình|닌빈|닌 빈/i.test(v))return profiles.city;return profiles.all;}
