import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { generatedHotels } from '../src/data/generatedHotels.ts';

const ROOT = process.cwd();
const outDir = path.join(ROOT, 'data', 'generated');

const sectionPlans = [
  {
    heading: '이 호텔 선택 이유',
    label: '호텔 전체/외관',
    keywords: ['exterior', 'outside', 'entrance', 'lobby', 'view', 'front', 'building', 'hotel', 'property', '숙소', '호텔', '외관', '전경', '입구', '로비']
  },
  {
    heading: '호텔 구성 및 특징',
    label: '객실',
    keywords: ['room', 'bed', 'suite', 'guestroom', 'bathroom', 'deluxe', '침대', '객실', '룸', '스위트', '욕실']
  },
  {
    heading: '주요 장점',
    label: '시설/수영장',
    keywords: ['pool', 'facility', 'fitness', 'spa', 'restaurant', 'breakfast', 'lounge', 'bar', '시설', '수영장', '스파', '피트니스', '조식', '레스토랑', '라운지']
  },
  {
    heading: '경쟁 제품과 비교',
    label: '공용 시설/로비',
    keywords: ['lobby', 'facility', 'restaurant', 'lounge', 'bar', 'interior', '로비', '시설', '라운지', '레스토랑', '인테리어']
  },
  {
    heading: '팁 & 고려사항',
    label: '주변/위치',
    keywords: ['location', 'nearby', 'view', 'airport', 'transport', 'surrounding', '위치', '주변', '공항', '전망', '교통']
  },
  {
    heading: '이런 분들 추천해요',
    label: '호텔 대표',
    keywords: ['hotel', 'property', 'exterior', 'room', 'pool', 'view', '호텔', '숙소', '전경', '객실', '수영장']
  }
];

await mkdir(outDir, { recursive: true });

const report = [];

for (const hotel of generatedHotels) {
  console.log(`Matching Agoda images for ${hotel.hotelName}`);
  const response = await fetchSecondaryData(hotel);
  const candidates = extractImageCandidates(response.text, hotel);
  const selected = selectSectionImages(candidates);

  report.push({
    slug: hotel.slug,
    hotelName: hotel.hotelName,
    hid: response.hid,
    status: response.status,
    responseLength: response.text.length,
    candidateCount: candidates.length,
    selected
  });

  await sleep(400);
}

await writeFile(path.join(outDir, 'agoda-section-image-match-test.json'), JSON.stringify(report, null, 2), 'utf8');
await writeFile(path.join(outDir, 'agoda-section-image-match-test.html'), renderHtml(report), 'utf8');

console.table(report.map((item) => ({
  slug: item.slug,
  status: item.status,
  candidates: item.candidateCount,
  selected: item.selected.length,
  avgScore: Math.round(item.selected.reduce((sum, image) => sum + image.score, 0) / item.selected.length)
})));

for (const item of report) {
  console.log(`\n${item.hotelName}`);
  for (const image of item.selected) {
    console.log(`- ${image.heading} [${image.label}] score=${image.score} reason=${image.reason}`);
    console.log(`  ${image.url}`);
  }
}

async function fetchSecondaryData(hotel) {
  const hid = new URL(hotel.landingUrl).searchParams.get('hid');
  const apiUrl = `https://www.agoda.com/api/cronos/property/BelowFoldParams/GetSecondaryData?cid=1927566&hid=${hid}&hotel_id=${hid}&all=false&isHostPropertiesEnabled=true`;
  const response = await fetch(apiUrl, {
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
      accept: 'application/json,text/plain,*/*',
      referer: hotel.landingUrl,
      'accept-language': 'ko-KR,ko;q=0.9,en;q=0.8'
    },
    signal: AbortSignal.timeout(45000)
  });
  return {
    hid,
    status: response.status,
    text: await response.text()
  };
}

