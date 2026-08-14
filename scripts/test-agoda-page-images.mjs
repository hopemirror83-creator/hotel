import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { generatedHotels } from '../src/data/generatedHotels.ts';

const ROOT = process.cwd();
const outDir = path.join(ROOT, 'data', 'generated');
const report = [];

await mkdir(outDir, { recursive: true });

for (const hotel of generatedHotels) {
  console.log(`Testing Agoda page images for ${hotel.hotelName}`);
  const pages = [hotel.landingUrl, ...buildDirectUrlCandidates(hotel)];
  const testedPages = [];
  const allImages = [];

  for (const pageUrl of pages) {
    const page = await fetchAgodaPage(pageUrl);
    const pageImages = extractAgodaImages(page.html, hotel);
    testedPages.push({
      inputUrl: pageUrl,
      finalUrl: page.finalUrl,
      status: page.status,
      htmlLength: page.html.length,
      hotelIdCount: count(page.html, extractHotelId(hotel.landingUrl)),
      hotelImagesCount: count(page.html, 'hotelImages'),
      pixCount: count(page.html, 'pix'),
      galleryCount: count(page.html, 'gallery') + count(page.html, 'Gallery'),
      photoCount: count(page.html, 'photo') + count(page.html, 'Photo'),
      imageCount: pageImages.length
    });
    allImages.push(...pageImages);
    await sleep(250);
  }

  const images = uniqueImages(allImages)
    .filter((image) => image.url !== hotel.imageUrl)
    .slice(0, 24);

  report.push({
    slug: hotel.slug,
    hotelName: hotel.hotelName,
    landingUrl: hotel.landingUrl,
    testedPages,
    finalUrl: testedPages[0]?.finalUrl,
    status: testedPages[0]?.status,
    htmlLength: testedPages[0]?.htmlLength,
    agodaImageCount: images.length,
    currentApiImage: hotel.imageUrl,
    images
  });

  await sleep(400);
}

await writeFile(path.join(outDir, 'agoda-page-image-test.json'), JSON.stringify(report, null, 2), 'utf8');

console.table(report.map((item) => ({
  slug: item.slug,
  status: item.status,
  htmlLength: item.htmlLength,
  agodaImageCount: item.agodaImageCount
})));

for (const item of report) {
  console.log(`\n${item.hotelName}`);
  console.log(`Final URL: ${item.finalUrl}`);
  for (const image of item.images.slice(0, 8)) {
    console.log(`- ${image.url}`);
  }
}

function buildDirectUrlCandidates(hotel) {
  const hid = extractHotelId(hotel.landingUrl);
  const slug = hotel.slug.replace(/-airport$/, '-airport-hotel-suites');
  return [
    `https://www.agoda.com/ko-kr/${hotel.slug}/hotel/incheon-kr.html?cid=1927566&hid=${hid}`,
    `https://www.agoda.com/${hotel.slug}/hotel/incheon-kr.html?cid=1927566&hid=${hid}`,
    `https://www.agoda.com/ko-kr/${slug}/hotel/incheon-kr.html?cid=1927566&hid=${hid}`,
    `https://www.agoda.com/${slug}/hotel/incheon-kr.html?cid=1927566&hid=${hid}`
  ].filter((url, index, list) => list.indexOf(url) === index);
}

function extractHotelId(url) {
  return new URL(url).searchParams.get('hid') || '';
}

function uniqueImages(images) {
  const seen = new Set();
  const result = [];
  for (const image of images) {
    if (seen.has(image.url)) continue;
    seen.add(image.url);
    result.push(image);
  }
  return result;
}

function count(text, value) {
  if (!value) return 0;
  return text.split(value).length - 1;
}

async function fetchAgodaPage(url) {
  const response = await fetch(url, {
    redirect: 'follow',
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'accept-language': 'ko-KR,ko;q=0.9,en;q=0.8'
    },
    signal: AbortSignal.timeout(45000)
  });
  return {
    status: response.status,
    finalUrl: response.url,
    html: await response.text()
  };
}

function extractAgodaImages(html, hotel) {
  const urls = new Set();
  const text = html
    .replace(/\\u002F/g, '/')
    .replace(/\\\//g, '/')
    .replace(/&amp;/g, '&');

  const patterns = [
    /https?:\/\/pix\d+\.agoda\.net\/hotelImages\/[^"'<>\\\s)]+/gi,
    /\/\/pix\d+\.agoda\.net\/hotelImages\/[^"'<>\\\s)]+/gi,
    /https?:\/\/[^"'<>\\\s)]+agoda[^"'<>\\\s)]*\.(?:jpg|jpeg|png|webp)[^"'<>\\\s)]*/gi
  ];

  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      urls.add(normalizeUrl(match[0]));
    }
  }

  return [...urls]
    .map((url) => ({
      url,
      family: imageFamily(url),
      hotelIdMatch: url.includes(`/hotelImages/${extractHotelImageId(hotel.imageUrl)}/`)
    }))
    .filter((image) => isUsefulAgodaImage(image.url))
    .sort((a, b) => Number(b.hotelIdMatch) - Number(a.hotelIdMatch));
}

function normalizeUrl(value) {
  let url = String(value || '').trim();
  if (url.startsWith('//')) url = `https:${url}`;
  return url.replace(/\\+/g, '');
}

function extractHotelImageId(url) {
  return String(url || '').match(/hotelImages\/([^/]+)/)?.[1] || '';
}

function imageFamily(url) {
  return String(url).match(/hotelImages\/([^/]+\/[^/]+)/)?.[1] || '';
}

function isUsefulAgodaImage(url) {
  if (!/^https?:\/\/pix\d+\.agoda\.net\/hotelImages\//i.test(url)) return false;
  if (/\.(gif|svg)(\?|$)/i.test(url)) return false;
  if (/\/0x0\//i.test(url)) return false;
  return /\.(jpg|jpeg|png|webp)(\?|$)/i.test(url);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
