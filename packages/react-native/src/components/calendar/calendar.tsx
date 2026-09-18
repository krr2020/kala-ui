import { ChevronLeft, ChevronRight } from "lucide-react-native";
import type { ReactElement } from "react";
import { useMemo, useState } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { Pressable, Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { buildMonth, chunk, iso } from "../../lib/calendar.utils";
import {
	addMonths,
	formatMonthYear,
	isSameDay,
	monthIsAfter,
	monthIsBefore,
} from "../../lib/date.utils";
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
// Same for the picker's 4x3 grid — announced in full, shown 3 letters wide.
const MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
] as const;
const CELL_SIZE = 36;
const GRID_GAP = 4;

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
	slotStyles,
	testID = "k-calendar",
}: CalendarProps): ReactElement {
	const { theme } = useUnistyles();
	const seed = Array.isArray(defaultValue)
		? defaultValue[0]
		: defaultValue instanceof Date
			? defaultValue
			: (defaultValue as DateRangeValue | undefined)?.from;
	const [view, setView] = useState(month ?? seed ?? new Date());
	const [pickerOpen, setPickerOpen] = useState(false);
	const [pickerYear, setPickerYear] = useState(view.getFullYear());
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
		const current =
			!Array.isArray(selection) && selection && !(selection instanceof Date)
				? selection
				: undefined;
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
				slotStyles={slotStyles ? { root: slotStyles.root } : undefined}
			/>
		);
	}

	const prevDisabled =
		min !== undefined && monthIsBefore(addMonths(view, -1), min);
	const nextDisabled =
		max !== undefined && monthIsAfter(addMonths(view, 1), max);

	// a month option is reachable when any of its days falls inside the window
	const monthDisabled = (m: number): boolean => {
		const first = new Date(pickerYear, m, 1);
		const last = new Date(pickerYear, m + 1, 0);
		return (
			(min !== undefined && last < min && !isSameDay(last, min)) ||
			(max !== undefined && first > max && !isSameDay(first, max))
		);
	};
	const yearPrevDisabled =
		min !== undefined && pickerYear <= min.getFullYear();
	const yearNextDisabled =
		max !== undefined && pickerYear >= max.getFullYear();

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
		// out-of-month leading/trailing cells dim and are not selectable —
		// selecting a neighbor month's day from this grid is a misclick
		const disabled = !inMonth || isDayDisabled(d);
		return { selected, middle, today, disabled, inMonth };
	};

	const dayStyle = (
	state: ReturnType<typeof dayState>,
): StyleProp<ViewStyle> => [
	{
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
			style={[{ gap: 8 }, applySlot(applySlot({}, style), slotStyles?.root)]}
		>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				{pickerOpen ? (
				<Pressable
					testID="k-calendar-year-prev"
					accessibilityRole="button"
					accessibilityLabel="Previous year"
					accessibilityState={{ disabled: yearPrevDisabled }}
					onPress={() =>
						!yearPrevDisabled && setPickerYear(pickerYear - 1)
					}
					hitSlop={6}
					style={({ pressed }) => ({
						width: CELL_SIZE,
						height: CELL_SIZE,
						alignItems: "center",
						justifyContent: "center",
						opacity: yearPrevDisabled ? 0.35 : pressed ? 0.6 : 1,
					})}
				>
					<ChevronLeft size={18} color={theme.foreground} />
				</Pressable>
			) : (
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
			)}
			<Pressable
				testID="k-calendar-month-label"
					accessibilityRole="button"
					accessibilityLabel={formatMonthYear(view)}
					accessibilityState={{ expanded: pickerOpen }}
					onPress={() => {
						setPickerYear(view.getFullYear());
						setPickerOpen(!pickerOpen);
					}}
					style={({ pressed }) => ({
						opacity: pressed ? 0.6 : 1,
					})}
				>
					<RNText
						style={{
							color: theme.foreground,
							fontSize: 15,
							fontWeight: "600",
						}}
					>
						{formatMonthYear(view)}
					</RNText>
				</Pressable>
			{pickerOpen ? (
				<Pressable
					testID="k-calendar-year-next"
					accessibilityRole="button"
					accessibilityLabel="Next year"
					accessibilityState={{ disabled: yearNextDisabled }}
					onPress={() =>
						!yearNextDisabled && setPickerYear(pickerYear + 1)
					}
					hitSlop={6}
					style={({ pressed }) => ({
						width: CELL_SIZE,
						height: CELL_SIZE,
						alignItems: "center",
						justifyContent: "center",
						opacity: yearNextDisabled ? 0.35 : pressed ? 0.6 : 1,
					})}
				>
					<ChevronRight size={18} color={theme.foreground} />
				</Pressable>
			) : (
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
			)}
			</View>
			{pickerOpen ? (
			<View
				testID="k-calendar-month-picker"
				style={{ gap: 8 }}
			>

					<RNText
						testID="k-calendar-year-label"
						style={{
							color: theme.foreground,
							fontSize: 15,
							fontWeight: "600",
							alignSelf: "center",
						}}
					>
						{pickerYear}
					</RNText>
			<View
				testID="k-calendar-months"
				style={{ gap: GRID_GAP }}
			>
				{chunk(
					MONTHS.map((name, m) => ({ name, m })),
					3,
				).map((row) => (
					<View
						key={row[0].name}
						testID="k-calendar-month-row"
						style={{ flexDirection: "row", gap: GRID_GAP }}
					>
						{row.map(({ name, m }) => {
						const selected =
							m === view.getMonth() && pickerYear === view.getFullYear();
						const disabled = monthDisabled(m);
						return (
							<Pressable
								key={name}
								testID={`k-calendar-month-option-${m}`}
								accessibilityRole="button"
								accessibilityLabel={name}
								accessibilityState={{ disabled, selected }}
								disabled={disabled}
								onPress={() => {
									setView(new Date(pickerYear, m, 1));
									setPickerOpen(false);
								}}
								style={({ pressed }) => ({
									flexGrow: 1,
									flexBasis: 0,
									height: CELL_SIZE,
								borderRadius: 999,
								alignItems: "center",
								justifyContent: "center",
								backgroundColor: selected ? theme.primary : undefined,
								opacity: disabled ? 0.35 : pressed ? 0.6 : 1,
							})}
							>
							<RNText
									style={{
										color: selected
											? theme.primaryForeground
											: theme.foreground,
										fontSize: 13,
									fontWeight: selected ? "600" : "400",
								}}
							>
								{name.slice(0, 3)}
							</RNText>
								</Pressable>
								);
							})}
						</View>
					))}
				</View>
			</View>
		) : (
			<>
			<View testID="k-calendar-weekdays" style={{ flexDirection: "row", gap: GRID_GAP }}>
			{WEEKDAYS.map((day) => (
				<RNText
					key={day}
					testID="k-calendar-weekday"
					style={{
						color: theme.mutedForeground,
						fontSize: 12,
						fontWeight: "600",
						flexGrow: 1,
						flexBasis: 0,
						textAlign: "center",
					}}
				>
					{day[0]}
				</RNText>
			))}
			</View>
				<View testID="k-calendar-grid" style={{ gap: GRID_GAP }}>
				{chunk(cells, 7).map((week) => (
					<View
						// weeks are fixed 7-day windows; the first cell's ISO day
						// identifies the row stably across month navigation
						key={iso(week[0].date)}
						testID="k-calendar-week"
						style={{ flexDirection: "row", gap: GRID_GAP }}
					>
						{week.map(({ date, inMonth }) => {
						const state = dayState(date, inMonth);
						return (
							<View
								key={iso(date)}
								testID={`k-calendar-cell-${iso(date)}`}
								style={{ flexGrow: 1, flexBasis: 0 }}
							>
							<Pressable
									testID={`k-calendar-day-${iso(date)}`}
									accessibilityRole="button"
									accessibilityLabel={`${date.getDate()} ${formatMonthYear(date)}`}
									accessibilityState={{
										disabled: state.disabled,
										selected: state.selected,
									}}
									disabled={state.disabled}
									onPress={() => inMonth && handleDayPress(date)}
									style={[dayStyle(state), { width: "100%" }]}
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
				))}
				</View>
			</>
		)}
		</View>
	);
}
