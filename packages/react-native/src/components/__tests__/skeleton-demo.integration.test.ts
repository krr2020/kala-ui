/**
 * Cross-package seam: the playground Skeleton demo consumes the library's
 * Skeleton API — pins the dedicated screen's marker, variant/static/label
 * arms, the width ladder, the card composition, and the fetch toggle's
 * conditional render.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const DEMO_PATH = resolve(
	__dirname,
	"../../../../../apps/native-playground/src/demos/components/skeleton-demo.tsx",
);
const REGISTRY_PATH = resolve(
	__dirname,
	"../../../../../apps/native-playground/src/demos/components/registry.tsx",
);
const BASICS_PATH = resolve(
	__dirname,
	"../../../../../apps/native-playground/src/demos/basics-demo.tsx",
);

describe("skeleton demo ↔ library seam", () => {
	const demo = readFileSync(DEMO_PATH, "utf8");

	it("uses the package barrel and the k-demo-skeleton root marker", () => {
		expect(demo).toMatch(/from "@kala-ui\/react-native";/);
		expect(demo).not.toMatch(/from "@kala-ui\/react-native\/dist/);
		expect(demo).toMatch(/testID="k-demo-skeleton"/);
	});

	it("renders both variants via the VARIANTS tuple", () => {
		const tuple = demo.match(/const VARIANTS = \[([\s\S]*?)\] as const;/);
		expect(tuple).not.toBeNull();
		for (const variant of ["rect", "circle"]) {
			expect(String(tuple)).toMatch(new RegExp(`"${variant}"`));
		}
		expect(demo).toMatch(/VARIANTS\.map/);
	});

	it("width ladder pins 96, 64, and 120", () => {
		expect(demo).toMatch(/width: 96/);
		expect(demo).toMatch(/width: 64/);
		expect(demo).toMatch(/width: 120/);
	});

	it("static, label, and card composition arms present", () => {
		expect(demo).toMatch(/animated=\{false\}/);
		expect(demo).toMatch(/accessibilityLabel="Loading profile"/);
		expect(demo).toMatch(/variant="circle"/);
		expect(demo).toMatch(/aspectRatio: 1/);
	});

	it("Simulate Fetch toggle swaps content ↔ skeleton via useState", () => {
		expect(demo).toMatch(/useState/);
		expect(demo).toMatch(/fetching \?\s*[\n\t ]*\(/);
		expect(demo).toMatch(/Content loaded/);
		expect(demo).toMatch(/fetching \? "Reset" : "Simulate Fetch"/);
	});

	it("uses shared demo tokens, not ad-hoc chrome", () => {
		expect(demo).toMatch(/DemoBlock/);
		expect(demo).toMatch(/demoStyles/);
	});

	it("keeps every visible string sentence case", () => {
		expect(demo).not.toMatch(/<(K?Text|Text)[^>]*>[a-z]/);
	});
});

describe("skeleton registry seam", () => {
	const registry = readFileSync(REGISTRY_PATH, "utf8");

	it("feedback group wires the skeleton entry to the dedicated demo", () => {
		expect(registry).toMatch(
			/import \{ SkeletonDemo \} from "\.\/skeleton-demo";/,
		);
		const feedback = registry.match(
			/name: "feedback",[\s\S]*?name: "navigation",/,
		);
		const entry = String(feedback).match(
			/humanizeLabel\("skeleton"\),[\s\S]*?SkeletonDemo/,
		);
		expect(entry).not.toBeNull();
	});
});

describe("basics skeletons block regression pin", () => {
	const basics = readFileSync(BASICS_PATH, "utf8");

	it("overview still renders its k-demo-skeletons block with 3 blocks", () => {
		expect(basics).toMatch(/testID="k-demo-skeletons"/);
		expect(basics).toMatch(/<Skeleton style=\{\{ width: 96, height: 12 \}\} \/>/);
		expect(basics).toMatch(
			/<Skeleton variant="circle" style=\{\{ width: 32, height: 32 \}\} \/>/,
		);
		expect(basics).toMatch(
			/<Skeleton style=\{\{ width: 64, height: 12 \}\} variant="rect" \/>/,
		);
	});
});
