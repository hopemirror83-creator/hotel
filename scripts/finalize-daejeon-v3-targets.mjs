import { readFile, writeFile } from 'node:fs/promises';

const sourcePath = 'data/candidates-daejeon-next-all.json';
const outputHotelsPath = 'data/target-hotels-daejeon-v3-quality.json';
const outputSlugsPath = 'data/target-slugs-daejeon-v3-quality.json';

const candidates = JSON.parse(await readFile(sourcePath, 'utf8'));
const excludedText = /(제주|서귀포|Daejeong-eup|Jeju|경산|경북|청도|충북|충청북|옥천|충남|충청남|계룡시|Gyeryong-si|Chungcheong|Okcheon|아파트먼트|아파트|프라이빗|침실\s*\d|Entire|Apartment|Studio|House|home)/i;

const selected = candidates
  .filter((hotel) => {
    const name = String(hotel.hotelName || '');
    const address = String(hotel.fallbackAddress || '');
    const latitude = Number(hotel.latitude || 0);
    const longitude = Number(hotel.longitude || 0);
    const combined = `${name} ${address}`;

    return /대전|Daejeon/i.test(address)
      && !excludedText.test(combined)
      && latitude >= 36.2
      && latitude <= 36.5
      && longitude >= 127.25
      && longitude <= 127.55
      && Number(hotel.reviewCount || 0) >= 5
      && Number(hotel.reviewScore || 0) >= 6.5;
  })
  .sort((a, b) => {
    const scoreA = Number(a.reviewCount || 0) * Math.max(0.1, Number(a.reviewScore || 0));
    const scoreB = Number(b.reviewCount || 0) * Math.max(0.1, Number(b.reviewScore || 0));
    return scoreB - scoreA;
  });

await writeFile(outputHotelsPath, `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
await writeFile(outputSlugsPath, `${JSON.stringify(selected.map((hotel) => hotel.slug), null, 2)}\n`, 'utf8');

console.log(`Selected ${selected.length} strict Daejeon candidates from ${candidates.length} candidates`);
