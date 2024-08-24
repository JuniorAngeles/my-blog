import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://my-blog-730.pages.dev/',
  vite: {
    server: {
      watch: {
        usePolling: true,
      },
    },
  },
  integrations: [mdx(), sitemap()],
});
