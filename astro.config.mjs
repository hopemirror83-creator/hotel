import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://hotel.product-pack.com',
  outDir: process.env.ASTRO_OUT_DIR || './dist'
});
