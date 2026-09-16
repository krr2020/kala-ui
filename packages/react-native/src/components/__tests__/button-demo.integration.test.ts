/**
 * Cross-package seam: the playground Button demo consumes the library's
 * Button API — this pins that the demo passes raw variant/color/size
 * values as props while showing humanized labels, and that the variant
 * list mirrors the mobile-first set (no web-parity leftovers).
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

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
});
