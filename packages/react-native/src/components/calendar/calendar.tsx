import { ChevronLeft, ChevronRight } from "lucide-react-native";
import type { ReactElement } from "react";
import { useMemo, useState } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { Pressable, Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import {
	addMonths,
	daysInMonth,
	firstWeekdayOffset,
	formatMonthYear,
	isSameDay,
	monthIsAfter,
	monthIsBefore,
} from "../../lib/date-utils";
import { applySlot } from "../slot-styles";
import type {
	CalendarProps,
	CalendarValue,
	DateRangeValue,
} from "./calendar.types";
import { CalendarSkeleton } from "./calendar-skeleton";

// Full names give unique keys; the grid renders only the first letter.
const WEEKDAYS = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
] as const;
const CELL_SIZE = 36;

const iso = (d: Date): string =>
	`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
		d.getDate(),
	).padStart(2, "0")}`;

/** 42 cells: leading days of the previous month, this month, trailing next. */
function buildMonth(view: Date): { date: Date; inMonth: boolean }[] {
	const year = view.getFullYear();
	const month = view.getMonth();
	const dim = daysInMonth(year, month);
	const offset = firstWeekdayOffset(new Date(year, month, 1));
	const prev = addMonths(view, -1);
	const prevDim = daysInMonth(prev.getFullYear(), prev.getMonth());
	const cells: { date: Date; inMonth: boolean }[] = [];
	for (let i = offset; i > 0; i--) {
		cells.push({
			date: new Date(prev.getFullYear(), prev.getMonth(), prevDim - i + 1),
			inMonth: false,
		});
	}
	for (let day = 1; day <= dim; day++) {
		cells.push({ date: new Date(year, month, day), inMonth: true });
	}
	const next = addMonths(view, 1);
	let trail = 1;
	while (cells.length < 42) {
		cells.push({
			date: new Date(next.getFullYear(), next.getMonth(), trail++),
			inMonth: false,
		});
	}
	return cells;
}

function rangePhase(
	selection: DateRangeValue | undefined,
): DateRangeValue | undefined {
	return selection;
}

/**
 * Calendar: inline month grid. Modes mirror the web component — single
 * commits a Date, multiple an ordered Date[], range a {from, to} where
 * a second tap completes and any later tap restarts. Nav buttons clamp
 * at min/max when the adjacent month falls entirely outside the window.
 */
