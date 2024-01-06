/// <reference types="vitest" />

import analog from '@analogjs/platform';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import * as fs from 'fs';

const getPostRoutes = (language: string) => {
  const posts = fs.readdirSync(`./blog/src/content/${language}`);
  return posts.map(
    post =>
      `/blog/${post.replace('.md', '').replace(/^\d{4}-\d{2}-\d{2}-/, '')}`
  );
};

const postRoutes = {
  en: getPostRoutes('en'),
  es: getPostRoutes('es'),
};
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    publicDir: 'src/public',
    build: {
      target: ['es2020'],
    },
    plugins: [
      analog({
        prerender: {
          routes: [
            '/',
            '/home',
            '/about',
            '/contact',
            ...postRoutes.en,
            ...postRoutes.es,
          ],
          sitemap: {
            host: 'https://mrrobot.dev',
          },
        },
        nitro: {
          preset: 'vercel',
          serveStatic: false,
          externals: { inline: ['zone.js/node', 'tslib'] },
        },
      }),
      tsconfigPaths(),
      splitVendorChunkPlugin(),
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/test-setup.ts'],
      include: ['**/*.spec.ts'],
      cache: {
        dir: `../node_modules/.vitest`,
      },
    },
    define: {
      'import.meta.vitest': mode !== 'production',
    },
  };
});
