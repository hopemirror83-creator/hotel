import { execFileSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';

const show = (path) => execFileSync('git', ['show', `HEAD:${path}`], { encoding: 'utf8', maxBuffer: 1024 * 1024 * 300 });
const manifest = JSON.parse(show('deploy-data/generated-hotels/manifest.json'));
const head = manifest.files.flatMap((file) => JSON.parse(show(`deploy-data/generated-hotels/${file.filename}`)));
const existing = head.filter((hotel) => !hotel.slug?.startsWith('tottori-'));
const region = JSON.parse(await readFile('data/target-hotels-tottori-v1-generated.json', 'utf8'));
const merged = [...existing, ...region];
await writeFile('src/data/generatedHotels.ts', `// @ts-nocheck\nexport const generatedHotels: any[] = ${JSON.stringify(merged, null, 2)};\n`);
console.log({ existing: existing.length, tottori: region.length, total: merged.length });






