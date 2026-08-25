import { readFile, writeFile } from 'node:fs/promises';

const remove = new Set(['nhatrang-860808']);
const targetsPath = 'data/target-hotels-nhatrang-v1-quality.json';
const targets = JSON.parse(await readFile(targetsPath, 'utf8')).filter((hotel) => !remove.has(hotel.slug));
await writeFile(targetsPath, `${JSON.stringify(targets, null, 2)}\n`);

const slugsPath = 'data/target-slugs-nhatrang-v1-quality.json';
const slugs = JSON.parse(await readFile(slugsPath, 'utf8')).filter((slug) => !remove.has(slug));
await writeFile(slugsPath, `${JSON.stringify(slugs, null, 2)}\n`);

const collectedPath = 'data/generated/hotels.collected.json';
const collected = JSON.parse(await readFile(collectedPath, 'utf8'));
collected.hotels = collected.hotels.filter((hotel) => !remove.has(hotel.slug));
await writeFile(collectedPath, `${JSON.stringify(collected, null, 2)}\n`);

console.log({ targets: targets.length, slugs: slugs.length, collected: collected.hotels.length });
