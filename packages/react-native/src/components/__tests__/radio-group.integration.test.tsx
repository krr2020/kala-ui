/**
 * Cross-package seam: the native-playground RadioGroup demo consumes
 * RadioGroup's public props. This test renders the demo's usage shapes and
 * pins the contract the app relies on — the border-defined resting circle,
 * the standard 10dp dot in the 22dp primary fill, the hasError arm, the
 * group-disabled arm, and the standalone no-label item.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fireEvent, render } from "@testing-library/react-native";
import { RadioGroup } from "../radio-group";

const inclHidden = { includeHiddenElements: true } as const;

const DEMO = join(
	__dirname,
	"../../../../../apps/native-playground/src/demos/components/radio-group-demo.tsx",
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

describe("RadioGroup demo ↔ package seam", () => {
	it("demo exercises the contract's prop surface (source census)", () => {
		const source = readFileSync(DEMO, "utf8");
		expect(source).toContain("<RadioGroup.Item");
		expect(source).toContain("hasError");
		expect(source).toContain("disabled>");
		expect(source).toContain('accessibilityLabel="anonymous radio"');
		expect(source).toContain('orientation="horizontal"');
	});

	it("demo-shaped checked row: 22dp circle, standard 10dp dot on primary fill", async () => {
		const { themes } = require("../../themes");
		const screen = await render(
			<RadioGroup defaultValue="team">
				<RadioGroup.Item value="team" label="Team" testID="k-radio-item-team" />
			</RadioGroup>,
		);
		const circle = flatStyle(
			screen.getByTestId("k-radio-item-team-circle", inclHidden),
		);
		expect(circle.backgroundColor).toBe(themes.light.primary);
		expect(circle.width).toBe(22);
		expect(circle.height).toBe(22);
		const dot = screen.getByTestId("k-radio-item-team-dot", inclHidden);
		const dotS = flatStyle(dot);
		expect(dotS.width).toBe(10);
		expect(dotS.height).toBe(10);
		expect(dotS.backgroundColor).toBe(themes.light.primaryForeground);
	});

	it("demo-shaped error row: destructive stroke at rest, destructive dot picked", async () => {
		const { themes } = require("../../themes");
		const idle = await render(
			<RadioGroup defaultValue="valid">
				<RadioGroup.Item
					value="invalid"
					label="Invalid choice"
					hasError
					testID="k-radio-item-invalid"
				/>
			</RadioGroup>,
		);
		expect(
			flatStyle(idle.getByTestId("k-radio-item-invalid-circle", inclHidden))
				.borderColor,
		).toBe(themes.light.destructive);

		const picked = await render(
			<RadioGroup defaultValue="invalid">
				<RadioGroup.Item
					value="invalid"
					label="Invalid choice"
					hasError
					testID="k-radio-item-invalid"
				/>
			</RadioGroup>,
		);
		const dot = flatStyle(
			picked.getByTestId("k-radio-item-invalid-dot", inclHidden),
		);
		expect(dot.backgroundColor).toBe(themes.light.destructive);
	});

	it("demo-shaped inline group: wrapping row with the 16px gap", async () => {
		const screen = await render(
			<RadioGroup defaultValue="solo" orientation="horizontal">
				<RadioGroup.Item value="solo" label="Solo" testID="k-radio-item-solo" />
				<RadioGroup.Item value="team" label="Team" testID="k-radio-item-team" />
			</RadioGroup>,
		);
		const root = flatStyle(screen.getByTestId("k-radio-group"));
		expect(root.flexDirection).toBe("row");
		expect(root.flexWrap).toBe("wrap");
		expect(root.gap).toBe(16);
		expect(
			screen.getByTestId("k-radio-item-solo-circle", inclHidden).children
				?.length ?? 0,
		).toBeGreaterThan(0);
	});

	it("demo-shaped group-disabled row: press is a no-op and disabled is announced", async () => {
		const onValueChange = jest.fn();
		const screen = await render(
			<RadioGroup defaultValue="a" disabled onValueChange={onValueChange}>
				<RadioGroup.Item value="b" label="Locked out" testID="k-radio-item-lo" />
			</RadioGroup>,
		);
		await fireEvent.press(screen.getByTestId("k-radio-item-lo", inclHidden));
		expect(onValueChange).not.toHaveBeenCalled();
		expect(
			screen.getByTestId("k-radio-item-lo", inclHidden).props
				.accessibilityState?.disabled,
		).toBe(true);
	});
});
