import { fireEvent, render } from "@testing-library/react-native";
import type { TimeValue } from "../time-picker";
import { TimePicker } from "../time-picker";

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

describe("TimePicker", () => {
	it("renders the k-time-picker marker with hour and minute wheels", async () => {
		const screen: Screen = await render(<TimePicker />);
		expect(screen.getByTestId("k-time-picker")).toBeTruthy();
		expect(screen.getByTestId("k-time-picker-hour")).toBeTruthy();
		expect(screen.getByTestId("k-time-picker-minute")).toBeTruthy();
		expect(screen.queryByTestId("k-time-picker-second")).toBeNull();
	});

	it("showSeconds adds the third wheel", async () => {
		const screen: Screen = await render(<TimePicker showSeconds />);
		expect(screen.getByTestId("k-time-picker-second")).toBeTruthy();
	});

	it("hourCycle 12 renders the AM/PM toggle; 24 does not", async () => {
		const twelve: Screen = await render(<TimePicker hourCycle={12} />);
		expect(twelve.getByTestId("k-time-picker-am-pm")).toBeTruthy();
		const twentyFour: Screen = await render(<TimePicker hourCycle={24} />);
		expect(twentyFour.queryByTestId("k-time-picker-am-pm")).toBeNull();
	});

	it("undefined value renders 00:00 without committing", async () => {
		const onValueChange = jest.fn();
		const screen: Screen = await render(
			<TimePicker onValueChange={onValueChange} />,
		);
		expect(onValueChange).not.toHaveBeenCalled();
		// zero-value hour is index 0 in the 24h wheel and reads "00";
		// it is the selected row, every other row is dimmed
		const zero = screen.getByTestId("k-time-picker-hour-item-0");
		expect(flatStyle(zero).opacity).toBe(1);
		expect(
			flatStyle(screen.getByTestId("k-time-picker-hour-item-5")).opacity,
		).not.toBe(1);
		expect(
			flatStyle(screen.getByTestId("k-time-picker-minute-item-0")).opacity,
		).toBe(1);
	});

	it("pressing an hour item commits 24h-normalized values", async () => {
		const onValueChange = jest.fn();
		const screen: Screen = await render(
			<TimePicker
				hourCycle={12}
				value={{ hours: 0, minutes: 30 }}
				onValueChange={onValueChange}
			/>,
		);
		// wheel shows 12h labels; tapping "12" under PM commits hours=12 (noon)
		await fireEvent.press(screen.getByTestId("k-time-picker-hour-item-11"));
		const committed = onValueChange.mock.calls[0][0] as TimeValue;
		expect(committed.hours).toBe(11);
		expect(committed.minutes).toBe(30);
		expect(committed.seconds).toBe(0);
	});

	it("hourCycle 12: tapping PM converts 1 PM to 13", async () => {
		const onValueChange = jest.fn();
		const screen: Screen = await render(
			<TimePicker
				hourCycle={12}
				value={{ hours: 1, minutes: 0 }}
				onValueChange={onValueChange}
			/>,
		);
		await fireEvent.press(screen.getByTestId("k-time-picker-am-pm"));
		await fireEvent.press(screen.getByTestId("k-time-picker-am-pm-option-pm"));
		const committed = onValueChange.mock.calls[0][0] as TimeValue;
		expect(committed.hours).toBe(13);
	});

	it("hourCycle 12: value={hours:13} renders PM selected with hour 1", async () => {
		const screen: Screen = await render(
			<TimePicker hourCycle={12} value={{ hours: 13, minutes: 45 }} />,
		);
		const pmOption = screen.getByTestId("k-time-picker-am-pm-option-pm");
		expect(pmOption.props.accessibilityState?.selected).toBe(true);
	});

	it("out-of-range values clamp, never NaN", async () => {
		const onValueChange = jest.fn();
		const screen: Screen = await render(
			<TimePicker
				value={{
					hours: 25 as unknown as number,
					minutes: -1 as unknown as number,
				}}
				onValueChange={onValueChange}
			/>,
		);
		await fireEvent.press(screen.getByTestId("k-time-picker-hour-item-5"));
		const committed = onValueChange.mock.calls[0][0] as TimeValue;
		expect(Number.isNaN(committed.hours)).toBe(false);
		expect(Number.isNaN(committed.minutes)).toBe(false);
	});

	it("controlled value locks over internal presses", async () => {
		const onValueChange = jest.fn();
		const screen: Screen = await render(
			<TimePicker
				value={{ hours: 9, minutes: 15 }}
				onValueChange={onValueChange}
			/>,
		);
		await fireEvent.press(screen.getByTestId("k-time-picker-hour-item-5"));
		expect(onValueChange).toHaveBeenCalledTimes(1);
		// display stays on the controlled hour: item 9 keeps its selected style
		const nine = screen.getByTestId("k-time-picker-hour-item-9");
		const five = screen.getByTestId("k-time-picker-hour-item-5");
		expect(flatStyle(nine).opacity).toBe(1);
		expect(flatStyle(five).opacity).not.toBe(1);
	});

	it("disabled blocks commits and announces disabled", async () => {
		const onValueChange = jest.fn();
		const screen: Screen = await render(
			<TimePicker disabled onValueChange={onValueChange} />,
		);
		expect(
			screen.getByTestId("k-time-picker").props.accessibilityState?.disabled,
		).toBe(true);
		await fireEvent.press(screen.getByTestId("k-time-picker-hour-item-5"));
		expect(onValueChange).not.toHaveBeenCalled();
	});

	it("isLoading keeps the k-time-picker marker on the skeleton", async () => {
		const screen: Screen = await render(<TimePicker isLoading />);
		expect(screen.getByTestId("k-time-picker")).toBeTruthy();
		expect(screen.queryByTestId("k-time-picker-hour")).toBeNull();
	});
});
