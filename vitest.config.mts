import { configDefaults, defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    environment: 'happy-dom',
    setupFiles: 'test/vitest/setup-file.ts',

    include: [
      // Matches vitest tests in any subfolder of 'src' or into 'test/vitest/__tests__'
      // Matches all files with extension 'js', 'jsx', 'ts' and 'tsx'
      'src/**/*.vitest.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
    coverage: {
      provider: 'istanbul',
      exclude: [
        ...configDefaults.exclude,
        'postcss.config.cjs',
        '.eslintrc.cjs',
        'quasar.config.js',
        '.quasar/**',
        'src/boot/**',
        'src/App.vue',
        'src/constants',
        'src/router',
      ],
    },
  },
  plugins: [
    vue({
      template: { transformAssetUrls },
    }) as Plugin,
    quasar({
      sassVariables: 'src/quasar-variables.scss',
    }) as Plugin,
    tsconfigPaths() as Plugin,
  ],
});
