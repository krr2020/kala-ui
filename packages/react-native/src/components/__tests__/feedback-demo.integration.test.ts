/**
 * Feedback demo seam: overlay/copy feedback copy reads as UI text.
 * Alert, banner, and toast each live on their own dedicated screens
 * (alert-demo.tsx / banner-demo.tsx / toast-demo.tsx).
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

	it("has no alert/banner/toast arms left — they moved to dedicated screens", () => {
		expect(src).not.toMatch(/<Alert/);
		expect(src).not.toMatch(/<Banner/);
		expect(src).not.toMatch(/<Toast/);
	});
});
