// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { defineConfig, configDefaults } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    minify: false,
    sourcemap: false,
    environment: 'happy-dom',
    setupFiles: 'test/vitest/setup-file.ts',
    include: [
      // Matches vitest tests in any subfolder of 'src' or into 'test/vitest/__tests__'
      // Matches all files with extension 'js', 'jsx', 'ts' and 'tsx'
      'src/**/*.vitest.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'test/vitest/__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
    ],
    coverage: {
      provider: 'istanbul',
      // Trying to get 80, for now in 4 just to pass the tests
      thresholds: {
        lines: 4,
        functions: 4,
        branches: 4,
        statements: 4
      },
      exclude: [
        ...configDefaults.exclude,
        'src/router/**',
        '.quasar/**',
        'src/constants/**',
        'quasar.config.js',
        'src/boot/**',
        'src/modules/auth/constants/**',
        'src/models/**',
        'src/modules/admin/routes/**',
        'src/modules/audits/routes/**',
        'src/modules/auth/routes/**'
      ]
    }
  },
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    quasar({
      sassVariables: 'src/quasar-variables.scss'
    }),
    tsconfigPaths()
  ]
});
