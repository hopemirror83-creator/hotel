import { readFile, writeFile } from 'node:fs/promises';
const path = 'data/generated/hotels.collected.json';
const data = JSON.parse(await readFile(path, 'utf8'));
const aliases = {
  'chiangmai-48944': /두앙타완|duangtawan/i,
  'chiangmai-1373902': /유님만|unimman/i,
  'chiangmai-36844625': /트래블로지님만|travelodgenimman/i,
  'chiangmai-159215': /푸라마치앙마이|furamachiangmai/i,
  'chiangmai-4458933': /코코텔치앙마이님만|kokotelchiangmainimman/i,
  'chiangmai-8315': /아모라타페|amorathapae/i,
  'chiangmai-159143': /임타페|immthaphae|immthapae/i,
  'chiangmai-51954': /라밍로지|raminglodge/i,
  'chiangmai-10901375': /로이호텔.*치앙마이|loihotel.*chiangmai/i,
  'chiangmai-28713525': /b2창푸악게이트|b2changphueakgate/i,
  'chiangmai-165345': /시리판나|siripanna/i,
  'chiangmai-215793': /에어포트그리너리|airportgreenery/i,
  'chiangmai-10757': /센타라리버사이드.*치앙마이|centarariverside.*chiangmai/i,
  'chiangmai-10954330': /슬립마이.*에어포트|sleepmai.*airport/i,
  'chiangmai-35750298': /타패플레이스|thapaeplace/i,
  'chiangmai-5777819': /달리호텔.*치앙마이|darleyhotel.*chiangmai/i,
  'chiangmai-9848028': /무스호텔.*치앙마이|moosehotel.*chiangmai/i,
  'chiangmai-8679874': /anapark.*치앙마이|anapark.*chiangmai/i,
  'chiangmai-1621752': /위터미널호텔|weterminalhotel|weterminalhotel/i,
  'chiangmai-460230': /더짐호텔.*치앙마이|thegymhotel.*chiangmai/i
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
const targets = JSON.parse(await readFile('data/target-hotels-chiangmai-v1-quality.json', 'utf8'));
const kept = new Set(data.hotels.map(hotel => hotel.slug));
await writeFile('data/target-hotels-chiangmai-v1-quality.json', JSON.stringify(targets.filter(hotel => kept.has(hotel.slug)), null, 2) + '\n');
await writeFile('data/target-slugs-chiangmai-v1-quality.json', JSON.stringify([...kept], null, 2) + '\n');
console.log(`Retained ${data.hotels.length} hotels with matched search signals`);
