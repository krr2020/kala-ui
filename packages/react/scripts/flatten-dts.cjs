const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '../dist');
const componentsDir = path.join(distDir, 'components');

// 1. Flatten component barrel index.d.ts -> {name}.d.ts
const componentDirs = fs.readdirSync(componentsDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

let count = 0;
for (const name of componentDirs) {
  const indexPath = path.join(componentsDir, name, 'index.d.ts');
  if (!fs.existsSync(indexPath)) continue;

  let content = fs.readFileSync(indexPath, 'utf8');

  // Rewrite relative imports for the moved file (one dir up)
  //   ./xxx       -> ./{name}/xxx   (sibling becomes child)
  //   ../xxx      -> ./xxx          (parent becomes sibling)
  //   ../../xxx   -> ./../xxx       (grandparent becomes parent)
  content = content.replace(/from\s+(["'])(\.[^"']+?)\1/g, (match, quote, importPath) => {
    if (importPath.startsWith('./')) {
      return match.replace(importPath, './' + name + '/' + importPath.slice(2));
    }
    if (importPath.startsWith('../')) {
      return match.replace(importPath, './' + importPath.slice(3));
    }
    return match;
  });

  const flatPath = path.join(componentsDir, name + '.d.ts');
  fs.writeFileSync(flatPath, content);
  count++;
  console.log('  Flattened: components/' + name + '/index.d.ts -> components/' + name + '.d.ts');
}

// 2. Copy lib/utils.d.ts to components/lib/utils.d.ts
const libUtilsPath = path.join(distDir, 'lib', 'utils.d.ts');
const componentsLibDir = path.join(componentsDir, 'lib');
const componentsLibUtilsPath = path.join(componentsLibDir, 'utils.d.ts');

if (fs.existsSync(libUtilsPath)) {
  fs.mkdirSync(componentsLibDir, { recursive: true });
  fs.copyFileSync(libUtilsPath, componentsLibUtilsPath);
  console.log('  Copied: lib/utils.d.ts -> components/lib/utils.d.ts');
  count++;
}

console.log('DTS flatten complete. ' + count + ' files processed.');
