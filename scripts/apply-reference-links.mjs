import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const collectedPath = path.join(ROOT, 'data', 'generated', 'hotels.collected.json');
const publicModulePath = path.join(ROOT, 'src', 'data', 'generatedHotels.ts');

const collected = JSON.parse(await readFile(collectedPath, 'utf8'));
const collectedBySlug = new Map((collected.hotels || []).map((hotel) => [hotel.slug, hotel]));
const publicHotels = await readPublicHotels();

let withReferenceLinks = 0;
let fixedPendingAnalysis = 0;

for (const hotel of publicHotels) {
  const sourceSignals = collectedBySlug.get(hotel.slug)?.sourceSignals || [];
  const referenceLinks = buildReferenceLinks(sourceSignals);
  if (referenceLinks.length > 0) {
    hotel.referenceLinks = referenceLinks;
    withReferenceLinks += 1;
  } else if (!Array.isArray(hotel.referenceLinks) || hotel.referenceLinks.length === 0) {
    delete hotel.referenceLinks;
  } else {
    withReferenceLinks += 1;
  }

  if (!hotel.analysis) {
    hotel.analysis = buildPendingAnalysis(hotel);
    hotel.qualityStatus = 'pending_generation';
    fixedPendingAnalysis += 1;
  }
}

await writeFile(
  publicModulePath,
  `// @ts-nocheck\nexport const generatedHotels: any[] = ${JSON.stringify(publicHotels, null, 2)};\n`,
  'utf8'
);

console.log(JSON.stringify({ hotels: publicHotels.length, withReferenceLinks, fixedPendingAnalysis }, null, 2));

async function readPublicHotels() {
  const text = await readFile(publicModulePath, 'utf8');
  const match = text.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
  if (!match) throw new Error('Could not parse generatedHotels.ts');
  return JSON.parse(match[1]);
}

function buildReferenceLinks(sourceSignals = []) {
  const seenUrls = new Set();
  const links = [];

  for (const signal of sourceSignals) {
    for (const item of signal.items || []) {
      const url = normalizeNaverBlogUrl(item.link);
      if (!url || seenUrls.has(url)) continue;

      links.push({
        title: cleanReferenceTitle(item.title || item.link),
        url,
        query: signal.query,
        source: 'naver_blog'
      });
      seenUrls.add(url);

      if (links.length >= 5) return links;
    }
  }

  return links;
}

function normalizeNaverBlogUrl(value) {
  try {
    const url = new URL(String(value || ''));
    const hostname = url.hostname.toLowerCase();
    if (hostname !== 'blog.naver.com' && hostname !== 'm.blog.naver.com') return '';
    url.protocol = 'https:';
    url.hostname = 'blog.naver.com';
    return url.toString();
  } catch {
    return '';
  }
}

function cleanReferenceTitle(value) {
  return String(value || '')
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildPendingAnalysis(hotel) {
  return {
    summary: `${hotel.hotelName}은 현재 기본 정보와 검색 결과를 바탕으로 분석을 준비 중입니다. 예약 전에는 위치, 체크인, 주차, 조식 조건을 함께 확인하는 것이 좋습니다.`,
    pros: ['기본 숙소 정보 수집 완료', '네이버 검색 신호 수집 완료', '예약 전 확인 항목 정리 예정'],
    cons: ['세부 후기 분석은 아직 준비 중입니다.'],
    recommendedFor: ['예약 전 기본 정보를 먼저 확인하려는 여행자'],
    notRecommendedFor: ['상세 후기 분석이 즉시 필요한 여행자'],
    checkPoints: ['체크인 시간 확인', '주차 가능 여부 확인', '조식 포함 여부 확인', '객실 타입 확인'],
    seoTitle: `${hotel.hotelName} 후기 모음 예약 전 체크`,
    metaDescription: `${hotel.hotelName} 예약 전 위치, 체크인, 주차, 조식 정보를 확인할 수 있는 호텔로그 페이지입니다.`
  };
}
