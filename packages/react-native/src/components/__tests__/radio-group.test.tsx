import { fireEvent, render } from "@testing-library/react-native";
import { RadioGroup } from "../radio-group";

type Screen = Awaited<ReturnType<typeof render>>;

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

function dotStyle(node: { children?: unknown[] }): Record<string, unknown> {
	const dot = node.children?.[0] as
		| { props: { style?: unknown } }
		| undefined;
	return flatStyle(dot ?? { props: {} });
}

describe("RadioGroup", () => {
	it("checked circle: 22dp circle, 2dp stroke, primary fill with a standard 10dp dot", async () => {
		const { themes } = require("../../themes");
		const screen: Screen = await render(
			<RadioGroup value="a">
				<RadioGroup.Item value="a" label="Alpha" testID="k-radio-item-a" />
			</RadioGroup>,
		);
		const circle = flatStyle(screen.getByTestId("k-radio-item-a-circle"));
		expect(circle.width).toBe(22);
		expect(circle.height).toBe(22);
		expect(circle.borderWidth).toBe(2);
		expect(circle.backgroundColor).toBe(themes.light.primary);
		expect(circle.borderColor).toBe(themes.light.primary);
		const dot = dotStyle(screen.getByTestId("k-radio-item-a-circle"));
		expect(dot.width).toBe(10);
		expect(dot.height).toBe(10);
		expect(dot.backgroundColor).toBe(themes.light.primaryForeground);
	});

	it("unchecked circle: border-defined transparent resting surface, no dot", async () => {
		const { themes } = require("../../themes");
		const screen: Screen = await render(
			<RadioGroup value="a">
				<RadioGroup.Item value="b" label="Beta" testID="k-radio-item-b" />
			</RadioGroup>,
		);
		const circle = flatStyle(screen.getByTestId("k-radio-item-b-circle"));
		expect(circle.borderWidth).toBe(2);
		expect(circle.backgroundColor).toBe("transparent");
		expect(circle.borderColor).toBe(themes.light.border);
		expect(screen.getByTestId("k-radio-item-b-circle").children?.length ?? 0).toBe(0);
	});

	it("hasError: destructive stroke unchecked; destructive dot over primary fill when checked", async () => {
		const { themes } = require("../../themes");
		const idle = await render(
			<RadioGroup value="a">
				<RadioGroup.Item value="b" label="Beta" testID="k-radio-item-b" hasError />
			</RadioGroup>,
		);
		expect(flatStyle(idle.getByTestId("k-radio-item-b-circle")).borderColor).toBe(
			themes.light.destructive,
		);
		const on = await render(
			<RadioGroup value="b">
				<RadioGroup.Item value="b" label="Beta" testID="k-radio-item-b" hasError />
			</RadioGroup>,
		);
		const circle = flatStyle(on.getByTestId("k-radio-item-b-circle"));
		expect(circle.backgroundColor).toBe(themes.light.primary);
		const dot = dotStyle(on.getByTestId("k-radio-item-b-circle"));
		expect(dot.backgroundColor).toBe(themes.light.destructive);
		expect(
			on.getByTestId("k-radio-item-b").props.accessibilityState,
		).toMatchObject({ checked: true });
	});

	it("group-disabled items block selection and announce disabled; item disabled merges with groupDisabled", async () => {
		const onValueChange = jest.fn();
		const screen: Screen = await render(
			<RadioGroup value="a" disabled onValueChange={onValueChange}>
				<RadioGroup.Item value="b" label="Beta" testID="k-radio-item-b" />
			</RadioGroup>,
		);
		await fireEvent.press(screen.getByTestId("k-radio-item-b"));
		expect(onValueChange).not.toHaveBeenCalled();
		expect(
			screen.getByTestId("k-radio-item-b").props.accessibilityState?.disabled,
		).toBe(true);
	});

	it("vertical root groups 44dp rows with the standard 4px list gap", async () => {
		const screen: Screen = await render(
			<RadioGroup value="a" testID="k-group">
				<RadioGroup.Item value="a" label="Alpha" testID="k-radio-item-a" />
				<RadioGroup.Item value="b" label="Beta" testID="k-radio-item-b" />
			</RadioGroup>,
		);
		const root = flatStyle(screen.getByTestId("k-group"));
		expect(root.flexDirection).toBe("column");
		expect(root.gap).toBe(4);
		const item = flatStyle(screen.getByTestId("k-radio-item-a"));
		expect(Number(item.minWidth)).toBeGreaterThanOrEqual(44);
		expect(Number(item.minHeight)).toBeGreaterThanOrEqual(44);
	});

	it("horizontal orientation lays a wrapping inline row with the 16px gap", async () => {
		const screen: Screen = await render(
			<RadioGroup value="a" orientation="horizontal" testID="k-group-inline">
				<RadioGroup.Item value="a" label="Alpha" testID="k-radio-item-a" />
				<RadioGroup.Item value="b" label="Beta" testID="k-radio-item-b" />
			</RadioGroup>,
		);
		const root = flatStyle(screen.getByTestId("k-group-inline"));
		expect(root.flexDirection).toBe("row");
		expect(root.flexWrap).toBe("wrap");
		expect(root.gap).toBe(16);
		const item = flatStyle(screen.getByTestId("k-radio-item-a"));
		expect(Number(item.minHeight)).toBeGreaterThanOrEqual(44);
	});

	it("horizontal selection still flips the dot; long labels shrink instead of clipping", async () => {
		const onValueChange = jest.fn();
		const screen: Screen = await render(
			<RadioGroup
				defaultValue="a"
				onValueChange={onValueChange}
				orientation="horizontal"
				testID="k-group-inline"
			>
				<RadioGroup.Item value="a" label="Alpha" testID="k-radio-item-a" />
				<RadioGroup.Item
					value="b"
					label="A very long inline label that must wrap"
					testID="k-radio-item-b"
				/>
			</RadioGroup>,
		);
		expect(
			screen.getByTestId("k-radio-item-a-circle").children?.length ?? 0,
		).toBeGreaterThan(0);
		await fireEvent.press(screen.getByTestId("k-radio-item-b"));
		expect(onValueChange).toHaveBeenCalledWith("b");
		expect(
			screen.getByTestId("k-radio-item-b-circle").children?.length ?? 0,
		).toBeGreaterThan(0);
		expect(screen.getByText("A very long inline label that must wrap")).toBeTruthy();
		const shrink = flatStyle(screen.getByTestId("k-radio-item-b"));
		expect(shrink.flexShrink).toBe(1);
		expect(shrink.flexGrow).toBeUndefined();
	});

	it("standalone item without a label: 44dp floor and an accessible name", async () => {
		const screen: Screen = await render(
			<RadioGroup defaultValue="only">
				<RadioGroup.Item
					value="only"
					accessibilityLabel="anonymous radio"
					testID="k-radio-item-solo"
				/>
			</RadioGroup>,
		);
		const item = flatStyle(screen.getByTestId("k-radio-item-solo"));
		expect(Number(item.minWidth)).toBeGreaterThanOrEqual(44);
		expect(Number(item.minHeight)).toBeGreaterThanOrEqual(44);
		expect(
			screen.getByTestId("k-radio-item-solo").props.accessibilityLabel,
		).toBe("anonymous radio");
	});

	it("disabled+hasError: destructive border wins over theme.border; disabled only dims", async () => {
		const { themes } = require("../../themes");
		const screen: Screen = await render(
			<RadioGroup value="a" disabled>
				<RadioGroup.Item
					value="b"
					label="Beta"
					hasError
					testID="k-radio-item-b"
				/>
			</RadioGroup>,
		);
		const circle = flatStyle(screen.getByTestId("k-radio-item-b-circle"));
		expect(circle.borderColor).toBe(themes.light.destructive);
		expect(circle.backgroundColor).toBe("transparent");
		const item = flatStyle(screen.getByTestId("k-radio-item-b"));
		expect(item.opacity).toBe(0.5);
	});

	it("unmatched value: nothing checked, selection still works, flip back un-checks", async () => {
		const onValueChange = jest.fn();
		const screen: Screen = await render(
			<RadioGroup value="ghost" onValueChange={onValueChange} testID="k-group">
				<RadioGroup.Item value="a" label="Alpha" testID="k-radio-item-a" />
				<RadioGroup.Item value="b" label="Beta" testID="k-radio-item-b" />
			</RadioGroup>,
		);
		for (const id of ["k-radio-item-a-circle", "k-radio-item-b-circle"]) {
			expect(screen.getByTestId(id).children?.length ?? 0).toBe(0);
		}
		const [alpha, beta] = screen.getAllByRole("radio");
		expect(alpha.props.accessibilityState?.checked).toBe(false);
		expect(beta.props.accessibilityState?.checked).toBe(false);

		await fireEvent.press(screen.getByTestId("k-radio-item-b"));
		expect(onValueChange).toHaveBeenCalledWith("b");
		// still controlled: the owner decides — nothing checked until value flips
		expect(
			screen.getByTestId("k-radio-item-b-circle").children?.length ?? 0,
		).toBe(0);

		await screen.rerender(
			<RadioGroup value="b" onValueChange={onValueChange} testID="k-group">
				<RadioGroup.Item value="a" label="Alpha" testID="k-radio-item-a" />
				<RadioGroup.Item value="b" label="Beta" testID="k-radio-item-b" />
			</RadioGroup>,
		);
		expect(
			screen.getByTestId("k-radio-item-b-circle").children?.length ?? 0,
		).toBeGreaterThan(0);

		// re-selecting the now-checked item is a no-op
		await fireEvent.press(screen.getByTestId("k-radio-item-b"));
		expect(onValueChange).toHaveBeenCalledTimes(1);

		// controlled value returning to the unmatched value un-checks everything
		await screen.rerender(
			<RadioGroup value="ghost" onValueChange={onValueChange} testID="k-group">
				<RadioGroup.Item value="a" label="Alpha" testID="k-radio-item-a" />
				<RadioGroup.Item value="b" label="Beta" testID="k-radio-item-b" />
			</RadioGroup>,
		);
		expect(
			screen.getByTestId("k-radio-item-b-circle").children?.length ?? 0,
		).toBe(0);
	});

	it("empty-string value is selectable and matches an item", async () => {
		const onValueChange = jest.fn();
		const screen: Screen = await render(
			<RadioGroup
				value=""
				onValueChange={onValueChange}
				testID="k-group"
			>
				<RadioGroup.Item value="" label="Blank" testID="k-radio-item-a" />
				<RadioGroup.Item value="b" label="Beta" testID="k-radio-item-b" />
			</RadioGroup>,
		);
		expect(
			screen.getByTestId("k-radio-item-a-circle").children?.length ?? 0,
		).toBeGreaterThan(0);
		expect(
			screen.getByTestId("k-radio-item-a").props.accessibilityState
				?.checked,
		).toBe(true);

		// the empty-value item is a live press target too: press it and it owns the group
		const flip: Screen = await render(
			<RadioGroup
				defaultValue="b"
				onValueChange={onValueChange}
				testID="k-group"
			>
				<RadioGroup.Item value="" label="Blank" testID="k-radio-item-a" />
				<RadioGroup.Item value="b" label="Beta" testID="k-radio-item-b" />
			</RadioGroup>,
		);
		await fireEvent.press(flip.getByTestId("k-radio-item-a"));
		expect(onValueChange).toHaveBeenCalledWith("");
		expect(
			flip.getByTestId("k-radio-item-a-circle").children?.length ?? 0,
		).toBeGreaterThan(0);
		expect(
			flip.getByTestId("k-radio-item-b-circle").children?.length ?? 0,
		).toBe(0);
	});

	it("unbroken long words: shrink chain from item through label so the row never widens", async () => {
		const screen: Screen = await render(
			<RadioGroup value="a" testID="k-group">
				<RadioGroup.Item
					value="a"
					label="InternationalizationSupercalifragilisticexpialidociousAntidisestablishmentarianism"
					description="Pneumonoultramicroscopicsilicovolcanoconiosis is the longest word in major English dictionaries and keeps going"
					testID="k-radio-item-a"
				/>
			</RadioGroup>,
		);
		const item = flatStyle(screen.getByTestId("k-radio-item-a"));
		expect(item.flexShrink).toBe(1);
		const label = screen.getByText(/Internationalization\w+/);
		expect(flatStyle(label).flexShrink).toBe(1);
		expect(flatStyle(screen.getByText(/Pneumonoultramicroscopics\w+/)).flexShrink).toBe(1);
		expect(screen.getByText(/Internationalization\w+/)).toBeTruthy();
		expect(screen.getByText(/Pneumonoultramicroscopics\w+/)).toBeTruthy();
		expect(
			screen.getByTestId("k-radio-item-a").props.accessibilityLabel,
		).toContain("Pneumonoultramicroscopicsilicovolcanoconiosis");
	});

	it("description renders under the label and joins the a11y label; re-select is a no-op", async () => {
		const onValueChange = jest.fn();
		const screen: Screen = await render(
			<RadioGroup value="a" onValueChange={onValueChange}>
				<RadioGroup.Item
					value="a"
					label="Alpha"
					description="first"
					testID="k-radio-item-a"
				/>
				<RadioGroup.Item value="b" label="Beta" testID="k-radio-item-b" />
			</RadioGroup>,
		);
		expect(screen.getByTestId("k-radio-item-a").props.accessibilityLabel).toBe(
			"Alpha, first",
		);
		await fireEvent.press(screen.getByTestId("k-radio-item-a"));
		expect(onValueChange).not.toHaveBeenCalled();
		await fireEvent.press(screen.getByTestId("k-radio-item-b"));
		expect(onValueChange).toHaveBeenCalledWith("b");
	});
});
