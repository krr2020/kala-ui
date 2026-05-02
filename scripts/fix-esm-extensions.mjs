#!/usr/bin/env node

/**
 * Post-build script to add .js extensions to relative imports in ESM output.
 * 
 * Node.js ESM requires explicit file extensions for relative imports.
 * TypeScript with moduleResolution: "bundler" doesn't add these automatically,
 * so this script fixes the compiled output.
 * 
 * Usage: node scripts/fix-esm-extensions.mjs <dist-dir>
 */

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

const distDir = process.argv[2] || 'dist';

// Regex to match relative imports without .js extension
// Matches: from "./foo" or from '../bar/baz' but NOT from "./foo.js" or from "package"
const importRegex = /from\s+['"](\.\.?\/[^'"]+)['"]/g;

async function fixFileExtensions(filePath) {
  let content = await readFile(filePath, 'utf-8');
  let modified = false;
  
  const newContent = content.replace(importRegex, (match, importPath) => {
    // Skip if already has .js, .jsx, .ts, .tsx, .json, or .css extension
    if (/\.(js|jsx|ts|tsx|json|css|mjs|cjs)$/i.test(importPath)) {
      return match;
    }
    
    // Skip if it's a directory import (ends with /) - these are handled by index.js
    // We'll add .js to make it explicit
    const newPath = importPath.endsWith('/') 
      ? `${importPath}index.js`
      : `${importPath}.js`;
    
    modified = true;
    return `from '${newPath}'`;
  });
  
  if (modified) {
    await writeFile(filePath, newContent, 'utf-8');
    return true;
  }
  return false;
}

async function getAllJsFiles(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getAllJsFiles(fullPath));
    } else if (entry.isFile() && extname(entry.name) === '.js') {
      files.push(fullPath);
    }
  }
  
  return files;
}

async function main() {
  console.log(`🔧 Fixing ESM extensions in ${distDir}...`);
  
  const jsFiles = await getAllJsFiles(distDir);
  let fixedCount = 0;
  
  for (const file of jsFiles) {
    const wasFixed = await fixFileExtensions(file);
    if (wasFixed) {
      fixedCount++;
    }
  }
  
  console.log(`✅ Fixed ${fixedCount} file(s)`);
}

main().catch(console.error);
