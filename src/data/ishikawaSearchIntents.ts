import type { Hotel } from './hotels';

const profiles = {
  station: { label: '가나자와역', terms: ['역세권','교통','조식','체크인'], recommendedFor: ['철도 중심 여행','가나자와 첫 방문','짧은 숙박'], notRecommendedFor: ['온천 휴양만 원하는 여행자'] },
  downtown: { label: '고린보·가타마치', terms: ['겐로쿠엔','오미초시장','주차','야간이동'], recommendedFor: ['도심 관광과 식도락','버스 중심 일정','커플여행'], notRecommendedFor: ['역 바로 앞 숙소를 원하는 여행자'] },
  traditional: { label: '히가시차야·겐로쿠엔', terms: ['전통거리','관광동선','조식','객실'], recommendedFor: ['전통 거리 관광','사진 여행','도보 중심 일정'], notRecommendedFor: ['늦은 밤 상권을 중시하는 여행자'] },
  kaga: { label: '가가온천', terms: ['온천','석식','셔틀','노천탕'], recommendedFor: ['료칸 온천여행','식사 포함 숙박','휴식 중심 일정'], notRecommendedFor: ['가나자와 도심 관광만 계획한 여행자'] },
  noto: { label: '와쿠라·노토', terms: ['온천','바다전망','교통','식사'], recommendedFor: ['노토반도 여행','바다 전망 숙박','온천 휴양'], notRecommendedFor: ['대중교통으로 촘촘한 일정을 잡은 여행자'] },
  komatsu: { label: '고마쓰·하쿠산', terms: ['공항·역','주차','체크인','가성비'], recommendedFor: ['고마쓰공항 이용','렌터카 여행','출장과 짧은 숙박'], notRecommendedFor: ['가나자와 중심부 도보 관광을 원하는 여행자'] },
  ishikawa: { label: '가나자와·이시카와', terms: ['위치','객실','조식','예약조건'], recommendedFor: ['이시카와 자유여행','호텔 비교','가족·커플 여행'], notRecommendedFor: ['조건 확인 없이 최저가만 찾는 여행자'] }
};

export function getIshikawaSearchIntent(hotel: Hotel) {
  if (!hotel.slug.startsWith('ishikawa-')) return undefined;
  const profile = pickProfile(hotel); const name = hotel.hotelName.trim(); const title = `${name} ${profile.label} 후기 모음 ${profile.terms.join(' ')}`;
  return { title, seoTitle: `${title} | 예약 전 FAQ`, metaDescription: `${name} 후기를 ${profile.label} 위치와 객실, 식사, 교통 및 예약 조건 중심으로 정리했습니다.`, intentChips: profile.terms, faqs: buildFaqs(name, profile.label), recommendedFor: profile.recommendedFor, notRecommendedFor: profile.notRecommendedFor };
}
function pickProfile(hotel: Hotel) { const text=[hotel.hotelName,hotel.address,hotel.analysis?.summary].filter(Boolean).join(' '); if (/가나자와역|Kanazawa Station|広岡|히로오카/i.test(text)) return profiles.station; if (/고린보|Korinbo|가타마치|Katamachi|오미초|Omicho/i.test(text)) return profiles.downtown; if (/히가시차야|Higashi Chaya|겐로쿠엔|Kenrokuen|히가시야마|Higashiyama/i.test(text)) return profiles.traditional; if (/가가|Kaga|야마시로|Yamashiro|야마나카|Yamanaka|아와즈|Awazu/i.test(text)) return profiles.kaga; if (/와쿠라|Wakura|노토|Noto|나나오|Nanao|와지마|Wajima/i.test(text)) return profiles.noto; if (/고마쓰|Komatsu|하쿠산|Hakusan/i.test(text)) return profiles.komatsu; return profiles.ishikawa; }
function buildFaqs(name: string, label: string) { return [
  { category:'위치', question:`${name} 위치는 ${label} 여행 동선에 맞나요?`, answer:'가까운 역이나 버스 정류장, 주요 관광지까지의 실제 이동 시간을 확인하세요. 가나자와 도심과 온천 지역은 이동 방식이 크게 다릅니다.' },
  { category:'체크인', question:`${name} 체크인 전에 무엇을 확인해야 하나요?`, answer:'프런트 운영 시간과 짐 보관, 늦은 도착 가능 여부를 확인하세요. 료칸은 석식 시작 시간 때문에 체크인 마감이 빠를 수 있습니다.' },
  { category:'조식·식사', question:`${name} 조식이나 석식 포함 예약이 유리할까요?`, answer:'도심 호텔은 주변 식당 선택지가 많지만 온천 료칸은 식사 포함 조건이 편리할 수 있습니다. 메뉴와 시작 시간, 포함 요금 차이를 비교하세요.' },
  { category:'교통·주차', question:`${name} 교통과 주차는 어떻게 확인해야 하나요?`, answer:'가나자와 시내는 버스와 도보 동선을, 가가·노토 지역은 셔틀 예약과 주차 가능 여부를 먼저 확인하는 편이 안전합니다.' },
  { category:'예약', question:`${name} 객실과 예약 조건은 무엇을 비교해야 하나요?`, answer:'침대 구성과 객실 전망, 금연 여부, 취소 기한과 추가 요금은 객실별로 다를 수 있습니다. 결제 전 아고다 최신 조건을 다시 확인하세요.' }
]; }
