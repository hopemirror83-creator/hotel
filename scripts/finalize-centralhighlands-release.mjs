import { readFile, writeFile } from 'node:fs/promises';

const modulePath = 'src/data/generatedHotels.ts';
const source = await readFile(modulePath, 'utf8');
const match = source.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
if (!match) throw new Error('Unable to parse generatedHotels.ts');
const hotels = JSON.parse(match[1]);
const collected = JSON.parse(await readFile('data/generated/hotels.collected.json', 'utf8')).hotels;
const signals = new Map(collected.map((hotel) => [hotel.slug, hotel.sourceSignals || []]));
const kept = [];
const excluded = [];
let linkedHotels = 0;

for (const hotel of hotels.filter((item) => item.slug?.startsWith('centralhighlands-'))) {
  const sections = hotel.analysis?.blogReview?.sections || [];
  const images = sections.filter((section) => /^https?:\/\//i.test(String(section.image?.url || section.imageUrl || ''))).length;
  const body = sections.reduce((total, section) => total + (section.paragraphs || []).reduce((sum, paragraph) => sum + String(paragraph).length, 0), 0);
  if (hotel.qualityStatus !== 'ready' || sections.length < 6 || images < 6 || body < 700) {
    excluded.push({ slug: hotel.slug, status: hotel.qualityStatus, sections: sections.length, images, body });
    continue;
  }
  const links = buildLinks(hotel.hotelName, signals.get(hotel.slug) || []);
  if (links.length) { hotel.referenceLinks = links; linkedHotels += 1; }
  else delete hotel.referenceLinks;
  kept.push(hotel);
}

await writeFile(modulePath, `// @ts-nocheck\nexport const generatedHotels: any[] = ${JSON.stringify(kept, null, 2)};\n`);
await writeFile('data/target-hotels-centralhighlands-v1-generated.json', `${JSON.stringify(kept, null, 2)}\n`);
await writeFile('data/target-slugs-centralhighlands-v1-quality.json', `${JSON.stringify(kept.map((hotel) => hotel.slug), null, 2)}\n`);
console.log({ generated: hotels.length, kept: kept.length, linkedHotels, excluded });

function buildLinks(name, sourceSignals) { const seen = new Set(), links = []; for (const signal of sourceSignals) for (const item of signal.items || []) { const url = normalizeUrl(item.link), title = clean(item.title); if (!url || !title || seen.has(url) || !relevant(name, title)) continue; seen.add(url); links.push({ title, url, query: signal.query, source: 'naver_blog' }); if (links.length >= 5) return links; } return links; }
function relevant(name, title) { const ignored = new Set(['호텔','리조트','아파트먼트','콘도텔','홈스테이','부온마투옷','플레이쿠','콘툼','망덴','닥락','베트남','숙소','후기','더','앤','인','비치','씨뷰']); const tokens = clean(name).toLowerCase().split(/[^0-9a-z가-힣]+/).filter((token) => token.length >= 2 && !ignored.has(token)), normalized = clean(title).toLowerCase().replace(/\s+/g, ''), unique = [...new Set(tokens)]; return unique.length > 0 && unique.filter((token) => normalized.includes(token)).length >= Math.min(2, unique.length); }
function normalizeUrl(value) { try { const url = new URL(String(value || '')); if (!['blog.naver.com','m.blog.naver.com'].includes(url.hostname.toLowerCase())) return ''; url.protocol = 'https:'; url.hostname = 'blog.naver.com'; return url.toString(); } catch { return ''; } }
function clean(value) { return String(value || '').replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim(); }


