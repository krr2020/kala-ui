/**
 * Feedback demo seam: toast/banner/overlay copy reads as UI text and
 * the toast trigger announces itself in Title Case. Alert lives on its
 * own dedicated screen (alert-demo.tsx).
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const src = readFileSync(
	resolve(
		__dirname,
		"../../../../../apps/native-playground/src/demos/feedback-demo.tsx",
	),
	"utf8",
);

describe("feedback demo ↔ library seam", () => {
	it("block labels are Title Case — no lowercase DemoBlock labels", () => {
		expect(src).not.toMatch(/label="[a-z]/);
	});

	it("has no alert arms left — they moved to the dedicated screen", () => {
		expect(src).not.toMatch(/<Alert/);
	});

	it("pins the humanized copy", () => {
		expect(src).toMatch(/<Toast.Title>Saved<\/Toast.Title>/);
		expect(src).toMatch(/<Toast.Description>Changes are live<\/Toast.Description>/);
		expect(src).toMatch(/accessibilityLabel="Show Toast"/);
	});
});
