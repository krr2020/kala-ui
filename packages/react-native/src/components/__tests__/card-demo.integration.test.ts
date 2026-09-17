/**
 * Cross-package seam: the playground Card demo consumes the library's
 * compound Card API — this pins that every compound part is exercised,
 * that the compound layout (padding none + elevated media card) is used,
 * and that the demo stays registered in the playground registry.
 * Plain .ts on purpose: the package vitest include only collects
 * .test.ts files under src/.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const DEMO_PATH = resolve(
	__dirname,
	"../../../../../apps/native-playground/src/demos/components/card-demo.tsx",
);
const REGISTRY_PATH = resolve(
	__dirname,
	"../../../../../apps/native-playground/src/demos/components/registry.tsx",
);

describe("card demo ↔ library seam", () => {
	const demo = readFileSync(DEMO_PATH, "utf8");

	it("imports the compound API from the library package", () => {
		expect(demo).toMatch(/import \{[\s\S]*\} from "@kala-ui\/react-native";/);
		for (const part of [
			"Card",
			"CardHeader",
			"CardTitle",
			"CardSubtitle",
			"CardDescription",
			"CardAction",
			"CardContent",
			"CardFooter",
			"CardImage",
			"CardImageOverlay",
			"CardMarker",
		]) {
			expect(demo).toContain(part);
		}
	});

	it("uses the compound layout: padding none + elevated media card", () => {
		expect(demo).toMatch(/<Card padding="none" variant="elevated">/);
		expect(demo).toMatch(/<CardImage[\s\S]*?source=\{\{ uri: /);
		expect(demo).toMatch(/alt="[^"]+"/);
	});

	it("exercises markers with position/color props and the overlay", () => {
		expect(demo).toMatch(/<CardMarker color="primary" position="top-right">/);
		expect(demo).toMatch(/<CardMarker variant="icon" color="destructive">/);
		expect(demo).toMatch(/<CardImageOverlay>/);
	});

	it("exercises the pressable arm with a tap counter", () => {
		expect(demo).toMatch(/<Card[\s\S]*?onPress=\{\(\) => setTaps/);
		expect(demo).toMatch(/accessibilityLabel="Open the notifications card"/);
		expect(demo).toMatch(/flush\n/);
	});

	it("wires the loading state through the Card API and shows both cards", () => {
		expect(demo).toMatch(/<Card isLoading>/);
		expect(demo).toMatch(/\{!loading && \(/);
		// loading visuals come from the Card API — the demo renders no
		// skeleton elements of its own (the toggle label may say "Skeleton")
		expect(demo).not.toMatch(/<Skeleton/);
		expect(demo).not.toMatch(/CardSkeletonStack/);
	});

	it("uses sentence-case copy throughout", () => {
		for (const copy of [
			'label="Variants"',
			'label="Compound Anatomy"',
			'label="Markers"',
			'label="Loading"',
			"Flat — hairline border",
			"Elevated — themed shadow",
			"Outlined — strong border",
			"Lakeside Cabin",
			"From $142 / night",
			"Trail Closed",
			"Daily Digest",
		]) {
			expect(demo).toContain(copy);
		}
		expect(demo).not.toMatch(/label="[a-z]/);
	});

	it("is registered as a playground preview", () => {
		const registry = readFileSync(REGISTRY_PATH, "utf8");
		expect(registry).toMatch(/import \{ CardDemo \} from "\.\/card-demo";/);
		expect(registry).toMatch(/name: "card"/);
		expect(registry).toMatch(/render: \(\) => <CardDemo \/>/);
	});
});
