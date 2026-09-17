/**
 * Cross-package seam: the playground Alert demo consumes the library's
 * Alert API — pins that the dedicated screen segregates variant and
 * color sweeps into labeled blocks with humanized copy (no raw enum
 * debug text), demonstrates Title/Description pairing, plain-string
 * children, dismissal with a visible round-trip, and the icon-less arm.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const DEMO_PATH = resolve(
	__dirname,
	"../../../../../apps/native-playground/src/demos/components/alert-demo.tsx",
);

describe("alert demo ↔ library seam", () => {
	const demo = readFileSync(DEMO_PATH, "utf8");

	it("uses the package barrel and the k-demo-alert root marker", () => {
		expect(demo).toMatch(/from "@kala-ui\/react-native";/);
		expect(demo).not.toMatch(/from "@kala-ui\/react-native\/dist/);
		expect(demo).toMatch(/testID="k-demo-alert"/);
	});

	it("segregates the sweep: one labeled block per dimension, humanized copy", () => {
		expect(demo).toMatch(/VARIANTS = \["solid", "outline", "subtle"\] as const/);
		const colorsBlock =
			demo.match(/const COLORS = \[([\s\S]*?)\] as const/)?.[1] ?? "";
		for (const color of [
			"primary",
			"secondary",
			"destructive",
			"success",
			"warning",
			"info",
			"muted",
		]) {
			expect(colorsBlock).toContain(`"${color}"`);
		}
		expect(demo).toMatch(/<DemoBlock label="Variants">/);
		expect(demo).toMatch(/<DemoBlock label="Colors \(Subtle\)">/);
		// each block maps ONE dimension and humanizes it into the copy
		expect(demo).toMatch(
			/\{VARIANTS\.map\(\(variant\) => \([\s\S]*?humanizeLabel\(variant\)/,
		);
		expect(demo).toMatch(
			/\{COLORS\.map\(\(color\) => \([\s\S]*?humanizeLabel\(color\)/,
		);
		// no flat variant×color debug sweep, no raw enum text in the copy
		expect(demo).not.toMatch(/VARIANTS\.map\(\(variant\) =>\s*\n\s*COLORS\.map/);
		expect(demo).not.toMatch(/\{variant\} · \{color\}/);
	});

	it("demonstrates Title/Description pairing and a plain-string child", () => {
		expect(demo).toMatch(/<Alert\.Title>/);
		expect(demo).toMatch(/<Alert\.Description>/);
		expect(demo).toMatch(
			/<Alert[^>]*>\n[\s]*[A-Z][^<\n]*\n[\s]*<\/Alert>/m,
		);
	});

	it("dismissal round-trips: counter on hide, explicit re-show control", () => {
		expect(demo).toMatch(/onDismiss=/);
		expect(demo).toMatch(/Dismissed \{dismissed\} Times/);
		expect(demo).toMatch(/Show Alert Again/);
		expect(demo).toMatch(/setVisible\(true\)/);
		// the re-show control lives in the hidden arm: counter text first,
		// then the button, inside the same conditional branch
		const hiddenArm = demo.slice(demo.indexOf(") : ("));
		expect(hiddenArm.indexOf("Dismissed {dismissed} Times")).toBeGreaterThan(-1);
		expect(hiddenArm.indexOf("Show Alert Again")).toBeGreaterThan(
			hiddenArm.indexOf("Dismissed {dismissed} Times"),
		);
	});

	it("exercises the icon-less arm", () => {
		expect(demo).toMatch(/showIcon=\{false\}/);
	});

	it("keeps every visible string sentence case", () => {
		expect(demo).not.toMatch(/>(?:Title|Description)>[a-z]/);
	});
});
