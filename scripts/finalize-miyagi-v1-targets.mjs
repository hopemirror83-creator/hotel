import { readFile, writeFile } from 'node:fs/promises';

const candidates = JSON.parse(await readFile('data/candidates-miyagi-v1-all.json', 'utf8'));

const selected = candidates
  .filter((hotel) => {
    const latitude = Number(hotel.latitude || 0);
    const longitude = Number(hotel.longitude || 0);
    const imageUrl = String(hotel.imageUrl || '');
    const address = String(hotel.fallbackAddress || '');
    const inMiyagi = latitude >= 37.72 && latitude <= 39.18
      && longitude >= 140.22 && longitude <= 141.78;
    return inMiyagi
      && hasMiyagiLocality(address)
      && !/Fukushima|Iwate|Yamagata|Akita|후쿠시마|이와테|야마가타|아키타/i.test(address)
      && /^https?:\/\//i.test(imageUrl)
      && Number(hotel.reviewCount || 0) >= 20
      && Number(hotel.reviewScore || 0) >= 7.5;
  })
  .sort((a, b) => {
    const scoreA = Number(a.reviewCount || 0) * Math.max(0.1, Number(a.reviewScore || 0));
    const scoreB = Number(b.reviewCount || 0) * Math.max(0.1, Number(b.reviewScore || 0));
    return scoreB - scoreA;
  })
  .slice(0, 200)
  .map((hotel) => ({ ...hotel, country: '일본', skipMapMatch: true }));

await writeFile('data/target-hotels-miyagi-v1-quality.json', `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
await writeFile('data/target-slugs-miyagi-v1-quality.json', `${JSON.stringify(selected.map((hotel) => hotel.slug), null, 2)}\n`, 'utf8');

console.log(`Selected ${selected.length} strict Miyagi candidates from ${candidates.length} ranked candidates`);
if (selected.length > 0) {
  console.log(`Minimum reviews: ${Math.min(...selected.map((hotel) => Number(hotel.reviewCount || 0)))}`);
  console.log(`Minimum score: ${Math.min(...selected.map((hotel) => Number(hotel.reviewScore || 0)))}`);
}

function hasMiyagiLocality(value) {
  return /\b(?:Miyagi|Sendai|Matsushima|Zao|Ishinomaki|Kesennuma|Shiogama|Natori|Osaki|Akiu|Sakunami)\b|宮城|仙台|松島|蔵王|石巻|気仙沼|塩竈|名取|大崎|秋保|作並|미야기|센다이|마쓰시마|자오|이시노마키|게센누마/i.test(value);
}
