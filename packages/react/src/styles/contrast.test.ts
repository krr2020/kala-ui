/**
 * Contrast guard — every solid/outline button pairing from config/button.ts must hold
 * WCAG AA (4.5:1) over the default tokens in both themes, hover states included, so
 * fixed-ramp or inverted-lightness regressions fail here instead of in production.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { buttonStyles } from "../config/button";

const here = dirname(fileURLToPath(import.meta.url));
const tokensCss = readFileSync(join(here, "tokens.css"), "utf8");

type Rgb = [number, number, number];

function parseBlock(css: string, selector: string): Map<string, string> {
	const match = css.search(new RegExp(`(^|\\n)\\s*${selector}\\s*\\{`));
	if (match === -1) return new Map();
	const open = css.indexOf("{", match);
	let depth = 1;
	let end = open + 1;
	while (depth > 0 && end < css.length) {
		if (css[end] === "{") depth++;
		if (css[end] === "}") depth--;
		end++;
	}
	const body = css.slice(open + 1, end - 1);
	const map = new Map<string, string>();
	for (const decl of body.split(";")) {
		const idx = decl.indexOf(":");
		if (idx === -1) continue;
		map.set(decl.slice(0, idx).trim(), decl.slice(idx + 1).trim());
	}
	return map;
}

function hslToRgb(h: number, s: number, l: number): Rgb {
	s /= 100;
	l /= 100;
	const k = (n: number) => (n + h / 30) % 12;
	const a = s * Math.min(l, 1 - l);
	const f = (n: number) =>
		l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
	return [f(0), f(8), f(4)].map((v) => Math.round(v * 255)) as Rgb;
}

function parseColor(raw: string, vars: Map<string, string>): Rgb {
	const value = raw.startsWith("var(")
		? (vars.get(raw.slice(4, -1).trim()) ?? raw)
		: raw;
	const hsl = value.match(
		/^hsl\(\s*([\d.]+)(?:deg)?\s*[, ]\s*([\d.]+)%\s*[, ]\s*([\d.]+)%/,
	);
	if (hsl) return hslToRgb(Number(hsl[1]), Number(hsl[2]), Number(hsl[3]));
	const hex = value.match(/^#([0-9a-f]{6})$/i);
	if (hex) {
		const n = parseInt(hex[1], 16);
		return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
	}
	throw new Error(`unparseable color: ${raw}`);
}

function composite(fg: Rgb, alpha: number, bg: Rgb): Rgb {
	return fg.map((c, i) => Math.round(c * alpha + bg[i] * (1 - alpha))) as Rgb;
}

function luminance([r, g, b]: Rgb): number {
	const adj = [r, g, b].map((v) => {
		const s = v / 255;
		return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
	});
	return 0.2126 * adj[0] + 0.7152 * adj[1] + 0.0722 * adj[2];
}

function contrast(a: Rgb, b: Rgb): number {
	const [lo, hi] = [luminance(a), luminance(b)].sort((x, y) => x - y);
	return (hi + 0.05) / (lo + 0.05);
}

interface Combo {
	name: string;
	variant: string;
	color?: string;
}

function combos(): Combo[] {
	const colors = Object.keys(buttonStyles.variants.color);
	const out: Combo[] = [{ name: "solid(default)", variant: "solid" }];
	for (const color of colors) out.push({ name: `solid/${color}`, variant: "solid", color });
	for (const color of colors)
		out.push({ name: `outline/${color}`, variant: "outline", color });
	return out;
}

function classesFor(combo: Combo): string {
	const rule = buttonStyles.compoundVariants.find(
		(r) =>
			r.variant === combo.variant &&
			("color" in r ? r.color === combo.color : combo.color === undefined),
	);
	if (!rule) throw new Error(`no compound variant for ${combo.name}`);
	return rule.className;
}

function bgText(classes: string, hover: boolean) {
	const rest = classes.replace(/hover:\S+/g, "");
	const pick = (source: string, utility: string) => {
		const m = source.match(new RegExp(`(?:^|\\s)${utility}-([\\w-]+)(?:\\/(\\d+))?`));
		return m ? { token: m[1], alpha: m[2] ? Number(m[2]) / 100 : 1 } : null;
	};
	return {
		bg: hover ? pick(classes, "hover:bg") : pick(rest, "bg"),
		text: hover ? pick(classes, "hover:text") : pick(rest, "text"),
	};
}

const AA = 4.5;

const KNOWN_SUB_AA: Record<string, number> = {};

describe("button contrast guard (default tokens)", () => {
	const themes = [
		{ label: "light", vars: parseBlock(tokensCss, ":root") },
		{ label: "dark", vars: parseBlock(tokensCss, ".dark") },
	];

	for (const theme of themes) {
		const background = parseColor("var(--background)", theme.vars);

		it(`holds >=4.5:1 for every combo in ${theme.label} (rest + hover)`, () => {
			const failures: string[] = [];
			for (const combo of combos()) {
				const classes = classesFor(combo);
				for (const hover of [false, true]) {
					const { bg, text } = bgText(classes, hover);
					if (!bg) continue;
					const bgRgb = composite(
						parseColor(`var(--${bg.token})`, theme.vars),
						bg.alpha,
						background,
					);
					const fgToken = text?.token ?? bgText(classes, false).text?.token;
					if (!fgToken) continue;
					const fgRgb = composite(
						parseColor(`var(--${fgToken})`, theme.vars),
						text?.alpha ?? 1,
						bgRgb,
					);
					const ratio = contrast(fgRgb, bgRgb);
					const key = `${theme.label} ${combo.name} ${hover ? "hover" : "rest"}`;
					const known = KNOWN_SUB_AA[key];
					if (ratio < AA && !(known && Math.abs(known - ratio) < 0.15))
						failures.push(`${key}: ${ratio.toFixed(2)}:1 (bg --${bg.token}/${bg.alpha} fg --${fgToken})`);
				}
			}
			expect(failures, failures.join("\n")).toEqual([]);
		});
	}
});
