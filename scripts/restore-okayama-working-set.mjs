import { readFile, writeFile } from 'node:fs/promises';

const hotels = JSON.parse(await readFile('data/target-hotels-okayama-v1-generated.json', 'utf8'));
await writeFile('src/data/generatedHotels.ts', `// @ts-nocheck\nexport const generatedHotels: any[] = ${JSON.stringify(hotels, null, 2)};\n`);
console.log(`Restored ${hotels.length} Okayama hotels to the working module`);




