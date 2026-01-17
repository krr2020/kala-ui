import { rmSync, existsSync, readdirSync, lstatSync } from 'fs';
import { join } from 'path';

const rootDirs = [
  'node_modules',
  '.turbo',
  '.tsconfig.tsbuildinfo'
];

const packageItems = [
  'node_modules',
  'dist',
  'coverage',
  '.turbo',
  'storybook-static',
  'tsconfig.tsbuildinfo',
  '.tsconfig.tsbuildinfo'
];

function clean(path) {
  if (existsSync(path)) {
    console.log(`Cleaning: ${path}`);
    try {
      rmSync(path, { recursive: true, force: true });
    } catch (err) {
      console.error(`Error cleaning ${path}: ${err.message}`);
    }
  }
}

// Clean root items
rootDirs.forEach(dir => clean(join(process.cwd(), dir)));

// Clean packages items
const packagesRoot = join(process.cwd(), 'packages');
if (existsSync(packagesRoot)) {
  const packages = readdirSync(packagesRoot);
  packages.forEach(pkg => {
    const pkgPath = join(packagesRoot, pkg);
    if (lstatSync(pkgPath).isDirectory()) {
      packageItems.forEach(item => {
        clean(join(pkgPath, item));
      });
    }
  });
}

console.log('Clean completed successfully.');
