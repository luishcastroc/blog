/// <reference types="vitest" />

import analog from '@analogjs/platform';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import * as fs from 'fs';

const posts = fs.readdirSync('./blog/src/content');
const postRoutes = posts.map(
  post => `/blog/${post.replace('.md', '').replace(/^\d{4}-\d{2}-\d{2}-/, '')}`
);
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
          routes: ['/', '/home', '/blog', '/about', '/contact', ...postRoutes],
          sitemap: {
            host: 'https://mrrobot.dev',
          },
        },
        nitro: {
          preset: 'vercel',
          serveStatic: false,
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
