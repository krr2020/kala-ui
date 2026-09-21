import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const stylesDir = (p: string) =>
	readFileSync(resolve(__dirname, "..", p), "utf8");

/**
 * Cross-package seam: tokens.css is the single source of token values for
 * BOTH the web stylesheet and the native theme generator. These checks fail
 * closed when either side drifts.
 */
describe("web↔native token seam (item 13)", () => {
	const generator = readFileSync(
		resolve(__dirname, "../../../../react-native/scripts/generate-themes.mjs"),
		"utf8",
	);
	const definitions = readFileSync(
		resolve(
			__dirname,
			"../../../../react-native/src/themes/definitions.ts",
		),
		"utf8",
	);

	it("the native generator reads tokens.css (not globals.css)", () => {
		expect(generator).toContain("styles/tokens.css");
		expect(generator).not.toMatch(/readFileSync[\s\S]*?styles\/globals\.css/);
	});

	it("native definitions match the tokens.css theme blocks", () => {
		const tokensCss = stylesDir("tokens.css").replace(
			/\/\*[\s\S]*?\*\//g,
			"",
		);
		const blocks = new Map<string, Map<string, string>>();
		for (const match of tokensCss.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
			const selector = match[1].replace(/@layer[^{]*$/, "").trim();
			if (!selector || selector.startsWith("@")) continue;
			const decls = new Map<string, string>();
			for (const decl of match[2].split(";")) {
				const idx = decl.indexOf(":");
				if (idx === -1) continue;
				const name = decl.slice(0, idx).trim();
				if (name.startsWith("--kala-mix")) continue;
				if (name.startsWith("--")) decls.set(name, decl.slice(idx + 1).trim());
			}
			blocks.set(selector, decls);
		}

		const selectorToConst: Record<string, string> = {
			":root": "light",
			".dark": "dark",
			".high-contrast-light": "highContrastLight",
			".high-contrast-dark": "highContrastDark",
		};

		function hslToHex(value: string): string {
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
			const hex = (v: number) =>
				Math.round(Math.min(1, Math.max(0, v + m2)) * 255)
					.toString(16)
					.padStart(2, "0");
			return `#${hex(r)}${hex(g)}${hex(b)}`;
		}

		const tokenToKey = (token: string) =>
			token
				.replace(/^--/, "")
				.replace(/-([a-z])/g, (_m, c: string) => c.toUpperCase());

		for (const [selector, constName] of Object.entries(selectorToConst)) {
			const block = blocks.get(selector);
			if (!block) throw new Error(`tokens.css missing block ${selector}`);
			const constMatch = definitions.match(
				new RegExp(`export const ${constName} = \\{([\\s\\S]*?)\\} as const`),
			);
			if (!constMatch) throw new Error(`definitions.ts missing ${constName}`);
			for (const [token, value] of block) {
				if (/^--(?:kala|default-transition)/.test(token)) continue;
				const key = tokenToKey(token);
				const native = value.startsWith("hsl(")
					? hslToHex(value)
					: value.replace(/px$/, "");
				const nativeLiteral = /^[\d.]+$/.test(native)
					? native
					: `"${native}"`;
				expect(
					constMatch[1].includes(`${key}: ${nativeLiteral}`),
					`${constName}.${key}`,
				).toBe(true);
			}
		}
	});

	it("THEMING.md replaces the copy-paste recipe with a tokens import", () => {
		const themingMd = readFileSync(
			resolve(__dirname, "../../../../../THEMING.md"),
			"utf8",
		);
		expect(themingMd).toContain("@kala-ui/react/styles/tokens");
		expect(themingMd).not.toMatch(
			/[Cc]opy[^.]*the default `:root`/,
		);
	});
});
