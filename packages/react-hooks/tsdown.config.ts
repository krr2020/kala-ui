import { defineConfig } from 'tsdown';

export default defineConfig({
	entry: ['src/index.ts', 'src/portable.ts'],
	format: ['cjs', 'esm'],
	dts: true,
	sourcemap: false,
	clean: true,
	// Hooks are client-only: lets React Server Component apps import them
	// without a manual "use client" boundary.
	banner: '"use client";',
	external: ['react', 'react-dom'],
});
