import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Badge ↔ theme ↔ playground seam. Static-parse where importing react
 entities would fail under vitest; theme checks import the pure token
 * tables directly.
 */
import { dark, highContrastDark, light } from "../themes/definitions";

const PLAYGROUND_BADGE_DEMO = resolve(
	__dirname,
	"../../../../apps/native-playground/src/demos/components/badge-demo.tsx",
);

/** WCAG relative luminance contrast ratio. */
function contrast(a: string, b: string): number {
	const lum = (hex: string) => {
		const n = [1, 3, 5].map(
			(i) => Number.parseInt(hex.slice(i, i + 2), 16) / 255,
		);
		const [r, g, bl] = n.map((c) =>
			c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
		);
		return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
	};
	const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
	return (l1 + 0.05) / (l2 + 0.05);
}

describe("badge token seam (dark-family secondary visibility)", () => {
	it("dark-family secondary is a distinct visible ramp, not the muted surface", () => {
		for (const theme of [dark, highContrastDark]) {
			expect(theme.secondary).not.toBe(theme.muted);
			expect(theme.secondary).not.toBe(theme.accent);
		}
	});

	it("dark-family secondary clears 3:1 against its background in every badge arm", () => {
		for (const theme of [dark, highContrastDark]) {
			expect(
				contrast(theme.secondary, theme.background),
			).toBeGreaterThanOrEqual(3);
		}
	});

	it("light-family secondary was already visible and stays untouched", () => {
		expect(contrast(light.secondary, light.background)).toBeGreaterThanOrEqual(
			3,
		);
	});
});

describe("playground badge demo seam", () => {
	it("drives the public slotStyles prop", () => {
		const demo = readFileSync(PLAYGROUND_BADGE_DEMO, "utf8");
		expect(demo).toMatch(/slotStyles=\{\{/);
		expect(demo).not.toMatch(/\boverrides=\{\{/);
	});
});
