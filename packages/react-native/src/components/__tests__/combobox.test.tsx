import { fireEvent, render, within } from "@testing-library/react-native";
import type { ComboboxOption } from "../combobox";
import { Combobox } from "../combobox";

type Screen = Awaited<ReturnType<typeof render>>;

const inclHidden = { includeHiddenElements: true } as const;

const options: ComboboxOption[] = [
	{ value: "apple", label: "Apple" },
	{ value: "banana", label: "Banana" },
	{ value: "cherry", label: "Cherry", disabled: true },
];

async function openCombobox(
	props: Partial<Parameters<typeof Combobox>[0]> = {},
): Promise<Screen> {
	const screen: Screen = await render(
		<Combobox options={options} {...props} />,
	);
	await fireEvent.press(screen.getByTestId("k-combobox"));
	return screen;
}

describe("Combobox", () => {
	it("shows the placeholder until a value is selected, then its label", async () => {
		const screen = await render(
			<Combobox options={options} placeholder="pick fruit" />,
		);
		expect(screen.getByText("pick fruit")).toBeTruthy();
		const chosen = await render(
			<Combobox options={options} defaultValue="banana" />,
		);
		expect(chosen.getByText("Banana")).toBeTruthy();
	});

	it("selection commits the value and closes the sheet", async () => {
		const onValueChange = jest.fn();
		const screen = await openCombobox({ onValueChange });
		await fireEvent.press(screen.getByTestId("k-combobox-option-1"));
		expect(onValueChange).toHaveBeenCalledWith("banana");
		expect(screen.queryByTestId("k-combobox-content", inclHidden)).toBeNull();
		expect(
			screen.getByTestId("k-combobox").props.accessibilityState.expanded,
		).toBe(false);
	});

	it("client filter is case-insensitive with emptyText on zero matches", async () => {
		const screen = await openCombobox();
		await fireEvent.changeText(screen.getByTestId("k-combobox-search"), "app");
		expect(screen.getAllByTestId(/k-combobox-option-\d/)).toHaveLength(1);
		await fireEvent.changeText(screen.getByTestId("k-combobox-search"), "zz");
		expect(screen.getByTestId("k-combobox-empty")).toBeTruthy();
	});

	it("async mode skips client filtering, reports queries, hides rows on empty search", async () => {
		const onSearchChange = jest.fn();
		const asyncOptions: ComboboxOption[] = [
			{ value: "apple", label: "Apple" },
			{ value: "banana", label: "Banana" },
		];
		const screen = await openCombobox({
			options: asyncOptions,
			onSearchChange,
		});
		expect(
			screen.queryAllByTestId("k-combobox-option", inclHidden),
		).toHaveLength(0);
		await fireEvent.changeText(screen.getByTestId("k-combobox-search"), "app");
		expect(onSearchChange).toHaveBeenCalledWith("app");
		// async: no client filtering, all provided rows stay visible
		expect(screen.getAllByTestId(/k-combobox-option-\d/)).toHaveLength(2);
		await fireEvent.press(screen.getByTestId("k-sheet-overlay", inclHidden));
		expect(onSearchChange).toHaveBeenLastCalledWith("");
	});

	it("clearable resets to empty string and hides without a value", async () => {
		const onValueChange = jest.fn();
		const empty = await render(<Combobox options={options} clearable />);
		expect(empty.queryByTestId("k-combobox-clear")).toBeNull();
		const filled = await render(
			<Combobox
				options={options}
				defaultValue="apple"
				clearable
				onValueChange={onValueChange}
			/>,
		);
		await fireEvent.press(filled.getByTestId("k-combobox-clear"));
		expect(onValueChange).toHaveBeenCalledWith("");
	});

	it("disabled blocks opening; isLoading renders the skeleton", async () => {
		const disabled = await render(<Combobox options={options} disabled />);
		await fireEvent.press(disabled.getByTestId("k-combobox"));
		expect(disabled.queryByTestId("k-combobox-content", inclHidden)).toBeNull();
		const loading = await render(<Combobox options={options} isLoading />);
		expect(loading.getByTestId("k-combobox-skeleton")).toBeTruthy();
	});

	it("controlled value locks the displayed label while onValueChange fires", async () => {
		const onValueChange = jest.fn();
		const screen = await render(
			<Combobox
				options={options}
				value="apple"
				onValueChange={onValueChange}
			/>,
		);
		expect(screen.getByText("Apple")).toBeTruthy();
		await fireEvent.press(screen.getByTestId("k-combobox"));
		await fireEvent.press(screen.getByTestId("k-combobox-option-1"));
		expect(onValueChange).toHaveBeenCalledWith("banana");
		expect(screen.getByText("Apple")).toBeTruthy();
	});

	it("slot style overrides reach the root", async () => {
		const screen = await render(
			<Combobox options={options} slotStyles={{ root: { borderWidth: 7 } }} />,
		);
		const flat = require("react-native").StyleSheet.flatten(
			screen.getByTestId("k-combobox").props.style,
		);
		expect(flat.borderWidth).toBe(7);
	});

	it("opens a titled sheet with the search fixed outside the scroll region", async () => {
		const screen = await openCombobox();
		expect(screen.getByTestId("k-sheet-header")).toBeTruthy();
		expect(screen.getByTestId("k-sheet-title").props.children).toBe(
			"Select an option",
		);
		const fixed = within(screen.getByTestId("k-combobox-fixed"));
		expect(fixed.getByTestId("k-combobox-search")).toBeTruthy();
		const fixedStyle = require("react-native").StyleSheet.flatten(
			screen.getByTestId("k-combobox-fixed").props.style,
		);
		// visible separation between the pinned search and the options below
		expect(fixedStyle.borderBottomWidth).toBe(1);
		expect(fixedStyle.paddingBottom).toBeGreaterThan(0);
		expect(fixedStyle.gap).toBeGreaterThan(2);
		const scroll = within(
			screen.getByTestId("k-combobox-scroll-content", inclHidden),
		);
		expect(scroll.queryByTestId("k-combobox-search", inclHidden)).toBeNull();
		expect(
			screen.getAllByTestId(/k-combobox-option-\d/, inclHidden).length,
		).toBeGreaterThan(0);
	});

	it("selected option row uses the shared accent look like Select", async () => {
		const flatten = require("react-native").StyleSheet.flatten;
		const chosen = await openCombobox({ defaultValue: "banana" });
		const comboRow = flatten(
			chosen.getByTestId("k-combobox-option-1", inclHidden).props.style,
		);
		const { Select } = require("../select");
		const reference = await render(
			<Select
				options={[
					{ value: "apple", label: "Apple" },
					{ value: "banana", label: "Banana" },
				]}
				defaultValue="banana"
				accessibilityLabel="pick"
			/>,
		);
		await fireEvent.press(reference.getByTestId("k-select"));
		const selectRow = flatten(
			reference.getAllByTestId("k-select-option")[1].props.style,
		);
		expect(comboRow.backgroundColor).toBe(selectRow.backgroundColor);
	});

	it("async mode with empty query keeps the header, search and an empty scroll region", async () => {
		const screen = await openCombobox({ onSearchChange: jest.fn() });
		expect(screen.getByTestId("k-combobox-content", inclHidden)).toBeTruthy();
		expect(
			within(screen.getByTestId("k-combobox-fixed")).getByTestId(
				"k-combobox-search",
			),
		).toBeTruthy();
		expect(
			screen.queryAllByTestId("k-combobox-option", inclHidden),
		).toHaveLength(0);
		const scrollContent = require("react-native").StyleSheet.flatten(
			screen.getByTestId("k-combobox-scroll-content", inclHidden).props
				.contentContainerStyle,
		);
		expect(scrollContent.minHeight).toBeGreaterThan(0);
	});

	it("trigger renders the shared chevron icon marker", async () => {
		const screen = await render(<Combobox options={options} />);
		expect(screen.getByTestId("k-combobox-chevron", inclHidden)).toBeTruthy();
	});

	it("search placeholder defaults to sentence case", async () => {
		const screen = await openCombobox();
		expect(screen.getByTestId("k-combobox-search").props.placeholder).toBe(
			"Search options",
		);
	});
});
