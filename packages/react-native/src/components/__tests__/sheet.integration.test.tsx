/**
 * Cross-package seam: the native-playground Select demo consumes Sheet
 * through Select's public props (title, sizing). This test renders Select
 * exactly as the demo does and pins the contract the app relies on —
 * an auto-sized sheet (content-hugging, maxHeight-clamped), header title
 * from label/placeholder, close affordance, and hairline separators.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fireEvent, render } from "@testing-library/react-native";
import { Select } from "../select";

const inclHidden = { includeHiddenElements: true } as const;

type Screen = Awaited<ReturnType<typeof render>>;

const DEMO = join(
	__dirname,
	"../../../../../apps/native-playground/src/demos/components/select-demo.tsx",
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

describe("Select demo ↔ package Sheet seam", () => {
	it("demo renders Selects the way this contract pins (source census)", () => {
		const source = readFileSync(DEMO, "utf8");
		expect(source).toContain("<Select");
		expect(source).not.toContain('snap="');
		expect(source).toContain("hasSuccess");
	});

	it("demo-shaped Select opens an auto-sized titled sheet with separators", async () => {
		const screen: Screen = await render(
			<Select
				placeholder="Pick a fruit"
				accessibilityLabel="Fruit"
				options={[
					{ value: "apple", label: "Apple" },
					{ value: "banana", label: "Banana" },
					{ value: "cherry", label: "Cherry", disabled: true },
				]}
			/>,
		);
		await fireEvent.press(screen.getByTestId("k-select"));
		const content = flatStyle(
			screen.getByTestId("k-sheet-content", inclHidden),
		);
		// auto sizing: no fixed height, clamped by maxHeight
		expect(content.height).toBeUndefined();
		expect(content.maxHeight).toBeGreaterThan(0);
		expect(screen.getByTestId("k-sheet-title", inclHidden).props.children).toBe(
			"Pick a fruit",
		);
		expect(screen.getByTestId("k-sheet-close", inclHidden)).toBeTruthy();
		expect(
			screen.getAllByTestId("k-select-option-separator", inclHidden),
		).toHaveLength(2);
	});
});
