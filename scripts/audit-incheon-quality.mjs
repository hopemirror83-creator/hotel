import { mkdir, readFile, writeFile } from 'node:fs/promises';

const apply = process.argv.includes('--apply');
const sourcePath = 'src/data/generatedHotels.ts';
const source = await readFile(sourcePath, 'utf8');
const match = source.match(/export const generatedHotels(?:\s*:\s*any\[\])?\s*=\s*([\s\S]*);\s*$/);
if (!match) throw new Error('Could not parse generatedHotels.ts');

const hotels = JSON.parse(match[1]);
const incheon = hotels.filter((hotel) => String(hotel.slug || '').startsWith('incheon-'));
const outOfRegion = incheon.filter((hotel) => !/(인천|Incheon)/i.test(String(hotel.address || '')));
const outOfRegionSlugs = new Set(outOfRegion.map((hotel) => hotel.slug));
const report = {
  scanned: incheon.length,
  quarantined: outOfRegion.map(pickIdentity),
  referenceLinksRemoved: 0,
  hotelsWithReferenceLinksRemoved: 0,
  facilityClaimsNeutralized: { breakfast: 0, wifi: 0, parking: 0 },
  thinPages: [],
  missingVerifiedHero: [],
  samples: []
};

for (const hotel of incheon) {
  if (outOfRegionSlugs.has(hotel.slug)) continue;
  sanitizeReferenceLinks(hotel);
  sanitizeFacilityClaims(hotel);
  const bodyLength = (hotel.analysis?.blogReview?.sections || [])
    .flatMap((section) => section.paragraphs || [])
    .reduce((sum, paragraph) => sum + String(paragraph || '').length, 0);
  if (bodyLength < 700) report.thinPages.push({ ...pickIdentity(hotel), bodyLength });
  if (!hotel.imageUrl) report.missingVerifiedHero.push(pickIdentity(hotel));
}

const nextHotels = hotels.filter((hotel) => !outOfRegionSlugs.has(hotel.slug));
await mkdir('data/audits', { recursive: true });
await writeFile(
  'data/audits/incheon-quality-audit-2026-09-23.json',
  `${JSON.stringify(report, null, 2)}\n`,
  'utf8'
);
await writeFile(
  'data/audits/incheon-quarantine-slugs-2026-09-23.json',
  `${JSON.stringify([...outOfRegionSlugs], null, 2)}\n`,
  'utf8'
);
await writeFile(
  'data/audits/incheon-missing-image-slugs-2026-09-23.json',
  `${JSON.stringify(report.missingVerifiedHero.map((hotel) => hotel.slug), null, 2)}\n`,
  'utf8'
);

if (apply) {
  await writeFile(
    sourcePath,
    `// @ts-nocheck\nexport const generatedHotels: any[] = ${JSON.stringify(nextHotels, null, 2)};\n`,
    'utf8'
  );
}

console.log(JSON.stringify({ mode: apply ? 'apply' : 'audit', ...report }, null, 2));

function pickIdentity(hotel) {
  return { slug: hotel.slug, hotelName: hotel.hotelName, address: hotel.address };
}

function sanitizeReferenceLinks(hotel) {
  const before = Array.isArray(hotel.referenceLinks) ? hotel.referenceLinks : [];
  if (!before.length) return;
  const after = before.filter((link) => isRelevantReference(hotel, link));
  const removed = before.length - after.length;
  if (!removed) return;
  report.referenceLinksRemoved += removed;
  report.hotelsWithReferenceLinksRemoved += 1;
  if (report.samples.length < 40) {
    report.samples.push({
      slug: hotel.slug,
      kind: 'reference',
      removed: before.filter((link) => !after.includes(link)).map((link) => link.title)
    });
  }
  if (after.length) hotel.referenceLinks = after;
  else delete hotel.referenceLinks;
}

function isRelevantReference(hotel, link) {
  const title = normalize(link.title);
  if (!title) return false;
  const name = normalize(hotel.hotelName);
  const locationTokens = getLocationTokens(hotel);
  const distinctive = getDistinctiveNameTokens(hotel.hotelName);

  const exactName = name.length >= 5 && title.includes(name);
  const tokenHits = distinctive.filter((token) => title.includes(token));
  const nameMatch = exactName || tokenHits.length >= Math.min(2, distinctive.length) || (
    distinctive.length === 1 && tokenHits.length === 1
  );
  if (!nameMatch) return false;

  // 동명 숙소 오염을 막기 위해 이름이나 주소에 지역 단서가 있으면 제목에도 하나는 요구한다.
  if (locationTokens.length && !locationTokens.some((token) => title.includes(token))) return false;
  return true;
}

