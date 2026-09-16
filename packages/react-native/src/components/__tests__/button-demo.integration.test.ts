/**
 * Cross-package seam: the playground Button demo consumes the library's
 * Button API — this pins that the demo passes raw variant/color/size
 * values as props while showing humanized labels, and that the variant
 * list mirrors the mobile-first set (no web-parity leftovers).
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const DEMO_PATH = resolve(
	__dirname,
	"../../../../../apps/native-playground/src/demos/components/button-demo.tsx",
);

describe("button demo ↔ library seam", () => {
	const demo = readFileSync(DEMO_PATH, "utf8");

	it("passes raw API values as props", () => {
		expect(demo).toMatch(/variant=\{variant\}/);
		expect(demo).toMatch(/color=\{color\}/);
		expect(demo).toMatch(/size=\{size\}/);
	});

	it("renders humanized title-case labels", () => {
		expect(demo).toMatch(/\{humanizeLabel\(variant\)\}/);
		expect(demo).toMatch(/\{humanizeLabel\(color\)\}/);
		expect(demo).toMatch(/\{humanizeLabel\(size\)\}/);
		expect(demo).not.toMatch(/\{variant\}<\//);
	});

	it("variant list matches the mobile-first set", () => {
		expect(demo).toMatch(
			/VARIANTS = \["solid", "outline", "ghost", "subtle"\] as const/,
		);
		expect(demo).not.toMatch(/"link"/);
	});

	it("icon glyphs use contrast tokens against solid fills", () => {
		// foreground on a primary fill is invisible in dark themes; solid-fill
		// buttons must pass the ramp's paired foreground token. Transparent
		// variants (subtle/ghost) may use theme.foreground — their fill is not
		// the primary tint, so the contrast pairing rule does not apply there.
		const solid =
			demo.match(
				/<Button[^>]*accessibilityLabel="[^"]+"[^>]*>[\s\S]*?<\/Button>/g,
			) ?? [];
		const sunGlyph = demo.match(/<Sun[^/]*color=\{theme\.primaryForeground\}/);
		expect(sunGlyph).toBeTruthy();
		// leading/trailing icons on transparent variants keep foreground
		// contrast; only the solid-fill icon must use the paired token
		expect(demo).toMatch(
			/<Save size=\{16\} color=\{theme\.primaryForeground\}/,
		);
	});

	it("demo copy is humanized and the shell insets content off the gesture bar", () => {
		expect(demo).not.toMatch(/label="[a-z]/);
		expect(demo).toMatch(/Pressed \{count\} Times/);
		expect(demo).toMatch(/>Full Width</);
		const shell = readFileSync(
			resolve(
				__dirname,
				"../../../../../apps/native-playground/src/route-shell.tsx",
			),
			"utf8",
		);
		expect(shell).toMatch(/edges=\{\["top", "bottom"\]\}/);
		const stylesheet = readFileSync(
			resolve(
				__dirname,
				"../../../../../apps/native-playground/src/demos/stylesheet.ts",
			),
			"utf8",
		);
		// end-of-scroll padding must extend the scroll CONTENT, not clip
		// the ScrollView frame — pin it inside routeContent and forbid it
		// on the screen frame
		expect(stylesheet).toMatch(/routeContent: \{[\s\S]*?paddingBottom: 7[0-9]/);
		expect(stylesheet).not.toMatch(
			/screen: \{[\s\S]*?\},[\s\S]*?paddingBottom: 7[0-9]/,
		);
	});
});
