import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
    site: 'https://calhan-energies.com',
  integrations: [sitemap()],
});
