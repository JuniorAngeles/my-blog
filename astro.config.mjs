import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.juniorangeles.tech/',
  vite: {
    server: {
      watch: {
        usePolling: true,
      },
    },
  },
  integrations: [mdx(), sitemap()],
});
