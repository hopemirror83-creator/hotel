import { readFile, writeFile } from 'node:fs/promises';
const path = 'data/generated/hotels.collected.json';
const data = JSON.parse(await readFile(path, 'utf8'));
const aliases = {
  'pattaya-5828735': /센터포인트프라임.*파타야|centrepointprime.*pattaya|centerpointprime.*pattaya/i,
  'pattaya-5697310': /그란데센터포인트.*파타야|grandecentrepoint.*pattaya|grandecenterpoint.*pattaya/i,
  'pattaya-527794': /시암앳시암.*파타야|siamatsiam.*pattaya/i,
  'pattaya-89338': /디바리.*좀티엔|dvaree.*jomtien/i,
  'pattaya-161923': /센타라그랜드미라지|centaragrandmirage/i,
  'pattaya-1622455': /더그라스.*앳마인드|thegrass.*atmind/i,
  'pattaya-31068633': /센터포인트스페이스|centrepointspace|centerpointspace/i,
  'pattaya-256056': /알테라호텔|alterahotel/i,
  'pattaya-532100': /무드호텔.*파타야|moodhotel.*pattaya/i,
  'pattaya-967809': /마치호텔.*파타야|marchhotel.*pattaya/i,
  'pattaya-1061229': /센타라라이프마리스|centaralifemaris/i,
  'pattaya-7937563': /아나아난|anaanan/i,
  'pattaya-22887339': /글로우파타야|glowpattaya/i,
  'pattaya-10860': /로얄클리프비치|royalcliffbeach/i,
  'pattaya-10853': /좀티엔팜비치|jomtienpalmbeach/i,
  'pattaya-2011272': /잔드모라다|zandmorada/i,
  'pattaya-234475': /보그파타야|voguepattaya/i,
  'pattaya-91729': /라빈드라비치|ravindrabeach/i,
  'pattaya-553938': /선데이씨투풀|sundayseatoopool|sundayseatoo/i,
  'pattaya-256168': /피프스좀티엔|fifthjomtien/i
};
const normalize = value => String(value || '').replace(/<[^>]+>/g, '').toLowerCase().replace(/[^a-z0-9가-힣]/g, '');
for (const hotel of data.hotels) {
  const alias = aliases[hotel.slug];
  if (!alias) throw Error(`Missing alias: ${hotel.slug}`);
  let count = 0;
  for (const signal of hotel.sourceSignals || []) {
    signal.items = (signal.items || []).filter(item => alias.test(normalize(item.title)) || alias.test(normalize(item.description)));
    signal.total = signal.items.length;
    count += signal.items.length;
  }
  hotel.searchResultCount = count;
  console.log(hotel.slug, count);
}
data.hotels = data.hotels.filter(hotel => hotel.searchResultCount > 0);
await writeFile(path, JSON.stringify(data, null, 2) + '\n');
const targets = JSON.parse(await readFile('data/target-hotels-pattaya-v1-quality.json', 'utf8'));
const kept = new Set(data.hotels.map(hotel => hotel.slug));
await writeFile('data/target-hotels-pattaya-v1-quality.json', JSON.stringify(targets.filter(hotel => kept.has(hotel.slug)), null, 2) + '\n');
await writeFile('data/target-slugs-pattaya-v1-quality.json', JSON.stringify([...kept], null, 2) + '\n');
console.log(`Retained ${data.hotels.length} hotels with matched search signals`);
