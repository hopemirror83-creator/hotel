import type{Hotel}from'./hotels';

export function getThainguyenSearchIntent(h:Hotel){
  if(!h.slug.startsWith('thainguyen-'))return;
  const name=h.hotelName.trim();
  const source=[h.hotelName,h.address].join(' ');
  const lake=/Nui Coc|Núi Cốc|누이꼭/i.test(source);
  const business=/Pho Yen|Phổ Yên|Song Cong|Sông Công|포옌|송꽁/i.test(source);
  const terms=lake?['누이꼭호수','가족','전망','교통']:business?['산업단지','출장','주차','체크인']:['시내위치','조식','주차','체크인'];
  const title=`${name} 타이응우옌 후기 모음 ${terms.join(' ')}`;
  return{title,seoTitle:`${title} | 예약 전 FAQ`,metaDescription:`${name} 후기를 타이응우옌 여행 동선과 ${terms.join('·')} 조건 중심으로 정리했습니다.`,intentChips:terms,recommendedFor:[lake?'누이꼭호수 가족 여행':business?'포옌·송꽁 출장':'타이응우옌 시내 일정','베트남 북부 육로 여행','조식과 주차 조건을 함께 보는 여행자'],notRecommendedFor:['하노이 중심 관광만 계획하는 여행자'],faqs:[{category:'위치',question:`${name}은 타이응우옌 일정에 편리한가요?`,answer:'시내 중심과 버스터미널, 목적지까지의 실제 이동 시간을 지도에서 확인하세요.'},{category:'교통',question:`${name}까지 하노이에서 어떻게 이동하나요?`,answer:'버스나 차량 이동 시간과 도착 지점에서 숙소까지의 택시 동선을 함께 확인하세요.'},{category:'조식',question:`${name} 조식은 포함되나요?`,answer:'객실 상품별 조식 포함 여부와 시작 시간은 예약 화면에서 다시 확인하는 편이 안전합니다.'},{category:'주차',question:`${name} 주차는 가능한가요?`,answer:'무료 주차 여부와 주차 공간, 대형 차량 진입 조건은 숙소에 미리 문의하세요.'},{category:'예약',question:`${name} 예약 전 무엇을 볼까요?`,answer:'객실 유형, 조식, 주차, 취소 기한과 늦은 체크인 가능 여부를 비교하세요.'}]};
}