function getDistinctiveNameTokens(value) {
  const ignored = new Set([
    '인천', '호텔', '모텔', '펜션', '리조트', '게스트하우스', '스테이', '인천공항',
    '강화도', '영종도', '을왕리', '송도', '부평', '주안', '구월동', '간석동', '소래포구',
    '점', '더', 'the', 'hotel', 'resort', 'pension', 'guesthouse'
  ]);
  return [...new Set(String(value || '')
    .toLowerCase()
    .replace(/[()（）]/g, ' ')
    .split(/[^0-9a-z가-힣]+/)
    .map(normalize)
    .filter((token) => token.length >= 2 && !ignored.has(token)))];
}

function getLocationTokens(hotel) {
  const source = `${hotel.hotelName || ''} ${hotel.address || ''}`;
  const candidates = [
    '강화도', '강화', '영종도', '영종', '을왕리', '송도', '부평', '주안', '구월동', '간석동',
    '소래포구', '연안부두', '월미도', '운서', '검단', '계양', '청라', '옹진', '선재도', '영흥도'
  ];
  return candidates.filter((token) => source.includes(token)).map(normalize);
}

function sanitizeFacilityClaims(hotel) {
  if (!hotel.analysis) return;
  hotel.analysis = walk(hotel.analysis, (value, key) => neutralizeFacilityText(hotel, value, key));
}

function neutralizeFacilityText(hotel, value, key) {
  const text = String(value || '');
  const sentences = text.split(/(?<=[.!?])\s+/);
  let changed = false;
  const next = sentences.map((sentence) => {
    const kind = facilityClaimKind(sentence);
    if (!kind) return sentence;
    changed = true;
    report.facilityClaimsNeutralized[kind] += 1;
    if (report.samples.length < 40) report.samples.push({ slug: hotel.slug, kind, value: sentence });
    return key === 'question' ? neutralQuestion(kind) : neutralStatement(kind);
  });
  return changed ? [...new Set(next)].join(' ') : text;
}

function facilityClaimKind(value) {
  const text = String(value || '');
  const assertion = /(무료|제공|운영|포함|불포함|미포함|가능|불가|없(?:음|습니다|다)?|협소|만차|유료|요금)/i;
  if (!assertion.test(text)) return '';
  if (/(조식|아침\s*식사|breakfast)/i.test(text)) return 'breakfast';
  if (/(와이파이|Wi[- ]?Fi)/i.test(text)) return 'wifi';
  if (/(주차|parking)/i.test(text)) return 'parking';
  return '';
}

function neutralQuestion(kind) {
  if (kind === 'breakfast') return '조식 운영 여부와 예약 플랜 포함 조건은 어떻게 확인하나요?';
  if (kind === 'wifi') return 'Wi-Fi 제공 범위와 이용 조건은 어떻게 확인하나요?';
  return '주차 가능 여부와 이용 조건은 어떻게 확인하나요?';
}

function neutralStatement(kind) {
  if (kind === 'breakfast') return '조식 운영 여부와 예약 플랜 포함 조건은 예약 화면 또는 숙소의 최신 안내를 확인하세요.';
  if (kind === 'wifi') return 'Wi-Fi 제공 범위와 이용 조건은 예약 화면 또는 숙소의 최신 안내를 확인하세요.';
  return '주차 가능 여부와 이용 조건은 예약 화면 또는 숙소의 최신 안내를 확인하세요.';
}

function walk(value, transform, key = '') {
  if (typeof value === 'string') return transform(value, key);
  if (Array.isArray(value)) return unique(value.map((item) => walk(item, transform, key)));
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).map(([childKey, child]) => [
    childKey,
    walk(child, transform, childKey)
  ]));
}

function unique(values) {
  return [...new Map(values.map((value) => [JSON.stringify(value), value])).values()];
}

function normalize(value) {
  return String(value || '')
    .replace(/<[^>]+>/g, '')
    .replace(/&(?:quot|amp|lt|gt);/g, ' ')
    .toLowerCase()
    .replace(/[^0-9a-z가-힣]/g, '');
}
