import { readFile, readdir, rm } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const distRoot = process.env.DEPLOY_DIST_DIR
  ? path.resolve(process.env.DEPLOY_DIST_DIR)
  : path.join(root, 'dist');
const distHotelDir = path.join(distRoot, 'hotel');
const prefixes = JSON.parse(await readFile(path.join(root, 'data', 'dynamic-hotel-prefixes.json'), 'utf8'));
const prefixMatchers = prefixes.map((prefix) => `${prefix}-`);
const entries = await readdir(distHotelDir, { withFileTypes: true });
let removed = 0;

for (const entry of entries) {
  if (!entry.isDirectory() || !prefixMatchers.some((prefix) => entry.name.startsWith(prefix))) continue;
  await rm(path.join(distHotelDir, entry.name), { recursive: true, force: true });
  removed += 1;
}

console.log(`Removed ${removed} D1-rendered hotel files from dist.`);
