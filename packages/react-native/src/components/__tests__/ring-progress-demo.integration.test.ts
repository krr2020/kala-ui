/**
 * Cross-package seam: the playground RingProgress demo consumes the
 * library's RingProgress API — pins the dedicated screen's marker, the
 * tone/size/track/cap/section arms, boundaries, and the stepper.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const DEMO_PATH = resolve(
	__dirname,
	"../../../../../apps/native-playground/src/demos/components/ring-progress-demo.tsx",
);
const REGISTRY_PATH = resolve(
	__dirname,
	"../../../../../apps/native-playground/src/demos/components/registry.tsx",
);

describe("ring-progress demo ↔ library seam", () => {
	const demo = readFileSync(DEMO_PATH, "utf8");

	it("uses the package barrel and the k-demo-ring-progress root marker", () => {
		expect(demo).toMatch(/from "@kala-ui\/react-native";/);
		expect(demo).not.toMatch(/from "@kala-ui\/react-native\/dist/);
		expect(demo).toMatch(/testID="k-demo-ring-progress"/);
	});

	it("renders every tone arm via the TONES tuple", () => {
		const tuple = demo.match(/const TONES = \[([\s\S]*?)\] as const;/);
		expect(tuple).not.toBeNull();
		for (const tone of [
			"primary",
			"secondary",
			"destructive",
			"success",
			"warning",
			"info",
		]) {
			expect(String(tuple)).toMatch(new RegExp(`"${tone}"`));
		}
		expect(demo).toMatch(/TONES\.map/);
	});

	it("renders size, track tone, and cap arms", () => {
		expect(demo).toMatch(/size=\{64\}/);
		expect(demo).toMatch(/size=\{96\}/);
		expect(demo).toMatch(/size=\{120\}/);
		expect(demo).toMatch(/emptyColor="secondary"/);
		expect(demo).toMatch(/roundCaps=\{false\}/);
	});

	it("multi-section stack arm present", () => {
		expect(demo).toMatch(/sections=\{\[/);
		expect(demo).toMatch(/value: 30/);
		expect(demo).toMatch(/value: 20/);
	});

	it("boundary arms pin 0, 100, and the clamped 140", () => {
		expect(demo).toMatch(/value=\{0\}/);
		expect(demo).toMatch(/value=\{100\}/);
		expect(demo).toMatch(/value=\{140\}/);
		expect(demo).toMatch(/140 clamps to 100%/);
	});

	it("Advance/Reset stepper drives a live ring", () => {
		expect(demo).toMatch(/Advance/);
		expect(demo).toMatch(/Reset/);
		expect(demo).toMatch(/useState/);
		expect(demo).toMatch(/ring=\{ring\}|value=\{ring\}/);
	});

	it("uses shared demo tokens, not ad-hoc chrome", () => {
		expect(demo).toMatch(/DemoBlock/);
		expect(demo).toMatch(/demoStyles/);
	});

	it("keeps every visible string sentence case", () => {
		expect(demo).not.toMatch(/<(K?Text|Text)[^>]*>[a-z]/);
	});
});

describe("ring-progress registry seam", () => {
	const registry = readFileSync(REGISTRY_PATH, "utf8");

	it("feedback group wires the ring-progress entry to the dedicated demo", () => {
		expect(registry).toMatch(
			/import \{ RingProgressDemo \} from "\.\/ring-progress-demo";/,
		);
		const feedback = registry.match(
			/name: "feedback",[\s\S]*?name: "navigation",/,
		);
		const entry = String(feedback).match(
			/humanizeLabel\("ring-progress"\),[\s\S]*?RingProgressDemo/,
		);
		expect(entry).not.toBeNull();
	});
});
