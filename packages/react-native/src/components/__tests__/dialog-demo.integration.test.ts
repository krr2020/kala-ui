import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Cross-package Dialog demo seam: the playground demo must keep
 * exercising every Dialog arm (sizes, dismissable gating, close-button
 * suppression) or library regressions ship unobserved. Static parse —
 * the demo pulls react-native, which this runner cannot execute (same
 * technique as components.app-seam).
 */
const DEMO = readFileSync(
	resolve(
		__dirname,
		"../../../../../apps/native-playground/src/demos/components/dialog-demo.tsx",
	),
	"utf8",
);

describe("playground dialog demo ↔ library Dialog seam", () => {
	it("renders all four size variations", () => {
		for (const size of ["sm", "md", "lg", "full"]) {
			expect(
				DEMO.match(new RegExp(`"${size}"`)),
				`demo exercises size ${size}`,
			).toBeTruthy();
		}
	});

	it("renders the non-dismissable and close-button-suppressed arms", () => {
		expect(DEMO).toMatch(/dismissable=\{false\}/);
		expect(DEMO).toMatch(/showCloseButton=\{false\}/);
	});

	it("renders the form-input and long-content variations", () => {
		expect(DEMO).toMatch(/<TextInput/);
		expect(DEMO).toMatch(/keyboardType="email-address"/);
		// five input kinds for focus traversal: 2 text + checkbox + select + switch
		expect(DEMO.match(/<TextInput/g)?.length).toBe(2);
		expect(DEMO).toMatch(/<Checkbox/);
		expect(DEMO).toMatch(/<Select/);
		expect(DEMO).toMatch(/<Switch/);
		expect(DEMO).toMatch(/Release notes/);
		expect(DEMO.match(/Array\.from\(\{ length: 16 \}/)).toBeTruthy();
	});

	it("keeps the composed header/title/description/body/footer vocabulary", () => {
		for (const part of [
			"Dialog.Header",
			"Dialog.Title",
			"Dialog.Description",
			"Dialog.Body",
			"Dialog.Footer",
		]) {
			expect(DEMO).toMatch(new RegExp(part.replace(".", "\\.")));
		}
	});
});
