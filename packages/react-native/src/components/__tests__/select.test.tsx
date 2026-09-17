import { fireEvent, render } from "@testing-library/react-native";
import type { SelectOption } from "../select";
import { Select } from "../select";

const inclHidden = { includeHiddenElements: true } as const;

type Screen = Awaited<ReturnType<typeof render>>;

const OPTIONS: SelectOption[] = [
	{ value: "apple", label: "Apple" },
	{ value: "banana", label: "Banana" },
	{ value: "cherry", label: "Cherry", disabled: true },
];

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

describe("Select trigger", () => {
	it("renders k-select / k-select-value / k-select-chevron markers", async () => {
		const screen: Screen = await render(
			<Select options={OPTIONS} accessibilityLabel="Fruit" />,
		);
		expect(screen.getByTestId("k-select")).toBeTruthy();
		expect(screen.getByTestId("k-select-value")).toBeTruthy();
		// Icon is a11y-hidden by default — the marker query must opt in
		expect(screen.getByTestId("k-select-chevron", inclHidden)).toBeTruthy();
	});

	it("button role + label; placeholder styled muted vs a selected value", async () => {
		const empty: Screen = await render(
			<Select options={OPTIONS} placeholder="Pick one" />,
		);
		const trigger = empty.getByTestId("k-select");
		expect(trigger.props.accessibilityRole).toBe("button");
		expect(trigger.props.accessibilityLabel).toBe("Pick one");
		const placeholder = empty.getByTestId("k-select-value");
		expect(placeholder.props.children).toBe("Pick one");
		const filled: Screen = await render(
			<Select options={OPTIONS} defaultValue="apple" />,
		);
		expect(flatStyle(placeholder).color).not.toBe(
			flatStyle(filled.getByTestId("k-select-value")).color,
		);
	});

	it("closed state renders no sheet", async () => {
		const screen: Screen = await render(<Select options={OPTIONS} />);
		expect(screen.queryByTestId("k-select-option")).toBeNull();
	});

	it("isLoading keeps the k-select marker on the skeleton surface", async () => {
		const screen: Screen = await render(<Select options={OPTIONS} isLoading />);
		expect(screen.getByTestId("k-select")).toBeTruthy();
		expect(screen.queryByTestId("k-select-value")).toBeNull();
	});

	it("disabled blocks opening, announces disabled state", async () => {
		const screen: Screen = await render(<Select options={OPTIONS} disabled />);
		const trigger = screen.getByTestId("k-select");
		expect(trigger.props.accessibilityState?.disabled).toBe(true);
		await fireEvent.press(trigger);
		expect(screen.queryByTestId("k-select-option")).toBeNull();
	});

	it("size sm/md map to distinct trigger heights", async () => {
		const sm: Screen = await render(<Select options={OPTIONS} size="sm" />);
		const md: Screen = await render(<Select options={OPTIONS} />);
		const hSm = flatStyle(sm.getByTestId("k-select")).minHeight as number;
		const hMd = flatStyle(md.getByTestId("k-select")).minHeight as number;
		expect(hSm).toBeLessThan(hMd);
		expect(hMd).toBeGreaterThanOrEqual(44);
	});

	it("hasError tints the border destructive", async () => {
		const plain: Screen = await render(<Select options={OPTIONS} />);
		const errored: Screen = await render(<Select options={OPTIONS} hasError />);
		const a = flatStyle(plain.getByTestId("k-select")).borderColor;
		const b = flatStyle(errored.getByTestId("k-select")).borderColor;
		expect(a).not.toBe(b);
	});

	it("hasSuccess tints the border — distinct from plain and error", async () => {
		const plain: Screen = await render(<Select options={OPTIONS} />);
		const errored: Screen = await render(<Select options={OPTIONS} hasError />);
		const success: Screen = await render(
			<Select options={OPTIONS} hasSuccess />,
		);
		const a = flatStyle(plain.getByTestId("k-select")).borderColor;
		const b = flatStyle(errored.getByTestId("k-select")).borderColor;
		const c = flatStyle(success.getByTestId("k-select")).borderColor;
		expect(c).not.toBe(a);
		expect(c).not.toBe(b);
	});

	it("chevron renders a sized Icon carrying the slot override", async () => {
		const screen: Screen = await render(
			<Select options={OPTIONS} slotStyles={{ chevron: { width: 33 } }} />,
		);
		const chevron = screen.getByTestId("k-select-chevron", inclHidden);
		expect(flatStyle(chevron).width).toBe(33);
		expect(flatStyle(chevron).height).toBeGreaterThan(0);
	});
});

