/**
 * Baseline demo seam: user-visible copy reads as UI text (Title Case
 * block labels, sentence-case values) and the progress status arms stay
 * mounted. Steps/Timeline now live in @kala-ui/react-native-app, so the
 * library overview pins core-only content.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const demoSource = (name: string): string =>
	readFileSync(
		resolve(__dirname, "../../../../../apps/native-playground/src/demos", name),
		"utf8",
	);

describe("basics demo ↔ library seam", () => {
	it("block labels are Title Case — no lowercase DemoBlock labels", () => {
		expect(demoSource("basics-demo.tsx")).not.toMatch(/label="[a-z]/);
	});

	it("user-visible strings are sentence case", () => {
		const src = demoSource("basics-demo.tsx");
		expect(src).toMatch(/label="Upload Progress"/);
		expect(src).toMatch(/description="One project"/);
		expect(src).toMatch(/placeholder="Email"/);
		expect(src).toMatch(/<Label required>Email<\/Label>/);
	});

	it("status arms stay mounted (progress)", () => {
		const src = demoSource("basics-demo.tsx");
		expect(src).toMatch(/<Progress /);
	});
});
