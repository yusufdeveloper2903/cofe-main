// @ts-check
import { fileURLToPath } from 'node:url';
import { defineConfig, fontProviders } from 'astro/config';

const stylesDir = fileURLToPath(new URL('./src/styles', import.meta.url));

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: 'https://coffeeroasters.example.com',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  prefetch: {
    prefetchAll: true,
  },
  fonts: [
    {
      name: 'Fraunces',
      cssVariable: '--font-fraunces',
      provider: fontProviders.fontsource(),
      weights: [900],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['serif'],
    },
    {
      name: 'Barlow',
      cssVariable: '--font-barlow',
      provider: fontProviders.fontsource(),
      weights: [400, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          loadPaths: [stylesDir],
          // Design tokens & mixins are available in every component <style lang="scss">.
          additionalData: '@use "abstracts" as *;\n',
        },
      },
    },
  },
});
