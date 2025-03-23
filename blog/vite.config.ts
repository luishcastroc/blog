/// <reference types="vitest" />
import analog from '@analogjs/platform';
import { defineConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
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

export default defineConfig(({ mode }) => {
  return {
    ssr: {
      optimizeDeps: { include: ['@ngxpert/hot-toast'] },
    },
    root: __dirname,
    publicDir: 'src/public',
    build: {
      outDir: '../dist/blog/client',
      reportCompressedSize: true,
      commonjsOptions: { transformMixedEsModules: true },
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
        content: {
          prismOptions: {
            additionalLangs: ['go', 'markdown', 'sql', 'clike', 'csharp'],
          },
        },
      }),
      nxViteTsPaths(),
    ],
    test: {
      reporters: ['default'],
      coverage: {
        reportsDirectory: '../coverage/blog',
        provider: 'v8',
      },
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
    server: {
      fs: {
        allow: ['.'],
      },
    },
  };
});
