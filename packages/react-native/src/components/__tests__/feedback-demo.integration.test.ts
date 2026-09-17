/**
 * Feedback demo seam: alert/toast/banner copy reads as UI text and the
 * toast trigger announces itself in Title Case.
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

	it("pins the humanized copy", () => {
		expect(src).toMatch(/<Alert.Title>Deployed<\/Alert.Title>/);
		expect(src).toMatch(/<Alert.Description>All checks passed<\/Alert.Description>/);
		expect(src).toMatch(/<Toast.Title>Saved<\/Toast.Title>/);
		expect(src).toMatch(/<Toast.Description>Changes are live<\/Toast.Description>/);
		expect(src).toMatch(/accessibilityLabel="Show Toast"/);
	});
});
