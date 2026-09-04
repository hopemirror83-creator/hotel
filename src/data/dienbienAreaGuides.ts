import { activeHotels as hotels } from './hotels';
import type { Hotel } from './hotels';
export type DienbienAreaGuide={slug:string;path:string;title:string;eyebrow:string;intro:string;purpose:string;intentQuestion:string;metaDescription:string;criteria:string[];keywords:string[]};
const make=(slug:string,eyebrow:string,title:string,intro:string,purpose:string,intentQuestion:string,criteria:string[],keywords:string[]):DienbienAreaGuide=>({slug,path:`/dienbien/${slug}/`,title,eyebrow,intro,purpose,intentQuestion,criteria,keywords,metaDescription:`${title} 예약 전 위치와 객실 조건을 비교합니다.`});
export const dienbienAreaGuides=[
make('dien-bien-phu-hotels','DIEN BIEN PHU','디엔비엔푸 호텔 후기 모음 위치·조식·주차','디엔비엔푸 시내 숙소는 A1 언덕과 전승박물관, 시장 이동과 조식·주차 조건을 함께 보아야 합니다.','디엔비엔푸 시내 숙박 가이드입니다.','시내 관광과 식당 이동에 편리한 호텔은 어디일까요?',['시내 위치','조식','주차','체크인'],['Dien Bien','디엔비엔']),
make('a1-hill-hotels','A1 HILL','A1 언덕 근처 호텔 후기 모음 유적지·교통','A1 언덕과 디엔비엔푸 전승박물관을 본다면 숙소에서의 이동 시간과 야간 교통편을 비교하세요.','역사 유적 여행 숙박 가이드입니다.','A1 언덕 관광에 맞는 숙소는 어디일까요?',['A1 언덕','박물관','교통','위치'],['Dien Bien','디엔비엔']),
make('dien-bien-airport-hotels','DIEN BIEN AIRPORT','디엔비엔푸 공항 근처 호텔 후기 교통·체크인','공항 숙소는 실제 이동 시간과 택시·픽업, 이른 체크아웃 조건을 함께 확인해야 합니다.','디엔비엔푸 공항 숙박 가이드입니다.','항공편 일정에 맞는 호텔은 어디일까요?',['공항 이동','픽업','체크인','주차'],['Dien Bien','디엔비엔']),
make('dien-bien-hotel-comparison','COMPARISON','디엔비엔푸 호텔 비교 평점·후기·위치','시내 관광과 공항 이동 중 어느 일정을 우선할지에 따라 숙소 선택이 달라집니다.','디엔비엔푸 주요 숙소 비교 페이지입니다.','후기와 위치를 함께 보면 어느 호텔이 맞을까요?',['평점','후기 수','위치','가격대'],['Dien Bien','디엔비엔'])] as DienbienAreaGuide[];
export const dienbienHotels=hotels.filter(h=>h.slug.startsWith('dienbien-')).sort((a,b)=>pop(b)-pop(a));
export function getDienbienAreaGuideHotels(g:DienbienAreaGuide,limit=20){return dienbienHotels.slice(0,limit).map(h=>item(h,g))}
export function getRelatedDienbienAreaGuides(h:Hotel){return h.slug.startsWith('dienbien-')?dienbienAreaGuides:[]}
function item(h:Hotel,g:DienbienAreaGuide){const price=h.averageNightlyRate??h.dailyRate,target='디엔비엔푸 역사·시내 여행';return{hotel:h,guideScore:pop(h),reasons:['A1 언덕과 시내 이동 동선을 비교하기 좋은 후보입니다.',h.reviewCount&&h.reviewCount>=50?'후기 수를 바탕으로 반복되는 장단점을 확인하기 좋습니다.':'공개 후기와 객실 조건을 함께 확인하세요.',h.reviewScore&&h.reviewScore>=9?'아고다 평점이 높은 편입니다.':'가격과 객실 조건을 함께 비교하세요.'],caution:'조식·주차·공항 이동과 취소 조건은 날짜와 상품에 따라 달라질 수 있습니다.',target,tags:['디엔비엔푸',...g.criteria.slice(0,3)],tableCells:['디엔비엔푸',String(h.reviewScore??'확인 필요'),h.reviewCount?`${h.reviewCount.toLocaleString('ko-KR')}건`:'후기 부족',price?`${price.toLocaleString('ko-KR')}원~`:'가격 확인',target]}}
function pop(h:Hotel){return(h.reviewScore||0)*1000+Math.min(h.reviewCount||0,50000)/10}
