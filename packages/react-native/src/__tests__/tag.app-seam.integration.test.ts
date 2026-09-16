import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Tag ↔ playground demo seam. The reported bug: the demo rendered a raw
 * lucide icon with no color, so lucide's default #242424 stroke was
 * invisible on the dark page background. Tag now owns icon theming
 * (icon is an icon-library component rendered at the tag's fg), so the
 * demo must pass the bare component with no hand-threaded colors.
 */
import { dark, light } from "../themes/definitions";

const PLAYGROUND_TAG_DEMO = resolve(
	__dirname,
	"../../../../apps/native-playground/src/demos/components/tag-demo.tsx",
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

describe("tag demo seam (icon visibility)", () => {
	it("delegates icon theming to Tag: bare icon component, no demo-side color threading", () => {
		const demo = readFileSync(PLAYGROUND_TAG_DEMO, "utf8");
		expect(demo).toMatch(/icon=\{Sun\}/);
		// the anti-pattern this seam pins: the demo hand-threading theme colors
		// through icons is exactly how the invisible-dark-icon bug happened
		expect(demo).not.toMatch(/<Icon\s/);
		expect(demo).not.toMatch(/color=\{theme\./);
		// iconColor is the only sanctioned override channel, and the demo
		// exercises it with a token key — never a raw cross-theme value
		expect(demo).toMatch(/iconColor="destructive"/);
	});

	it("every dark-themed foreground clears 3:1 against the dark page background", () => {
		for (const c of [dark.foreground, dark.mutedForeground]) {
			const ratio = contrast(c, dark.background);
			expect(ratio).toBeGreaterThanOrEqual(3);
		}
		// light.foreground is only valid on light surfaces — pairing it with
		// the dark background is the bug this seam exists to catch
		expect(contrast(light.foreground, dark.background)).toBeLessThan(3);
	});

	it("demo drives the public slotStyles prop", () => {
		const demo = readFileSync(PLAYGROUND_TAG_DEMO, "utf8");
		expect(demo).toMatch(/slotStyles=\{\{/);
		expect(demo).not.toMatch(/\boverrides=\{\{/);
	});
});
