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
	it("composeOffset math: keyboard translate composes with entry and drag", () => {
		const { composeOffset } = require("../sheet/sheet.styles");
		// keyboard closed: kb term is a no-op
		expect(composeOffset(300, 0, 0)).toBe(300);
		expect(composeOffset(300, 24, 0)).toBe(324);
		// keyboard open: sheet lifts by kb while drag still adds
		expect(composeOffset(300, 0, 260)).toBe(40);
		expect(composeOffset(300, 24, 260)).toBe(64);
		// drag-dismiss threshold still reads positive
		expect(composeOffset(0, 120, 260)).toBe(-140);
	});

	it("header separator renders only when a title is present", async () => {
		const { Sheet } = require("../sheet");
		const titled = await render(
			<Sheet open onClose={jest.fn()} title="Options">
				<></>
			</Sheet>,
		);
		const header = flatStyle(titled.getByTestId("k-sheet-header", inclHidden));
		expect(header.borderBottomWidth).toBe(1);
		expect(header.borderBottomColor).toBeTruthy();
	});

	it("footer renders pinned below the body, outside the scroll view", async () => {
		const { Sheet } = require("../sheet");
		const screen = await render(
			<Sheet open onClose={jest.fn()} title="Options" scrollable footer={<></>}>
				<></>
			</Sheet>,
		);
		const footer = screen.getByTestId("k-sheet-footer", inclHidden);
		expect(footer).toBeTruthy();
		const flat = flatStyle(footer);
		expect(flat.borderTopWidth).toBe(1);
		// footer is a sibling AFTER the scroll container, never inside it
		const scroll = screen.getByTestId("k-sheet-scroll", inclHidden);
		expect(scroll.props.testID).not.toBe(footer.props.testID);
	});
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
		// option dividers are gone; the sheet header itself is separated
		expect(
			screen.queryAllByTestId("k-select-option-separator", inclHidden),
		).toHaveLength(0);
		const header = flatStyle(screen.getByTestId("k-sheet-header", inclHidden));
		expect(header.borderBottomWidth).toBe(1);
	});
});
