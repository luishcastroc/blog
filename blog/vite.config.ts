/// <reference types="vitest" />

import analog from '@analogjs/platform';
import * as path from 'path';
import * as fs from 'fs';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

function getFilenamesSync(directoryPath: string): string[] {
  // Normalize the directory path
  const normalizedPath = path.resolve(directoryPath);

  try {
    const files = fs.readdirSync(normalizedPath);
    //remove the date at the beginning which is formatted as YYYY-MM-DD and the .md extension
    files.forEach((file, index) => {
      files[index] = `/blog/${file.slice(11, -3)}`;
    });
    return files;
  } catch (error) {
    console.error(`Error reading directory: ${(error as Error).message}`);
    return [];
  }
}

const files = getFilenamesSync('./blog/src/content');

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    publicDir: 'src/public',

    build: {
      target: ['es2020'],
    },
    plugins: [
      analog({
        nitro: {
          externals: {
            inline: ['zone.js/node'],
            external: ['node-fetch-native/dist/polyfill', 'destr'],
          },
        },

        static: true,
        prerender: {
          routes: async () => {
            return ['/', '/blog', '/about', '/home', ...files];
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
