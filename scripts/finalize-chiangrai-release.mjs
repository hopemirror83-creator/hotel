import { readFile, writeFile } from 'node:fs/promises';
const path = 'src/data/generatedHotels.ts';
const source = await readFile(path, 'utf8');
const match = source.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
if (!match) throw new Error('Cannot parse hotel data');
const hotels = JSON.parse(match[1]);
const collected = JSON.parse(await readFile('data/generated/hotels.collected.json', 'utf8')).hotels;
const signals = new Map(collected.map(hotel => [hotel.slug, hotel.sourceSignals || []]));
const kept = [], excluded = [];
for (const hotel of hotels.filter(item => item.slug?.startsWith('chiangrai-'))) {
  const sections = hotel.analysis?.blogReview?.sections || [];
  const images = sections.filter(section => /^https?:\/\//i.test(String(section.image?.url || section.imageUrl || ''))).length;
  const agodaImages = sections.filter(section => /^agoda_/i.test(String(section.image?.source || ''))).length;
  const body = sections.reduce((total, section) => total + (section.paragraphs || []).reduce((sum, paragraph) => sum + String(paragraph).length, 0), 0);
  if (hotel.qualityStatus !== 'ready' || sections.length < 6 || images < 6 || agodaImages < 6 || body < 700) {
    excluded.push({ slug: hotel.slug, status: hotel.qualityStatus, sections: sections.length, images, agodaImages, body });
    continue;
  }
  const links = buildLinks(hotel.hotelName, signals.get(hotel.slug) || []);
  if (links.length) hotel.referenceLinks = links;
  else delete hotel.referenceLinks;
  kept.push(hotel);
}
await writeFile(path, `// @ts-nocheck\nexport const generatedHotels: any[] = ${JSON.stringify(kept, null, 2)};\n`);
await writeFile('data/target-hotels-chiangrai-v1-generated.json', `${JSON.stringify(kept, null, 2)}\n`);
await writeFile('data/target-slugs-chiangrai-v1-quality.json', `${JSON.stringify(kept.map(hotel => hotel.slug), null, 2)}\n`);
console.log({ generated: hotels.length, kept: kept.length, linkedHotels: kept.filter(hotel => hotel.referenceLinks?.length).length, excluded });

function buildLinks(name, sourceSignals) {
  const tokens = hotelTokens(name), seen = new Set(), links = [];
  for (const signal of sourceSignals) for (const item of signal.items || []) {
    const url = normalizeUrl(item.link), title = clean(item.title);
    if (!url || !title || seen.has(url) || !relevant(tokens, title)) continue;
    seen.add(url); links.push({ title, url, query: signal.query, source: 'naver_blog' });
    if (links.length >= 5) return links;
  }
  return links;
}
function hotelTokens(value) { const ignored = new Set(['호텔','리조트','게스트하우스','부티크','버짓','치앙라이','치앙센','더','앤','인','hotel','resort','chiang','rai','saen']); return [...new Set(clean(value).toLowerCase().split(/[^a-z0-9가-힣]+/).filter(token => token.length >= 2 && !ignored.has(token)))]; }
function relevant(tokens, value) { const normalized = clean(value).toLowerCase().replace(/\s+/g, ''); return tokens.length > 0 && tokens.filter(token => normalized.includes(token)).length >= Math.min(2, tokens.length); }
function normalizeUrl(value) { try { const url = new URL(String(value || '')); if (!['blog.naver.com','m.blog.naver.com'].includes(url.hostname.toLowerCase())) return ''; url.protocol = 'https:'; url.hostname = 'blog.naver.com'; return url.toString(); } catch { return ''; } }
function clean(value) { return String(value || '').replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim(); }
