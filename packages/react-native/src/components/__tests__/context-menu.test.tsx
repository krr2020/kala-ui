import { fireEvent, render } from "@testing-library/react-native";
import { Text } from "react-native";
import { ContextMenu } from "../context-menu";
import type { DropdownMenuItem } from "../dropdown-menu";

type Screen = Awaited<ReturnType<typeof render>>;

const actions: DropdownMenuItem[] = [
	{ key: "copy", label: "Copy", onSelect: jest.fn() },
	{ key: "delete", label: "Delete", destructive: true },
];

const inclHidden = { includeHiddenElements: true } as const;

describe("ContextMenu", () => {
	it("wraps arbitrary children under the k-context-menu marker", async () => {
		const screen: Screen = await render(
			<ContextMenu items={actions}>
				<Text>invoice.pdf</Text>
			</ContextMenu>,
		);
		expect(screen.getByTestId("k-context-menu")).toBeTruthy();
		expect(screen.getByText("invoice.pdf")).toBeTruthy();
	});

	it("opens the sheet on longPress with content and item markers", async () => {
		const screen: Screen = await render(
			<ContextMenu items={actions}>
				<Text>invoice.pdf</Text>
			</ContextMenu>,
		);
		await fireEvent(screen.getByTestId("k-context-menu"), "longPress");
		expect(screen.getByTestId("k-context-menu-content")).toBeTruthy();
		expect(screen.getAllByTestId("k-context-menu-item")).toHaveLength(2);
	});

	it("a plain press does not open the menu", async () => {
		const screen: Screen = await render(
			<ContextMenu items={actions}>
				<Text>invoice.pdf</Text>
			</ContextMenu>,
		);
		await fireEvent.press(screen.getByTestId("k-context-menu"));
		expect(screen.queryByTestId("k-context-menu-content")).toBeNull();
	});

	it("overlay dismiss closes the sheet and fires onClose", async () => {
		const onClose = jest.fn();
		const screen: Screen = await render(
			<ContextMenu items={actions} onClose={onClose}>
				<Text>invoice.pdf</Text>
			</ContextMenu>,
		);
		await fireEvent(screen.getByTestId("k-context-menu"), "longPress");
		await fireEvent.press(screen.getByTestId("k-sheet-overlay", inclHidden));
		expect(onClose).toHaveBeenCalledTimes(1);
		expect(screen.queryByTestId("k-context-menu-content")).toBeNull();
	});

	it("action press fires onSelect and closes the sheet", async () => {
		const onSelect = jest.fn();
		const screen: Screen = await render(
			<ContextMenu items={[{ key: "copy", label: "Copy", onSelect }]}>
				<Text>invoice.pdf</Text>
			</ContextMenu>,
		);
		await fireEvent(screen.getByTestId("k-context-menu"), "longPress");
		await fireEvent.press(screen.getAllByTestId("k-context-menu-item")[0]);
		expect(onSelect).toHaveBeenCalledTimes(1);
		expect(screen.queryByTestId("k-context-menu-content")).toBeNull();
	});
});
