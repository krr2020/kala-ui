import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// jsdom window-global redefinitions (window.location etc.) are non-configurable under `pool: 'vmThreads'` — run those files in the default pool
const DEFAULT_POOL_TESTS = ['src/showcase/design-system/component-preview-card.test.tsx'];

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
