import { execFileSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
const show = path => execFileSync('git', ['show', `HEAD:${path}`], { encoding: 'utf8', maxBuffer: 1024 * 1024 * 300 });
const manifest = JSON.parse(show('deploy-data/generated-hotels/manifest.json'));
const existing = manifest.files.flatMap(file => JSON.parse(show(`deploy-data/generated-hotels/${file.filename}`)))
  .filter(h => !h.slug?.startsWith('khaolak-'));
const region = JSON.parse(await readFile('data/target-hotels-khaolak-v1-generated.json', 'utf8'));
const merged = [...existing, ...region];
await writeFile('src/data/generatedHotels.ts', `// @ts-nocheck\nexport const generatedHotels: any[] = ${JSON.stringify(merged, null, 2)};\n`);
console.log({ existing: existing.length, khaolak: region.length, total: merged.length });
