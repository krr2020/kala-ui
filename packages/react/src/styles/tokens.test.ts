import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) =>
	readFileSync(new URL(path, import.meta.url), "utf8");

const themeCss = read("./theme.css");
const globalsCss = read("./globals.css");
const helpersCss = read("./helpers.css");
let tokensCss: string | null = null;
try {
	tokensCss = read("./tokens.css");
} catch {
	tokensCss = null;
}
const tokensBlockCss = tokensCss ?? globalsCss;
const avatarConfig = read("../config/avatar.ts");
const inputConfig = read("../config/input.ts");
const selectConfig = read("../config/select.ts");
const buttonConfig = read("../config/button.ts");
const tabsConfig = read("../config/tabs.ts");

describe("tokens.css extraction (item 13)", () => {
	it.skipIf(tokensCss === null)(
		"ships a tokens.css with the theme blocks; globals no longer inlines them",
		() => {
			const tokens = tokensCss as string;
			for (const selector of [":root", ".neutral", ".accent", ".dark", ".dark.accent", ".high-contrast-light", ".high-contrast-dark"]) {
				expect(tokens, selector).toMatch(new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{`));
			}
			expect(globalsCss).not.toMatch(/:root\s*\{/);
			expect(globalsCss).toContain('@import "./tokens.css";');
		},
	);

	it.skipIf(tokensCss === null)(
		"color-mix alpha formulas live only in tokens.css",
		() => {
			const FORMULA = /color-mix\(\s*in oklab[\s\S]*?--(?:border|shadow|overlay|background)-alpha/;
			expect((tokensCss as string)).toMatch(FORMULA);
			for (const [name, css] of [
				["globals.css", globalsCss],
				["helpers.css", helpersCss],
				["theme.css", themeCss],
			] as const) {
				expect(css.match(FORMULA) ?? [], name).toEqual([]);
			}
		},
	);
});

describe("Design-extension tokens (src)", () => {
	it("defines --font-heading in @theme with the sans stack as default", () => {
		expect(themeCss).toMatch(/--font-heading:\s*\n?\s*"IBM Plex Sans"/);
	});

	it("defines motion tokens and wires the Tailwind default transition chain", () => {
		expect(tokensBlockCss).toMatch(/--kala-duration-fast:\s*120ms/);
		expect(tokensBlockCss).toMatch(/--kala-duration-base:\s*150ms/);
		expect(tokensBlockCss).toMatch(/--kala-duration-slow:\s*200ms/);
		expect(tokensBlockCss).toMatch(/--kala-ease:\s*cubic-bezier/);
		expect(tokensBlockCss).toMatch(
			/--default-transition-duration:\s*var\(--kala-duration-base\)/,
		);
		expect(tokensBlockCss).toMatch(
			/--default-transition-timing-function:\s*var\(--kala-ease\)/,
		);
	});

	it("defines --kala-radius-input on a single declaration line falling back to the control radius", () => {
		// Single-line form: tooling greps the raw declaration, so var( must not wrap.
		expect(tokensBlockCss).toMatch(
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
	const css = tokensBlockCss.replace(/\/\*[\s\S]*?\*\//g, "");
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
	const css = tokensBlockCss.replace(/\/\*[\s\S]*?\*\//g, "");
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

describe("size-ladder knobs (item 7)", () => {
	const ladder: Array<[name: string, pattern: RegExp]> = [
		["--kala-control-h-xs", /--kala-control-h-xs:\s*calc\(var\(--kala-control-h\) - 0\.75rem\)/],
		["--kala-control-h-sm", /--kala-control-h-sm:\s*calc\(var\(--kala-control-h\) - 0\.25rem\)/],
		["--kala-control-h-lg", /--kala-control-h-lg:\s*calc\(var\(--kala-control-h\) \+ 0\.25rem\)/],
		["--kala-control-px-xs", /--kala-control-px-xs:\s*calc\(var\(--kala-control-px\) - 0\.5rem\)/],
		["--kala-control-px-sm", /--kala-control-px-sm:\s*calc\(var\(--kala-control-px\) - 0\.25rem\)/],
		["--kala-control-px-lg", /--kala-control-px-lg:\s*calc\(var\(--kala-control-px\) \+ 1rem\)/],
		["--kala-radius-sm", /--kala-radius-sm:\s*0\.25rem/],
	];

	it("derives every ladder step from the base density knobs at :root", () => {
		for (const [name, pattern] of ladder)
			expect(tokensBlockCss, name).toMatch(pattern);
	});

	it("keeps ladder knobs theme-invariant — never redefined per theme", () => {
		for (const selector of [
			".dark",
			".high-contrast-light",
			".high-contrast-dark",
		]) {
			const names = tokenNames(selector);
			for (const [name] of ladder)
				expect(names.has(name), `${selector} ${name}`).toBe(false);
		}
	});

	it("no radius-step literals remain in the seven swept config tables", () => {
		// rounded-full stays (pill is semantic); every step radius must read
		// the knobs so shape retuning reaches all swept surfaces.
		const swept = [
			"button",
			"alert",
			"dialog",
			"dropdown-menu",
			"number-input",
			"avatar",
			"select",
		];
		for (const file of swept) {
			const src = read(`../config/${file}.ts`);
			expect(
				src.match(/(^|[\s"'])rounded-(sm|md|lg|xl)(?=[\s"'])/) ?? [],
				file,
			).toEqual([]);
		}
	});

	it("swept configs consume the ladder and radius knobs", () => {
		const alertConfig = read("../config/alert.ts");
		expect(buttonConfig).toContain("h-[var(--kala-control-h-xs)]");
		expect(buttonConfig).toContain("h-[var(--kala-control-h-sm)]");
		expect(buttonConfig).toContain("h-[var(--kala-control-h-lg)]");
		expect(buttonConfig).toContain("size-[var(--kala-control-h)]");
		expect(selectConfig).toContain("h-[var(--kala-control-h-sm)]");
		expect(alertConfig).toContain("rounded-[var(--kala-radius-sm)]");
		expect(alertConfig).toContain("rounded-[var(--kala-radius-card)]");
		expect(avatarConfig).toContain("rounded-[var(--kala-radius-control)]");
		expect(avatarConfig).not.toContain("rounded-md");
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
		/^(b|l|r|t|x|y)(-\d+)?$|^(dashed|dotted|solid|double|hidden|none|collapse)$/;

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

const distTokensCss = (() => {
	try {
		return read("../../dist/styles/tokens.css");
	} catch {
		return null;
	}
})();

describe.skipIf(distTokensCss === null)("tokens.css (dist)", () => {
	const css = distTokensCss as string;

	it("ships the :root and .dark token blocks", () => {
		expect(css).toMatch(/:root\s*\{/);
		expect(css).toMatch(/\.dark\s*\{/);
		expect(css).toMatch(/--primary:/);
	});

	it("ships the single-sourced derived mixes", () => {
		expect(css).toMatch(/--kala-mix-border:/);
		expect(css).toMatch(/--kala-mix-shadow:/);
	});
});

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
