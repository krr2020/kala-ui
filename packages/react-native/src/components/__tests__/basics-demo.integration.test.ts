/**
 * Baseline demo seam: user-visible copy reads as UI text (Title Case
 * block labels, sentence-case values) and the status arms stay mounted.
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
		expect(src).toMatch(/title: "Order placed"/);
		expect(src).toMatch(/description="One project"/);
		expect(src).toMatch(/placeholder="Email"/);
		expect(src).toMatch(/<Label required>Email<\/Label>/);
		expect(src).toMatch(/title: "Account"/);
	});

	it("status arms stay mounted (progress, steps, timeline)", () => {
		const src = demoSource("basics-demo.tsx");
		expect(src).toMatch(/<Progress /);
		expect(src).toMatch(/<Steps[\s\S]*?items=/);
		expect(src).toMatch(/<Timeline[\s\S]*?items=/);
	});
});
