const cityUrl = process.env.AGODA_CITY_PAGE_URL || 'https://www.agoda.com/ko-kr/city/incheon-kr.html';

const response = await fetch(cityUrl, {
  headers: {
    'User-Agent': 'Mozilla/5.0',
    'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8'
  },
  signal: AbortSignal.timeout(20000)
});
const html = await response.text();
const patterns = [
  /hid=(\d{3,10})/g,
  /hotelId["':=\s]+(\d{3,10})/g,
  /hotel_id["':=\s]+(\d{3,10})/g,
  /propertyId["':=\s]+(\d{3,10})/g,
  /\/hotelImages\/(?:\d+\/)?(\d{3,10})\//g
];
const ids = [];

for (const pattern of patterns) {
  for (const match of html.matchAll(pattern)) ids.push(match[1]);
}

const unique = [...new Set(ids)];
console.log(JSON.stringify({
  url: cityUrl,
  finalUrl: response.url,
  status: response.status,
  htmlLength: html.length,
  uniqueHotelIds: unique.length,
  hasIncheonCityId: html.includes('17234'),
  sample: unique.slice(0, 80)
}, null, 2));
