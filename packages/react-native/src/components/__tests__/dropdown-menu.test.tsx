import { fireEvent, render } from "@testing-library/react-native";
import { StyleSheet } from "react-native";
import type { DropdownMenuItem } from "../dropdown-menu";
import { DropdownMenu } from "../dropdown-menu";

type Screen = Awaited<ReturnType<typeof render>>;

const actions: DropdownMenuItem[] = [
	{ key: "edit", label: "Edit" },
	{ key: "share", label: "Share" },
	{ key: "delete", label: "Delete", destructive: true },
	{ key: "archive", label: "Archive", disabled: true },
];

function labelColor(row: { props: { children?: unknown } }): unknown {
	const children = (
		Array.isArray(row.props.children)
			? row.props.children
			: [row.props.children]
	) as { props?: { style?: unknown } }[];
	for (const child of children) {
		const flat = StyleSheet.flatten(child?.props?.style as never) as
			| { color?: string }
			| undefined;
		if (flat?.color) return flat.color;
	}
	return null;
}

const inclHidden = { includeHiddenElements: true } as const;

async function openMenu(items: DropdownMenuItem[] = actions): Promise<Screen> {
	const screen: Screen = await render(
		<DropdownMenu items={items} triggerLabel="actions" />,
	);
	await fireEvent.press(screen.getByTestId("k-dropdown-menu"));
	return screen;
}

describe("DropdownMenu", () => {
	it("renders a trigger button marked collapsed until pressed", async () => {
		const screen: Screen = await render(
			<DropdownMenu items={actions} triggerLabel="actions" />,
		);
		const trigger = screen.getByTestId("k-dropdown-menu");
		expect(trigger.props.accessibilityRole).toBe("button");
		expect(trigger.props.accessibilityState.expanded).toBe(false);
	});

	it("opens the sheet on trigger press with content and item markers", async () => {
		const screen = await openMenu();
		expect(screen.getByTestId("k-dropdown-menu-content")).toBeTruthy();
		expect(screen.getAllByTestId("k-dropdown-menu-item")).toHaveLength(4);
		expect(
			screen.getByTestId("k-dropdown-menu").props.accessibilityState.expanded,
		).toBe(true);
	});

	it("action press fires onSelect, closes the sheet, and collapses the trigger", async () => {
		const onSelect = jest.fn();
		const screen = await openMenu([{ key: "edit", label: "Edit", onSelect }]);
		await fireEvent.press(screen.getAllByTestId("k-dropdown-menu-item")[0]);
		expect(onSelect).toHaveBeenCalledTimes(1);
		expect(screen.queryByTestId("k-dropdown-menu-content")).toBeNull();
		expect(
			screen.getByTestId("k-dropdown-menu").props.accessibilityState.expanded,
		).toBe(false);
	});

	it("overlay dismiss closes without firing any onSelect and collapses the trigger", async () => {
		const onSelect = jest.fn();
		const screen = await openMenu([{ key: "edit", label: "Edit", onSelect }]);
		await fireEvent.press(screen.getByTestId("k-sheet-overlay", inclHidden));
		expect(onSelect).not.toHaveBeenCalled();
		expect(screen.queryByTestId("k-dropdown-menu-content")).toBeNull();
		expect(
			screen.getByTestId("k-dropdown-menu").props.accessibilityState.expanded,
		).toBe(false);
	});

	it("destructive rows use the destructive text color; plain rows do not", async () => {
		const screen = await openMenu();
		const rows = screen.getAllByTestId("k-dropdown-menu-item");
		const plain = labelColor(rows[0]);
		const destructive = labelColor(rows[2]);
		expect(destructive).toBeTruthy();
		expect(plain).toBeTruthy();
		expect(destructive).not.toEqual(plain);
	});

	it("disabled rows are muted and unpressable", async () => {
		const onSelect = jest.fn();
		const screen = await openMenu([
			{ key: "archive", label: "Archive", disabled: true, onSelect },
		]);
		const row = screen.getAllByTestId("k-dropdown-menu-item")[0];
		expect(row.props.accessibilityState.disabled).toBe(true);
		expect(StyleSheet.flatten(row.props.style).opacity).toBe(0.5);
		await fireEvent.press(row);
		expect(onSelect).not.toHaveBeenCalled();
	});

	it("checkbox row toggles through onCheckedChange and keeps the sheet open", async () => {
		const onCheckedChange = jest.fn();
		const screen = await openMenu([
			{
				type: "checkbox",
				key: "sync",
				label: "Sync",
				checked: false,
				onCheckedChange,
			},
		]);
		const row = screen.getByTestId("k-dropdown-menu-checkbox-item");
		expect(screen.queryByTestId("k-menu-item-indicator")).toBeNull();
		await fireEvent.press(row);
		expect(onCheckedChange).toHaveBeenCalledWith(true);
		expect(screen.getByTestId("k-dropdown-menu-content")).toBeTruthy();
	});

	it("checkbox row shows the check indicator only when checked", async () => {
		const screen = await openMenu([
			{
				type: "checkbox",
				key: "sync",
				label: "Sync",
				checked: true,
				onCheckedChange: jest.fn(),
			},
		]);
		expect(screen.getByTestId("k-menu-item-indicator")).toBeTruthy();
	});

	it("radio row fires onCheckedChange(true), shows a dot, and keeps the sheet open", async () => {
		const onCheckedChange = jest.fn();
		const screen = await openMenu([
			{
				type: "radio",
				key: "light",
				label: "Light",
				checked: false,
				onCheckedChange,
			},
		]);
		const row = screen.getByTestId("k-dropdown-menu-radio-item");
		expect(screen.queryByTestId("k-menu-item-indicator")).toBeNull();
		await fireEvent.press(row);
		expect(onCheckedChange).toHaveBeenCalledWith(true);
		expect(screen.getByTestId("k-dropdown-menu-content")).toBeTruthy();
	});

	it("label and separator rows render non-interactive", async () => {
		const screen = await openMenu([
			{ type: "label", key: "l1", label: "Actions" },
			{ type: "separator", key: "s1" },
			{ key: "edit", label: "Edit" },
		]);
		const label = screen.getByTestId("k-dropdown-menu-label");
		expect(label.props.onPress).toBeUndefined();
		expect(label.props.accessibilityRole).toBeUndefined();
		expect(screen.getByTestId("k-dropdown-menu-separator")).toBeTruthy();
	});

	it("empty items render the no-actions row", async () => {
		const screen = await openMenu([]);
		expect(screen.getByTestId("k-dropdown-menu-empty")).toBeTruthy();
	});

	it("slot style overrides win on the content surface", async () => {
		const screen: Screen = await render(
			<DropdownMenu
				items={actions}
				triggerLabel="actions"
				slotStyles={{ content: { borderWidth: 3 } }}
			/>,
		);
		await fireEvent.press(screen.getByTestId("k-dropdown-menu"));
		const content = screen.getByTestId("k-dropdown-menu-content");
		expect(StyleSheet.flatten(content.props.style).borderWidth).toBe(3);
	});

	it("renders nothing for the sheet until opened", async () => {
		const screen: Screen = await render(
			<DropdownMenu items={actions} triggerLabel="actions" />,
		);
		expect(screen.queryByTestId("k-dropdown-menu-content")).toBeNull();
	});
});
