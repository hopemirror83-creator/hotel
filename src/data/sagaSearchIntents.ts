import type { Hotel } from './hotels';
const profiles = {
  city:{label:'사가역·도심',terms:['역근처','조식','주차','체크인'],focus:'사가역과 시내 이동, 조식·주차·체크인 조건'},
  ureshino:{label:'우레시노 온천',terms:['온천','노천탕','석식','송영'],focus:'우레시노 온천과 객실 욕실, 석식·송영 조건'},
  takeo:{label:'다케오 온천',terms:['온천','역근처','주차','조식'],focus:'다케오 온천과 신칸센역 이동, 주차·조식 조건'},
  karatsu:{label:'가라쓰',terms:['오션뷰','가라쓰성','조식','주차'],focus:'가라쓰성과 해변 이동, 객실 전망·조식·주차 조건'},
  imari:{label:'이마리·아리타',terms:['도자기마을','렌터카','주차','조식'],focus:'이마리·아리타 이동과 렌터카·주차·조식 조건'},
  tosu:{label:'도스역·아울렛',terms:['역근처','아울렛','조식','주차'],focus:'도스역과 아울렛 이동, 조식·주차 조건'},
  coast:{label:'다라·가시마',terms:['오션뷰','해산물','온천','렌터카'],focus:'아리아케해 전망과 해산물, 온천·렌터카 조건'},
  all:{label:'사가현',terms:['위치','객실','교통','예약조건'],focus:'사가현 위치와 객실·교통·식사·예약 조건'}
};
export function getSagaSearchIntent(hotel:Hotel){if(!hotel.slug.startsWith('saga-'))return;const p=pick(hotel);const name=hotel.hotelName.trim();const title=`${name} ${p.label} 후기 모음 ${p.terms.join(' ')}`;return{title,seoTitle:`${title} | 예약 전 FAQ`,metaDescription:`${name} 후기를 ${p.focus} 중심으로 정리했습니다. 예약 전에 최신 조건을 확인하세요.`,intentChips:p.terms,recommendedFor:['사가 자유여행','온천·도자기 여행','철도·렌터카 여행'],notRecommendedFor:['교통과 식사 조건을 확인하지 않는 여행자'],faqs:faq(name,p)}}
function pick(h:Hotel){const v=[h.hotelName,h.address,h.analysis?.summary].filter(Boolean).join(' ');if(/우레시노|Ureshino|嬉野/i.test(v))return profiles.ureshino;if(/다케오|Takeo|武雄/i.test(v))return profiles.takeo;if(/가라쓰|가라츠|Karatsu|唐津/i.test(v))return profiles.karatsu;if(/이마리|Imari|伊万里|아리타|Arita|有田/i.test(v))return profiles.imari;if(/도스|토스|Tosu|鳥栖/i.test(v))return profiles.tosu;if(/다라|타라|Tara|太良|가시마|Kashima|鹿島/i.test(v))return profiles.coast;if(/사가|Saga|佐賀/i.test(v))return profiles.city;return profiles.all}
function faq(name:string,p:any){return[{category:'위치',question:`${name} 위치는 ${p.label} 일정에 맞나요?`,answer:`${p.focus}을 먼저 확인하세요. 사가현은 권역에 따라 열차와 버스 배차 간격 차이가 큽니다.`},{category:'체크인',question:`${name} 체크인 전 무엇을 확인해야 하나요?`,answer:'프런트 운영 시간과 짐 보관, 늦은 도착 가능 여부를 확인하세요. 료칸은 석식 마감 시간이 빠를 수 있습니다.'},{category:'식사·온천',question:`${name} 식사와 온천 조건은 어떻게 확인할까요?`,answer:'조식·석식 포함 여부와 제공 시간, 대욕장 운영 시간과 객실 욕실 유무를 예약 조건에서 비교하세요.'},{category:'교통·주차',question:`${name} 교통과 주차는 무엇을 볼까요?`,answer:'역과 관광지 이동, 버스·셔틀 시간을 확인하세요. 렌터카라면 무료 주차 여부와 진입 동선도 중요합니다.'},{category:'예약',question:`${name} 객실 조건은 무엇을 비교할까요?`,answer:'침대 구성과 금연, 전망, 식사 포함 여부와 취소 기한을 결제 전에 확인하세요.'}]}
