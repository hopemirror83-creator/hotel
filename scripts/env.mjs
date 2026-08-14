import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

export function loadEnv() {
  const envPath = path.join(process.cwd(), '.env');
  if (!existsSync(envPath)) return process.env;

  const body = readFileSync(envPath, 'utf8');
  for (const line of body.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const index = trimmed.indexOf('=');
    if (index < 0) continue;

    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
  return process.env;
}

export function requireAnyEnv(groups) {
  const env = loadEnv();
  const missing = [];
  for (const group of groups) {
    if (!group.some((key) => env[key])) missing.push(group.join(' or '));
  }
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  return env;
}

export function getAgodaCredentials() {
  const env = loadEnv();
  let siteId = env.AGODA_SITE_ID;
  let apiKey = env.AGODA_API_KEY;
  const affiliateKey = env.AGODA_AFFILIATE_KEY;

  if ((!siteId || !apiKey) && affiliateKey?.includes(':')) {
    const [keySiteId, keyApiKey] = affiliateKey.split(':');
    siteId ||= keySiteId;
    apiKey ||= keyApiKey;
  }

  if (!siteId || !apiKey) {
    throw new Error('AGODA_AFFILIATE_KEY or both AGODA_SITE_ID and AGODA_API_KEY are required.');
  }

  return { siteId, apiKey };
}
