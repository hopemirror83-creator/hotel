import { readFile, writeFile } from 'node:fs/promises';

const path = 'src/data/generatedHotels.ts';
const text = await readFile(path, 'utf8');
const match = text.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
const hotels = JSON.parse(match[1]);
const collected = JSON.parse(await readFile('data/generated/hotels.collected.json', 'utf8'));
const bySlug = new Map((collected.hotels || []).map((hotel) => [hotel.slug, hotel]));
let linkedHotels = 0;
let totalLinks = 0;

for (const hotel of hotels) {
  if (!hotel.slug?.startsWith('tottori-')) continue;
  const links = build(hotel.hotelName, bySlug.get(hotel.slug)?.sourceSignals || []);
  if (links.length) {
    hotel.referenceLinks = links;
    linkedHotels++;
    totalLinks += links.length;
  } else delete hotel.referenceLinks;
}

await writeFile(path, `// @ts-nocheck\nexport const generatedHotels: any[] = ${JSON.stringify(hotels, null, 2)};\n`);
console.log({ linkedHotels, totalLinks });

function build(name, signals) {
  const seen = new Set();
  const links = [];
  for (const signal of signals) for (const item of signal.items || []) {
    const url = normalize(item.link);
    const title = clean(item.title);
    if (!url || !title || seen.has(url) || !relevant(name, title)) continue;
    seen.add(url);
    links.push({ title, url, query: signal.query, source: 'naver_blog' });
    if (links.length >= 5) return links;
  }
  return links;
}
function relevant(name, title) {
  const ignore = new Set(['호텔', '리조트', '료칸', '돗토리', '일본', '숙소', '후기', '더', '앤', '인']);
  const tokens = clean(name).toLowerCase().split(/[^0-9a-z가-힣]+/).filter((token) => token.length >= 2 && !ignore.has(token));
  const normalizedTitle = clean(title).toLowerCase().replace(/\s+/g, '');
  const unique = [...new Set(tokens)];
  return unique.length > 0 && unique.filter((token) => normalizedTitle.includes(token)).length >= Math.min(2, unique.length);
}
function normalize(value) {
  try {
    const url = new URL(String(value || ''));
    if (!['blog.naver.com', 'm.blog.naver.com'].includes(url.hostname.toLowerCase())) return '';
    url.protocol = 'https:';
    url.hostname = 'blog.naver.com';
    return url.toString();
  } catch { return ''; }
}
function clean(value) { return String(value || '').replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim(); }





