/**
 * Cross-package seam: the native-playground Checkbox demo consumes
 * Checkbox's public props. This test renders the demo's usage shapes and
 * pins the contract the app relies on — the border-defined resting box
 * (visible on card-colored dark surfaces), the 22dp footprint with the
 * stroke rendered inside, and boolean press payloads for the demo's
 * tri-state cycling row.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fireEvent, render } from "@testing-library/react-native";
import { Checkbox } from "../checkbox";

const inclHidden = { includeHiddenElements: true } as const;

const DEMO = join(
	__dirname,
	"../../../../../apps/native-playground/src/demos/components/checkbox-demo.tsx",
);

function flatStyle(node: {
	props: { style?: unknown };
}): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	const walk = (entry: unknown): void => {
		if (Array.isArray(entry)) {
			for (const e of entry) walk(e);
		} else if (entry) {
			Object.assign(out, entry);
		}
	};
	walk(node.props.style ?? []);
	return out;
}

describe("Checkbox demo ↔ package seam", () => {
	it("demo renders Checkboxes the way this contract pins (source census)", () => {
		const source = readFileSync(DEMO, "utf8");
		expect(source).toContain("<Checkbox");
		expect(source).toContain("useState<TriState>(\"indeterminate\")");
		expect(source).toContain("onValueChange={cycle}");
	});

	it("demo-shaped rows: resting box is border-defined, footprint stays 22dp", async () => {
		const screen = await render(
			<Checkbox label="Agree to the terms" value={false} />,
		);
		const box = flatStyle(screen.getByTestId("k-checkbox-box", inclHidden));
		// no card fill — card-on-card is invisible in dark sheets/pages
		expect(box.backgroundColor).toBe("transparent");
		expect(box.borderWidth).toBe(2);
		expect(box.width).toBe(22);
		expect(box.height).toBe(22);
	});

	it("tri-state cycling row presses always deliver boolean payloads", async () => {
		const seen: boolean[] = [];
		const screen = await render(
			<Checkbox
				label="Select all rows"
				value="indeterminate"
				onValueChange={(next) => seen.push(next)}
			/>,
		);
		await fireEvent.press(screen.getByTestId("k-checkbox"));
		expect(seen).toEqual([true]);
		expect(
			seen.every((payload) => typeof payload === "boolean"),
		).toBe(true);
	});

	it("demo demo pins hasError and the closing tri-state cycle (source census)", () => {
		const source = readFileSync(DEMO, "utf8");
		expect(source).toContain("hasError");
		// the cycle must close: indeterminate → unchecked on a true press
		expect(source).toContain("? false");
	});

	it("demo-shaped hasError row: destructive resting border", async () => {
		const { themes } = require("../../themes");
		const screen = await render(
				<Checkbox label="Accept shipping terms" value={false} hasError />,
			);
		const box = flatStyle(screen.getByTestId("k-checkbox-box", inclHidden));
		expect(box.borderColor).toBe(themes.light.destructive);
		expect(box.backgroundColor).toBe("transparent");
	});
});
