import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Cross-package overlay-demo seam: the playground demos must keep
 * exercising the AlertDialog and Sheet variation arms (alert
 * confirmation styles + dismissal modes, sheet snap points +
 * keyboard + long content) or library regressions ship unobserved.
 * Static parse — same technique as the dialog-demo seam.
 */
const ALERT_DEMO = readFileSync(
	resolve(
		__dirname,
		"../../../../../apps/native-playground/src/demos/components/alert-dialog-demo.tsx",
	),
	"utf8",
);
const SHEET_DEMO = readFileSync(
	resolve(
		__dirname,
		"../../../../../apps/native-playground/src/demos/components/sheet-demo.tsx",
	),
	"utf8",
);

describe("playground overlay demos ↔ library seam", () => {
	it("alert-dialog demo covers destructive, informational, dismissable, and long arms", () => {
		expect(ALERT_DEMO).toMatch(/color="destructive"/);
		expect(ALERT_DEMO).toMatch(/AlertDialog\.Cancel/);
		expect(ALERT_DEMO).toMatch(/AlertDialog\.Action/);
		expect(ALERT_DEMO).toMatch(/dismissable/);
		expect(ALERT_DEMO).toMatch(/AlertDialog\.Body/);
		expect(ALERT_DEMO.match(/Array\.from\(\{ length: 10 \}/)).toBeTruthy();
	});

	it("sheet demo covers snap points, keyboard input, and long content", () => {
		for (const snap of ["auto", "peek", "half", "full"]) {
			expect(SHEET_DEMO).toMatch(new RegExp(`"${snap}"`));
		}
		expect(SHEET_DEMO).toMatch(/dismissable=\{false\}/);
		expect(SHEET_DEMO).toMatch(/avoidKeyboard/);
		expect(SHEET_DEMO).toMatch(/<TextInput/);
		expect(SHEET_DEMO.match(/Array\.from\(\{ length: 16 \}/)).toBeTruthy();
	});
});
