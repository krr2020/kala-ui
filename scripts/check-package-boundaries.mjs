#!/usr/bin/env node

/**
 * Architecture boundary guard for the @kala-ui package split.
 *
 * Enforces the dependency direction react-app -> react -> react-hooks:
 *   1. Core (packages/react) must never reference @kala-ui/react-app.
 *   2. App source must not use relative imports that escape the package —
 *      cross-package imports must go through @kala-ui/react/* subpaths.
 *   3. Core must not depend on app-only libraries (apexcharts, dnd-kit,
 *      simple-icons) — they exist only in the app-level package.
 *
 * Wired into the root `lint` script; runs in the CI lint job.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const root = resolve(process.cwd());
const coreDir = join(root, 'packages/react');
const appDir = join(root, 'packages/react-app');

const errors = [];

// --- Rule 1: core src must not reference the app package -------------------
for (const dir of [join(coreDir, 'src'), join(coreDir, '.storybook')]) {
  for (const file of walk(dir, ['.ts', '.tsx'])) {
    const content = readFileSync(file, 'utf-8');
    if (/from ["']@kala-ui\/react-app/.test(content)) {
      errors.push(`core references app package: ${relative(root, file)}`);
    }
  }
}

// --- Rule 2: app src relative imports must stay inside the package ---------
for (const file of walk(join(appDir, 'src'), ['.ts', '.tsx'])) {
  const content = readFileSync(file, 'utf-8');
  const specRe = /(?:from|import\s*\()\s*["'](\.\.?\/[^"']+)["']/g;
  let match;
  while ((match = specRe.exec(content))) {
    const spec = match[1];
    const target = resolve(dirname(file), spec);
    const rel = relative(appDir, target);
    if (rel.startsWith('..') || rel === '') {
      errors.push(
        `app import escapes the package (use @kala-ui/react/* instead): ${relative(root, file)} -> ${spec}`,
      );
    }
  }
}

// --- Rule 3: core deps must stay app-free -----------------------------------
const corePkg = JSON.parse(readFileSync(join(coreDir, 'package.json'), 'utf-8'));
const APP_ONLY_DEPS = [
  'apexcharts',
  'react-apexcharts',
  '@dnd-kit/core',
  '@dnd-kit/modifiers',
  '@dnd-kit/sortable',
  '@dnd-kit/utilities',
  'simple-icons',
];
for (const dep of APP_ONLY_DEPS) {
  if (corePkg.dependencies?.[dep]) {
    errors.push(`core package.json depends on app-only library: ${dep}`);
  }
}

// --- Rule 4: app must depend on core ----------------------------------------
const appPkg = JSON.parse(readFileSync(join(appDir, 'package.json'), 'utf-8'));
if (appPkg.dependencies?.['@kala-ui/react'] !== 'workspace:*') {
  errors.push('app package.json must depend on @kala-ui/react (workspace:*)');
}

if (errors.length > 0) {
  console.error(`✗ package boundary violations (${errors.length}):`);
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
}
console.log('✓ package boundaries clean (react-app -> react -> react-hooks)');

function* walk(dir, extensions) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      yield* walk(full, extensions);
    } else if (extensions.some((ext) => entry.endsWith(ext))) {
      yield full;
    }
  }
}
