import { readFile, writeFile } from 'node:fs/promises';

const candidates = JSON.parse(await readFile('data/candidates-chiba-v1-all.json', 'utf8'));

const selected = candidates
  .filter((hotel) => {
    const latitude = Number(hotel.latitude || 0);
    const longitude = Number(hotel.longitude || 0);
    const imageUrl = String(hotel.imageUrl || '');
    const address = String(hotel.fallbackAddress || '');
    const inChiba = latitude >= 34.88 && latitude <= 36.12
      && longitude >= 139.72 && longitude <= 140.88;

    return inChiba
      && hasChibaLocality(address)
      // Agoda commonly groups Urayasu and Maihama under Tokyo even though
      // their coordinates and street addresses are in Chiba Prefecture.
      && !/Ibaraki|Saitama|Kanagawa|이바라키|사이타마|가나가와/i.test(address)
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

await writeFile('data/target-hotels-chiba-v1-quality.json', `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
await writeFile('data/target-slugs-chiba-v1-quality.json', `${JSON.stringify(selected.map((hotel) => hotel.slug), null, 2)}\n`, 'utf8');

console.log(`Selected ${selected.length} strict Chiba candidates from ${candidates.length} ranked candidates`);
if (selected.length > 0) {
  console.log(`Minimum reviews: ${Math.min(...selected.map((hotel) => Number(hotel.reviewCount || 0)))}`);
  console.log(`Minimum score: ${Math.min(...selected.map((hotel) => Number(hotel.reviewScore || 0)))}`);
}

function hasChibaLocality(value) {
  return /\b(?:Chiba|Narita|Urayasu|Maihama|Makuhari|Kashiwa|Funabashi|Ichikawa|Kisarazu|Tateyama|Kamogawa)\b|千葉|成田|浦安|舞浜|幕張|치바|나리타|우라야스|마이하마|마쿠하리/i.test(value);
}
