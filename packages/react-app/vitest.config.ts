import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// SSR tests stub window/document to undefined — non-redefinable under `pool: 'vmThreads'` — so they run in the default pool
const DEFAULT_POOL_TESTS = [
	'src/components/charts/chart.test.tsx',
	'src/components/charts/theme-utils.test.ts',
	'src/components/user-menu-dropdown/user-menu-dropdown.test.tsx',
];

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/*.config.ts',
        '**/*.config.js',
        '**/index.ts',
        '**/__tests__/**',
      ],
    },
    projects: [
      {
        test: {
          name: 'vm',
          environment: 'jsdom',
          pool: 'vmThreads',
          include: ['src/**/*.test.{ts,tsx}'],
          exclude: [
            '**/node_modules/**',
            ...DEFAULT_POOL_TESTS,
          ],
        },
      },
      {
        test: {
          name: 'isolated-dom-globals',
          environment: 'jsdom',
          include: DEFAULT_POOL_TESTS,
        },
      },
    ],
  },
});
