import { readFile, writeFile } from 'node:fs/promises';

const targetPath = 'data/target-hotels-gyeonggi-v5-200.json';
const slugPath = 'data/target-slugs-gyeonggi-v5-200.json';
const collectedPath = 'data/generated/hotels.collected.json';
const candidatePath = 'data/candidates-gyeonggi-next-quality.json';
const replacementPath = 'data/target-hotels-gyeonggi-v5-final-replacement.json';
const replacementSlugPath = 'data/target-slugs-gyeonggi-v5-final-replacement.json';
const badSlug = 'gyeonggi-21125534';
const excluded = new Set(['gyeonggi-23147380', 'gyeonggi-10589755', 'gyeonggi-15906191', badSlug]);
const otherRegionPattern = /서울|Seoul|인천|Incheon|강원|Gangwon|충북|Chungbuk|충남|Chungnam|경북|Gyeongbuk|전북|Jeonbuk|부산|Busan|제주|Jeju/i;
const privateStayPattern = /아파트먼트|프라이빗 하우스|스튜디오 아파트|빌라 \(|침실 \d+개|private house|apartment \(/i;

const targets = JSON.parse(await readFile(targetPath, 'utf8')).filter((hotel) => hotel.slug !== badSlug);
const used = new Set(targets.map((hotel) => hotel.slug));
const candidates = JSON.parse(await readFile(candidatePath, 'utf8'));
const replacement = candidates.find((hotel) => {
  if (used.has(hotel.slug) || excluded.has(hotel.slug)) return false;
  const latitude = Number(hotel.latitude);
  const longitude = Number(hotel.longitude);
  const address = String(hotel.fallbackAddress || '');
  return latitude >= 36.8
    && latitude <= 38.3
    && longitude >= 126
    && longitude <= 127.9
    && /경기|Gyeonggi/i.test(address)
    && !otherRegionPattern.test(address.replace(/경기|Gyeonggi/gi, ''))
    && !privateStayPattern.test(String(hotel.hotelName || ''));
});

if (!replacement) throw new Error('No valid final replacement found');
const finalTargets = [...targets, replacement];
if (finalTargets.length !== 200) throw new Error(`Expected 200 targets, found ${finalTargets.length}`);

const collected = JSON.parse(await readFile(collectedPath, 'utf8'));
collected.hotels = collected.hotels.filter((hotel) => hotel.slug !== badSlug);

await writeFile(targetPath, `${JSON.stringify(finalTargets, null, 2)}\n`, 'utf8');
await writeFile(slugPath, `${JSON.stringify(finalTargets.map((hotel) => hotel.slug), null, 2)}\n`, 'utf8');
await writeFile(replacementPath, `${JSON.stringify([replacement], null, 2)}\n`, 'utf8');
await writeFile(replacementSlugPath, `${JSON.stringify([replacement.slug], null, 2)}\n`, 'utf8');
await writeFile(collectedPath, `${JSON.stringify(collected, null, 2)}\n`, 'utf8');

console.log(JSON.stringify({ removed: badSlug, replacement }, null, 2));
