import { readFile, writeFile } from 'node:fs/promises';

const collectedPath = 'data/generated/hotels.collected.json';
const collected = JSON.parse(await readFile(collectedPath, 'utf8'));
const aliases = {
  'huahin-304275': /래디슨리조트앤스파후아힌|radissonresortandspahuahin/i,
  'huahin-3122020': /홀리데이인리조트바나나바후아힌|holidayinnresortvananavahuahin/i,
  'huahin-407521': /더리젠트차암비치리조트|regentchaambeachresort/i,
  'huahin-44864': /촘뷰호텔|chomviewhotel/i,
  'huahin-10722': /두짓타니후아힌|dusitthanihuahin/i,
  'huahin-3001731': /b2후아힌프리미어|b2huahinpremier/i,
  'huahin-344255': /로얄파빌리온후아힌|royalpavilionhuahin/i,
  'huahin-305552': /아마리후아힌|amarihuahin/i,
  'huahin-14654067': /센타라라이프차암비치리조트|centaralifechaambeachresort/i,
  'huahin-37023558': /베스트웨스턴플러스카라페이스|bestwesternpluscarapace/i,
  'huahin-294930': /미다드씨후아힌|midadehuahin/i,
  'huahin-9786059': /아이사눅후아힌|isanookhuahin/i,
  'huahin-23166508': /블루로터스.*후아힌|bluelotus.*huahin/i,
  'huahin-52173': /워라부라후아힌|woraburahuahin/i,
  'huahin-14502155': /시파인비치골프앤리조트|seapinebeachgolf/i,
  'huahin-4947213': /더야나빌라스후아힌|theyanavillashuahin/i,
  'huahin-337681': /오리엔탈비치펄리조트|orientalbeachpearlresort/i,
  'huahin-66526': /알린타후아힌|aleentahuahin/i,
  'huahin-48475': /골든파인비치리조트.*후아힌|goldenpinebeachresort.*huahin/i,
  'huahin-502762': /빌라그리스프란부리|villagrispranburi/i
};

const normalize = value => String(value || '').replace(/<[^>]+>/g, '').toLowerCase().replace(/[^a-z0-9가-힣]/g, '');
for (const hotel of collected.hotels) {
  const alias = aliases[hotel.slug];
  if (!alias) throw new Error(`Missing alias for ${hotel.slug}`);
  let count = 0;
  for (const signal of hotel.sourceSignals || []) {
    signal.items = (signal.items || []).filter(item => alias.test(normalize(item.title)) || alias.test(normalize(item.description)));
    signal.total = signal.items.length;
    count += signal.items.length;
  }
  hotel.searchResultCount = count;
  console.log(hotel.slug, count);
}

collected.hotels = collected.hotels.filter(hotel => hotel.searchResultCount > 0);
await writeFile(collectedPath, `${JSON.stringify(collected, null, 2)}\n`);
const targets = JSON.parse(await readFile('data/target-hotels-huahin-v1-quality.json', 'utf8'));
const kept = new Set(collected.hotels.map(hotel => hotel.slug));
await writeFile('data/target-hotels-huahin-v1-quality.json', `${JSON.stringify(targets.filter(hotel => kept.has(hotel.slug)), null, 2)}\n`);
await writeFile('data/target-slugs-huahin-v1-quality.json', `${JSON.stringify([...kept], null, 2)}\n`);
console.log(`Retained ${collected.hotels.length} hotels with matched search signals`);
