// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// URL real de produccion (Vercel). El sitemap, las URLs canonicas, las
// hreflang y los og:url dependen de este valor.
const SITE_URL = 'https://portafolio-web-nine-bay.vercel.app';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  output: 'server',
  integrations: [react(), sitemap()],
  adapter: vercel(),
  i18n: {
    locales: ['es', 'ca', 'en'],
    defaultLocale: 'es',
    routing: {
      prefixDefaultLocale: false
    }
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
