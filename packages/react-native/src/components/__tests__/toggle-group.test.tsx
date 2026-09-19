/**
 * ToggleGroup contracts: single/multiple selection semantics, group→item
 * context flow (size/variant), and disabled gating at both levels. Single
 * behaves like a deselectable radio set ('' when empty); multiple reports
 * arrays of every active value, like the web toolbar-toggle pattern.
 */
import { fireEvent, render } from "@testing-library/react-native";
import { themes } from "../../themes";
import { ToggleGroup, ToggleGroupItem } from "../toggle-group";
import { toValues } from "../toggle-group/toggle-group.styles";

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
		// joined strip: one muted single-row track, not free-floating buttons
		const s = flatStyle(group);
		expect(s.flexDirection).toBe("row");
		expect(s.flexWrap).toBeUndefined();
		expect(s.overflow).toBe("hidden");
		expect(s.backgroundColor).toBe(themes.light.muted);
		expect(Number(s.borderRadius)).toBeGreaterThan(0);
	});

	it("outline variant draws one joined border with hairline separators", async () => {
		const screen = await render(
			<ToggleGroup type="single" variant="outline">
				<ToggleGroupItem value="left">Left</ToggleGroupItem>
				<ToggleGroupItem value="center">Center</ToggleGroupItem>
				<ToggleGroupItem value="right">Right</ToggleGroupItem>
			</ToggleGroup>,
		);
		const track = flatStyle(screen.getByTestId("k-toggle-group"));
		expect(Number(track.borderWidth)).toBe(1);
		expect(track.borderColor).toBe(themes.light.border);
		expect(track.overflow).toBe("hidden");
		// grouped items carry no chrome of their own — the track owns it
		const rows = items(screen).map(flatStyle);
		expect(rows[0].borderWidth).toBe(0);
		expect(rows[0].borderLeftWidth).toBeUndefined();
		expect(Number(rows[1].borderLeftWidth)).toBe(1);
		expect(rows[1].borderColor).toBe(themes.light.border);
		expect(Number(rows[2].borderLeftWidth)).toBe(1);
		});

	it("default variant: active item keeps its accent fill inside the muted track", async () => {
		const screen = await render(
			<ToggleGroup type="single" defaultValue="left">
				<ToggleGroupItem value="left">Left</ToggleGroupItem>
				<ToggleGroupItem value="right">Right</ToggleGroupItem>
			</ToggleGroup>,
		);
		const track = flatStyle(screen.getByTestId("k-toggle-group"));
		expect(track.backgroundColor).toBe(themes.light.muted);
		expect(Number(track.borderWidth)).toBe(0);
		expect(flatStyle(items(screen)[0]).backgroundColor).toBe(
			themes.light.accent,
		);
		});

	it("a disabled outline group keeps its strip border", async () => {
		const screen = await render(
			<ToggleGroup type="single" variant="outline" disabled>
				<ToggleGroupItem value="a">A</ToggleGroupItem>
				<ToggleGroupItem value="b">B</ToggleGroupItem>
			</ToggleGroup>,
		);
		const track = flatStyle(screen.getByTestId("k-toggle-group"));
		expect(Number(track.borderWidth)).toBe(1);
		expect(track.borderColor).toBe(themes.light.border);
		});

	it("toValues: '' and undefined normalize to empty; strings and arrays pass through", () => {
		expect(toValues("")).toEqual([]);
		expect(toValues(undefined)).toEqual([]);
		expect(toValues("a")).toEqual(["a"]);
		expect(toValues(["a", "b"])).toEqual(["a", "b"]);
		});

	it("controlled single value='' selects nothing but presses still report", async () => {
		const onValueChange = jest.fn();
		const screen = await render(
			<ToggleGroup type="single" value="" onValueChange={onValueChange}>
				<ToggleGroupItem value="left">Left</ToggleGroupItem>
				<ToggleGroupItem value="right">Right</ToggleGroupItem>
			</ToggleGroup>,
		);
		expect(
			items(screen).every((i) => !i.props.accessibilityState.checked),
		).toBe(true);
		await fireEvent.press(items(screen)[0]);
		expect(onValueChange).toHaveBeenCalledWith("left");
		expect(
			items(screen).every((i) => !i.props.accessibilityState.checked),
		).toBe(true);
		});

	it("removing the first child re-derives separators with no stale state", async () => {
		const screen = await render(
			<ToggleGroup type="single" variant="outline">
				<ToggleGroupItem value="a">A</ToggleGroupItem>
				<ToggleGroupItem value="b">B</ToggleGroupItem>
				<ToggleGroupItem value="c">C</ToggleGroupItem>
			</ToggleGroup>,
		);
		await screen.rerender(
			<ToggleGroup type="single" variant="outline">
				<ToggleGroupItem value="b">B</ToggleGroupItem>
				<ToggleGroupItem value="c">C</ToggleGroupItem>
			</ToggleGroup>,
		);
		const rows = items(screen).map(flatStyle);
		expect(rows[0].borderLeftWidth).toBeUndefined();
		expect(Number(rows[1].borderLeftWidth)).toBe(1);
		});

	it("single-child group renders with no separator", async () => {
		const screen = await render(
			<ToggleGroup type="single" variant="outline">
				<ToggleGroupItem value="solo">Solo</ToggleGroupItem>
			</ToggleGroup>,
		);
		expect(flatStyle(items(screen)[0]).borderLeftWidth).toBeUndefined();
		});

	it("standalone item outside a group keeps its own pill surface", async () => {
		const screen = await render(<ToggleGroupItem value="solo">Solo</ToggleGroupItem>);
		const solo = flatStyle(screen.getByTestId("k-toggle-group-item"));
		expect(Number(solo.borderRadius)).toBeGreaterThan(0);
		await fireEvent.press(screen.getByTestId("k-toggle-group-item"));
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
	const heights = items(screen).map((item) => Number(flatStyle(item).minHeight));
	expect(heights[0]).toBe(44);
	expect(heights[1]).toBe(36);
	// the 44dp touch floor rides the Pressable hitSlop prop per size —
	// vertical-only so adjacent joined items cannot steal horizontal taps
	expect(items(screen)[0].props.hitSlop).toBeUndefined();
	expect(
		(items(screen)[1].props.hitSlop as { top?: number }).top,
	).toBe(4);
	const md = await render(
		<ToggleGroup type="single">
			<ToggleGroupItem value="a">A</ToggleGroupItem>
		</ToggleGroup>,
	);
	// md (40) still tops up to the 44 floor — vertical only, like sm
	expect(md.getAllByTestId("k-toggle-group-item")[0].props.hitSlop).toEqual({
		top: 2,
		bottom: 2,
		left: 0,
		right: 0,
	});
	});

	it("a disabled group item keeps its surface and shows a state glyph (Check when active, Lock when not)", async () => {
		const screen = await render(
			<ToggleGroup type="single" value="a">
				<ToggleGroupItem value="a" disabled>
					Active
				</ToggleGroupItem>
				<ToggleGroupItem value="b" disabled>
					Idle
				</ToggleGroupItem>
			</ToggleGroup>,
		);
		const rows = items(screen);
		expect(flatStyle(rows[0]).opacity).toBe(0.5);
		expect(flatStyle(rows[1]).opacity).toBe(0.5);
		expect(rows[0].props.accessibilityState.checked).toBe(true);
		expect(rows[1].props.accessibilityState.checked).toBe(false);
		const walk = (node: unknown, found: string[]): string[] => {
			const n = node as { props?: { testID?: string }; children?: unknown };
			if (n?.props?.testID?.startsWith("k-toggle-")) found.push(n.props.testID);
			if (n?.children) {
				for (const c of [n.children].flat()) walk(c, found);
			}
			return found;
		};
		const glyphRoot = walk(screen.toJSON(), []).filter((id) =>
			id.includes("-glyph-"),
		);
		expect(glyphRoot.sort()).toEqual([
			"k-toggle-group-item-glyph-check",
			"k-toggle-group-item-glyph-lock",
		]);
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
		expect(items(screen)[0].props.accessibilityState.disabled).toBe(true);

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
						...((Array.isArray(n.children) ? n.children : [n.children]).filter(
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
