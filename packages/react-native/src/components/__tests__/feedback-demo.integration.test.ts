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

	it("alerts block covers the variant × color arms", () => {
		expect(src.match(/<Alert[\s\S]*?>/g)?.length).toBeGreaterThanOrEqual(6);
		expect(src).toMatch(/<Alert variant="solid" color="destructive">/);
		expect(src).toMatch(/<Alert.Title>Payment failed<\/Alert.Title>/);
		expect(src).toMatch(/showIcon=\{false\}/);
		// sentence case: no lowercase-start visible copy inside the alerts block
		const alertsBlock = src.match(/label="Alerts">([\s\S]*?)<\/DemoBlock>/)?.[1] ?? "";
		expect(alertsBlock).not.toMatch(/>(?:Title|Description)>[a-z]/);
	});
});
