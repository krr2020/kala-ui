#!/usr/bin/env node

/**
 * Post-tsc build script that adds .js extensions to all relative imports
 * in the dist output. TypeScript's tsc does not emit .js extensions for
 * relative imports, which is required for Node.js ESM resolution when
 * "type": "module" is set in package.json.
 *
 * This runs after `tsc` as part of the build process.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { execSync } from 'node:child_process';

const distDir = new URL('../dist', import.meta.url).pathname;

if (!existsSync(distDir)) {
  console.log('No dist directory found, skipping');
  process.exit(0);
}

// Find all .js files in dist
const files = execSync(`find ${distDir} -name '*.js' -type f`, { encoding: 'utf-8' })
  .trim()
  .split('\n')
  .filter(Boolean);

let patched = 0;
let bannered = 0;

function resolveImport(importPath, fromFile) {
  const dir = dirname(fromFile);
  const fullPath = join(dir, importPath);

  // Already has an extension
  if (importPath.endsWith('.js') || importPath.endsWith('.mjs') || importPath.endsWith('.cjs')) {
    return null;
  }

  // It's a directory with index.js
  if (existsSync(join(fullPath, 'index.js'))) {
    return `${importPath}/index.js`;
  }

  // It's a direct .js file
  if (existsSync(`${fullPath}.js`)) {
    return `${importPath}.js`;
  }

  // Can't resolve - leave as-is (might be an external package)
  return null;
}

for (const file of files) {
  const content = readFileSync(file, 'utf-8');

  const patchedContent = content.replace(
    /(from\s+['"])(\.\.?\/[^'"]+)(['"])/g,
    (match, prefix, importPath, suffix) => {
      const resolved = resolveImport(importPath, file);
      if (!resolved) return match;
      patched++;
      return `${prefix}${resolved}${suffix}`;
    },
  );

  // Also handle dynamic imports
  const finalContent = patchedContent.replace(
    /(import\s*\(['"])(\.\.?\/[^'"]+)(['"]\))/g,
    (match, prefix, importPath, suffix) => {
      const resolved = resolveImport(importPath, file);
      if (!resolved) return match;
      patched++;
      return `${prefix}${resolved}${suffix}`;
    },
  );

  if (finalContent !== content) {
    writeFileSync(file, finalContent, 'utf-8');
  }

  // Mark every component module and the barrel as client-only so React
  // Server Component apps (Next.js App Router, Waku, …) can import them
  // directly without a manual "use client" boundary. dist/lib stays
  // server-safe (pure helpers, no hooks).
  const relPath = relative(distDir, file);
  const needsBanner =
    relPath === 'index.js' ||
    (relPath.startsWith('components/') && !finalContent.startsWith('"use client";'));

  if (needsBanner && !finalContent.startsWith('"use client";')) {
    writeFileSync(file, `"use client";\n${finalContent}`, 'utf-8');
    bannered++;
  }
}

console.log(`Patched ${patched} relative imports with .js extensions`);
console.log(`Added "use client" banner to ${bannered} files`);
