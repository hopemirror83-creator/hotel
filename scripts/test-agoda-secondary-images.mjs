import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { generatedHotels } from '../src/data/generatedHotels.ts';

const ROOT = process.cwd();
const outDir = path.join(ROOT, 'data', 'generated');
const report = [];

await mkdir(outDir, { recursive: true });

for (const hotel of generatedHotels) {
  const hid = new URL(hotel.landingUrl).searchParams.get('hid');
  const apiUrl = `https://www.agoda.com/api/cronos/property/BelowFoldParams/GetSecondaryData?cid=1927566&hid=${hid}&hotel_id=${hid}&all=false&isHostPropertiesEnabled=true`;
  console.log(`Testing Agoda secondary API for ${hotel.hotelName}`);

  const response = await fetch(apiUrl, {
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
      accept: 'application/json,text/plain,*/*',
      referer: hotel.landingUrl,
      'accept-language': 'ko-KR,ko;q=0.9,en;q=0.8'
    },
    signal: AbortSignal.timeout(45000)
  });
  const text = await response.text();
  const images = extractAgodaImages(text);

  report.push({
    slug: hotel.slug,
    hotelName: hotel.hotelName,
    hid,
    apiUrl,
    status: response.status,
    contentType: response.headers.get('content-type'),
    responseLength: text.length,
    imageCount: images.length,
    images: images.slice(0, 24)
  });

  await sleep(400);
}

await writeFile(path.join(outDir, 'agoda-secondary-image-test.json'), JSON.stringify(report, null, 2), 'utf8');

console.table(report.map((item) => ({
  slug: item.slug,
  status: item.status,
  responseLength: item.responseLength,
  imageCount: item.imageCount
})));

for (const item of report) {
  console.log(`\n${item.hotelName}`);
  for (const image of item.images.slice(0, 8)) {
    console.log(`- ${image}`);
  }
}

function extractAgodaImages(value) {
  const text = String(value || '')
    .replace(/\\u002F/g, '/')
    .replace(/\\\//g, '/')
    .replace(/&amp;/g, '&');
  const urls = new Set();
  const patterns = [
    /https?:\/\/pix\d+\.agoda\.net\/hotelImages\/[^"'<>\\\s)]+/gi,
    /\/\/pix\d+\.agoda\.net\/hotelImages\/[^"'<>\\\s)]+/gi
  ];

  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      let url = match[0];
      if (url.startsWith('//')) url = `https:${url}`;
      if (/\.(jpg|jpeg|png|webp)(\?|$)/i.test(url)) urls.add(url);
    }
  }
  return [...urls];
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
