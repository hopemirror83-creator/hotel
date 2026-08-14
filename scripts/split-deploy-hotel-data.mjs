import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const sourcePath = path.join(root, 'src', 'data', 'generatedHotels.ts');
const outputDir = path.join(root, 'deploy-data', 'generated-hotels');
const chunkSize = Number(process.env.HOTEL_DATA_CHUNK_SIZE || 500);

const source = await readFile(sourcePath, 'utf8');
const match = source.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
if (!match) throw new Error('Unable to parse src/data/generatedHotels.ts');

const hotels = JSON.parse(match[1]);
await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });

const files = [];
for (let index = 0; index < hotels.length; index += chunkSize) {
  const chunk = hotels.slice(index, index + chunkSize);
  const filename = `hotels-${String(files.length + 1).padStart(3, '0')}.json`;
  await writeFile(path.join(outputDir, filename), `${JSON.stringify(chunk)}\n`, 'utf8');
  files.push({ filename, count: chunk.length });
}

await writeFile(
  path.join(outputDir, 'manifest.json'),
  `${JSON.stringify({ generatedAt: new Date().toISOString(), total: hotels.length, chunkSize, files }, null, 2)}\n`,
  'utf8',
);

console.log(`Prepared ${hotels.length} hotels in ${files.length} Git-safe chunks.`);
