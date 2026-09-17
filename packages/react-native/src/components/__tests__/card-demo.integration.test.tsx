/**
 * Cross-package seam: the playground Card demo consumes the library's
 * compound Card API — this pins that every compound part is exercised,
 * that the compound layout (padding none + elevated media card) is used,
 * and that the demo stays registered in the playground registry.
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
		const block = demo.match(
			/import \{[\s\S]*?\} from "@kala-ui\/react-native";/,
		);
		expect(block).toBeTruthy();
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
		expect(demo).toMatch(
			/<CardMarker color="primary" position="top-right">/,
		);
		expect(demo).toMatch(/<CardMarker variant="icon" color="destructive">/);
		expect(demo).toMatch(/<CardImageOverlay>/);
	});

	it("wires the loading state through the Card API", () => {
		expect(demo).toMatch(/isLoading=\{loading\}/);
		expect(demo).not.toMatch(/Skeleton/);
	});

	it("shows variant coverage with raw API values", () => {
		expect(demo).toMatch(/<Card>/);
		expect(demo).toMatch(/<Card variant="elevated">/);
		expect(demo).toMatch(/<Card variant="outlined">/);
	});

	it("is registered as a playground preview", () => {
		const registry = readFileSync(REGISTRY_PATH, "utf8");
		expect(registry).toMatch(/import \{ CardDemo \} from "\.\/card-demo";/);
		expect(registry).toMatch(/name: "card"/);
		expect(registry).toMatch(/render: \(\) => <CardDemo \/>/);
	});
});
