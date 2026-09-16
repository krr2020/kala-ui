import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { themes } from "../themes";
import type { ThemeName } from "../types";

/**
 * Cross-package seam: native themes are transcribed from the web token source
 * of truth (packages/react/src/styles/globals.css). This suite pins the
 * crash-regression contract at that seam — a theme block in the CSS that
 * silently drops a token present in :root must never again ship as a native
 * theme with undefined color slots.
 */

const CSS_PATH = resolve(__dirname, "../../../react/src/styles/globals.css");

const SELECTOR_BY_THEME: Record<ThemeName, string> = {
	light: ":root",
	dark: ".dark",
	"high-contrast-light": ".high-contrast-light",
	"high-contrast-dark": ".high-contrast-dark",
};

/** Parse flat `--token: value;` declarations out of one selector block. */
function blockTokens(selector: string): Map<string, string> {
	const css = readFileSync(CSS_PATH, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
	const match = css.match(new RegExp(`([^{}]*${selector.replace(".", "\\.")}[^{}]*)\\{([^{}]*)\\}`));
	if (!match) throw new Error(`missing CSS block ${selector}`);
	const decls = new Map<string, string>();
	for (const decl of match[2].split(";")) {
		const idx = decl.indexOf(":");
		if (idx === -1) continue;
		const name = decl.slice(0, idx).trim();
		if (name.startsWith("--")) decls.set(name, decl.slice(idx + 1).trim());
	}
	return decls;
}

const KEY_TOKENS = [
	"success",
	"successForeground",
	"warning",
	"warningForeground",
	"overlay",
	"overlayAlpha",
] as const;

describe("native themes ↔ web globals.css seam", () => {
	it("the four crash-class tokens are declared in every web theme block", () => {
		const root = blockTokens(":root");
		for (const selector of Object.values(SELECTOR_BY_THEME)) {
			const block = blockTokens(selector);
			for (const key of KEY_TOKENS) {
				const token = `--${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`;
				expect(block.has(token) || (selector === ":root" && root.has(token)), `${selector} missing ${token}`).toBe(true);
			}
		}
	});

	it("every native theme resolves the crash-class tokens to real values", () => {
		for (const name of Object.keys(themes) as ThemeName[]) {
			const theme = themes[name] as Record<string, string | number>;
			for (const key of KEY_TOKENS) {
				const value = theme[key];
				if (key.endsWith("Alpha")) {
					expect(typeof value, `${name}.${key}`).toBe("number");
				} else {
					expect(
						typeof value === "string" && /^#[0-9a-f]{6}$/.test(value),
						`${name}.${key} = ${String(value)}`,
					).toBe(true);
				}
			}
		}
	});
});
