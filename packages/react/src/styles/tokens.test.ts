import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) =>
	readFileSync(new URL(path, import.meta.url), "utf8");

const themeCss = read("./theme.css");
const globalsCss = read("./globals.css");
const avatarConfig = read("../config/avatar.ts");
const inputConfig = read("../config/input.ts");
const selectConfig = read("../config/select.ts");
const buttonConfig = read("../config/button.ts");
const tabsConfig = read("../config/tabs.ts");

describe("Design-extension tokens (src)", () => {
	it("defines --font-heading in @theme with the sans stack as default", () => {
		expect(themeCss).toMatch(/--font-heading:\s*\n?\s*"IBM Plex Sans"/);
	});

	it("defines motion tokens and wires the Tailwind default transition chain", () => {
		expect(globalsCss).toMatch(/--kala-duration-fast:\s*120ms/);
		expect(globalsCss).toMatch(/--kala-duration-base:\s*150ms/);
		expect(globalsCss).toMatch(/--kala-duration-slow:\s*200ms/);
		expect(globalsCss).toMatch(/--kala-ease:\s*cubic-bezier/);
		expect(globalsCss).toMatch(
			/--default-transition-duration:\s*var\(--kala-duration-base\)/,
		);
		expect(globalsCss).toMatch(
			/--default-transition-timing-function:\s*var\(--kala-ease\)/,
		);
	});

	it("defines --kala-radius-input on a single declaration line falling back to the control radius", () => {
		// Single-line form: tooling greps the raw declaration, so var( must not wrap.
		expect(globalsCss).toMatch(
			/--kala-radius-input:\s*var\(--kala-radius-control\)/,
		);
	});

	it("input and select use the input radius; button and tabs keep the control radius", () => {
		const inputRadius =
			"rounded-[var(--kala-radius-input,var(--kala-radius-control))]";
		const controlRadius = "rounded-[var(--kala-radius-control)]";
		expect(inputConfig).toContain(inputRadius);
		expect(selectConfig).toContain(inputRadius);
		expect(buttonConfig).toContain(controlRadius);
		expect(buttonConfig).not.toContain("--kala-radius-input");
		expect(tabsConfig).toContain(controlRadius);
		expect(tabsConfig).not.toContain("--kala-radius-input");
	});
});

