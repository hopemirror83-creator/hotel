import { readFile, writeFile } from 'node:fs/promises';

const targets = JSON.parse(await readFile('data/target-hotels-hochiminh-v1-quality.json', 'utf8'));
const replacement = targets.filter((hotel) => hotel.slug === 'hochiminh-407407');
await writeFile('data/target-hotels-hochiminh-v1-replacement.json', `${JSON.stringify(replacement, null, 2)}\n`);
console.log(replacement);
