import { access, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const outputPath = path.join(root, 'src', 'data', 'generatedHotels.ts');
const dataDir = path.join(root, 'deploy-data', 'generated-hotels');

if (process.env.FORCE_REBUILD_DEPLOY_DATA !== '1') {
  try {
    await access(outputPath);
    console.log('Using the existing generatedHotels.ts file.');
    process.exit(0);
  } catch {
    // Cloudflare's Git build reconstructs the ignored monolith from small tracked chunks.
  }
}

const manifest = JSON.parse(await readFile(path.join(dataDir, 'manifest.json'), 'utf8'));
const chunks = [];
for (const entry of manifest.files) {
  chunks.push(...JSON.parse(await readFile(path.join(dataDir, entry.filename), 'utf8')));
}

if (chunks.length !== manifest.total) {
  throw new Error(`Hotel data count mismatch: expected ${manifest.total}, received ${chunks.length}`);
}

await writeFile(
  outputPath,
  `// @ts-nocheck\nexport const generatedHotels: any[] = ${JSON.stringify(chunks, null, 2)};\n`,
  'utf8',
);
console.log(`Reconstructed generatedHotels.ts with ${chunks.length} hotels.`);
