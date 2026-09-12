import { readFile, writeFile } from 'node:fs/promises';

const path = 'data/generated/hotels.collected.json';
const data = JSON.parse(await readFile(path, 'utf8'));
const aliases = new Map([
  ['khaolak-2115736', /라벨라|lavela/i],
  ['khaolak-338589', /더샌즈|thesands/i],
  ['khaolak-5692215', /칼리마|kalima/i],
  ['khaolak-85087', /압사라|아스파라|apsara/i],
  ['khaolak-108383', /브리자|briza/i],
  ['khaolak-69222', /코코텔|kokotel|수완팜/i],
  ['khaolak-460326', /그레이스랜드|graceland/i],
  ['khaolak-5796898', /edenbeach|에덴비치/i],
  ['khaolak-400380', /더워터스|thewaters/i],
  ['khaolak-49045', /씨뷰리조트|seaviewresort/i],
  ['khaolak-48391', /에메랄드|emerald/i],
  ['khaolak-698780', /리프오션사이드|leafoceanside/i],
  ['khaolak-283988', /라플로라|laflora/i],
  ['khaolak-178301', /파나리|fanari/i],
  ['khaolak-18759561', /풀만|pullman/i],
  ['khaolak-9362509', /메르디앙|meridien/i],
  ['khaolak-77601', /jw메리어트|jwmarriott/i],
  ['khaolak-5481629', /데바솜|devasom/i],
  ['khaolak-338522', /마이카오락|maikhaolak/i],
  ['khaolak-240590', /칸타리|kantary/i]
]);
const normalize = value => String(value || '').replace(/<[^>]+>/g, '').toLowerCase().replace(/[^a-z0-9가-힣]/g, '');
for (const hotel of data.hotels) {
  const alias = aliases.get(hotel.slug);
  if (!alias) throw Error(`Missing alias: ${hotel.slug}`);
  let count = 0;
  for (const signal of hotel.sourceSignals || []) {
    signal.items = (signal.items || []).filter(item => {
      const title = normalize(item.title), description = normalize(item.description);
      if (!alias.test(title) && !alias.test(description)) return false;
      if (hotel.slug === 'khaolak-338589' && /더리프온더샌즈|leafonthesands/.test(title)) return false;
      if (hotel.slug === 'khaolak-338522' && /마이카오|maikhao(?!lak)/.test(title) && !/카오락|khaolak/.test(title + description)) return false;
      return true;
    });
    signal.total = signal.items.length;
    count += signal.items.length;
  }
  hotel.searchResultCount = count;
  console.log(hotel.slug, hotel.hotelName, count);
}
await writeFile(path, JSON.stringify(data, null, 2) + '\n');
