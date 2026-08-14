const base = process.env.VERIFY_BASE_URL || 'https://e7ae0c7d.hotellog.pages.dev';
const paths = [
  '/hotel/incheon-734599/',
  '/hotel/incheon-54980162/',
  '/hotel/incheon-50405896/',
  '/sitemap.xml'
];

for (const path of paths) {
  const response = await fetch(`${base}${path}`, { signal: AbortSignal.timeout(20000) });
  const html = await response.text();
  console.log(JSON.stringify({
    path,
    status: response.status,
    hasReference: html.includes('reference-link-section'),
    externalLinks: html.split('target="_blank"').length - 1,
    sitemapHotelCount: html.split('/hotel/incheon-').length - 1,
    hasKoreanTitle: html.includes('네이버 블로그 후기')
  }));
}
