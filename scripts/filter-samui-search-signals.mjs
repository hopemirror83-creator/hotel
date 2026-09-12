import { readFile, writeFile } from 'node:fs/promises';
const path = 'data/generated/hotels.collected.json';
const data = JSON.parse(await readFile(path, 'utf8'));
const aliases = {
  'samui-159251': /한사르|hansar/i, 'samui-2727957': /코시|cosi/i,
  'samui-159077': /arkbar|아크바/i, 'samui-547973': /이스케이프비치|escapebeach/i,
  'samui-109915': /노라부리|noraburi/i, 'samui-5828751': /럽디|lubd/i,
  'samui-103945': /실라바디|silavadee/i, 'samui-10814': /크리스탈베이요트|crystalbayyacht/i,
  'samui-1535817': /셀레스|celes/i, 'samui-1164116': /프리빌리지.*에즈라|privilege.*ezra/i,
  'samui-5929': /반힌사이|baanhinsai/i, 'samui-96332': /더사란|thesaran/i,
  'samui-247464': /만트라사무이|mantrasamui/i, 'samui-711844': /프라나.*난다나|prana.*nandana/i,
  'samui-239709': /코코팜|cocopalm/i, 'samui-1254358': /익스플로러.*사무이|explorar.*samui/i,
  'samui-159086': /마이사무이|maisamui/i, 'samui-48422': /살라사무이.*청몬|salasamui.*choengmon/i,
  'samui-105034': /로얄무앙|royalmuang/i, 'samui-10820': /통사이베이|tongsai bay|tongsai/i
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
const targets = JSON.parse(await readFile('data/target-hotels-samui-v1-quality.json', 'utf8'));
const kept = new Set(data.hotels.map(hotel => hotel.slug));
await writeFile('data/target-hotels-samui-v1-quality.json', JSON.stringify(targets.filter(hotel => kept.has(hotel.slug)), null, 2) + '\n');
await writeFile('data/target-slugs-samui-v1-quality.json', JSON.stringify([...kept], null, 2) + '\n');
console.log(`Retained ${data.hotels.length} hotels with matched search signals`);