function extractImageCandidates(value, hotel) {
  const normalized = String(value || '')
    .replace(/\\u002F/g, '/')
    .replace(/\\\//g, '/')
    .replace(/&amp;/g, '&');

  const baseCandidates = [];
  try {
    const json = JSON.parse(value);
    walk(json, [], baseCandidates);
  } catch {
    // The regex fallback below still gives usable Agoda CDN image candidates.
  }

  const byUrl = new Map();
  for (const candidate of baseCandidates) {
    if (!isAgodaImage(candidate.url)) continue;
    byUrl.set(candidate.url, enhanceCandidate(candidate, hotel));
  }

  for (const url of extractAgodaUrls(normalized)) {
    if (!byUrl.has(url)) {
      byUrl.set(url, enhanceCandidate({ url, context: '', path: '' }, hotel));
    }
  }

  return [...byUrl.values()]
    .filter((candidate) => candidate.size !== 'tiny')
    .sort((a, b) => b.baseScore - a.baseScore);
}

function walk(node, pathParts, candidates) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    node.forEach((child, index) => walk(child, [...pathParts, String(index)], candidates));
    return;
  }

  const stringValues = [];
  for (const [key, value] of Object.entries(node)) {
    if (typeof value === 'string') {
      stringValues.push(`${key}:${value}`);
      if (isAgodaImage(value)) {
        candidates.push({
          url: normalizeUrl(value),
          context: collectContext(node),
          path: [...pathParts, key].join('.')
        });
      }
    }
  }

  for (const [key, value] of Object.entries(node)) {
    if (value && typeof value === 'object') walk(value, [...pathParts, key], candidates);
  }
}

function collectContext(node) {
  const keys = [
    'title',
    'caption',
    'description',
    'name',
    'category',
    'categoryName',
    'roomName',
    'roomTypeName',
    'facilityName',
    'tag',
    'type',
    'imageType'
  ];
  const values = [];
  for (const key of keys) {
    if (typeof node[key] === 'string') values.push(node[key]);
  }
  return values.join(' ');
}

function extractAgodaUrls(text) {
  const urls = new Set();
  const patterns = [
    /https?:\/\/pix\d+\.agoda\.net\/hotelImages\/[^"'<>\\\s)]+/gi,
    /\/\/pix\d+\.agoda\.net\/hotelImages\/[^"'<>\\\s)]+/gi
  ];

  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      const url = normalizeUrl(match[0]);
      if (isAgodaImage(url)) urls.add(url);
    }
  }
  return [...urls];
}

function enhanceCandidate(candidate, hotel) {
  const url = normalizeUrl(candidate.url);
  const searchText = `${url} ${candidate.context || ''} ${candidate.path || ''}`.toLowerCase();
  const hotelId = new URL(hotel.landingUrl).searchParams.get('hid');
  const size = classifySize(url);
  const hotelIdMatch = url.includes(`/hotelImages/${hotelId}/`) || url.includes(`/hotelImages/${hotelId.slice(0, 3)}/${hotelId}/`);
  const highRes = /s=(1024x768|800x600|640x480|600x450|512x384)/i.test(url);

  return {
    url: preferLargeSize(url),
    originalUrl: url,
    context: candidate.context || '',
    path: candidate.path || '',
    searchText,
    size,
    hotelIdMatch,
    baseScore: (hotelIdMatch ? 80 : 0) + (highRes ? 15 : 0) + (size === 'large' ? 10 : 0)
  };
}

function selectSectionImages(candidates) {
  const usedFamilies = new Set();
  const usedUrls = new Set();
  const selected = [];

  for (const plan of sectionPlans) {
    const ranked = candidates
      .filter((candidate) => !usedUrls.has(candidate.url) && !usedFamilies.has(imageFamily(candidate.url)))
      .map((candidate) => scoreForPlan(candidate, plan))
      .sort((a, b) => b.score - a.score);

    const picked = ranked[0] || scoreForPlan(candidates.find((candidate) => !usedUrls.has(candidate.url)) || candidates[0], plan);
    if (!picked?.url) continue;

    usedUrls.add(picked.url);
    usedFamilies.add(imageFamily(picked.url));
    selected.push({
      heading: plan.heading,
      label: plan.label,
      url: picked.url,
      originalUrl: picked.originalUrl,
      score: picked.score,
      reason: picked.reason,
      context: picked.context,
      path: picked.path,
      hotelIdMatch: picked.hotelIdMatch
    });
  }

  return selected;
}

