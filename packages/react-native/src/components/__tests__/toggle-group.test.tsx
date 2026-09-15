/**
 * ToggleGroup contracts: single/multiple selection semantics, group→item
 * context flow (size/variant), and disabled gating at both levels. Single
 * behaves like a deselectable radio set ('' when empty); multiple reports
 * arrays of every active value, like the web toolbar-toggle pattern.
 */
import { fireEvent, render } from "@testing-library/react-native";
import { ToggleGroup, ToggleGroupItem } from "../toggle-group";

const incl = { includeHiddenElements: true } as const;

const flatStyle = (node: {
	props: { style?: unknown };
}): Record<string, number | string> =>
	require("react-native").StyleSheet.flatten(node.props.style) ?? {};

const items = (
	screen: Awaited<ReturnType<typeof render>>,
): ReturnType<typeof screen.getAllByTestId> =>
	screen.getAllByTestId("k-toggle-group-item", incl);

describe("ToggleGroup", () => {
	it("renders group and item markers as a row with a11y group role", async () => {
		const screen = await render(
			<ToggleGroup type="single">
				<ToggleGroupItem value="left">Left</ToggleGroupItem>
				<ToggleGroupItem value="right">Right</ToggleGroupItem>
			</ToggleGroup>,
		);
		const group = screen.getByTestId("k-toggle-group");
		// web's toolbar-toggle pattern: the group announces as a toolbar
		expect(group.props.accessibilityRole).toBe("toolbar");
		expect(items(screen).length).toBe(2);
		const s = flatStyle(group);
		expect(s.flexDirection).toBe("row");
		expect(Number(s.gap)).toBeGreaterThan(0);
	});

	it("single mode selects one item and deselects back to empty string", async () => {
		const onValueChange = jest.fn();
		const screen = await render(
			<ToggleGroup type="single" onValueChange={onValueChange}>
				<ToggleGroupItem value="left">Left</ToggleGroupItem>
				<ToggleGroupItem value="right">Right</ToggleGroupItem>
			</ToggleGroup>,
		);
		await fireEvent.press(items(screen)[0]);
		expect(onValueChange).toHaveBeenCalledWith("left");
		expect(items(screen)[0].props.accessibilityState.checked).toBe(true);
		expect(items(screen)[1].props.accessibilityState.checked).toBe(false);

		// pressing the active item turns it off — the deselect arm
		onValueChange.mockClear();
		await fireEvent.press(items(screen)[0]);
		expect(onValueChange).toHaveBeenCalledWith("");
		expect(items(screen)[0].props.accessibilityState.checked).toBe(false);
	});

	it("single mode switches exclusivity: a new item replaces the old one", async () => {
		const onValueChange = jest.fn();
		const screen = await render(
			<ToggleGroup type="single" onValueChange={onValueChange}>
				<ToggleGroupItem value="left">Left</ToggleGroupItem>
				<ToggleGroupItem value="right">Right</ToggleGroupItem>
			</ToggleGroup>,
		);
		await fireEvent.press(items(screen)[0]);
		await fireEvent.press(items(screen)[1]);
		expect(onValueChange).toHaveBeenNthCalledWith(1, "left");
		expect(onValueChange).toHaveBeenNthCalledWith(2, "right");
		expect(items(screen)[0].props.accessibilityState.checked).toBe(false);
		expect(items(screen)[1].props.accessibilityState.checked).toBe(true);
	});

	it("multiple mode toggles items independently and reports arrays", async () => {
		const onValueChange = jest.fn();
		const screen = await render(
			<ToggleGroup type="multiple" onValueChange={onValueChange}>
				<ToggleGroupItem value="bold">Bold</ToggleGroupItem>
				<ToggleGroupItem value="italic">Italic</ToggleGroupItem>
			</ToggleGroup>,
		);
		await fireEvent.press(items(screen)[0]);
		expect(onValueChange).toHaveBeenCalledWith(["bold"]);
		await fireEvent.press(items(screen)[1]);
		expect(onValueChange).toHaveBeenCalledWith(["bold", "italic"]);
		// removing keeps the remaining active values
		onValueChange.mockClear();
		await fireEvent.press(items(screen)[0]);
		expect(onValueChange).toHaveBeenCalledWith(["italic"]);
		expect(items(screen)[0].props.accessibilityState.checked).toBe(false);
		expect(items(screen)[1].props.accessibilityState.checked).toBe(true);
	});

	it("controlled single value wins until the parent updates it", async () => {
		const onValueChange = jest.fn();
		const screen = await render(
			<ToggleGroup type="single" value="center" onValueChange={onValueChange}>
				<ToggleGroupItem value="left">Left</ToggleGroupItem>
				<ToggleGroupItem value="center">Center</ToggleGroupItem>
			</ToggleGroup>,
		);
		expect(items(screen)[1].props.accessibilityState.checked).toBe(true);
		await fireEvent.press(items(screen)[0]);
		expect(onValueChange).toHaveBeenCalledWith("left");
		// controlled lock: state only moves when the parent re-renders
		expect(items(screen)[1].props.accessibilityState.checked).toBe(true);
		expect(items(screen)[0].props.accessibilityState.checked).toBe(false);

		await screen.rerender(
			<ToggleGroup type="single" value="left" onValueChange={onValueChange}>
				<ToggleGroupItem value="left">Left</ToggleGroupItem>
				<ToggleGroupItem value="center">Center</ToggleGroupItem>
			</ToggleGroup>,
		);
		expect(items(screen)[0].props.accessibilityState.checked).toBe(true);
		expect(items(screen)[1].props.accessibilityState.checked).toBe(false);
	});

	it("defaultValue seeds single and multiple state", async () => {
		const screen = await render(
			<ToggleGroup type="single" defaultValue="right">
				<ToggleGroupItem value="left">Left</ToggleGroupItem>
				<ToggleGroupItem value="right">Right</ToggleGroupItem>
			</ToggleGroup>,
		);
		expect(items(screen)[1].props.accessibilityState.checked).toBe(true);

		const multi = await render(
			<ToggleGroup type="multiple" defaultValue={["bold"]}>
				<ToggleGroupItem value="bold">Bold</ToggleGroupItem>
				<ToggleGroupItem value="italic">Italic</ToggleGroupItem>
			</ToggleGroup>,
		);
		expect(items(multi)[0].props.accessibilityState.checked).toBe(true);
		expect(items(multi)[1].props.accessibilityState.checked).toBe(false);
	});

	it("group size flows to items through context unless the item overrides", async () => {
		const screen = await render(
			<ToggleGroup type="single" size="lg">
				<ToggleGroupItem value="a">A</ToggleGroupItem>
				<ToggleGroupItem value="b" size="sm">
					B
				</ToggleGroupItem>
			</ToggleGroup>,
		);
		const heights = items(screen).map((item) =>
			Number(flatStyle(item).height),
		);
		expect(heights[0]).toBe(44);
		expect(heights[1]).toBe(36);
	});

	it("a disabled item never fires and dims; a disabled group gates all items", async () => {
		const onValueChange = jest.fn();
		const screen = await render(
			<ToggleGroup type="single" onValueChange={onValueChange}>
				<ToggleGroupItem value="a" disabled>
					A
				</ToggleGroupItem>
				<ToggleGroupItem value="b">B</ToggleGroupItem>
			</ToggleGroup>,
		);
		await fireEvent.press(items(screen)[0]);
		expect(onValueChange).not.toHaveBeenCalled();
		expect(Number(flatStyle(items(screen)[0]).opacity)).toBeLessThan(1);
		expect(
			items(screen)[0].props.accessibilityState.disabled,
		).toBe(true);

		await screen.rerender(
			<ToggleGroup type="single" disabled onValueChange={onValueChange}>
				<ToggleGroupItem value="a">A</ToggleGroupItem>
				<ToggleGroupItem value="b">B</ToggleGroupItem>
			</ToggleGroup>,
		);
		await fireEvent.press(items(screen)[1]);
		expect(onValueChange).not.toHaveBeenCalled();
		expect(items(screen)[1].props.accessibilityState.disabled).toBe(true);
	});

	it("renders an empty group marker with zero items", async () => {
		const screen = await render(<ToggleGroup type="single" />);
		expect(screen.getByTestId("k-toggle-group")).toBeTruthy();
		expect(screen.queryAllByTestId("k-toggle-group-item")).toEqual([]);
	});

	it("string children render as host Text nodes", async () => {
		const screen = await render(
			<ToggleGroup type="single">
				<ToggleGroupItem value="left">Left</ToggleGroupItem>
			</ToggleGroup>,
		);
		const walk = (node: unknown, found: string[]): string[] => {
			if (Array.isArray(node)) {
				node.forEach((child) => {
					walk(child, found);
				});
				return found;
			}
			if (node && typeof node === "object") {
				const n = node as { type?: string; children?: unknown };
				if (n.type === "Text") {
					found.push(
						...((Array.isArray(n.children)
							? n.children
							: [n.children]
						).filter(
							(child: unknown) => typeof child === "string",
						) as string[]),
					);
				}
				walk(n.children, found);
			}
			return found;
		};
		const texts = walk(screen.toJSON(), []);
		expect(texts).toContain("Left");
	});
});
