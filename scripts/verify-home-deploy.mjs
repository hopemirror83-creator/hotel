const base = process.env.VERIFY_BASE_URL || 'https://68b31dce.hotellog.pages.dev';
const html = await (await fetch(base, { signal: AbortSignal.timeout(20000) })).text();

console.log(JSON.stringify({
  national: html.includes('전국 호텔'),
  adminStaticLink: html.includes('href="/admin/"'),
  status: html.includes('수집 상태'),
  search: html.includes('hotel-search-input'),
  regionTree: html.includes('region-tree'),
  cards: (html.match(/class="hotel-card"/g) || []).length
}, null, 2));