/** Extract flat `--token: value;` declarations from one CSS selector block. */
const blockTokens = (selector: string): Map<string, string> => {
	const css = globalsCss.replace(/\/\*[\s\S]*?\*\//g, "");
	const match = css.match(
		new RegExp(`([^{]*${selector.replace(".", "\\.")}[^{}]*)\\{([^{}]*)\\}`),
	);
	if (!match) throw new Error(`missing CSS block ${selector}`);
	const decls = new Map<string, string>();
	for (const decl of match[2].split(";")) {
		const idx = decl.indexOf(":");
		if (idx === -1) continue;
		const name = decl.slice(0, idx).trim();
		if (name.startsWith("--")) decls.set(name, decl.slice(idx + 1).trim());
	}
	return decls;
};

describe("presence tokens (--online / --offline)", () => {
	// Mirrors the avatar status dot contract: light-family themes sit on
	// green-500/slate-500, dark-family brighten to green-400/slate-400.
	const expected: Array<[selector: string, online: string, offline: string]> = [
		[":root", "#22c55e", "#64748b"],
		[".dark", "#4ade80", "#94a3b8"],
		[".high-contrast-light", "#22c55e", "#64748b"],
		[".high-contrast-dark", "#4ade80", "#94a3b8"],
	];

	it("every shipped theme block defines both tokens with family values", () => {
		for (const [selector, online, offline] of expected) {
			const block = blockTokens(selector);
			expect(block.get("--online"), `${selector} --online`).toBe(online);
			expect(block.get("--offline"), `${selector} --offline`).toBe(offline);
		}
	});

	it("@theme maps them to --color-* so bg-online/bg-offline utilities resolve", () => {
		expect(themeCss).toMatch(/--color-online:\s*var\(--online\)/);
		expect(themeCss).toMatch(/--color-offline:\s*var\(--offline\)/);
	});

	it("avatar config consumes the resolving utilities", () => {
		expect(avatarConfig).toContain("bg-online");
		expect(avatarConfig).toContain("bg-offline");
	});
});

/** All `--token` names declared inside one exact CSS selector block. */
const tokenNames = (selector: string): Set<string> => {
	const css = globalsCss.replace(/\/\*[\s\S]*?\*\//g, "");
	const names = new Set<string>();
	for (const match of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
		if (match[1].trim() !== selector) continue;
		for (const decl of match[2].split(";")) {
			const idx = decl.indexOf(":");
			const name = decl.slice(0, idx).trim();
			if (name.startsWith("--")) names.add(name);
		}
	}
	if (names.size === 0) throw new Error(`missing CSS block ${selector}`);
	return names;
};

describe("theme-block token parity", () => {
	const selectable = [":root", ".dark", ".high-contrast-light", ".high-contrast-dark"];
	// Radii/motion are theme-invariant: defined once on :root and inherited,
	// so they are excluded from per-theme parity instead of being duplicated.
	const isInvariant = (name: string) =>
		name.startsWith("--kala-") || name.startsWith("--default-transition");

	it("the four selectable theme blocks define identical themeable token sets", () => {
		const baseline = [...tokenNames(":root")].filter((n) => !isInvariant(n)).sort();
		expect(baseline.length).toBeGreaterThan(0);
		for (const selector of selectable.slice(1)) {
			const names = [...tokenNames(selector)].filter((n) => !isInvariant(n)).sort();
			expect(names, selector).toEqual(baseline);
		}
	});

	it("keeps invariant radii/motion tokens out of per-theme blocks", () => {
		for (const selector of selectable.slice(1)) {
			expect([...tokenNames(selector)].filter(isInvariant), selector).toEqual([]);
		}
	});

	it("example recipe blocks only reference :root token names", () => {
		const root = tokenNames(":root");
		for (const selector of [".neutral", ".accent", ".dark.accent"]) {
			expect(
				[...tokenNames(selector)].filter((n) => !root.has(n)),
				selector,
			).toEqual([]);
		}
	});
});

describe("config color utilities resolve", () => {
	const themeColors = new Set(
		[...themeCss.matchAll(/--color-([a-z0-9-]+):/g)].map((match) => match[1]),
	);
	// Non-color operands of color-prefixed utilities: font sizes, text
	// alignment, and CSS keywords that are not @theme color entries.
	const NON_COLOR = new Set([
		"sm", "xs", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl", "8xl",
		"9xl", "left", "center", "right", "top", "bottom", "start", "end",
		"transparent", "current", "inherit", "none", "hidden",
	]);
	// border-<width|style> operands: border-b, border-l-2, border-dashed, …
	const BORDER_STRUCTURAL =
		/^(b|l|r|t|x|y)(-\d+)?$|^(dashed|dotted|solid|double|hidden|none)$/;

	it("every color utility in src/config/*.ts maps to a --color-* @theme entry", () => {
		const offenders = new Set<string>();
		const configDir = ["src/config", "packages/react/src/config"]
			.map((p) => `${process.cwd()}/${p}`)
			.find((p) => readdirSync(p).length > 0);
		if (!configDir) throw new Error("cannot locate packages/react/src/config from cwd");
		for (
			const file of readdirSync(configDir).filter(
				(f) => f.endsWith(".ts") && f !== "index.ts",
			)
		) {
			const src = readFileSync(`${configDir}/${file}`, "utf8");
			for (const match of src.matchAll(
				/(?:^|[^\w-])((?:bg|text|ring|border|fill|stroke|outline|divide|from|via|to|accent|caret|decoration)-([a-z][a-z0-9-/]*))/g,
			)) {
				const utility = match[1];
				const name = match[2].split("/")[0];
				if (themeColors.has(name)) continue;
				if (NON_COLOR.has(name)) continue;
				if (utility.startsWith("border") && BORDER_STRUCTURAL.test(name)) continue;
				offenders.add(`${utility} (${file})`);
			}
		}
		expect([...offenders].sort()).toEqual([]);
	});
});

const distGlobalsCss = (() => {
	try {
		return read("../../dist/styles/globals.css");
	} catch {
		return null;
	}
})();

describe.skipIf(distGlobalsCss === null)(
	"Design-extension tokens (dist)",
	() => {
		const css = distGlobalsCss as string;

		it("emits the font-heading utility", () => {
			expect(css).toMatch(/\.font-heading\s*\{/);
		});

		it("chains the default transition duration to the kala duration token", () => {
			expect(css).toMatch(
				/--default-transition-duration:\s*var\(--kala-duration-base\)/,
			);
		});

		it("compiled transition utilities emit the default duration var, not a literal", () => {
			const transitionUtility =
				css.match(/\.transition-colors\s*\{[^}]*\}/)?.[0] ?? "";
			expect(transitionUtility).toMatch(/var\(--default-transition-duration\)/);
			expect(transitionUtility).not.toMatch(/transition-duration:\s*150ms/);
		});

		it("keeps the radius-input fallback class intact (no calc wrapping)", () => {
			expect(css).toContain(
				"border-radius: var(--kala-radius-input,var(--kala-radius-control))",
			);
		});
	},
);
