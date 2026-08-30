import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const distHotelDir = path.join(root, 'dist', 'hotel');
const prefixPath = path.join(root, 'data', 'dynamic-hotel-prefixes.json');
const outputPath = path.join(root, 'data', 'generated', 'rendered-hotel-pages.sql');
const prefixes = JSON.parse(await readFile(prefixPath, 'utf8'));
const prefixMatchers = prefixes.map((prefix) => `${prefix}-`);
const entries = await readdir(distHotelDir, { withFileTypes: true });
const pages = [];

for (const entry of entries) {
  if (!entry.isDirectory() || !prefixMatchers.some((prefix) => entry.name.startsWith(prefix))) continue;

  const htmlPath = path.join(distHotelDir, entry.name, 'index.html');
  const html = await readFile(htmlPath, 'utf8');
  const contentHash = createHash('sha256').update(html).digest('hex');
  pages.push({ slug: entry.name, html, contentHash });
}

if (pages.length === 0) {
  throw new Error(`No rendered hotel pages found for prefixes: ${prefixes.join(', ')}`);
}

const quote = (value) => `'${String(value).replaceAll("'", "''")}'`;
const statements = [
  ...pages.map((page) => (
    `INSERT INTO rendered_hotel_pages (slug, html, content_hash, updated_at) VALUES (${quote(page.slug)}, ${quote(page.html)}, ${quote(page.contentHash)}, CURRENT_TIMESTAMP) ` +
    'ON CONFLICT(slug) DO UPDATE SET html = excluded.html, content_hash = excluded.content_hash, updated_at = CURRENT_TIMESTAMP;'
  )),
  '',
];

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, statements.join('\n'), 'utf8');
console.log(`Exported ${pages.length} rendered hotel pages to ${path.relative(root, outputPath)}.`);
