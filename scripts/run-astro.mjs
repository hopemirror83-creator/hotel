import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const findAstroCli = () => {
  let current = process.cwd();
  while (true) {
    const modernCli = path.join(current, 'node_modules', 'astro', 'bin', 'astro.mjs');
    const legacyCli = path.join(current, 'node_modules', 'astro', 'astro.js');
    if (existsSync(modernCli)) return modernCli;
    if (existsSync(legacyCli)) return legacyCli;
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return 'astro';
};

const astroCli = findAstroCli();
const maxOldSpaceSize = process.env.ASTRO_MAX_OLD_SPACE_SIZE || '6144';

const child = spawn(process.execPath, ['--max-old-space-size=' + maxOldSpaceSize, astroCli, ...args], {
  stdio: 'inherit',
  env: {
    ...process.env,
    ASTRO_CONFIG_DIR: path.join(process.cwd(), '.astro-config'),
    ASTRO_TELEMETRY_DISABLED: '1',
    ASTRO_TELEMETRY_OPTOUT: '1',
    XDG_CONFIG_HOME: path.join(process.cwd(), '.config')
  }
});

child.on('error', (error) => {
  console.error(error);
  process.exit(1);
});

child.on('close', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 0);
});
