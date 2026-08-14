const citySlugs = [
  ['seoul-kr', 'Seoul'],
  ['busan-kr', 'Busan'],
  ['jeju-island-kr', 'Jeju'],
  ['incheon-kr', 'Incheon'],
  ['daegu-kr', 'Daegu'],
  ['daejeon-kr', 'Daejeon'],
  ['gwangju-kr', 'Gwangju'],
  ['ulsan-kr', 'Ulsan'],
  ['suwon-si-kr', 'Suwon'],
  ['gangneung-si-kr', 'Gangneung'],
  ['sokcho-si-kr', 'Sokcho'],
  ['gyeongju-si-kr', 'Gyeongju'],
  ['jeonju-si-kr', 'Jeonju'],
  ['yeosu-si-kr', 'Yeosu'],
  ['pyeongchang-gun-kr', 'Pyeongchang'],
  ['mokpo-si-kr', 'Mokpo'],
  ['pohang-si-kr', 'Pohang'],
  ['cheongju-si-kr', 'Cheongju'],
  ['chuncheon-si-kr', 'Chuncheon'],
  ['tongyeong-si-kr', 'Tongyeong'],
  ['geoje-si-kr', 'Geoje'],
  ['namhae-gun-kr', 'Namhae']
];

const results = [];

for (const [slug, name] of citySlugs) {
  const url = `https://www.agoda.com/ko-kr/city/${slug}.html`;
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8'
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(20000)
    });
    const text = await response.text();
    const ids = extractCityIds(text);
    const title = (text.match(/<title>(.*?)<\/title>/i)?.[1] || '').replace(/\s+/g, ' ').trim();
    const result = { slug, name, status: response.status, finalUrl: response.url, ids, title };
    results.push(result);
    console.log(JSON.stringify(result));
  } catch (error) {
    const result = { slug, name, error: error.message, ids: [] };
    results.push(result);
    console.log(JSON.stringify(result));
  }
  await sleep(250);
}

console.log('SUMMARY');
console.log(results.map((entry) => `${entry.ids[0] || '?'}:${entry.name}`).join(','));

function extractCityIds(text) {
  const patterns = [
    /(?:cityId|city_id|CityID|cityID)["':=\s]+(\d{2,8})/g,
    /[?&]city=(\d{2,8})/g,
    /"city"\s*:\s*(\d{2,8})/g,
    /"CityId"\s*:\s*(\d{2,8})/g
  ];
  const ids = [];
  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) ids.push(match[1]);
  }
  return [...new Set(ids)].slice(0, 10);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
