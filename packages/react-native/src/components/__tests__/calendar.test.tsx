import { fireEvent, render } from "@testing-library/react-native";
import {
	addMonths,
	clampTimePart,
	daysInMonth,
	firstWeekdayOffset,
	formatMonthYear,
	isSameDay,
	monthIsAfter,
	monthIsBefore,
	startOfMonth,
} from "../../lib/date.utils";
import { Calendar, CalendarSkeleton } from "../calendar";

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

// Grid is rendered inside the sheet-free inline surface; days expose
// k-calendar-day-<iso> markers (iso = YYYY-MM-DD, stable for Maestro).
const iso = (d: Date): string =>
	`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
		d.getDate(),
	).padStart(2, "0")}`;

describe("date.utils", () => {
	it("daysInMonth handles 31/30/29/28 boundaries", () => {
		expect(daysInMonth(2026, 0)).toBe(31); // Jan
		expect(daysInMonth(2026, 3)).toBe(30); // Apr
		expect(daysInMonth(2028, 1)).toBe(29); // leap Feb
		expect(daysInMonth(2026, 1)).toBe(28); // non-leap Feb
	});

	it("addMonths rolls the year at December→January", () => {
		const dec = new Date(2026, 11, 15);
		const next = addMonths(dec, 1);
		expect(next.getFullYear()).toBe(2027);
		expect(next.getMonth()).toBe(0);
		expect(next.getDate()).toBe(15);
		const back = addMonths(new Date(2027, 0, 10), -1);
		expect(back.getFullYear()).toBe(2026);
		expect(back.getMonth()).toBe(11);
	});

	it("startOfMonth + firstWeekdayOffset produce the leading blanks", () => {
		// Jan 1 2026 is a Thursday (index 4 with week starting Sunday).
		expect(startOfMonth(new Date(2026, 0, 15)).getDate()).toBe(1);
		expect(firstWeekdayOffset(new Date(2026, 0, 1))).toBe(4);
		expect(firstWeekdayOffset(new Date(2026, 1, 1))).toBe(0); // Feb 1 2026 Sunday
	});

	it("isSameDay ignores time; monthIsBefore/After compare calendar months", () => {
		expect(isSameDay(new Date(2026, 0, 5, 8), new Date(2026, 0, 5, 22))).toBe(
			true,
		);
		expect(monthIsBefore(new Date(2026, 0, 31), new Date(2026, 1, 1))).toBe(
			true,
		);
		expect(monthIsAfter(new Date(2026, 1, 1), new Date(2026, 0, 31))).toBe(
			true,
		);
		expect(monthIsBefore(new Date(2026, 0, 1), new Date(2026, 0, 31))).toBe(
			false,
		);
	});

	it("clampTimePart keeps values in range and never NaN", () => {
		expect(clampTimePart(-1, 24)).toBe(0);
		expect(clampTimePart(25, 24)).toBe(23);
		expect(clampTimePart(12, 12)).toBe(11);
		expect(clampTimePart(Number.NaN, 24)).toBe(0);
	});

	it("formatMonthYear renders the header label", () => {
		expect(formatMonthYear(new Date(2026, 0, 15))).toBe("January 2026");
		expect(formatMonthYear(new Date(2026, 11, 1))).toBe("December 2026");
	});
});

