import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const manifestPath = path.join(root, 'deploy-data/generated-hotels/manifest.json');
const outputPath = path.join(root, 'data/hotellog-japan-manual-index-all.txt');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const japanPrefixes = new Set([
  'osaka', 'tokyo', 'fukuoka', 'kyoto', 'sapporo', 'okinawa', 'nagoya',
  'hiroshima', 'kobe', 'yokohama', 'chiba', 'miyagi', 'hakone', 'ishikawa',
  'toyama', 'fukui', 'niigata', 'nagano', 'gifu', 'shizuoka', 'yamanashi',
  'gunma', 'tochigi', 'ibaraki', 'saitama', 'fukushima', 'yamagata', 'akita',
  'iwate', 'aomori', 'hokkaido', 'okayama', 'tottori', 'shimane', 'yamaguchi',
  'kagawa', 'tokushima', 'ehime', 'kochi', 'mie'
]);

const hotels = [];
for (const chunk of manifest.files) {
  const chunkPath = path.join(root, 'deploy-data/generated-hotels', chunk.filename);
  hotels.push(...JSON.parse(await readFile(chunkPath, 'utf8')));
}

const urls = [...new Set(hotels
  .map((hotel) => String(hotel.slug || '').trim())
  .filter((slug) => japanPrefixes.has(slug.split('-', 1)[0]))
  .map((slug) => `https://hotel.product-pack.com/hotel/${slug}/`))]
  .sort((a, b) => a.localeCompare(b, 'en'));

await writeFile(outputPath, `${urls.join('\r\n')}\r\n`, 'utf8');
console.log(JSON.stringify({ outputPath, count: urls.length, first: urls[0], last: urls.at(-1) }, null, 2));
