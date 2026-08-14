import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const hotelRoot = path.resolve('dist/hotel');
const outputPath = path.resolve('src/data/generatedHotels.ts');
const slugs = (await readdir(hotelRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

const recovered = [];
const failures = [];

for (const slug of slugs) {
  const filePath = path.join(hotelRoot, slug, 'index.html');
  try {
    const html = await readFile(filePath, 'utf8');
    const hotel = recoverHotel(slug, html);
    if (!hotel.hotelName || !hotel.analysis.blogReview.sections.length) {
      failures.push({ slug, hotelName: hotel.hotelName, sections: hotel.analysis.blogReview.sections.length });
      continue;
    }
    recovered.push(hotel);
  } catch (error) {
    failures.push({ slug, error: String(error.message || error) });
  }
}

if (recovered.length < 8000 || failures.length > 20) {
  throw new Error(`복원 검증 실패: recovered=${recovered.length}, failures=${failures.length}`);
}

await writeFile(outputPath, `// @ts-nocheck\nexport const generatedHotels: any[] = ${JSON.stringify(recovered, null, 2)};\n`, 'utf8');
await writeFile('data/generated/recovery-report.json', `${JSON.stringify({ recovered: recovered.length, failures }, null, 2)}\n`, 'utf8');
console.log(`Recovered ${recovered.length} hotels from dist. Failures: ${failures.length}`);

function recoverHotel(slug, html) {
  const hotelName = decode(capture(html, /<img[^>]+alt="([^"]+) 대표 이미지"/i) || text(capture(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i)));
  const region = regionFromSlug(slug);
  const address = decode(capture(html, /id="hotel-map"[^>]+data-address="([^"]*)"/i));
  const latitude = number(capture(html, /id="hotel-map"[^>]+data-latitude="([^"]*)"/i));
  const longitude = number(capture(html, /id="hotel-map"[^>]+data-longitude="([^"]*)"/i));
  const imageUrl = decode(capture(html, /<img[^>]+src="([^"]+)"[^>]+alt="[^"]+ 대표 이미지"/i));
  const landingUrl = decode(capture(html, /<a class="primary-button full" href="([^"]+)" rel="nofollow sponsored"/i));
  const reviewScore = number(valueAfterLabel(html, '아고다 평점'));
  const reviewCount = integer(valueAfterLabel(html, '후기 개수'));
  const averageNightlyRate = integer(valueAfterLabel(html, '예상 가격'));
  const summary = text(capture(html, /<p class="summary-text">([\s\S]*?)<\/p>/i));
  const metaLine = capture(html, /<div class="meta-line">([\s\S]*?)<\/div>/i);
  const lastUpdated = text(capture(metaLine, /마지막 갱신:\s*([\s\S]*?)<\/span>/i));
  const searchResultCount = integer(text(capture(metaLine, /분석 검색 결과:\s*([\s\S]*?)<\/span>/i)));
  const boxes = [...html.matchAll(/<div class="analysis-box(?: [^"]+)?">([\s\S]*?)<\/div>/gi)];
  const lists = new Map(boxes.map((match) => [text(capture(match[1], /<h2>([\s\S]*?)<\/h2>/i)), listItems(match[1])]));
  const checkBlock = capture(html, /<section class="section check-section">([\s\S]*?)<\/section>/i);
  const blogBody = capture(html, /<div class="blog-review-body">([\s\S]*?)<section class="section summary-section">/i) || html;
  const introBlock = capture(html, /<div class="blog-intro">([\s\S]*?)<\/div>/i);
  const intro = paragraphs(introBlock);
  const sections = [...blogBody.matchAll(/<section class="blog-review-block">([\s\S]*?)<\/section>/gi)].map((match) => {
    const block = match[1];
    const figureEnd = block.indexOf('</figure>');
    const prose = figureEnd >= 0 ? block.slice(figureEnd + 9) : block;
    const image = decode(capture(block, /<figure class="blog-section-image">[\s\S]*?<img[^>]+src="([^"]+)"/i));
    return {
      heading: text(capture(block, /<h3>([\s\S]*?)<\/h3>/i)),
      paragraphs: paragraphs(prose),
      ...(image ? { image: { url: image, alt: decode(capture(block, /<figure class="blog-section-image">[\s\S]*?<img[^>]+alt="([^"]*)"/i)), source: 'recovered-build' } } : {})
    };
  });
  const referenceSection = capture(html, /<section class="section reference-link-section">([\s\S]*?)<\/section>/i);
  const referenceLinks = [...referenceSection.matchAll(/<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)].map((match) => ({
    title: text(match[2]),
    url: decode(match[1]),
    source: 'naver-blog'
  }));
  const metaDescription = decode(capture(html, /<meta name="description" content="([^"]*)"/i));
  const seoTitle = text(capture(html, /<title>([\s\S]*?)<\/title>/i));

  return compact({
    slug,
    hotelName,
    region,
    address,
    latitude,
    longitude,
    reviewScore,
    reviewCount,
    averageNightlyRate,
    imageUrl,
    landingUrl,
    lastUpdated,
    searchResultCount,
    referenceLinks,
    qualityStatus: 'ready',
    analysis: {
      summary,
      pros: lists.get('많이 언급된 장점') || [],
      cons: lists.get('반복적으로 언급된 단점') || [],
      recommendedFor: lists.get('추천 여행자 유형') || [],
      notRecommendedFor: lists.get('비추천/주의 여행자 유형') || [],
      checkPoints: listItems(checkBlock),
      seoTitle,
      metaDescription,
      blogReview: { intro, sections }
    }
  });
}

function valueAfterLabel(html, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text(capture(html, new RegExp(`${escaped}[\\s\\S]{0,180}?<strong[^>]*>([\\s\\S]*?)<\\/strong>`, 'i')));
}

function listItems(html = '') {
  return [...html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map((match) => text(match[1])).filter(Boolean);
}

function paragraphs(html = '') {
  return [...html.matchAll(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/gi)].map((match) => text(match[1])).filter(Boolean);
}

function capture(value = '', pattern) {
  return String(value || '').match(pattern)?.[1] || '';
}

function text(value = '') {
  return decode(String(value).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

function decode(value = '') {
  return String(value)
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
}

function number(value) {
  const parsed = Number(String(value || '').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(parsed) && parsed !== 0 ? parsed : undefined;
}

function integer(value) {
  const parsed = Number(String(value || '').replace(/[^0-9]/g, ''));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function compact(value) {
  if (Array.isArray(value)) return value.map(compact);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined && item !== '').map(([key, item]) => [key, compact(item)]));
}

function regionFromSlug(slug) {
  const prefix = slug.split('-')[0];
  return ({ incheon: '인천', seoul: '서울', busan: '부산', jeju: '제주', gangwon: '강원', gyeonggi: '경기', jeonnam: '전남', jeonbuk: '전북', gyeongbuk: '경북', gyeongnam: '경남', chungbuk: '충북', chungnam: '충남', daegu: '대구', daejeon: '대전', gwangju: '광주', ulsan: '울산' })[prefix] || '전국';
}