export function Calendar({
	mode = "single",
	value,
	defaultValue,
	onValueChange,
	month,
	min,
	max,
	disabledDates,
	isLoading = false,
	skeletonConfig,
	accessibilityLabel = "Calendar",
	style,
	styles,
	testID = "k-calendar",
}: CalendarProps): ReactElement {
	const { theme } = useUnistyles();
	const seed = Array.isArray(defaultValue)
		? defaultValue[0]
		: defaultValue instanceof Date
			? defaultValue
			: (defaultValue as DateRangeValue | undefined)?.from;
	const [view, setView] = useState(month ?? seed ?? new Date());
	const [internal, setInternal] = useState<CalendarValue | undefined>(
		defaultValue,
	);

	const selection = value !== undefined ? value : internal;
	const cells = useMemo(() => buildMonth(view), [view]);

	const commit = (next: CalendarValue): void => {
		if (value === undefined) setInternal(next);
		onValueChange?.(next);
	};

	const isDayDisabled = (d: Date): boolean =>
		(min !== undefined && d < min && !isSameDay(d, min)) ||
		(max !== undefined && d > max && !isSameDay(d, max)) ||
		(disabledDates?.(d) ?? false);

	const handleDayPress = (d: Date): void => {
		if (isDayDisabled(d)) return;
		if (mode === "single") {
			commit(d);
			return;
		}
		if (mode === "multiple") {
			const current = Array.isArray(selection) ? selection : [];
			const next = current.some((x) => isSameDay(x, d))
				? current.filter((x) => !isSameDay(x, d))
				: [...current, d];
			commit(next);
			return;
		}
		const current = rangePhase(
			!Array.isArray(selection) && selection && !(selection instanceof Date)
				? selection
				: undefined,
		);
		if (!current || current.to) {
			commit({ from: d });
		} else if (d < current.from) {
			commit({ from: d });
		} else if (isSameDay(d, current.from)) {
			commit({ from: d });
		} else {
			commit({ from: current.from, to: d });
		}
	};

	if (isLoading) {
		return (
			<CalendarSkeleton
				{...skeletonConfig}
				testID={testID}
				style={style}
				styles={styles ? { root: styles.root } : undefined}
			/>
		);
	}

	const prevDisabled =
		min !== undefined && monthIsBefore(addMonths(view, -1), min);
	const nextDisabled =
		max !== undefined && monthIsAfter(addMonths(view, 1), max);

	const dayState = (d: Date, inMonth: boolean) => {
		let selected = false;
		let middle = false;
		if (mode === "single") {
			selected = selection instanceof Date && isSameDay(selection, d);
		} else if (mode === "multiple") {
			selected =
				Array.isArray(selection) && selection.some((x) => isSameDay(x, d));
		} else {
			const range =
				!Array.isArray(selection) && selection && !(selection instanceof Date)
					? selection
					: undefined;
			if (range) {
				const fromSel = isSameDay(range.from, d);
				const toSel = range.to !== undefined && isSameDay(range.to, d);
				selected = fromSel || toSel;
				middle =
					!fromSel &&
					!toSel &&
					d > range.from &&
					range.to !== undefined &&
					d < range.to;
			}
		}
		const today = isSameDay(d, new Date());
		const disabled = isDayDisabled(d);
		return { selected, middle, today, disabled, inMonth };
	};

	const dayStyle = (
		state: ReturnType<typeof dayState>,
	): StyleProp<ViewStyle> => [
		{
			width: CELL_SIZE,
			height: CELL_SIZE,
			borderRadius: 999,
			alignItems: "center",
			justifyContent: "center",
		},
		state.selected && {
			backgroundColor: theme.primary,
			borderWidth: 0,
		},
		state.middle && { backgroundColor: theme.accent, borderWidth: 0 },
		state.today &&
			!state.selected && {
				borderWidth: 1,
				borderColor: theme.ring,
			},
		state.disabled && { opacity: 0.35 },
	];

	const labelColor = (state: ReturnType<typeof dayState>): string => {
		if (state.selected) return theme.primaryForeground;
		if (state.middle) return theme.accentForeground;
		if (!state.inMonth) return theme.mutedForeground;
		return theme.foreground;
	};

	return (
		<View
			testID={testID}
			accessibilityLabel={accessibilityLabel}
			style={[{ gap: 8 }, applySlot(applySlot({}, style), styles?.root)]}
		>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<Pressable
					testID="k-calendar-prev"
					accessibilityRole="button"
					accessibilityLabel="Previous month"
					accessibilityState={{ disabled: prevDisabled }}
					onPress={() => !prevDisabled && setView(addMonths(view, -1))}
					hitSlop={6}
					style={({ pressed }) => ({
						width: CELL_SIZE,
						height: CELL_SIZE,
						alignItems: "center",
						justifyContent: "center",
						opacity: prevDisabled ? 0.35 : pressed ? 0.6 : 1,
					})}
				>
					<ChevronLeft size={18} color={theme.foreground} />
				</Pressable>
				<RNText
					testID="k-calendar-month-label"
					style={{ color: theme.foreground, fontSize: 15, fontWeight: "600" }}
				>
					{formatMonthYear(view)}
				</RNText>
				<Pressable
					testID="k-calendar-next"
					accessibilityRole="button"
					accessibilityLabel="Next month"
					accessibilityState={{ disabled: nextDisabled }}
					onPress={() => !nextDisabled && setView(addMonths(view, 1))}
					hitSlop={6}
					style={({ pressed }) => ({
						width: CELL_SIZE,
						height: CELL_SIZE,
						alignItems: "center",
						justifyContent: "center",
						opacity: nextDisabled ? 0.35 : pressed ? 0.6 : 1,
					})}
				>
					<ChevronRight size={18} color={theme.foreground} />
				</Pressable>
			</View>
			<View style={{ flexDirection: "row", justifyContent: "space-around" }}>

				{WEEKDAYS.map((day) => (
					<RNText
						key={day}
						testID="k-calendar-weekday"
						style={{
							color: theme.mutedForeground,
							fontSize: 12,
							fontWeight: "600",
							width: CELL_SIZE,
							textAlign: "center",
						}}
					>
						{day[0]}
					</RNText>
				))}
			</View>
			<View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
				{cells.map(({ date, inMonth }) => {
					const state = dayState(date, inMonth);
					return (
						<View key={iso(date)} testID={`k-calendar-cell-${iso(date)}`}>
							<Pressable
								testID={`k-calendar-day-${iso(date)}`}
								accessibilityRole="button"
								accessibilityLabel={`${date.getDate()} ${formatMonthYear(date)}`}
								accessibilityState={{
									disabled: state.disabled,
									selected: state.selected,
								}}
								onPress={() => handleDayPress(date)}
								style={dayStyle(state)}
							>
								<RNText
									style={{
										color: labelColor(state),
										fontSize: 14,
										fontWeight: state.selected ? "600" : "400",
									}}
								>
									{date.getDate()}
								</RNText>
							</Pressable>
						</View>
					);
				})}
			</View>
		</View>
	);
}
