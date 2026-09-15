import { fireEvent, render } from "@testing-library/react-native";
import { DateRangePicker, DatePicker } from "../date-picker";

const inclHidden = { includeHiddenElements: true } as const;

type Screen = Awaited<ReturnType<typeof render>>;

function flatStyle(node: {
	props: { style?: unknown };
}): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	const walk = (entry: unknown): void => {
		if (Array.isArray(entry)) {
			for (const e of entry) walk(e);
		} else if (entry && typeof entry === "object") {
			Object.assign(out, entry);
		}
	};
	walk(node.props.style ?? []);
	return out;
}

describe("DatePicker", () => {
	it("renders the k-date-picker trigger with button role and placeholder", async () => {
		const screen: Screen = await render(<DatePicker placeholder="Pick a date" />);
		const trigger = screen.getByTestId("k-date-picker");
		expect(trigger.props.accessibilityRole).toBe("button");
		expect(trigger.props.accessibilityLabel).toContain("Pick a date");
		expect(trigger.props.accessibilityState?.expanded).toBe(false);
	});

	it("closed trigger renders no sheet; press opens it", async () => {
		const screen: Screen = await render(<DatePicker />);
		expect(screen.queryByTestId("k-sheet-content")).toBeNull();
		await fireEvent.press(screen.getByTestId("k-date-picker"));
		expect(screen.getByTestId("k-sheet-content", inclHidden)).toBeTruthy();
		expect(
			screen.getByTestId("k-date-picker").props.accessibilityState?.expanded,
		).toBe(true);
	});

	it("placeholder shows before selection, formatted value after commit", async () => {
		const screen: Screen = await render(<DatePicker defaultValue={new Date(2026, 1, 10)} />);
		expect(screen.getByTestId("k-date-picker").props.accessibilityLabel).toContain(
			"Feb 10, 2026",
		);
	});

	it("selecting a day commits onValueChange and closes the sheet", async () => {
		const onValueChange = jest.fn();
		const screen: Screen = await render(
			<DatePicker
				month={new Date(2026, 1, 1)}
				onValueChange={onValueChange}
			/>,
		);
		await fireEvent.press(screen.getByTestId("k-date-picker"));
		await fireEvent.press(screen.getByTestId("k-calendar-day-2026-02-10"));
		expect(onValueChange).toHaveBeenCalledTimes(1);
		const committed = onValueChange.mock.calls[0][0] as Date;
		expect(committed.getMonth()).toBe(1);
		expect(committed.getDate()).toBe(10);
		expect(screen.queryByTestId("k-sheet-content")).toBeNull();
		expect(
			screen.getByTestId("k-date-picker").props.accessibilityState?.expanded,
		).toBe(false);
	});

	it("controlled value locks display; internal taps do not override", async () => {
		const onValueChange = jest.fn();
		const screen: Screen = await render(
			<DatePicker
				value={new Date(2026, 1, 10)}
				onValueChange={onValueChange}
			/>,
		);
		await fireEvent.press(screen.getByTestId("k-date-picker"));
		await fireEvent.press(screen.getByTestId("k-calendar-day-2026-02-20"));
		expect(onValueChange).toHaveBeenCalledTimes(1);
		expect(screen.getByTestId("k-date-picker").props.accessibilityLabel).toContain(
			"Feb 10, 2026",
		);
	});

	it("buttonDisabled blocks opening and announces disabled", async () => {
		const screen: Screen = await render(<DatePicker buttonDisabled />);
		const trigger = screen.getByTestId("k-date-picker");
		expect(trigger.props.accessibilityState?.disabled).toBe(true);
		await fireEvent.press(trigger);
		expect(screen.queryByTestId("k-sheet-content")).toBeNull();
	});

	it("disabled date inside the sheet does not commit and keeps the sheet open", async () => {
		const onValueChange = jest.fn();
		const screen: Screen = await render(
			<DatePicker
				month={new Date(2026, 1, 1)}
				max={new Date(2026, 1, 20)}
				onValueChange={onValueChange}
			/>,
		);
		await fireEvent.press(screen.getByTestId("k-date-picker"));
		await fireEvent.press(screen.getByTestId("k-calendar-day-2026-02-25"));
		expect(onValueChange).not.toHaveBeenCalled();
		expect(screen.getByTestId("k-sheet-content", inclHidden)).toBeTruthy();
	});

	it("isLoading keeps the k-date-picker marker on the skeleton surface", async () => {
		const screen: Screen = await render(<DatePicker isLoading />);
		expect(screen.getByTestId("k-date-picker")).toBeTruthy();
		expect(screen.queryByTestId("k-sheet-content")).toBeNull();
	});

	it("hasError tints the trigger border destructive", async () => {
		const plain: Screen = await render(<DatePicker />);
		const errored: Screen = await render(<DatePicker hasError />);
		expect(flatStyle(plain.getByTestId("k-date-picker")).borderColor).not.toBe(
			flatStyle(errored.getByTestId("k-date-picker")).borderColor,
		);
	});
});

