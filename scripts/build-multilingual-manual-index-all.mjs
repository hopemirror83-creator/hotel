import { writeFileSync } from 'node:fs';
import { multilingualRegions } from '../src/data/multilingualRegions.ts';

const baseUrl = 'https://hotel.product-pack.com';
const urls = [`${baseUrl}/en/`, `${baseUrl}/ja/`];

for (const region of Object.values(multilingualRegions)) {
  urls.push(`${baseUrl}/en/${region.localePath}/`);
  urls.push(`${baseUrl}/ja/${region.localePath}/`);
  for (const slug of region.slugs) {
    urls.push(`${baseUrl}/en/hotel/${slug}/`);
    urls.push(`${baseUrl}/ja/hotel/${slug}/`);
  }
}

const uniqueUrls = [...new Set(urls)];
writeFileSync('data/hotellog-multilingual-manual-index-all.txt', `${uniqueUrls.join('\n')}\n`, 'utf8');
console.log(`Wrote ${uniqueUrls.length} multilingual URLs.`);
