/// <reference types="vitest" />

import analog from '@analogjs/platform';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import * as fs from 'fs';

const posts = fs.readdirSync('./blog/src/content');
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    publicDir: 'src/public',

    build: {
      target: ['es2020'],
    },
    plugins: [
      analog({
        static: true,
        prerender: {
          routes: [
            '/home',
            '/blog',
            '/about',
            '/contact',
            ...posts.map(
              post =>
                `/blog/posts/${post
                  .replace('.md', '')
                  .replace(/^\d{4}-\d{2}-\d{2}-/, '')}`
            ),
          ],
        },
        nitro: {
          externals: {
            inline: ['zone.js/node', 'tslib'],
            external: ['node-fetch-native/dist/polyfill', 'destr'],
          },
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
