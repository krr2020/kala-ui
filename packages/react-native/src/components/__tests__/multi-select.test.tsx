import { fireEvent, render, within } from "@testing-library/react-native";
import type { MultiSelectOption } from "../multi-select";
import { MultiSelect } from "../multi-select";

type Screen = Awaited<ReturnType<typeof render>>;

const inclHidden = { includeHiddenElements: true } as const;

const options: MultiSelectOption[] = [
	{ value: "apple", label: "Apple" },
	{ value: "banana", label: "Banana" },
	{ value: "cherry", label: "Cherry", disabled: true },
	{ value: "date", label: "Date" },
];

async function openSelect(
	props: Partial<Parameters<typeof MultiSelect>[0]> = {},
): Promise<Screen> {
	const screen: Screen = await render(
		<MultiSelect options={options} {...props} />,
	);
	await fireEvent.press(screen.getByTestId("k-multi-select"));
	return screen;
}

describe("MultiSelect", () => {
	it("renders a collapsed trigger that opens the sheet on press", async () => {
		const screen = await openSelect();
		expect(screen.getByTestId("k-multi-select-content")).toBeTruthy();
		expect(
			screen.getByTestId("k-multi-select").props.accessibilityState.expanded,
		).toBe(true);
	});

	it("renders chips per selection with a +N badge beyond maxVisibleSelections", async () => {
		const exact = await render(
			<MultiSelect
				options={options}
				defaultValue={["apple", "banana"]}
				maxVisibleSelections={2}
			/>,
		);
		expect(exact.getAllByTestId("k-multi-select-chip")).toHaveLength(2);
		expect(exact.queryByTestId("k-multi-select-overflow")).toBeNull();

		const overflow = await render(
			<MultiSelect
				options={options}
				defaultValue={["apple", "banana", "date"]}
				maxVisibleSelections={2}
			/>,
		);
		expect(overflow.getAllByTestId("k-multi-select-chip")).toHaveLength(2);
		const badge = overflow.getByTestId("k-multi-select-overflow");
		expect(badge.props.children).toContain("+1");
	});

	it("toggling a row fires onValueChange with the full array and stays open", async () => {
		const onValueChange = jest.fn();
		const screen = await openSelect({
			defaultValue: ["apple"],
			onValueChange,
		});
		const rows = screen.getAllByTestId(/k-multi-select-option-\d/);
		expect(rows[0].props.accessibilityState.checked).toBe(true);
		await fireEvent.press(rows[1]);
		expect(onValueChange).toHaveBeenCalledWith(["apple", "banana"]);
		expect(screen.getByTestId("k-multi-select-content")).toBeTruthy();
		await fireEvent.press(rows[0]);
		expect(onValueChange).toHaveBeenLastCalledWith(["banana"]);
	});

	it("chip X removal fires onValueChange and does not open the sheet", async () => {
		const onValueChange = jest.fn();
		const screen = await render(
			<MultiSelect
				options={options}
				defaultValue={["apple", "banana"]}
				onValueChange={onValueChange}
			/>,
		);
		const chips = screen.getAllByTestId("k-multi-select-chip");
		expect(chips).toHaveLength(2);
		await fireEvent.press(
			screen.getAllByTestId("k-multi-select-chip-remove")[0],
		);
		expect(onValueChange).toHaveBeenCalledWith(["banana"]);
		expect(
			screen.getByTestId("k-multi-select").props.accessibilityState.expanded,
		).toBe(false);
	});

	it("maxSelected gates additions but allows deselection at the cap", async () => {
		const onValueChange = jest.fn();
		const screen = await openSelect({
			defaultValue: ["apple", "banana"],
			maxSelected: 2,
			onValueChange,
		});
		const rows = screen.getAllByTestId(/k-multi-select-option-\d/);
		expect(rows[3].props.accessibilityState.disabled).toBe(true);
		await fireEvent.press(rows[3]);
		expect(onValueChange).not.toHaveBeenCalled();
		await fireEvent.press(rows[0]);
		expect(onValueChange).toHaveBeenCalledWith(["banana"]);
	});

	it("select-all commits enabled values only and toggles to [] when complete", async () => {
		const onValueChange = jest.fn();
		const screen = await openSelect({ onValueChange });
		await fireEvent.press(screen.getByTestId("k-multi-select-select-all"));
		expect(onValueChange).toHaveBeenCalledWith(["apple", "banana", "date"]);
		await screen.rerender(
			<MultiSelect
				options={options}
				value={["apple", "banana", "date"]}
				onValueChange={onValueChange}
			/>,
		);
		await fireEvent.press(screen.getByTestId("k-multi-select-select-all"));
		expect(onValueChange).toHaveBeenLastCalledWith([]);
		await fireEvent.press(screen.getByTestId("k-multi-select-clear-all"));
		expect(onValueChange).toHaveBeenLastCalledWith([]);
	});

	it("search filters case-insensitively, shows emptyText, and resets on close", async () => {
		const screen = await openSelect();
		await fireEvent.changeText(
			screen.getByTestId("k-multi-select-search"),
			"BAN",
		);
		expect(screen.getAllByTestId(/k-multi-select-option-\d/)).toHaveLength(1);
		await fireEvent.changeText(
			screen.getByTestId("k-multi-select-search"),
			"zz",
		);
		expect(screen.getByTestId("k-multi-select-empty")).toBeTruthy();
		await fireEvent.press(screen.getByTestId("k-sheet-overlay", inclHidden));
		await fireEvent.press(screen.getByTestId("k-multi-select"));
		expect(
			screen.getAllByTestId(/k-multi-select-option-\d/).length,
		).toBeGreaterThan(1);
	});

	it("grouped options render group header rows", async () => {
		const screen = await openSelect({
			options: [
				{ value: "a", label: "Alpha", group: "Letters" },
				{ value: "1", label: "One", group: "Numbers" },
			],
			grouped: true,
		});
		expect(screen.getByTestId("k-multi-select-group-Letters")).toBeTruthy();
		expect(screen.getByTestId("k-multi-select-group-Numbers")).toBeTruthy();
	});

	it("controlled value locks chips; skeleton while loading; disabled blocks open", async () => {
		const onValueChange = jest.fn();
		const controlled = await render(
			<MultiSelect
				options={options}
				value={["apple"]}
				onValueChange={onValueChange}
			/>,
		);
		await fireEvent.press(controlled.getByTestId("k-multi-select"));
		await fireEvent.press(controlled.getByTestId("k-multi-select-option-1"));
		expect(onValueChange).toHaveBeenCalledWith(["apple", "banana"]);
		expect(controlled.getAllByTestId("k-multi-select-chip")).toHaveLength(1);

		const loading = await render(<MultiSelect options={options} isLoading />);
		expect(loading.getByTestId("k-multi-select-skeleton")).toBeTruthy();

		const disabled = await render(<MultiSelect options={options} disabled />);
		await fireEvent.press(disabled.getByTestId("k-multi-select"));
		expect(
			disabled.queryByTestId("k-multi-select-content", inclHidden),
		).toBeNull();
	});

	it("slot style overrides reach the root", async () => {
		const screen = await render(
			<MultiSelect
				options={options}
				slotStyles={{ root: { borderWidth: 7 } }}
			/>,
		);
		const flat = require("react-native").StyleSheet.flatten(
			screen.getByTestId("k-multi-select").props.style,
		);
		expect(flat.borderWidth).toBe(7);
	});

	it("opens a titled sheet with search and actions fixed above the scrolling rows", async () => {
		const screen = await openSelect({ defaultValue: ["apple"] });
		expect(screen.getByTestId("k-sheet-header")).toBeTruthy();
		expect(screen.getByTestId("k-sheet-title").props.children).toBe(
			"Select options",
		);
		const fixed = within(screen.getByTestId("k-multi-select-fixed"));
		expect(fixed.getByTestId("k-multi-select-search")).toBeTruthy();
		expect(fixed.getByTestId("k-multi-select-select-all")).toBeTruthy();
		expect(fixed.getByTestId("k-multi-select-clear-all")).toBeTruthy();
		const scroll = within(
			screen.getByTestId("k-multi-select-scroll", inclHidden),
		);
		expect(
			scroll.getAllByTestId(/k-multi-select-option-\d/, inclHidden),
		).toHaveLength(4);
		expect(
			scroll.queryByTestId("k-multi-select-search", inclHidden),
		).toBeNull();
	});

	it("clear all only appears once something is selected", async () => {
		const onValueChange = jest.fn();
		const screen = await openSelect({ onValueChange });
		expect(
			screen.queryByTestId("k-multi-select-clear-all", inclHidden),
		).toBeNull();
		await fireEvent.press(
			screen.getAllByTestId(/k-multi-select-option-\d/, inclHidden)[0],
		);
		await fireEvent.press(screen.getByTestId("k-multi-select-clear-all"));
		expect(onValueChange).toHaveBeenLastCalledWith([]);
	});

	it("rows use a checkbox look and the shared selected-row styling", async () => {
		const flatten = require("react-native").StyleSheet.flatten;
		const screen = await openSelect({ defaultValue: ["apple"] });
		const row = flatten(
			screen.getByTestId("k-multi-select-option-0", inclHidden).props.style,
		);
		const { Select } = require("../select");
		const reference = await render(
			<Select
				options={[
					{ value: "apple", label: "Apple" },
					{ value: "banana", label: "Banana" },
				]}
				defaultValue="apple"
				accessibilityLabel="pick"
			/>,
		);
		await fireEvent.press(reference.getByTestId("k-select"));
		const selectRow = flatten(
			reference.getAllByTestId("k-select-option")[0].props.style,
		);
		expect(row.backgroundColor).toBe(selectRow.backgroundColor);
		// rounded-square checkbox, never a circle
		const box = flatten(
			screen.getByTestId("k-multi-select-checkbox-0", inclHidden).props.style,
		);
		expect(box.borderRadius).toBeLessThan(box.width / 2);
	});
});
