/**
 * Cross-package seam: the playground Toast demo consumes the library's
 * Toast API — pins the dedicated screen's trigger, both positions, the
 * auto-dismiss counter, the manual no-duration arm, and containment.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const DEMO_PATH = resolve(
	__dirname,
	"../../../../../apps/native-playground/src/demos/components/toast-demo.tsx",
);

describe("toast demo ↔ library seam", () => {
	const demo = readFileSync(DEMO_PATH, "utf8");

	it("uses the package barrel and the k-demo-toast root marker", () => {
		expect(demo).toMatch(/from "@kala-ui\/react-native";/);
		expect(demo).not.toMatch(/from "@kala-ui\/react-native\/dist/);
		expect(demo).toMatch(/testID="k-demo-toast"/);
	});

	it("has a Show Toast trigger producing Title + Description content", () => {
		expect(demo).toMatch(/Show Toast/);
		expect(demo).toMatch(/<Toast\.Title>/);
		expect(demo).toMatch(/<Toast\.Description>/);
		expect(demo).toMatch(/Saved/);
		expect(demo).toMatch(/Changes are live/);
	});

	it("exercises both positions", () => {
		expect(demo).toMatch(/position=\{"top"|setPosition\("top"\)/);
		expect(demo).toMatch(/position=\{"bottom"|setPosition\("bottom"\)/);
		expect(demo).toMatch(/position=\{position\}/);
	});

	it("auto-dismiss arm: duration 1500 with an auto-closed counter", () => {
		expect(demo).toMatch(/duration=\{1500\}/);
		expect(demo).toMatch(/Auto-Closed \{autoClosed\} Times/);
	});

	it("manual arm: no duration, explicit Close Toast trigger", () => {
		const manualArm = demo.match(/<Toast[^>]*>(?!<Toast)/g) ?? [];
		// at least one <Toast open=...> without a duration prop
		expect(manualArm.some((open) => !open.includes("duration"))).toBe(true);
		expect(demo).toMatch(/Close Toast/);
		expect(demo).toMatch(/onOpenChange=/);
	});

	it("mounts every toast inside the visible Toast Stage box", () => {
		expect(demo).toMatch(/position: "relative"/);
		expect(demo).toMatch(/minHeight: 220/);
		expect(demo).toMatch(/borderColor: theme.border/);
		expect(demo).toMatch(/overflow: "hidden"/);
		// no bare zero-height relative mount remains
		expect(demo).not.toMatch(/\{\s*position: "relative"\s*\}/);
	});

	it("keeps every visible string sentence case", () => {
		expect(demo).not.toMatch(/<KText[^>]*>[a-z]/);
		expect(demo).not.toMatch(/<(Toast\.Title|Toast\.Description)>[a-z]/);
	});
});
