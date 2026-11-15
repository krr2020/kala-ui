import { defineConfig } from 'vitest/config';

// matchMedia-stubbing tests can't redefine the jsdom global under `pool: 'vmThreads'` — run those in the default pool
const DEFAULT_POOL_TESTS = [
	'src/__tests__/use-color-scheme.test.ts',
	'src/__tests__/use-reduced-motion.test.ts',
];

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['**/*.test.ts', '**/*.test.tsx', '**/dist/**', '**/node_modules/**'],
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
