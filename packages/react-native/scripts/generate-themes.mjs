#!/usr/bin/env node

/**
 * Emits packages/react-native/src/themes.ts from the web token source of
 * truth (packages/react/src/styles/globals.css). Re-run after editing the
 * CSS; the parity test fails until the transcription is regenerated.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../../..');
const css = readFileSync(
	resolve(root, 'packages/react/src/styles/globals.css'),
	'utf-8',
).replace(/\/\*[\s\S]*?\*\//g, '');

const blocks = new Map();
const blockRe = /([^{}]+)\{([^{}]*)\}/g;
let match;
while ((match = blockRe.exec(css))) {
	const selector = match[1].replace(/@layer[^{]*$/, '').trim();
	if (!selector || selector.startsWith('@')) continue;
	const decls = new Map();
	for (const decl of match[2].split(';')) {
		const idx = decl.indexOf(':');
		if (idx === -1) continue;
		const name = decl.slice(0, idx).trim();
		if (!name.startsWith('--')) continue;
		decls.set(name, decl.slice(idx + 1).trim().replace(/\s+/g, ' '));
	}
	blocks.set(selector, decls);
}

const NON_THEMED = /^--(?:kala|default-transition)/;

function resolveVars(decls) {
	const out = new Map();
	for (const [name, raw] of decls) {
		let value = raw;
		let guard = 0;
		while (value.includes('var(') && guard++ < 10) {
			value = value.replace(
				/var\((--[\w-]+)(?:\s*,\s*([^()]+))?\)/,
				(_all, varName, fallback) => decls.get(varName) ?? fallback ?? '',
			);
		}
		out.set(name, value);
	}
	return out;
}

function hslToHex(value) {
	const m = value.match(
		/^hsl\(\s*([\d.]+)(?:deg)?\s*[, ]\s*([\d.]+)%\s*[, ]\s*([\d.]+)%\s*\)$/,
	);
	if (!m) throw new Error(`not an hsl color: ${value}`);
	const h = Number(m[1]) % 360;
	const s = Number(m[2]) / 100;
	const l = Number(m[3]) / 100;
	const c = (1 - Math.abs(2 * l - 1)) * s;
	const hp = h / 60;
	const x = c * (1 - Math.abs((hp % 2) - 1));
	let r = 0;
	let g = 0;
	let b = 0;
	if (hp < 1) [r, g, b] = [c, x, 0];
	else if (hp < 2) [r, g, b] = [x, c, 0];
	else if (hp < 3) [r, g, b] = [0, c, x];
	else if (hp < 4) [r, g, b] = [0, x, c];
	else if (hp < 5) [r, g, b] = [x, 0, c];
	else [r, g, b] = [c, 0, x];
	const m2 = l - c / 2;
	const hex = (v) =>
		Math.round(Math.min(1, Math.max(0, v + m2)) * 255)
			.toString(16)
			.padStart(2, '0');
	return `#${hex(r)}${hex(g)}${hex(b)}`;
}

const tokenToKey = (token) =>
	token.replace(/^--/, '').replace(/-([a-z])/g, (_m, c) => c.toUpperCase());
const toValue = (value) =>
	value.startsWith('hsl(') ? hslToHex(value) : Number(value.replace(/px$/, ''));

const SOURCES = {
	light: [':root'],
	neutral: ['.neutral'],
	accent: [':root', '.accent'],
	dark: ['.dark'],
	'dark-accent': ['.dark', '.dark.accent'],
	'high-contrast-light': ['.high-contrast-light'],
	'high-contrast-dark': ['.high-contrast-dark'],
};

const varNames = {
	'dark-accent': 'darkAccent',
	'high-contrast-light': 'highContrastLight',
	'high-contrast-dark': 'highContrastDark',
};

const lines = [
	'import type { KalaTheme, ThemeName } from "./types";',
	'',
	'// Transcribed from packages/react/src/styles/globals.css — regenerate with',
	'// `node scripts/generate-themes.mjs`; parity with the CSS is enforced by',
	'// src/__tests__/tokens-parity.test.ts. The `accent` theme is :root merged',
	'// with the .accent overrides; `dark-accent` is .dark merged with .dark.accent',
	'// (CSS cascade semantics). Colors are hex; alphas/spreads are numbers.',
];
for (const [themeName, selectors] of Object.entries(SOURCES)) {
	const merged = new Map();
	for (const selector of selectors) {
		const block = blocks.get(selector);
		if (!block) throw new Error(`missing CSS block ${selector}`);
		for (const [token, value] of resolveVars(block)) {
			if (!NON_THEMED.test(token)) merged.set(token, value);
		}
	}
	const entries = [...merged].map(([token, value]) => {
		const native = toValue(value);
		return `\t${tokenToKey(token)}: ${typeof native === 'number' ? native : `"${native}"`},`;
	});
	lines.push(
		`export const ${varNames[themeName] ?? themeName} = {`,
		...entries,
		'} as const satisfies KalaTheme;',
		'',
	);
}
lines.push(
	'export const themes = {',
	'\tlight,',
	'\tneutral,',
	'\taccent,',
	'\tdark,',
	'\t"dark-accent": darkAccent,',
	'\t"high-contrast-light": highContrastLight,',
	'\t"high-contrast-dark": highContrastDark,',
	'} as const satisfies Record<ThemeName, KalaTheme>;',
	'',
	'export const themeNames = Object.keys(themes) as ThemeName[];',
);

writeFileSync(
	resolve(root, 'packages/react-native/src/themes.ts'),
	`${lines.join('\n')}\n`,
);
console.log('packages/react-native/src/themes.ts written');
