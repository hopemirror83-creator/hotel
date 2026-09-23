import { readFile, writeFile } from 'node:fs/promises';

const collectedPath = 'data/generated/hotels.collected.json';
const collected = JSON.parse(await readFile(collectedPath, 'utf8'));
for (const hotel of collected.hotels) {
  const tokens = hotelTokens(hotel.hotelName);
  let count = 0;
  for (const signal of hotel.sourceSignals || []) {
    signal.items = (signal.items || []).filter(item => relevant(tokens, `${item.title || ''} ${item.description || ''}`));
    signal.total = signal.items.length;
    count += signal.items.length;
  }
  hotel.searchResultCount = count;
  console.log(hotel.slug, count);
}
await writeFile(collectedPath, `${JSON.stringify(collected, null, 2)}\n`);

function hotelTokens(value) {
  const ignored = new Set(['호텔', '리조트', '게스트하우스', '부티크', '버짓', '치앙라이', '치앙센', '더', '앤', '인', 'hotel', 'resort', 'chiang', 'rai', 'saen']);
  return [...new Set(String(value || '').toLowerCase().split(/[^a-z0-9가-힣]+/).filter(token => token.length >= 2 && !ignored.has(token)))];
}
function relevant(tokens, value) {
  const normalized = String(value || '').replace(/<[^>]+>/g, '').toLowerCase().replace(/\s+/g, '');
  return tokens.length > 0 && tokens.filter(token => normalized.includes(token)).length >= Math.min(2, tokens.length);
}
