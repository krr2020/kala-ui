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

	it("icon-button glyph uses a contrast token against the solid fill", () => {
		// foreground on a primary fill is invisible in dark themes; the
		// demo must pass the ramp's paired foreground token.
		expect(demo).toMatch(/color=\{theme\.primaryForeground\}/);
		expect(demo).not.toMatch(/color=\{theme\.foreground\}/);
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
		expect(stylesheet).toMatch(/paddingBottom: 7[0-9]/);
	});
});
