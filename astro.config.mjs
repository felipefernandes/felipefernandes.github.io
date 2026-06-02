import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://felipefernandes.github.io',
  base: '/',
  output: 'static',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
  ],
  i18n: {
    defaultLocale: 'pt',
    locales: ['pt', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  // Redirects para posts antigos do Jekyll
  redirects: {
    '/jekyll/update/2014/08/03/reencontro-animado/': '/arquivo/blog/reencontro-animado',
    '/css/frontend/development/2014/08/05/css-efeito-marcatexto/': '/arquivo/blog/css-efeito-marcatexto',
    '/photoshop/tutorial/2015/11/11/Os-06-passos-para-comecar-no-photoshop/': '/arquivo/blog/os-06-passos-photoshop',
  },
});
