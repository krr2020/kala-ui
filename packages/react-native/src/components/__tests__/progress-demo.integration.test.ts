/**
 * Cross-package seam: the playground Progress demo consumes the library's
 * Progress API — pins the dedicated screen's marker, every color/size arm,
 * label + showValue, custom bounds, the clamped boundary arms, and the
 * Simulate Upload stepper.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const DEMO_PATH = resolve(
	__dirname,
	"../../../../../apps/native-playground/src/demos/components/progress-demo.tsx",
);
const REGISTRY_PATH = resolve(
	__dirname,
	"../../../../../apps/native-playground/src/demos/components/registry.tsx",
);

describe("progress demo ↔ library seam", () => {
	const demo = readFileSync(DEMO_PATH, "utf8");

	it("uses the package barrel and the k-demo-progress root marker", () => {
		expect(demo).toMatch(/from "@kala-ui\/react-native";/);
		expect(demo).not.toMatch(/from "@kala-ui\/react-native\/dist/);
		expect(demo).toMatch(/testID="k-demo-progress"/);
	});

	it("renders every color arm", () => {
		// arms are pinned by the COLORS tuple the demo maps over
		const tuple = demo.match(/const COLORS = \[([\s\S]*?)\] as const;/);
		expect(tuple).not.toBeNull();
		for (const color of [
			"primary",
			"secondary",
			"destructive",
			"success",
			"warning",
			"info",
		]) {
			expect(String(tuple)).toMatch(new RegExp(`"${color}"`));
		}
		expect(demo).toMatch(/COLORS\.map/);
	});

	it("renders every size arm plus label and showValue", () => {
		for (const size of ["sm", "md", "lg"]) {
			expect(demo).toMatch(new RegExp(`size="${size}"`));
		}
		expect(demo).toMatch(/label=/);
		expect(demo).toMatch(/showValue/);
	});

	it("custom min/max arm present", () => {
		expect(demo).toMatch(/min=\{10\}/);
		expect(demo).toMatch(/max=\{90\}/);
	});

	it("boundary arms pin the clamped values: 0, 100, 120 and -20", () => {
		expect(demo).toMatch(/value=\{0\}/);
		expect(demo).toMatch(/value=\{100\}/);
		expect(demo).toMatch(/value=\{120\}/);
		expect(demo).toMatch(/value=\{-20\}/);
	});

	it("Simulate Upload stepper drives a live readout", () => {
		expect(demo).toMatch(/Simulate Upload/);
		expect(demo).toMatch(/useState/);
		expect(demo).toMatch(/upload/);
		expect(demo).toMatch(/Upload: \{upload\}%|Value: \{upload\}%/);
	});

	it("uses shared demo tokens, not ad-hoc chrome", () => {
		expect(demo).toMatch(/DemoBlock/);
		expect(demo).toMatch(/demoStyles/);
	});

	it("keeps every visible string sentence case", () => {
		expect(demo).not.toMatch(/<(K?Text|Text)[^>]*>[a-z]/);
	});
});

describe("progress registry seam", () => {
	const registry = readFileSync(REGISTRY_PATH, "utf8");

	it("feedback group wires the progress entry to the dedicated demo", () => {
		expect(registry).toMatch(
			/import \{ ProgressDemo \} from "\.\/progress-demo";/,
		);
		const feedback = registry.match(
			/name: "feedback",[\s\S]*?name: "navigation",/,
		);
		const entry = String(feedback).match(
			/humanizeLabel\("progress"\),[\s\S]*?ProgressDemo/,
		);
		expect(entry).not.toBeNull();
	});
});
