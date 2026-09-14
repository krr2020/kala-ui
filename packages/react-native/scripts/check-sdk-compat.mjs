#!/usr/bin/env node

/**
 * SDK-compat gate: every versioned Expo/RN pin in the pnpm-workspace catalog
 * must satisfy its range in the installed expo's bundledNativeModules.json.
 * Fails loudly on any pin outside the SDK 57 matrix, so a "latest" bump that
 * Expo has not tested cannot slip in silently.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../../..');

const workspace = readFileSync(resolve(root, 'pnpm-workspace.yaml'), 'utf-8');
const catalog = {};
{
	// Extract ONLY the "Expo / React Native" section of the catalog: web
	// entries (react 19.3.0 etc.) are deliberately ahead of the SDK pins and
	// must not be graded against bundledNativeModules. The section starts at
	// its header comment; comment lines before the first entry belong to it,
	// and the first comment AFTER an entry is the next section's header.
	const lines = workspace.split('\n');
	let inSection = false;
	let sawEntry = false;
	for (const line of lines) {
		if (/^\s+# Expo \/ React Native/.test(line)) {
			inSection = true;
			continue;
		}
		if (!inSection) continue;
		if (/^\s+#/.test(line)) {
			if (sawEntry) break;
			continue;
		}
		if (/^\S/.test(line)) break; // dedent -> catalog block over
		const m = line.match(/^\s+(?:'([^']+)'|"([^"]+)"|([\w@/.-]+)):\s*(\S+)\s*$/);
		if (m) {
			catalog[m[1] ?? m[2] ?? m[3]] = m[4];
			sawEntry = true;
		}
	}
}

// expo is a dependency of the playground app, not the root — check there
// first, then the root, so the gate works from any install layout.
const bundledPath = [
	resolve(root, 'apps/native-playground/node_modules/expo/bundledNativeModules.json'),
	resolve(root, 'node_modules/expo/bundledNativeModules.json'),
].find((candidate) => {
	try {
		readFileSync(candidate);
		return true;
	} catch {
		return false;
	}
});
if (!bundledPath) {
	console.error('✗ expo/bundledNativeModules.json not found — run pnpm install');
	process.exit(1);
}
const bundled = JSON.parse(readFileSync(bundledPath, 'utf-8'));

// Minimal semver-satisfies for the range shapes Expo publishes:
// ^x.y.z, ~x.y.z, x.y.z, and >=x.y.z.
function satisfies(version, range) {
	const v = version.split('.').map(Number);
	const strip = (r) => r.replace(/^[~^>=]*\s*/, '').split('.').map(Number);
	if (range.startsWith('>=')) {
		const b = strip(range);
		return (
			v[0] > b[0] ||
			(v[0] === b[0] && (v[1] > b[1] || (v[1] === b[1] && v[2] >= b[2])))
		);
	}
	const b = strip(range);
	if (range.startsWith('^')) {
		return v[0] === b[0] && (v[1] > b[1] || (v[1] === b[1] && v[2] >= b[2]));
	}
	if (range.startsWith('~')) {
		return v[0] === b[0] && v[1] === b[1] && v[2] >= b[2];
	}
	return v[0] === b[0] && v[1] === b[1] && v[2] === b[2];
}

const errors = [];
let checked = 0;
for (const [name, version] of Object.entries(catalog)) {
	const range = bundled[name];
	if (!range) continue; // not SDK-versioned (e.g. unistyles, nitro) — peers cover it
	checked += 1;
	if (!satisfies(version, range)) {
		errors.push(`${name}@${version} is outside SDK range ${range}`);
	}
}

if (checked === 0) {
	console.error('✗ no catalog pins matched bundledNativeModules — gate misconfigured');
	process.exit(1);
}
if (errors.length > 0) {
	console.error(`✗ SDK-compat violations (${errors.length}):`);
	for (const e of errors) console.error(`  - ${e}`);
	process.exit(1);
}
console.log(`✓ all ${checked} SDK-versioned catalog pins inside the expo 57 matrix`);
