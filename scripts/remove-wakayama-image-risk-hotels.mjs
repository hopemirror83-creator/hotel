import { readFile, writeFile } from 'node:fs/promises';

const blocked = new Set(['wakayama-56199568', 'wakayama-2615208', 'wakayama-908281']);
const targetPath = 'data/target-hotels-wakayama-v1-quality.json';
const slugPath = 'data/target-slugs-wakayama-v1-quality.json';
const publicPath = 'src/data/generatedHotels.ts';

const targets = JSON.parse(await readFile(targetPath, 'utf8')).filter((hotel) => !blocked.has(hotel.slug));
const text = await readFile(publicPath, 'utf8');
const match = text.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
const hotels = JSON.parse(match[1]).filter((hotel) => !blocked.has(hotel.slug));

await writeFile(targetPath, `${JSON.stringify(targets, null, 2)}\n`);
await writeFile(slugPath, `${JSON.stringify(targets.map((hotel) => hotel.slug), null, 2)}\n`);
await writeFile(publicPath, `// @ts-nocheck\nexport const generatedHotels: any[] = ${JSON.stringify(hotels, null, 2)};\n`);
console.log({ removed: [...blocked], remaining: targets.length });
