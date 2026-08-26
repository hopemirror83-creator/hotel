import { readFile, writeFile } from 'node:fs/promises';

const reports = JSON.parse(await readFile('data/generated/generation-report.json', 'utf8'));
const retrySlugs = reports
  .filter((report) => report.status !== 'ready')
  .map((report) => report.slug)
  .filter((slug) => slug?.startsWith('hochiminh-'));

await writeFile('data/target-slugs-hochiminh-v1-retry.json', `${JSON.stringify(retrySlugs, null, 2)}\n`);
console.log({ total: reports.length, retry: retrySlugs.length, retrySlugs });
