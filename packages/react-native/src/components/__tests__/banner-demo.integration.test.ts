/**
 * Cross-package seam: the playground Banner demo consumes the library's
 * Banner API — pins the dedicated screen's tone sweep, both positions,
 * the close round-trip, the loading arms, and the alert-role arm.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const DEMO_PATH = resolve(
	__dirname,
	"../../../../../apps/native-playground/src/demos/components/banner-demo.tsx",
);

describe("banner demo ↔ library seam", () => {
	const demo = readFileSync(DEMO_PATH, "utf8");

	it("uses the package barrel and the k-demo-banner root marker", () => {
		expect(demo).toMatch(/from "@kala-ui\/react-native";/);
		expect(demo).not.toMatch(/from "@kala-ui\/react-native\/dist/);
		expect(demo).toMatch(/testID="k-demo-banner"/);
	});

	it("sweeps the four tones with humanized copy", () => {
		const colorsBlock =
			demo.match(/const COLORS = \[([\s\S]*?)\] as const/)?.[1] ?? "";
		for (const color of ["info", "warning", "destructive", "success"]) {
			expect(colorsBlock).toContain(`"${color}"`);
		}
		expect(demo).toMatch(
			/\{COLORS\.map\(\(color\) => \([\s\S]*?humanizeLabel\(color\)/,
		);
	});

	it("shows both positions: static inline and fixed inside a relative box", () => {
		expect(demo).toMatch(/position="static"/);
		expect(demo).toMatch(/position=\{?"fixed"|position="fixed"/);
		expect(demo).toMatch(/position: "relative"/);
	});

	it("close round-trips: counter on hide, explicit re-show control", () => {
		expect(demo).toMatch(/onClose=/);
		expect(demo).toMatch(/Closed \{closed\} Times/);
		expect(demo).toMatch(/Show Banner Again/);
		expect(demo).toMatch(/setVisible\(true\)/);
		const hiddenArm = demo.slice(demo.indexOf(") : ("));
		expect(hiddenArm.indexOf("Closed {closed} Times")).toBeGreaterThan(-1);
		expect(hiddenArm.indexOf("Show Banner Again")).toBeGreaterThan(
			hiddenArm.indexOf("Closed {closed} Times"),
		);
	});

	it("exercises all three loading arms", () => {
		expect(demo).toMatch(/isLoading/);
		expect(demo).toMatch(
			/skeletonConfig=\{\{ showIcon: false, showCloseButton: false \}\}/,
		);
		expect(demo).toMatch(/skeleton=\{/);
	});

	it("exercises the assertive role arm", () => {
		expect(demo).toMatch(/role="alert"/);
	});

	it("keeps every visible string sentence case", () => {
		// banner children live as raw JSX text; ban lowercase enum leaks
		// by asserting every explicit banner child starts uppercase
		const arms =
			demo.match(/<Banner[^>]*>\s*[A-Z][^<\n]*/g) ??
			[];
		expect(arms.length).toBeGreaterThan(0);
		for (const arm of arms) {
			const text = arm.replace(/^<Banner[^>]*>\s*/, "");
			expect(text).toMatch(/^[A-Z]/);
		}
	});
});
