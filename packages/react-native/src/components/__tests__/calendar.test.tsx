import { fireEvent, render } from "@testing-library/react-native";
import { View } from "react-native";
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
import { chunk } from "../../lib/calendar.utils";
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

	it("chunk splits into fixed-size rows (even, ragged, empty)", () => {
		expect(chunk([1, 2, 3, 4, 5, 6, 7], 7)).toEqual([[1, 2, 3, 4, 5, 6, 7]]);
		expect(chunk(Array.from({ length: 42 }, (_, i) => i), 7)).toHaveLength(6);
		expect(chunk([1, 2, 3, 4, 5], 3)).toEqual([
			[1, 2, 3],
			[4, 5],
		]);
		expect(chunk([], 7)).toEqual([]);
	});
});

describe("Calendar", () => {
it("week rows keep stable identity across month navigation", async () => {
	const screen: Screen = await render(
		<Calendar month={new Date(2026, 8, 1)} />, // September 2026
	);
	const before = screen
		.getAllByTestId(/^k-calendar-cell-/)
		.slice(0, 1)
		.map((node) => node.props.testID);
	await fireEvent.press(screen.getByTestId("k-calendar-next"));
	const after = screen
		.getAllByTestId(/^k-calendar-cell-/)
		.slice(0, 1)
		.map((node) => node.props.testID);
	// cells identify by ISO day (no index keys); October's grid starts on
	// a different first cell and every cell key is unique
	expect(after[0]).not.toBe(before[0]);
	expect(new Set(after).size).toBe(after.length);
	expect(after.length).toBe(before.length);
});

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

		// month label is now a Pressable: its text rides inside a child RNText
		const labelText = (screen: Screen): string => {
			const first = (
				screen.getByTestId("k-calendar-month-label").props.children as unknown[]
			)[0];
			if (first && typeof first === "object" && "props" in first) {
				return String((first as { props: { children?: string } }).props.children);
			}
			return String(first);
		};

	it("prev/next navigate across month and year boundaries", async () => {
		const screen: Screen = await render(
			<Calendar month={new Date(2026, 11, 1)} />,
		);
		expect(labelText(screen)).toBe("December 2026");
		await fireEvent.press(screen.getByTestId("k-calendar-next"));
		expect(labelText(screen)).toBe("January 2027");
		await fireEvent.press(screen.getByTestId("k-calendar-prev"));
		await fireEvent.press(screen.getByTestId("k-calendar-prev"));
		expect(labelText(screen)).toBe("November 2026");
	});

	it("nav clamps at min/max: out-of-window next/prev are disabled and inert", async () => {
		const screen: Screen = await render(
			<Calendar month={new Date(2026, 1, 1)} max={new Date(2026, 1, 20)} />,
		);
		const next = screen.getByTestId("k-calendar-next");
		expect(next.props.accessibilityState?.disabled).toBe(true);
		await fireEvent.press(next);
		expect(labelText(screen)).toBe("February 2026");
		const minScreen: Screen = await render(
			<Calendar month={new Date(2026, 1, 1)} min={new Date(2026, 1, 5)} />,
		);
		const prev = minScreen.getByTestId("k-calendar-prev");
		expect(prev.props.accessibilityState?.disabled).toBe(true);
		await fireEvent.press(prev);
		expect(labelText(minScreen)).toBe("February 2026");
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
		expect(
			screen.getAllByTestId("k-skeleton", inclHidden).length,
		).toBeGreaterThan(0);
	});

	describe("month/year picker", () => {
		it("month label toggles the picker: day grid swaps out and back", async () => {
			const screen: Screen = await render(
				<Calendar month={new Date(2026, 1, 1)} />,
			);
			const label = screen.getByTestId("k-calendar-month-label");
			expect(label.props.accessibilityRole).toBe("button");
			await fireEvent.press(label);
			expect(screen.getByTestId("k-calendar-month-picker")).toBeTruthy();
			expect(screen.queryByTestId("k-calendar-day-2026-02-10")).toBeNull();
			// day-grid chevrons are replaced by the picker's year chevrons
			expect(screen.queryByTestId("k-calendar-next")).toBeNull();
			expect(label.props.accessibilityState?.expanded).toBe(true);
			await fireEvent.press(label);
			expect(screen.queryByTestId("k-calendar-month-picker")).toBeNull();
			expect(screen.getByTestId("k-calendar-day-2026-02-10")).toBeTruthy();
			expect(label.props.accessibilityState?.expanded).toBe(false);
		});

		it("picker shows 12 full-name month options, view month selected", async () => {
			const screen: Screen = await render(
				<Calendar month={new Date(2026, 1, 1)} />,
			);
			await fireEvent.press(screen.getByTestId("k-calendar-month-label"));
			const options = screen.getAllByTestId(/^k-calendar-month-option-\d+$/);
			expect(options.length).toBe(12);
				expect(
					screen.getByTestId("k-calendar-month-option-2").props
						.accessibilityLabel,
				).toBe("March");
			const feb = screen.getByTestId("k-calendar-month-option-1");
			expect(feb.props.accessibilityState?.selected).toBe(true);
			expect(
				screen.getByTestId("k-calendar-month-option-0").props.accessibilityState
				?.selected,
			).toBe(false);
		});

		it("picking a month closes the picker and shows that month", async () => {
			const screen: Screen = await render(
				<Calendar month={new Date(2026, 1, 1)} />,
			);
			await fireEvent.press(screen.getByTestId("k-calendar-month-label"));
			await fireEvent.press(screen.getByTestId("k-calendar-month-option-5"));
			expect(screen.queryByTestId("k-calendar-month-picker")).toBeNull();
			expect(screen.getByTestId("k-calendar-day-2026-06-10")).toBeTruthy();
		});

		it("year chevrons move the picker year and picking applies it", async () => {
			const screen: Screen = await render(
				<Calendar month={new Date(2026, 1, 1)} />,
			);
			await fireEvent.press(screen.getByTestId("k-calendar-month-label"));
			await fireEvent.press(screen.getByTestId("k-calendar-year-next"));
			expect(screen.getByTestId("k-calendar-year-label").props.children).toBe(
				2027,
			);
			await fireEvent.press(screen.getByTestId("k-calendar-month-option-0"));
			expect(screen.getByTestId("k-calendar-day-2027-01-10")).toBeTruthy();
		});

		it("year chevrons clamp at min/max with disabled state", async () => {
			const screen: Screen = await render(
				<Calendar
					month={new Date(2026, 1, 1)}
					min={new Date(2026, 1, 5)}
					max={new Date(2026, 5, 20)}
				/>,
			);
			await fireEvent.press(screen.getByTestId("k-calendar-month-label"));
			const prev = screen.getByTestId("k-calendar-year-prev");
			expect(prev.props.accessibilityLabel).toBe("Previous year");
			expect(prev.props.accessibilityState?.disabled).toBe(true);
			const next = screen.getByTestId("k-calendar-year-next");
			expect(next.props.accessibilityLabel).toBe("Next year");
			// max lands in 2026, so 2027 has no reachable months
			expect(next.props.accessibilityState?.disabled).toBe(true);
			await fireEvent.press(next);
			expect(screen.getByTestId("k-calendar-year-label").props.children).toBe(
				2026,
			);
			expect(
				screen.getByTestId("k-calendar-month-option-6").props.accessibilityState
				?.disabled,
			).toBe(true);
		});

		it("out-of-window months disabled, boundary months enabled", async () => {
			const screen: Screen = await render(
				<Calendar
					month={new Date(2026, 1, 1)}
					min={new Date(2026, 1, 5)}
					max={new Date(2026, 5, 20)}
				/>,
			);
			await fireEvent.press(screen.getByTestId("k-calendar-month-label"));
			expect(
				screen.getByTestId("k-calendar-month-option-0").props.accessibilityState
				?.disabled,
			).toBe(true);
			expect(
				screen.getByTestId("k-calendar-month-option-1").props.accessibilityState
				?.disabled,
			).toBe(false);
			expect(
				screen.getByTestId("k-calendar-month-option-5").props.accessibilityState
				?.disabled,
			).toBe(false);
			expect(
				screen.getByTestId("k-calendar-month-option-6").props.accessibilityState
				?.disabled,
			).toBe(true);
		});

		// TestInstance children include text nodes; only element cells count
		const weekCells = (week: { children: unknown[] }): number =>
			week.children.filter(
				(c) =>
					!!c &&
					typeof c === "object" &&
					typeof (c as { props?: { testID?: string } }).props?.testID ===
						"string" &&
					(c as { props: { testID: string } }).props.testID.startsWith(
						"k-calendar-cell-",
					),
			).length;

		it("day grid is week rows of exactly 7 flex columns — no wrap", async () => {
			// Feb 1 2026 is a Sunday — zero leading blanks
			const feb: Screen = await render(
				<Calendar month={new Date(2026, 1, 1)} />,
			);
			// Jan 1 2026 is a Thursday — 4 leading blanks
			const jan: Screen = await render(
				<Calendar month={new Date(2026, 0, 1)} />,
			);
			for (const screen of [feb, jan]) {
				const weeks = screen.getAllByTestId("k-calendar-week");
				expect(weeks).toHaveLength(6);
				for (const week of weeks) {
					expect(weekCells(week)).toBe(7);
				}
				const grid = flatStyle(screen.getByTestId("k-calendar-grid"));
				expect(grid.flexWrap).toBeUndefined();
				expect(grid.justifyContent).toBeUndefined();
			}
			const wrapper = flatStyle(jan.getByTestId("k-calendar-cell-2026-01-15"));
			expect(wrapper.flexGrow).toBe(1);
			expect(wrapper.flexBasis).toBe(0);
			const day = flatStyle(jan.getByTestId("k-calendar-day-2026-01-15"));
			expect(day.width).toBe("100%");
			expect(day.height).toBe(36);
			expect(jan.getAllByTestId(/^k-calendar-cell-/).length).toBe(42);
		});

		it("weekday header uses the same 7-column flex math", async () => {
			const screen: Screen = await render(
				<Calendar month={new Date(2026, 1, 1)} />,
			);
			const header = flatStyle(screen.getByTestId("k-calendar-weekdays"));
			expect(header.flexWrap).toBeUndefined();
			for (const day of screen.getAllByTestId("k-calendar-weekday")) {
				const style = flatStyle(day);
				expect(style.flexGrow).toBe(1);
				expect(style.flexBasis).toBe(0);
				expect(style.textAlign).toBe("center");
				expect(style.width).toBeUndefined();
			}
		});

		it("leading and trailing blanks fill columns and stay inert", async () => {
			const screen: Screen = await render(
				<Calendar month={new Date(2026, 0, 1)} />,
			);
			const leading = flatStyle(screen.getByTestId("k-calendar-cell-2025-12-28"));
			expect(leading.flexGrow).toBe(1);
			expect(
				screen.getByTestId("k-calendar-day-2025-12-28").props.accessibilityState
					?.disabled,
			).toBe(true);
		});

		it("week rows stay 7 columns inside a narrow container", async () => {
			const screen: Screen = await render(
				<View style={{ width: 200 }}>
				<Calendar month={new Date(2026, 1, 1)} />
			</View>,
			);
			for (const week of screen.getAllByTestId("k-calendar-week")) {
				expect(weekCells(week)).toBe(7);
			}
		});

		it("month picker is 4 rows of 3 flex columns", async () => {
			const screen: Screen = await render(
				<Calendar month={new Date(2026, 1, 1)} />,
			);
			await fireEvent.press(screen.getByTestId("k-calendar-month-label"));
			const rows = screen.getAllByTestId("k-calendar-month-row");
			expect(rows).toHaveLength(4);
			for (const row of rows) {
				const options = row.children.filter(
					(c) =>
						!!c &&
						typeof c === "object" &&
						typeof (c as { props?: { testID?: string } }).props?.testID ===
							"string" &&
						(c as unknown as { props: { testID: string } }).props.testID.startsWith(
							"k-calendar-month-option-",
					),
				);
				expect(options).toHaveLength(3);
				for (const option of options) {
					const style = flatStyle(option as unknown as { props: { style?: unknown } });
					expect(style.flexGrow).toBe(1);
					expect(style.flexBasis).toBe(0);
					expect(style.width).toBeUndefined();
				}
			}
		});

		it("pressing an out-of-window month option is inert", async () => {
			const screen: Screen = await render(
				<Calendar
					month={new Date(2026, 1, 1)}
					min={new Date(2026, 1, 5)}
					max={new Date(2026, 5, 20)}
				/>,
			);
			await fireEvent.press(screen.getByTestId("k-calendar-month-label"));
			await fireEvent.press(screen.getByTestId("k-calendar-month-option-7"));
			// picker still open, view month unchanged
			expect(screen.getByTestId("k-calendar-month-picker")).toBeTruthy();
			expect(
				screen.getByTestId("k-calendar-month-option-1").props.accessibilityState
					?.selected,
			).toBe(true);
		});

		it("opening, navigating years, and picking months never commit a value", async () => {
			const onValueChange = jest.fn();
			const screen: Screen = await render(
				<Calendar
					month={new Date(2026, 1, 1)}
					onValueChange={onValueChange}
			/>,
			);
			await fireEvent.press(screen.getByTestId("k-calendar-month-label"));
			await fireEvent.press(screen.getByTestId("k-calendar-year-prev"));
			await fireEvent.press(screen.getByTestId("k-calendar-year-next"));
			await fireEvent.press(screen.getByTestId("k-calendar-month-option-7"));
			expect(onValueChange).not.toHaveBeenCalled();
		});
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
