import { readFile } from 'node:fs/promises';

const content = JSON.parse(await readFile('data/multilingual-myeongdong-content.json', 'utf8'));
for (const slug of ['jeju-567545', 'jeju-18209350', 'jeju-31451473', 'jeju-42957', 'jeju-18875336', 'jeju-1199068', 'jeju-178625', 'jeju-302120']) {
  scan(content[slug]?.ja, slug);
}

function scan(value, path) {
  if (typeof value === 'string' && /[가-힣]/.test(value)) console.log(`${path}: ${value}`);
  else if (Array.isArray(value)) value.forEach((item, index) => scan(item, `${path}[${index}]`));
  else if (value && typeof value === 'object') Object.entries(value).forEach(([key, item]) => scan(item, `${path}.${key}`));
}
