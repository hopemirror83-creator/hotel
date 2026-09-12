import { readFile, writeFile } from 'node:fs/promises';

for (const file of ['data/candidates-phuket-v1-all.json', 'data/target-hotels-phuket-v1-quality.json', 'data/target-hotels-phuket-v1-generated.json']) {
  const hotels = JSON.parse(await readFile(file, 'utf8'));
  let changed = 0;
  for (const hotel of hotels) {
    if (hotel.slug?.startsWith('phuket-') && hotel.region === '베트남 푸껫') {
      hotel.region = '태국 푸껫';
      changed++;
    }
  }
  await writeFile(file, JSON.stringify(hotels, null, 2) + '\n');
  console.log(file, changed);
}
