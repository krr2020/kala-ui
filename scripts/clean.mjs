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

// Clean apps (Next.js build output)
const appsRoot = join(process.cwd(), 'apps');
if (existsSync(appsRoot)) {
  const apps = readdirSync(appsRoot);
  apps.forEach(app => {
    const appPath = join(appsRoot, app);
    if (lstatSync(appPath).isDirectory()) {
      ['node_modules', '.next', 'dist'].forEach(item => {
        clean(join(appPath, item));
      });
    }
  });
}

console.log('Clean completed successfully.');
