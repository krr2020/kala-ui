import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Cross-package theme contract: the web ThemeProvider's shipped theme names
 * and the native themes map must expose the SAME curated set — light/dark as
 * the standard pair plus the high-contrast a11y opt-ins. Brand variants
 * (neutral/accent/dark-accent) are customization examples, not shipped
 * themes, on both platforms.
 */

const WEB_PROVIDER = resolve(
	__dirname,
	"../components/theme-provider/theme-provider.tsx",
);
const NATIVE_DEFINITIONS = resolve(
	__dirname,
	"../../../react-native/src/themes/definitions.ts",
);

const SHARED_THEMES = [
	"light",
	"dark",
	"high-contrast-light",
	"high-contrast-dark",
] as const;

function extractWebThemes(source: string): string[] {
	const match = source.match(/export const THEMES = \[([^\]]*)\]/);
	if (!match) throw new Error("THEMES array not found in theme-provider.tsx");
	return [...match[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
}

function extractNativeThemeNames(source: string): string[] {
	const match = source.match(/export const themes = \{([^\}]*)\}/);
	if (!match) throw new Error("themes map not found in definitions.ts");
	const lines = match[1].split(",").map((entry) => entry.trim());
	return lines
		.filter(Boolean)
		.map((entry) => {
			if (entry.startsWith('"')) return entry.replace(/"([^"]+)".*/, "$1");
			return entry.replace(/:.*/, "");
		})
		.map((name) =>
			name === "highContrastLight"
				? "high-contrast-light"
				: name === "highContrastDark"
					? "high-contrast-dark"
					: name,
		);
}

describe("web/native shared theme contract", () => {
	it("web THEMES exposes exactly the shared four themes", () => {
		expect(extractWebThemes(readFileSync(WEB_PROVIDER, "utf8")).sort()).toEqual(
			[...SHARED_THEMES].sort(),
		);
	});

	it("native themeNames (themes map keys) match the web THEMES exactly", () => {
		const native = extractNativeThemeNames(
			readFileSync(NATIVE_DEFINITIONS, "utf8"),
		)
			.filter((name) => !name.startsWith("export"))
			.sort();
		expect(native).toEqual([...SHARED_THEMES].sort());
	});

	it("no shipped theme list mentions the removed brand variants", () => {
		const web = readFileSync(WEB_PROVIDER, "utf8");
		const native = readFileSync(NATIVE_DEFINITIONS, "utf8");
		for (const source of [web, native]) {
			expect(source).not.toMatch(/['"]neutral['"]/);
			expect(source).not.toMatch(/['"]dark-accent['"]/);
		}
	});
});