describe("DateRangePicker", () => {
	it("renders the k-date-picker-date-range-picker trigger with placeholder", async () => {
		const screen: Screen = await render(
			<DateRangePicker placeholder="Pick a range" />,
		);
		const trigger = screen.getByTestId("k-date-picker-date-range-picker");
		expect(trigger.props.accessibilityRole).toBe("button");
		expect(trigger.props.accessibilityLabel).toContain("Pick a range");
	});

	it("first tap keeps the sheet open; second completes the range and closes", async () => {
		const onValueChange = jest.fn();
		const screen: Screen = await render(
			<DateRangePicker
				month={new Date(2026, 1, 1)}
				onValueChange={onValueChange}
			/>,
		);
		await fireEvent.press(
			screen.getByTestId("k-date-picker-date-range-picker"),
		);
		await fireEvent.press(screen.getByTestId("k-calendar-day-2026-02-04"));
		expect(onValueChange).toHaveBeenLastCalledWith({ from: new Date(2026, 1, 4) });
		expect(screen.getByTestId("k-sheet-content", inclHidden)).toBeTruthy();
		await fireEvent.press(screen.getByTestId("k-calendar-day-2026-02-20"));
		expect(onValueChange).toHaveBeenLastCalledWith({
			from: new Date(2026, 1, 4),
			to: new Date(2026, 1, 20),
		});
		expect(screen.queryByTestId("k-sheet-content")).toBeNull();
	});

	it("trigger shows partial 'from' then 'from - to'", async () => {
		const screen: Screen = await render(
			<DateRangePicker value={{ from: new Date(2026, 1, 4) }} />,
		);
		expect(
			screen.getByTestId("k-date-picker-date-range-picker").props
				.accessibilityLabel,
		).toContain("Feb 4, 2026");
		await screen.rerender(
			<DateRangePicker
				value={{ from: new Date(2026, 1, 4), to: new Date(2026, 1, 20) }}
			/>,
		);
		const label = screen.getByTestId("k-date-picker-date-range-picker").props
			.accessibilityLabel as string;
		expect(label).toContain("Feb 4, 2026");
		expect(label).toContain("Feb 20, 2026");
	});

	it("controlled full range locks display over internal taps", async () => {
		const onValueChange = jest.fn();
		const screen: Screen = await render(
			<DateRangePicker
				value={{ from: new Date(2026, 1, 4), to: new Date(2026, 1, 20) }}
				onValueChange={onValueChange}
			/>,
		);
		await fireEvent.press(
			screen.getByTestId("k-date-picker-date-range-picker"),
		);
		await fireEvent.press(screen.getByTestId("k-calendar-day-2026-02-10"));
		await fireEvent.press(screen.getByTestId("k-calendar-day-2026-02-12"));
		const label = screen.getByTestId("k-date-picker-date-range-picker").props
			.accessibilityLabel as string;
		expect(label).toContain("Feb 4, 2026");
		expect(label).toContain("Feb 20, 2026");
	});

	it("uncontrolled partial pick updates the trigger to the from label", async () => {
		const screen: Screen = await render(
			<DateRangePicker
				month={new Date(2026, 1, 1)}
				placeholder="Pick a range"
			/>,
		);
		await fireEvent.press(
			screen.getByTestId("k-date-picker-date-range-picker"),
		);
		await fireEvent.press(screen.getByTestId("k-calendar-day-2026-02-10"));
		expect(
			screen.getByTestId("k-date-picker-date-range-picker").props
				.accessibilityLabel,
		).toContain("Feb 10, 2026");
		expect(
			screen.getByTestId("k-date-picker-date-range-picker").props
				.accessibilityLabel,
		).not.toContain("Pick a range");
	});

	it("buttonDisabled blocks opening", async () => {
		const screen: Screen = await render(<DateRangePicker buttonDisabled />);
		await fireEvent.press(
			screen.getByTestId("k-date-picker-date-range-picker"),
		);
		expect(screen.queryByTestId("k-sheet-content")).toBeNull();
	});

	it("isLoading keeps the range marker on the skeleton surface", async () => {
		const screen: Screen = await render(<DateRangePicker isLoading />);
		expect(screen.getByTestId("k-date-picker-date-range-picker")).toBeTruthy();
	});
});
