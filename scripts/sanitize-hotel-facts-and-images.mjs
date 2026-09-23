import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const sourcePath = path.join(root, 'src', 'data', 'generatedHotels.ts');
const apply = process.argv.includes('--apply');
const source = await readFile(sourcePath, 'utf8');
const match = source.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
if (!match) throw new Error('Could not parse generatedHotels.ts');

const hotels = JSON.parse(match[1]);
const report = {
  scanned: hotels.length,
  legacyFieldsRemoved: 0,
  wifiClaimsNeutralized: 0,
  breakfastClaimsNeutralized: 0,
  unverifiedHeroImagesRemoved: 0,
  unverifiedSectionImagesRemoved: 0,
  hotelsWithNoVerifiedImage: 0,
  samples: []
};

for (const hotel of hotels) {
  migrateRateFields(hotel);
  sanitizeAnalysis(hotel);
  sanitizeImages(hotel);
}

report.hotelsWithNoVerifiedImage = hotels.filter((hotel) => (
  !hotel.imageUrl && !(hotel.analysis?.blogReview?.sections || []).some((section) => section.image?.url)
)).length;

const auditDir = path.join(root, 'data', 'audits');
await mkdir(auditDir, { recursive: true });
await writeFile(
  path.join(auditDir, 'hotel-fact-image-safety-report.json'),
  `${JSON.stringify(report, null, 2)}\n`,
  'utf8'
);

if (apply) {
  await writeFile(
    sourcePath,
    `// @ts-nocheck\nexport const generatedHotels: any[] = ${JSON.stringify(hotels, null, 2)};\n`,
    'utf8'
  );
}

console.log(JSON.stringify({ mode: apply ? 'apply' : 'audit', ...report }, null, 2));

function migrateRateFields(hotel) {
  if (Object.hasOwn(hotel, 'includeBreakfast')) {
    hotel.breakfastIncludedInRate = hotel.includeBreakfast === true ? true : 'unknown';
    delete hotel.includeBreakfast;
    report.legacyFieldsRemoved += 1;
  } else if (hotel.breakfastIncludedInRate == null) {
    hotel.breakfastIncludedInRate = 'unknown';
  }

  if (Object.hasOwn(hotel, 'freeWifi')) {
    hotel.wifiIncludedInRate = hotel.freeWifi === true ? true : 'unknown';
    delete hotel.freeWifi;
    report.legacyFieldsRemoved += 1;
  } else if (hotel.wifiIncludedInRate == null) {
    hotel.wifiIncludedInRate = 'unknown';
  }
}

function sanitizeAnalysis(hotel) {
  if (!hotel.analysis) return;

  if (Array.isArray(hotel.analysis.cons)) {
    hotel.analysis.cons = hotel.analysis.cons.filter((item) => {
      const kind = unsafeClaimKind(item);
      if (!kind) return true;
      incrementClaim(kind, hotel, item);
      return false;
    });
  }

  hotel.analysis = walk(hotel.analysis, (value, key) => {
    const kind = unsafeClaimKind(value);
    if (!kind) return value;
    incrementClaim(kind, hotel, value);
    if (key === 'question') {
      if (kind === 'both') return '조식 조건과 Wi-Fi 이용 조건은 어떻게 확인하나요?';
      if (kind === 'breakfast') return '조식 운영 및 객실 요금 포함 여부는 어떻게 확인하나요?';
      return 'Wi-Fi 제공 범위와 이용 조건은 어떻게 확인하나요?';
    }
    if (kind === 'both') return '조식 포함 여부와 Wi-Fi 이용 조건은 예약 플랜 또는 숙소에 최신 정보를 확인하세요.';
    if (kind === 'breakfast') return '조식 운영 및 객실 요금 포함 여부는 예약 플랜 또는 숙소에 최신 정보를 확인하세요.';
    return 'Wi-Fi 제공 범위와 이용 조건은 예약 화면 또는 숙소에 최신 정보를 확인하세요.';
  });
}

function walk(value, transform, key = '') {
  if (typeof value === 'string') return transform(value, key);
  if (Array.isArray(value)) {
    const next = value.map((item) => walk(item, transform, key));
    return [...new Set(next.map((item) => JSON.stringify(item)))].map((item) => JSON.parse(item));
  }
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).map(([childKey, child]) => [
    childKey,
    walk(child, transform, childKey)
  ]));
}

function unsafeClaimKind(value) {
  const text = String(value || '');
  const negative = '(?:미제공|제공되지|제공하지|지원하지|미포함|포함되지|없(?:습니다|음|다)?|이용할 수 없|불가)';
  const wifiTerm = '(?:무료\\s*)?(?:와이파이|와이파이\\s*서비스|Wi[- ]?Fi)';
  const breakfastTerm = '(?:조식|아침\\s*식사|breakfast)';
  const wifi = new RegExp(`(?:${wifiTerm}.{0,40}${negative}|${negative}.{0,40}${wifiTerm})`, 'i').test(text);
  const breakfast = new RegExp(`(?:${breakfastTerm}.{0,40}${negative}|${negative}.{0,40}${breakfastTerm})`, 'i').test(text);
  if (wifi && breakfast) return 'both';
  if (wifi) return 'wifi';
  if (breakfast) return 'breakfast';
  return '';
}

function incrementClaim(kind, hotel, value) {
  if (kind === 'wifi' || kind === 'both') report.wifiClaimsNeutralized += 1;
  if (kind === 'breakfast' || kind === 'both') report.breakfastClaimsNeutralized += 1;
  if (report.samples.length < 30) report.samples.push({ slug: hotel.slug, kind, value });
}

function sanitizeImages(hotel) {
  const hotelId = getHotelId(hotel);
  if (hotel.imageUrl && !isVerifiedAgodaImage(hotel.imageUrl, hotelId)) {
    hotel.imageUrl = '';
    report.unverifiedHeroImagesRemoved += 1;
  }

  for (const section of hotel.analysis?.blogReview?.sections || []) {
    if (section.image?.url && !isVerifiedAgodaImage(section.image.url, hotelId)) {
      delete section.image;
      report.unverifiedSectionImagesRemoved += 1;
    }
  }

  if (!hotel.imageUrl) {
    const verified = (hotel.analysis?.blogReview?.sections || [])
      .map((section) => section.image?.url)
      .find(Boolean);
    if (verified) hotel.imageUrl = verified;
  }
}

function getHotelId(hotel) {
  try {
    return new URL(hotel.landingUrl).searchParams.get('hid') || '';
  } catch {
    return '';
  }
}

function isVerifiedAgodaImage(value, hotelId) {
  if (!hotelId) return false;
  try {
    const url = new URL(String(value));
    if (!/^pix\d+\.agoda\.net$/i.test(url.hostname)) return false;
    const segments = url.pathname.split('/').filter(Boolean);
    const marker = segments.findIndex((segment) => segment.toLowerCase() === 'hotelimages');
    return marker >= 0 && segments.slice(marker + 1).includes(String(hotelId));
  } catch {
    return false;
  }
}
