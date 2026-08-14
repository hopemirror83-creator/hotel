const urls = [
  'https://4b7aec4c.hotellog.pages.dev/hotel/incheon-50405896/',
  'https://4b7aec4c.hotellog.pages.dev/hotel/incheon-2070028/',
  'https://4b7aec4c.hotellog.pages.dev/hotel/incheon-734599/',
  'https://4b7aec4c.hotellog.pages.dev/sitemap.xml'
];

for (const url of urls) {
  const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
  const html = await response.text();
  console.log(JSON.stringify({
    url,
    status: response.status,
    length: html.length,
    hasReference: html.includes('reference-link-section'),
    hasNaverTitle: html.includes('네이버 블로그 후기'),
    externalLinks: html.split('target="_blank"').length - 1,
    sitemapHotelCount: html.split('/hotel/incheon-').length - 1
  }));
}