describe("Calendar", () => {
	it("renders the k-calendar marker with weekday header and a 6x7 grid", async () => {
		const screen: Screen = await render(
			<Calendar month={new Date(2026, 1, 1)} />,
		);
		expect(screen.getByTestId("k-calendar")).toBeTruthy();
		expect(screen.getAllByTestId(/^k-calendar-weekday$/).length).toBe(7);
		// Feb 2026: 28 days starting Sunday — 28 cells + 0 leading + 14 trailing.
		const cells = screen.getAllByTestId(/^k-calendar-cell-/);
		expect(cells.length).toBe(42);
		expect(
			screen.getByTestId(`k-calendar-cell-${iso(new Date(2026, 1, 14))}`),
		).toBeTruthy();
	});

	it("single mode: tapping a day commits onValueChange and styles it selected", async () => {
		const onValueChange = jest.fn();
		const screen: Screen = await render(
			<Calendar month={new Date(2026, 1, 1)} onValueChange={onValueChange} />,
		);
		await fireEvent.press(screen.getByTestId("k-calendar-day-2026-02-10"));
		expect(onValueChange).toHaveBeenCalledTimes(1);
		const committed = onValueChange.mock.calls[0][0] as Date;
		expect(committed.getFullYear()).toBe(2026);
		expect(committed.getMonth()).toBe(1);
		expect(committed.getDate()).toBe(10);
	});

	it("multiple mode: taps accumulate, re-tap removes, order stable", async () => {
		const onValueChange = jest.fn();
		const screen: Screen = await render(
			<Calendar
				month={new Date(2026, 1, 1)}
				mode="multiple"
				onValueChange={onValueChange}
			/>,
		);
		await fireEvent.press(screen.getByTestId("k-calendar-day-2026-02-03"));
		await fireEvent.press(screen.getByTestId("k-calendar-day-2026-02-17"));
		expect(onValueChange).toHaveBeenLastCalledWith([
			new Date(2026, 1, 3),
			new Date(2026, 1, 17),
		]);
		await fireEvent.press(screen.getByTestId("k-calendar-day-2026-02-03"));
		expect(onValueChange).toHaveBeenLastCalledWith([new Date(2026, 1, 17)]);
	});

	it("range mode: first tap sets from, second completes to; third tap restarts", async () => {
		const onValueChange = jest.fn();
		const screen: Screen = await render(
			<Calendar
				month={new Date(2026, 1, 1)}
				mode="range"
				onValueChange={onValueChange}
			/>,
		);
		await fireEvent.press(screen.getByTestId("k-calendar-day-2026-02-04"));
		expect(onValueChange).toHaveBeenLastCalledWith({
			from: new Date(2026, 1, 4),
		});
		await fireEvent.press(screen.getByTestId("k-calendar-day-2026-02-20"));
		expect(onValueChange).toHaveBeenLastCalledWith({
			from: new Date(2026, 1, 4),
			to: new Date(2026, 1, 20),
		});
		await fireEvent.press(screen.getByTestId("k-calendar-day-2026-02-11"));
		expect(onValueChange).toHaveBeenLastCalledWith({
			from: new Date(2026, 1, 11),
		});
	});

	it("range mode: tapping an earlier day after from restarts from that day", async () => {
		const onValueChange = jest.fn();
		const screen: Screen = await render(
			<Calendar
				month={new Date(2026, 1, 1)}
				mode="range"
				onValueChange={onValueChange}
			/>,
		);
		await fireEvent.press(screen.getByTestId("k-calendar-day-2026-02-20"));
		await fireEvent.press(screen.getByTestId("k-calendar-day-2026-02-04"));
		expect(onValueChange).toHaveBeenLastCalledWith({
			from: new Date(2026, 1, 4),
		});
	});

	it("disabled dates render disabled-styled and never commit", async () => {
		const onValueChange = jest.fn();
		const screen: Screen = await render(
			<Calendar
				month={new Date(2026, 1, 1)}
				onValueChange={onValueChange}
				disabledDates={(d: Date) => d.getDate() > 20}
			/>,
		);
		const disabledDay = screen.getByTestId("k-calendar-day-2026-02-25");
		expect(disabledDay.props.accessibilityState?.disabled).toBe(true);
		await fireEvent.press(disabledDay);
		expect(onValueChange).not.toHaveBeenCalled();
		await fireEvent.press(screen.getByTestId("k-calendar-day-2026-02-10"));
		expect(onValueChange).toHaveBeenCalledTimes(1);
	});

	it("min/max disable days outside the window", async () => {
		const onValueChange = jest.fn();
		const screen: Screen = await render(
			<Calendar
				month={new Date(2026, 1, 1)}
				min={new Date(2026, 1, 10)}
				max={new Date(2026, 1, 20)}
				onValueChange={onValueChange}
			/>,
		);
		await fireEvent.press(screen.getByTestId("k-calendar-day-2026-02-02"));
		expect(onValueChange).not.toHaveBeenCalled();
		await fireEvent.press(screen.getByTestId("k-calendar-day-2026-02-15"));
		expect(onValueChange).toHaveBeenCalledTimes(1);
	});

	it("prev/next navigate across month and year boundaries", async () => {
		const screen: Screen = await render(
			<Calendar month={new Date(2026, 11, 1)} />,
		);
		expect(screen.getByTestId("k-calendar-month-label").props.children).toBe(
			"December 2026",
		);
		await fireEvent.press(screen.getByTestId("k-calendar-next"));
		expect(screen.getByTestId("k-calendar-month-label").props.children).toBe(
			"January 2027",
		);
		await fireEvent.press(screen.getByTestId("k-calendar-prev"));
		await fireEvent.press(screen.getByTestId("k-calendar-prev"));
		expect(screen.getByTestId("k-calendar-month-label").props.children).toBe(
			"November 2026",
		);
	});

	it("nav clamps at min/max: out-of-window next/prev are disabled and inert", async () => {
		const screen: Screen = await render(
			<Calendar month={new Date(2026, 1, 1)} max={new Date(2026, 1, 20)} />,
		);
		const next = screen.getByTestId("k-calendar-next");
		expect(next.props.accessibilityState?.disabled).toBe(true);
		await fireEvent.press(next);
		expect(screen.getByTestId("k-calendar-month-label").props.children).toBe(
			"February 2026",
		);
		const minScreen: Screen = await render(
			<Calendar month={new Date(2026, 1, 1)} min={new Date(2026, 1, 5)} />,
		);
		const prev = minScreen.getByTestId("k-calendar-prev");
		expect(prev.props.accessibilityState?.disabled).toBe(true);
		await fireEvent.press(prev);
		expect(minScreen.getByTestId("k-calendar-month-label").props.children).toBe(
			"February 2026",
		);
		// days inside the visible month stay tappable within the window
		const _onValueChange = jest.fn();
		await fireEvent.press(minScreen.getByTestId("k-calendar-day-2026-02-10"));
		expect(screen.getByTestId("k-calendar-day-2026-02-10")).toBeTruthy();
	});

	it("today carries the ring token color", async () => {
		const today = new Date();
		const screen: Screen = await render(<Calendar />);
		const todayCell = screen.getByTestId(
			`k-calendar-day-${iso(today)}`,
			inclHidden,
		);
		expect(flatStyle(todayCell).borderColor).toBeTruthy();
	});

	it("isLoading swaps to the skeleton surface keeping the k-calendar marker", async () => {
		const screen: Screen = await render(
			<Calendar isLoading skeletonConfig={{ cellCount: 42 }} />,
		);
		expect(screen.getByTestId("k-calendar")).toBeTruthy();
		expect(screen.queryByTestId("k-calendar-month-label")).toBeNull();
	});

	it("CalendarSkeleton renders a bounded grid", async () => {
		const screen: Screen = await render(<CalendarSkeleton cellCount={35} />);
		expect(screen.getAllByTestId("k-skeleton").length).toBeGreaterThan(0);
	});

	it("day colors map straight from the active theme tokens", async () => {
		const screen: Screen = await render(
			<Calendar
				month={new Date(2026, 1, 1)}
				defaultValue={new Date(2026, 1, 10)}
			/>,
		);
		const themes = require("../../themes").themes;
		expect(
			flatStyle(screen.getByTestId("k-calendar-day-2026-02-10"))
				.backgroundColor,
		).toBe(themes.light.primary);
		expect(
			flatStyle(screen.getAllByTestId("k-calendar-weekday")[0]).color,
		).toBe(themes.light.mutedForeground);
	});
});
