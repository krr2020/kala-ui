import { defineConfig } from 'tsup';

// Get all component directories
import { readdirSync, existsSync } from 'fs';
import { join } from 'path';

const componentsDir = 'src/components';
const entries: Record<string, string> = {
  index: 'src/index.ts',
};

// Auto-discover component entry points
const componentDirs = readdirSync(componentsDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

for (const dir of componentDirs) {
  const indexPath = join(componentsDir, dir, 'index.ts');
  if (existsSync(indexPath)) {
    entries[`components/${dir}`] = indexPath;
  }
}

// Add lib/utils
entries['components/lib/utils'] = 'src/lib/utils.ts';

// Add config/tailwind-base
if (existsSync('src/config/tailwind-base.ts')) {
  entries['config/tailwind-base'] = 'src/config/tailwind-base.ts';
}

export default defineConfig({
  entry: entries,
  format: ['esm'],
  dts: false,  // Disable DTS - use tsc --emitDeclarationOnly separately
  external: [
    'react',
    'react-dom',
    '@radix-ui/*',
    'class-variance-authority',
    'clsx',
    'tailwind-merge',
    'framer-motion',
    'lucide-react',
    '@dnd-kit/*',
    'cmdk',
    'date-fns',
    'input-otp',
    'react-day-picker',
    'react-resizable-panels',
    'simple-icons',
    'sonner',
    'vaul',
    'apexcharts',
    'react-apexcharts',
  ],
  clean: true,
  splitting: false,
  sourcemap: true,
  minify: false,
  target: 'es2022',
  outDir: 'dist',
});
