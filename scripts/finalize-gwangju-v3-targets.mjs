import { readFile, writeFile } from 'node:fs/promises';

const sourcePath = 'data/candidates-gwangju-next-all.json';
const outputHotelsPath = 'data/target-hotels-gwangju-v3-quality.json';
const outputSlugsPath = 'data/target-slugs-gwangju-v3-quality.json';

const candidates = JSON.parse(await readFile(sourcePath, 'utf8'));
const excludedText = /(Gyeonggi-do|Gwangju-si|Toechon|Gonjiam|Docheok|Namhansanseong|퇴촌|곤지암|남한산성|경기도|담양|장성|구례|전라남도|Jeollanam-do|Damyang|Jangseong|Gurye|펜션|게스트하우스|한옥)/i;

const selected = candidates
  .filter((hotel) => {
    const name = String(hotel.hotelName || '');
    const address = String(hotel.fallbackAddress || '');
    const latitude = Number(hotel.latitude || 0);
    const longitude = Number(hotel.longitude || 0);
    const combined = `${name} ${address}`;

    return /Gwangju|광주/i.test(address)
      && !excludedText.test(combined)
      && latitude >= 35.05
      && latitude <= 35.25
      && longitude >= 126.70
      && longitude <= 127.00
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

console.log(`Selected ${selected.length} strict Gwangju candidates from ${candidates.length} candidates`);
