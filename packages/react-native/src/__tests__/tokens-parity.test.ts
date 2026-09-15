import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { themes } from "../themes";
import { motion, tokens } from "../tokens";
import type { ThemeName } from "../types";

/**
 * Token parity contract: packages/react-native themes must match the web
 * source of truth (packages/react/src/styles/globals.css) token-for-token.
 *
 * The CSS is parsed here with a hand-rolled tokenizer on purpose — no parser
 * dependency. globals.css theme blocks are flat `--token: value;` declaration
 * lists (no nesting), so scanning selector-scoped blocks is sound; if the CSS
 * ever grows nesting, these tests fail and that is the signal to adopt a real
 * parser.
 */

const CSS_PATH = resolve(__dirname, "../../../react/src/styles/globals.css");

/** Strip /* ... *​/ comments (block level; theme blocks contain no strings). */
function stripComments(css: string): string {
	return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

/** Parse top-level-ish `selector { flat declarations }` blocks. */
function parseBlocks(css: string): Map<string, Map<string, string>> {
	const blocks = new Map<string, Map<string, string>>();
	const blockRe = /([^{}]+)\{([^{}]*)\}/g;
	for (const match of css.matchAll(blockRe)) {
		const selector = match[1].replace(/@layer[^{]*$/, "").trim();
		if (!selector || selector.startsWith("@")) continue;
		const decls = new Map<string, string>();
		for (const decl of match[2].split(";")) {
			const idx = decl.indexOf(":");
			if (idx === -1) continue;
			const name = decl.slice(0, idx).trim();
			const value = decl
				.slice(idx + 1)
				.trim()
				.replace(/\s+/g, " ");
			if (name.startsWith("--")) decls.set(name, value);
		}
		blocks.set(selector, decls);
	}
	return blocks;
}

/** Cascade merge: override declarations win over the base block. */
function cascade(
	base: Map<string, string>,
	override: Map<string, string>,
): Map<string, string> {
	return new Map([...base, ...override]);
}

/** Resolve `var(--x, fallback)` references against the same block. */
function resolveVars(decls: Map<string, string>): Map<string, string> {
	const out = new Map<string, string>();
	for (const [name, raw] of decls) {
		let value = raw;
		let guard = 0;
		value = value.replace(
			/var\((--[\w-]+)(?:\s*,\s*([^()]+))?\)/g,
			(_m, varName: string, fallback?: string) =>
				decls.get(varName) ?? fallback ?? "",
		);
		while (value.includes("var(") && guard < 10) {
			guard += 1;
			value = value.replace(
				/var\((--[\w-]+)(?:\s*,\s*([^()]+))?\)/g,
				(_m, varName: string, fallback?: string) =>
					decls.get(varName) ?? fallback ?? "",
			);
		}
		out.set(name, value);
	}
	return out;
}

/**
 * Independent hsl → hex converter (reference implementation, deliberately
 * separate from the library so the parity check is not circular).
 * Accepts `hsl(H S% L%)` and `hsl(H, S%, L%)`.
 */
function hslToHex(value: string): string {
	const m = value.match(
		/^hsl\(\s*([\d.]+)(?:deg)?\s*[, ]\s*([\d.]+)%\s*[, ]\s*([\d.]+)%\s*\)$/,
	);
	if (!m) throw new Error(`not an hsl color: ${value}`);
	const h = Number(m[1]);
	const s = Number(m[2]) / 100;
	const l = Number(m[3]) / 100;
	const c = (1 - Math.abs(2 * l - 1)) * s;
	const hp = (((h % 360) + 360) % 360) / 60;
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
	const to255 = (v: number) =>
		Math.round(Math.min(1, Math.max(0, v + m2)) * 255)
			.toString(16)
			.padStart(2, "0");
	return `#${to255(r)}${to255(g)}${to255(b)}`;
}

/** Convert one resolved CSS declaration value to the native theme form: hex color string, or number for alphas/spreads. */
function cssValueToNative(value: string): string | number {
	if (value.startsWith("hsl(")) return hslToHex(value);
	if (/^-?[\d.]+(px)?$/.test(value)) return Number(value.replace(/px$/, ""));
	return value;
}

/** CSS token name → native theme key (`--primary-foreground` → `primaryForeground`). */
function tokenToKey(token: string): string {
	return token
		.replace(/^--/, "")
		.replace(/-([a-z])/g, (_m, c: string) => c.toUpperCase());
}

const css = stripComments(readFileSync(CSS_PATH, "utf-8"));
const blocks = parseBlocks(css);

const EXPECTED_SELECTORS = [
	":root",
	".neutral",
	".accent",
	".dark",
	".dark.accent",
	".high-contrast-light",
	".high-contrast-dark",
] as const;

/** CSS block composition per native theme (cascade semantics made explicit). */
const THEME_SOURCES: Record<ThemeName, string[]> = {
	light: [":root"],
	neutral: [".neutral"],
	accent: [":root", ".accent"],
	dark: [".dark"],
	"dark-accent": [".dark", ".dark.accent"],
	"high-contrast-light": [".high-contrast-light"],
	"high-contrast-dark": [".high-contrast-dark"],
};

/** Tokens that are not theme-dependent (shape/motion/Tailwind plumbing) — they live in tokens.ts as dp values, not in the themes. */
const NON_THEMED = /^--(?:kala|default-transition)/;

function resolvedCssTheme(name: ThemeName): Map<string, string | number> {
	const selectors = THEME_SOURCES[name];
	const merged = new Map<string, string>();
	for (const selector of selectors) {
		const block = blocks.get(selector);
		if (!block) throw new Error(`missing CSS block ${selector}`);
		for (const [k, v] of resolveVars(block)) {
			if (!NON_THEMED.test(k)) merged.set(k, v);
		}
	}
	const out = new Map<string, string | number>();
	for (const [token, value] of merged) {
		out.set(tokenToKey(token), cssValueToNative(value));
	}
	return out;
}

describe("globals.css tokenizer", () => {
	it("finds all seven theme blocks", () => {
		for (const selector of EXPECTED_SELECTORS) {
			expect(blocks.has(selector), selector).toBe(true);
		}
	});

	it("resolves var() fallbacks inside a block", () => {
		const root = resolveVars(blocks.get(":root") ?? new Map());
		expect(root.get("--card-border-alpha")).toBe("1");
	});
});

describe("theme parity with globals.css", () => {
	it("exports exactly 7 themes", () => {
		expect(Object.keys(themes).sort()).toEqual(
			[
				"light",
				"neutral",
				"accent",
				"dark",
				"dark-accent",
				"high-contrast-light",
				"high-contrast-dark",
			].sort(),
		);
	});

	for (const name of Object.keys(THEME_SOURCES) as ThemeName[]) {
		it(`${name}: matches the CSS source token-for-token`, () => {
			const expected = resolvedCssTheme(name);
			const actual = themes[name] as Record<string, string | number>;
			expect(Object.keys(actual).length).toBe(expected.size);
			for (const [key, value] of expected) {
				expect(actual[key], `${name}.${key}`).toEqual(value);
			}
		});
	}

	it("accent carries the .accent overrides (not silently dropped)", () => {
		const accent = themes.accent as Record<string, string | number>;
		expect(accent.cardBorderAlpha).toBe(0);
		expect(accent.shadowAlpha).toBe(0.1);
		expect(accent.shadowSpread).toBe(25);
	});

	it("dark-accent carries the .dark.accent overrides (not silently dropped)", () => {
		const darkAccent = themes["dark-accent"] as Record<string, string | number>;
		expect(darkAccent.background).toBe(hslToHex("hsl(224 76% 48%)"));
		expect(darkAccent.backgroundAlpha).toBe(0.05);
		expect(darkAccent.cardBorderAlpha).toBe(0);
	});

	it("a deleted token breaks parity (missing-token detection works)", () => {
		const expected = resolvedCssTheme("light");
		const tampered = { ...(themes.light as Record<string, string | number>) };
		delete tampered.background;
		expect(Object.keys(tampered).length).toBe(expected.size - 1);
	});

	it("an extra token breaks parity (extra-token detection works)", () => {
		const expected = resolvedCssTheme("light");
		const tampered = { ...(themes.light as Record<string, string | number>) };
		tampered.surprise = "#000000";
		expect(Object.keys(tampered).length).not.toBe(expected.size);
	});

	it("light primary converts correctly (spot check)", () => {
		expect(themes.light.primary).toBe(hslToHex("hsl(221.2 83.2% 53.3%)"));
	});

	it("numeric alpha tokens are finite numbers in [0, 1]", () => {
		for (const name of Object.keys(themes) as ThemeName[]) {
			const theme = themes[name] as Record<string, string | number>;
			for (const [key, value] of Object.entries(theme)) {
				if (!key.toLowerCase().endsWith("alpha")) continue;
				expect(typeof value, `${name}.${key}`).toBe("number");
				expect(value, `${name}.${key}`).toBeGreaterThanOrEqual(0);
				expect(value, `${name}.${key}`).toBeLessThanOrEqual(1);
			}
		}
	});
});

describe("layout restructure pins", () => {
	it("tokens object keeps the pre-restructure public shape", () => {
		expect(tokens).toEqual({
			radius: { control: 6, card: 8, input: 6 },
			space: { controlPx: 16, cardPad: 24, gutter: 16 },
			size: { controlH: 40 },
			motion: {
				duration: { fast: 120, base: 150, slow: 200 },
				ease: { standard: [0.4, 0, 0.2, 1] },
				spring: {
					gentle: { damping: 18, stiffness: 120 },
					snappy: { damping: 14, stiffness: 220 },
					bouncy: { damping: 10, stiffness: 180 },
				},
			},
		});
	});

	it("src/index.ts public export names are unchanged", () => {
		// Static parse (not import): the entry pulls in react-native, which
		// vitest cannot execute — the export LIST is the contract anyway.
		const entry = readFileSync(resolve(__dirname, "../index.ts"), "utf8");
		// `export *` and default exports are outside this pin's vocabulary —
		// fail loudly instead of silently under-collecting.
		expect(entry).not.toMatch(/export\s+\*/);
		expect(entry).not.toMatch(/export\s+default/);
		const names = new Set<string>();
		for (const m of entry.matchAll(
			/export\s+(?:type\s+)?\{([^}]*)\}\s*from\s*"[^"]+";/g,
		)) {
			for (const part of m[1].split(",")) {
				const name = part
					.trim()
					.replace(/^type /, "")
					.split(" as ")
					.pop();
				if (name) names.add(name);
			}
		}
		// An empty set means the entry stopped matching the re-export shape —
		// that is a parse failure, not a passing pin.
		expect(names.size).toBeGreaterThan(0);
		expect([...names].sort()).toEqual(
			[
				"Accordion",
				"AccordionContentProps",
				"AccordionItemProps",
				"AccordionProps",
				"AccordionTriggerProps",
				"AccordionType",
				"AccordionVariant",
				"Alert",
				"AlertColor",
				"AlertDescriptionProps",
				"AlertProps",
				"AlertTitleProps",
				"AlertVariant",
				"AlertDialog",
				"AlertDialogProps",
				"Avatar",
				"AvatarGroup",
				"AvatarGroupProps",
				"AvatarItem",
				"AvatarProps",
				"AvatarShape",
				"AvatarSize",
				"AvatarStatus",
				"Badge",
				"BadgeColor",
				"BadgeProps",
				"BadgeShape",
				"BadgeVariant",
				"Banner",
				"BannerColor",
				"BannerPosition",
				"BannerProps",
				"BannerSkeletonConfig",
				"Button",
				"ButtonProps",
				"Card",
				"CardProps",
				"Checkbox",
				"CheckboxProps",
				"Collapsible",
				"CollapsibleContentProps",
				"CollapsibleProps",
				"CollapsibleTriggerProps",
				"ContextMenu",
				"ContextMenuProps",
				"Dialog",
				"DialogProps",
				"DropdownMenu",
				"DropdownMenuActionItem",
				"DropdownMenuCheckboxItem",
				"DropdownMenuItem",
				"DropdownMenuLabelItem",
				"DropdownMenuProps",
				"DropdownMenuRadioItem",
				"DropdownMenuSeparatorItem",
				"EmptyState",
				"EmptyStateAction",
				"EmptyStateIcon",
				"EmptyStateProps",
				"ErrorBoundary",
				"ErrorBoundaryProps",
				"ErrorFallback",
				"ErrorFallbackProps",
				"ErrorFallbackVariant",
				"Field",
				"FieldProps",
				"Heading",
				"HeadingAlign",
				"HeadingProps",
				"HeadingSize",
				"HeadingWeight",
				"Icon",
				"IconProps",
				"Indicator",
				"IndicatorColor",
				"IndicatorPosition",
				"IndicatorProps",
				"InputOtp",
				"InputOtpProps",
				"InputOtpSeparator",
				"InputOtpSeparatorProps",
				"InputOtpSlot",
				"InputOtpSlotProps",
				"KalaTheme",
				"Label",
				"LabelProps",
				"List",
				"ListItem",
				"ListItemAction",
				"ListItemActionProps",
				"ListItemAvatar",
				"ListItemAvatarProps",
				"ListItemBadge",
				"ListItemBadgeProps",
				"ListItemContent",
				"ListItemContentProps",
				"ListItemIcon",
				"ListItemIconProps",
				"ListItemIconSize",
				"ListItemProps",
				"ListItemText",
				"ListItemTextProps",
				"ListItemTitle",
				"ListItemTitleProps",
				"ListProps",
				"ListSkeletonConfig",
				"ListSkeletonVariant",
				"LoadingOverlay",
				"LoadingOverlayProps",
				"Pagination",
				"PaginationProps",
				"PaginationSize",
				"PasswordStrengthIndicator",
				"PasswordStrengthIndicatorProps",
				"Progress",
				"ProgressColor",
				"ProgressProps",
				"ProgressSize",
				"RadioGroup",
				"RadioGroupItemProps",
				"RadioGroupProps",
				"Rating",
				"RatingProps",
				"RatingSize",
				"RingProgress",
				"RingProgressProps",
				"RingProgressSection",
				"RingTone",
				"SegmentedControl",
				"SegmentedControlData",
				"SegmentedControlItem",
				"SegmentedControlProps",
				"SegmentedControlRadius",
				"SegmentedControlSize",
				"Select",
				"SelectOption",
				"SelectProps",
				"Sheet",
				"SheetBodyProps",
				"SheetProps",
				"Separator",
				"SeparatorOrientation",
				"SeparatorProps",
				"Skeleton",
				"SkeletonProps",
				"SkeletonVariant",
				"Slider",
				"SliderProps",
				"Spinner",
				"SpinnerProps",
				"SpinnerSize",
				"SpinnerVariant",
				"StepItem",
				"Steps",
				"StepsOrientation",
				"StepsProps",
				"Switch",
				"SwitchProps",
				"Tabs",
				"TabsItem",
				"TabsProps",
				"Tag",
				"TagColor",
				"TagProps",
				"TagSize",
				"TagVariant",
				"Text",
				"TextAlign",
				"TextColor",
				"TextProps",
				"TextSize",
				"TextWeight",
				"TextInput",
				"TextInputProps",
				"Textarea",
				"TextareaProps",
				"ThemeName",
				"Toggle",
				"ToggleGroup",
				"ToggleGroupItem",
				"ToggleGroupItemProps",
				"ToggleGroupProps",
				"ToggleGroupType",
				"ToggleProps",
				"ToggleSize",
				"ToggleVariant",
				"Toast",
				"ToastDescriptionProps",
				"ToastPosition",
				"ToastProps",
				"ToastTitleProps",
				"Toolbar",
				"ToolbarButton",
				"ToolbarButtonProps",
				"ToolbarLink",
				"ToolbarLinkProps",
				"ToolbarProps",
				"ToolbarSeparator",
				"ToolbarSeparatorProps",
				"ToolbarToggleGroup",
				"ToolbarToggleGroupProps",
				"ToolbarToggleItem",
				"ToolbarToggleItemProps",
				"calculatePasswordStrength",
				"motion",
				"themeNames",
				"themes",
				"tokens",
			].sort(),
		);
	});
});

describe("motion tokens (design-specs §7.1 / §8)", () => {
	it("spring configs match the spec exactly", () => {
		expect(motion.spring.gentle).toEqual({ damping: 18, stiffness: 120 });
		expect(motion.spring.snappy).toEqual({ damping: 14, stiffness: 220 });
		expect(motion.spring.bouncy).toEqual({ damping: 10, stiffness: 180 });
	});

	it("durations and easings are present and non-empty", () => {
		const durations = Object.entries(motion.duration);
		expect(durations.length).toBeGreaterThan(0);
		for (const [key, value] of durations) {
			expect(value, `duration.${key}`).toBeGreaterThan(0);
		}
		for (const value of Object.values(motion.ease)) {
			expect(
				Array.isArray(value) ? value.length : String(value).length,
			).toBeGreaterThan(0);
		}
	});

	it("durations carry the web token values", () => {
		expect(motion.duration.fast).toBe(120);
		expect(motion.duration.base).toBe(150);
		expect(motion.duration.slow).toBe(200);
	});
});
