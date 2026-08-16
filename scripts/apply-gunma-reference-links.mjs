import { readFile, writeFile } from 'node:fs/promises';

const publicPath = 'src/data/generatedHotels.ts';
const collectedPath = 'data/generated/hotels.collected.json';
const text = await readFile(publicPath, 'utf8');
const match = text.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
if (!match) throw new Error('Could not parse generatedHotels.ts');
const hotels = JSON.parse(match[1]);
const collected = JSON.parse(await readFile(collectedPath, 'utf8'));
const bySlug = new Map((collected.hotels || []).map((hotel) => [hotel.slug, hotel]));
let linkedHotels = 0;
let totalLinks = 0;

for (const hotel of hotels) {
  if (!hotel.slug?.startsWith('gunma-')) continue;
  const links = buildLinks(hotel.hotelName, bySlug.get(hotel.slug)?.sourceSignals || []);
  if (links.length) {
    hotel.referenceLinks = links;
    linkedHotels += 1;
    totalLinks += links.length;
  } else {
    delete hotel.referenceLinks;
  }
}

await writeFile(publicPath, `// @ts-nocheck\nexport const generatedHotels: any[] = ${JSON.stringify(hotels, null, 2)};\n`, 'utf8');
console.log(JSON.stringify({ linkedHotels, totalLinks }, null, 2));

function buildLinks(name, signals) {
  const seen = new Set();
  const links = [];
  for (const signal of signals) {
    for (const item of signal.items || []) {
      const url = normalizeUrl(item.link);
      const title = clean(item.title);
      if (!url || !title || seen.has(url) || !isRelevant(name, title)) continue;
      seen.add(url);
      links.push({ title, url, query: signal.query, source: 'naver_blog' });
      if (links.length >= 5) return links;
    }
  }
  return links;
}

function isRelevant(name, title) {
  const ignored = new Set(['호텔', '리조트', '료칸', '군마', '구사쓰', '쿠사츠', '이카호', '미나카미', '온천', '일본', '숙소', '후기', '더', '앤', '인']);
  const tokens = clean(name).toLowerCase().split(/[^0-9a-z가-힣]+/).filter((token) => token.length >= 2 && !ignored.has(token));
  const normalized = clean(title).toLowerCase().replace(/\s+/g, '');
  const unique = [...new Set(tokens)];
  const matched = unique.filter((token) => normalized.includes(token.replace(/\s+/g, ''))).length;
  return unique.length > 0 && matched >= Math.min(2, unique.length);
}

function normalizeUrl(value) {
  try {
    const url = new URL(String(value || ''));
    if (!['blog.naver.com', 'm.blog.naver.com'].includes(url.hostname.toLowerCase())) return '';
    url.protocol = 'https:';
    url.hostname = 'blog.naver.com';
    return url.toString();
  } catch { return ''; }
}

function clean(value) {
  return String(value || '').replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
}
