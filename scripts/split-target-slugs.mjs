import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const inputFile = process.argv[2];
const partSize = Number(process.argv[3] || 50);
if (!inputFile) throw new Error('Usage: node scripts/split-target-slugs.mjs <input-file> [part-size]');

const slugs = JSON.parse(await readFile(inputFile, 'utf8'));
const parsed = path.parse(inputFile);
for (let start = 0; start < slugs.length; start += partSize) {
  const part = slugs.slice(start, start + partSize);
  const partNumber = Math.floor(start / partSize) + 1;
  const output = path.join(parsed.dir, `${parsed.name.replace(/-200$/, '')}-part-${partNumber}${parsed.ext}`);
  await writeFile(output, `${JSON.stringify(part, null, 2)}\n`, 'utf8');
  console.log(`${output}: ${part.length}`);
}
