import { readFile, writeFile } from 'node:fs/promises';
const path = 'data/generated/hotels.collected.json';
const data = JSON.parse(await readFile(path, 'utf8'));
const aliases = {
  'bangkok-461790': /버클리.*프라투남|berkeley.*pratunam/i,
  'bangkok-10636': /아시아호텔.*방콕|asiahotel.*bangkok/i,
  'bangkok-286830': /센터포인트.*터미널21|centrepoint.*terminal21|centerpoint.*terminal21/i,
  'bangkok-10637': /바이욕스카이|baiyokesky/i,
  'bangkok-96281': /센터포인트.*라차담리|centrepoint.*ratchadamri|centerpoint.*ratchadamri/i,
  'bangkok-148694': /람부뜨리빌리지|rambuttrivillage/i,
  'bangkok-71883': /나이트호텔.*수쿰|nighthotel.*sukhum/i,
  'bangkok-48490': /센터포인트.*실롬|centrepoint.*silom|centerpoint.*silom/i,
  'bangkok-1274214': /센터포인트.*통로|centrepoint.*thonglo|centerpoint.*thonglo/i,
  'bangkok-1378714': /아르테호텔|artehotel/i,
  'bangkok-179078': /jc케빈|jckevin/i,
  'bangkok-488932': /만다린호텔.*센터포인트|mandarin.*centrepoint|mandarin.*centerpoint/i,
  'bangkok-47625': /트리니티실롬|trinitysilom/i,
  'bangkok-52152': /밀레니엄힐튼.*방콕|millenniumhilton.*bangkok/i,
  'bangkok-34247951': /쿼터차오프라야|quarterchaophraya/i,
  'bangkok-10670': /라마다플라자.*메남|ramadaplaza.*menam/i,
  'bangkok-16333744': /아사이.*차이나타운|asai.*chinatown/i,
  'bangkok-248566': /누보시티|nouvocity/i,
  'bangkok-46936093': /티니디트렌디.*카오산|tinideetrendy.*khaosan/i,
  'bangkok-4124250': /카오산아트호텔|khaosanarthotel/i
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
const targets = JSON.parse(await readFile('data/target-hotels-bangkok-v1-quality.json', 'utf8'));
const kept = new Set(data.hotels.map(hotel => hotel.slug));
await writeFile('data/target-hotels-bangkok-v1-quality.json', JSON.stringify(targets.filter(hotel => kept.has(hotel.slug)), null, 2) + '\n');
await writeFile('data/target-slugs-bangkok-v1-quality.json', JSON.stringify([...kept], null, 2) + '\n');
console.log(`Retained ${data.hotels.length} hotels with matched search signals`);