function scoreForPlan(candidate, plan) {
  const keywordHits = plan.keywords.filter((keyword) => candidate.searchText.includes(keyword.toLowerCase()));
  const sectionBias = {
    '이 호텔 선택 이유': /\/0\//.test(candidate.url) ? 8 : 0,
    '호텔 구성 및 특징': /room|bed|suite|guestroom|객실|침대|roomtype|rooms/i.test(candidate.searchText) ? 35 : 0,
    '주요 장점': /pool|facility|spa|fitness|restaurant|breakfast|수영장|시설|조식/i.test(candidate.searchText) ? 35 : 0,
    '경쟁 제품과 비교': /lobby|facility|restaurant|interior|로비|시설/i.test(candidate.searchText) ? 25 : 0,
    '팁 & 고려사항': /view|location|airport|nearby|surrounding|위치|공항|주변/i.test(candidate.searchText) ? 25 : 0,
    '이런 분들 추천해요': /\/0\//.test(candidate.url) ? 6 : 0
  }[plan.heading] || 0;

  const score = candidate.baseScore + keywordHits.length * 20 + sectionBias;
  return {
    ...candidate,
    score,
    reason: keywordHits.length > 0 ? `keyword:${keywordHits.slice(0, 4).join(',')}` : 'best-agoda-candidate'
  };
}

function normalizeUrl(value) {
  let url = String(value || '').trim();
  if (url.startsWith('//')) url = `https:${url}`;
  return url.replace(/\\+/g, '').replace(/&amp;/g, '&');
}

function isAgodaImage(url) {
  const value = normalizeUrl(url);
  if (!/^https?:\/\/pix\d+\.agoda\.net\/hotelImages\//i.test(value)) return false;
  if (/\.(gif|svg)(\?|$)/i.test(value)) return false;
  return /\.(jpg|jpeg|png|webp)(\?|$)/i.test(value);
}

function classifySize(url) {
  const size = String(url).match(/[?&]s=(\d+)x(\d+)/i);
  if (!size) return 'unknown';
  const width = Number(size[1]);
  const height = Number(size[2]);
  if (width < 300 || height < 220) return 'tiny';
  if (width >= 512 && height >= 384) return 'large';
  return 'medium';
}

function preferLargeSize(url) {
  return String(url)
    .replace(/([?&]s=)360x270/i, '$11024x768')
    .replace(/([?&]s=)512x384/i, '$11024x768');
}

function imageFamily(url) {
  return String(url).replace(/[?&]s=\d+x\d+/i, '').replace(/[?&]ar=[^&]+/i, '');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function renderHtml(items) {
  const cards = items.map((hotel) => `
    <section class="hotel">
      <h2>${escapeHtml(hotel.hotelName)}</h2>
      <p class="meta">${escapeHtml(hotel.slug)} · candidates ${hotel.candidateCount} · selected ${hotel.selected.length}</p>
      <div class="grid">
        ${hotel.selected.map((image) => `
          <article class="card">
            <img src="${escapeHtml(image.url)}" alt="${escapeHtml(`${hotel.hotelName} ${image.heading}`)}" loading="lazy" referrerpolicy="no-referrer">
            <div class="body">
              <h3>${escapeHtml(image.heading)}</h3>
              <p>${escapeHtml(image.label)}</p>
              <p class="score">score ${image.score} · ${escapeHtml(image.reason)}</p>
            </div>
          </article>
        `).join('')}
      </div>
    </section>
  `).join('');

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>HotelLog Agoda Image Match Test</title>
  <style>
    body { margin: 0; background: #f5f7fb; color: #111827; font-family: Arial, sans-serif; }
    main { width: min(1160px, calc(100% - 28px)); margin: 32px auto; }
    h1 { margin: 0 0 8px; font-size: 32px; }
    .lead { margin: 0 0 24px; color: #667085; line-height: 1.6; }
    .hotel { margin: 0 0 28px; padding: 22px; border: 1px solid #e5eaf2; border-radius: 8px; background: #fff; }
    .hotel h2 { margin: 0 0 6px; font-size: 24px; }
    .meta { margin: 0 0 16px; color: #667085; font-size: 14px; }
    .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
    .card { overflow: hidden; border: 1px solid #e5eaf2; border-radius: 8px; background: #fff; }
    img { display: block; width: 100%; aspect-ratio: 16 / 10; object-fit: cover; background: #eef4ff; }
    .body { padding: 12px; }
    .body h3 { margin: 0 0 6px; font-size: 18px; }
    .body p { margin: 0 0 5px; color: #475467; line-height: 1.45; }
    .score { font-size: 12px; color: #2563eb !important; }
    @media (max-width: 760px) {
      main { margin-top: 18px; }
      .hotel { padding: 16px; }
      .grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <main>
    <h1>Agoda Image Match Test</h1>
    <p class="lead">아고다 내부 이미지 후보를 호텔별 6개 후기 소제목에 자동 매칭한 테스트입니다. 이미지는 저장하지 않고 Agoda CDN URL을 직접 표시합니다.</p>
    ${cards}
  </main>
</body>
</html>`;
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