describe("Select sheet", () => {
	it("trigger press opens the options sheet; option press commits + closes", async () => {
		const onValueChange = jest.fn();
		const screen: Screen = await render(
			<Select options={OPTIONS} onValueChange={onValueChange} />,
		);
		await fireEvent.press(screen.getByTestId("k-select"));
		const rows = screen.getAllByTestId("k-select-option");
		expect(rows).toHaveLength(3);
		await fireEvent.press(rows[1]);
		expect(onValueChange).toHaveBeenCalledWith("banana");
		expect(screen.queryByTestId("k-select-option")).toBeNull();
		expect(screen.getByTestId("k-select-value").props.children).toBe("Banana");
	});

	it("disabled option is inert and announced", async () => {
		const onValueChange = jest.fn();
		const screen: Screen = await render(
			<Select options={OPTIONS} onValueChange={onValueChange} />,
		);
		await fireEvent.press(screen.getByTestId("k-select"));
		const rows = screen.getAllByTestId("k-select-option");
		expect(rows[2].props.accessibilityState?.disabled).toBe(true);
		await fireEvent.press(rows[2]);
		expect(onValueChange).not.toHaveBeenCalled();
	});

	it("selected option announces selected state and tints active", async () => {
		const screen: Screen = await render(
			<Select options={OPTIONS} defaultValue="apple" />,
		);
		await fireEvent.press(screen.getByTestId("k-select"));
		const rows = screen.getAllByTestId("k-select-option");
		expect(rows[0].props.accessibilityState?.selected).toBe(true);
		expect(rows[1].props.accessibilityState?.selected).toBeFalsy();
		const active = flatStyle(rows[0]).backgroundColor;
		const idle = flatStyle(rows[1]).backgroundColor;
		expect(active).not.toBe(idle);
	});

	it("overlay press closes without committing", async () => {
		const onValueChange = jest.fn();
		const screen: Screen = await render(
			<Select options={OPTIONS} onValueChange={onValueChange} />,
		);
		await fireEvent.press(screen.getByTestId("k-select"));
		await fireEvent.press(screen.getByTestId("k-sheet-overlay", inclHidden));
		expect(onValueChange).not.toHaveBeenCalled();
		expect(screen.queryByTestId("k-select-option")).toBeNull();
	});

	it("option rows are hairline-separated between rows only", async () => {
		const screen: Screen = await render(<Select options={OPTIONS} />);
		await fireEvent.press(screen.getByTestId("k-select"));
		expect(screen.getAllByTestId("k-select-option")).toHaveLength(3);
		expect(
			screen.getAllByTestId("k-select-option-separator", inclHidden),
		).toHaveLength(2);
	});

	it("sheet header defaults to the placeholder; label wins; close closes without committing", async () => {
		const onValueChange = jest.fn();
		const screen: Screen = await render(
			<Select
				options={OPTIONS}
				placeholder="Pick a fruit"
				onValueChange={onValueChange}
			/>,
		);
		await fireEvent.press(screen.getByTestId("k-select"));
		expect(screen.getByTestId("k-sheet-title", inclHidden).props.children).toBe(
			"Pick a fruit",
		);
		await fireEvent.press(screen.getByTestId("k-sheet-close", inclHidden));
		expect(onValueChange).not.toHaveBeenCalled();
		expect(screen.queryAllByTestId("k-select-option")).toHaveLength(0);

		const labelled: Screen = await render(
			<Select options={OPTIONS} label="Fruit" placeholder="Pick a fruit" />,
		);
		await fireEvent.press(labelled.getByTestId("k-select"));
		expect(
			labelled.getByTestId("k-sheet-title", inclHidden).props.children,
		).toBe("Fruit");
	});

	it("sheet sizes to content (auto) under a maxHeight clamp, not a fixed height", async () => {
		const screen: Screen = await render(<Select options={OPTIONS} />);
		await fireEvent.press(screen.getByTestId("k-select"));
		const style = flatStyle(screen.getByTestId("k-sheet-content", inclHidden));
		expect(style.height).toBeUndefined();
		expect(style.maxHeight).toBeGreaterThan(0);
	});

	it("empty options with header: zero separators, header + close + empty state render", async () => {
		const screen: Screen = await render(
			<Select options={[]} placeholder="Nothing here" />,
		);
		await fireEvent.press(screen.getByTestId("k-select"));
		expect(
			screen.queryAllByTestId("k-select-option-separator", inclHidden),
		).toHaveLength(0);
		expect(screen.getByTestId("k-sheet-title", inclHidden)).toBeTruthy();
		expect(screen.getByTestId("k-sheet-close", inclHidden)).toBeTruthy();
		expect(screen.getByTestId("k-select-empty")).toBeTruthy();
	});

	it("uncontrolled defaultValue seeds; controlled value locks until parent re-renders", async () => {
		const screen: Screen = await render(
			<Select options={OPTIONS} defaultValue="banana" />,
		);
		expect(screen.getByTestId("k-select-value").props.children).toBe("Banana");
		const controlled: Screen = await render(
			<Select options={OPTIONS} value="apple" onValueChange={jest.fn()} />,
		);
		await fireEvent.press(controlled.getByTestId("k-select"));
		await fireEvent.press(controlled.getAllByTestId("k-select-option")[1]);
		expect(controlled.getByTestId("k-select-value").props.children).toBe(
			"Apple",
		);
	});

	it("trigger exposes accessibilityState.expanded flipping with open", async () => {
		const screen: Screen = await render(<Select options={OPTIONS} />);
		const trigger = screen.getByTestId("k-select");
		expect(trigger.props.accessibilityState?.expanded).toBe(false);
		await fireEvent.press(trigger);
		expect(
			screen.getByTestId("k-select").props.accessibilityState?.expanded,
		).toBe(true);
	});

	it("empty options render the trigger; open yields zero rows + empty state, no crash", async () => {
		const screen: Screen = await render(
			<Select options={[]} placeholder="Nothing here" />,
		);
		expect(screen.getByTestId("k-select-value").props.children).toBe(
			"Nothing here",
		);
		await fireEvent.press(screen.getByTestId("k-select"));
		expect(screen.queryAllByTestId("k-select-option")).toHaveLength(0);
		expect(screen.getByTestId("k-select-empty")).toBeTruthy();
	});

	it("duplicate labels resolve deterministically by first value match", async () => {
		const dupes: SelectOption[] = [
			{ value: "one", label: "Same" },
			{ value: "two", label: "Same" },
		];
		const screen: Screen = await render(
			<Select options={dupes} defaultValue="two" />,
		);
		expect(screen.getByTestId("k-select-value").props.children).toBe("Same");
		await fireEvent.press(screen.getByTestId("k-select"));
		const rows = screen.getAllByTestId("k-select-option");
		expect(rows[1].props.accessibilityState?.selected).toBe(true);
		expect(rows[0].props.accessibilityState?.selected).toBeFalsy();
	});

	it("orphan controlled value renders its raw value — async loads never blank the trigger", async () => {
		const screen: Screen = await render(
			<Select options={OPTIONS} value="ghost" placeholder="Pick one" />,
		);
		const value = screen.getByTestId("k-select-value");
		expect(value.props.children).toBe("ghost");
	});

	it("slotStyles.root slot wins over the library trigger surface", async () => {
		const screen: Screen = await render(
			<Select options={OPTIONS} style={{ minHeight: 60 }} />,
		);
		expect(flatStyle(screen.getByTestId("k-select")).minHeight).toBe(60);
	});
});
