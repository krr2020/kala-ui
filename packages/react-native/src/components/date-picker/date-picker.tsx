import { Calendar as CalendarIcon } from "lucide-react-native";
import type { ReactElement } from "react";
import { useState } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { Pressable, Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { formatDay } from "../../lib/date-utils";
import { applySlot } from "../slot-styles";
import { Sheet } from "../sheet";
import { Skeleton } from "../skeleton";
import { Calendar } from "../calendar";
import type { DateRangeValue } from "../calendar";
import type { DatePickerProps, DateRangePickerProps } from "./date-picker.types";

const HEIGHT = { sm: 44, md: 48 } as const;

function TriggerChrome({
	label,
	filled,
	size,
	hasError,
	disabled,
	expanded,
	testID,
	onPress,
	style,
	accessibilityLabel,
}: {
	label: string;
	filled: boolean;
	size: "sm" | "md";
	hasError: boolean;
	disabled: boolean;
	expanded: boolean;
	testID: string;
	onPress: () => void;
	style?: StyleProp<ViewStyle>;
	accessibilityLabel: string;
}): ReactElement {
	const { theme } = useUnistyles();
	return (
		<Pressable
			testID={testID}
			accessibilityRole="button"
			accessibilityLabel={accessibilityLabel}
			accessibilityState={{ disabled, expanded }}
			disabled={disabled}
			onPress={disabled ? undefined : onPress}
			style={[
				{
					flexDirection: "row",
					alignItems: "center",
					gap: 8,
					minHeight: HEIGHT[size],
					paddingHorizontal: 12,
					borderWidth: 1,
					borderRadius: 8,
					borderColor: hasError ? theme.destructive : theme.border,
					backgroundColor: theme.background,
					opacity: disabled ? 0.6 : 1,
				},
				style,
			]}
		>
			<CalendarIcon size={16} color={theme.mutedForeground} />
			<RNText
				style={{
					color: filled ? theme.foreground : theme.mutedForeground,
					fontSize: 14,
					flex: 1,
				}}
			>
				{label}
			</RNText>
		</Pressable>
	);
}

/**
 * DatePicker: sheet-based single-date picker. Selecting a day commits
 * onValueChange and closes the sheet; controlled `value` locks display.
 */
export function DatePicker({
	value: valueProp,
	defaultValue,
	onValueChange,
	placeholder = "Pick a date",
	size = "md",
	month,
	min,
	max,
	disabledDates,
	buttonDisabled = false,
	disabled,
	hasError = false,
	isLoading = false,
	accessibilityLabel,
	style,
	styles,
	testID = "k-date-picker",
}: DatePickerProps): ReactElement {
	const [internal, setInternal] = useState<Date | undefined>(defaultValue);
	const [open, setOpen] = useState(false);

	const date = valueProp !== undefined ? valueProp : internal;
	const triggerDisabled = buttonDisabled || disabled === true;

	if (isLoading) {
		return (
			<Skeleton
				testID={testID}
				style={[{ height: HEIGHT[size], width: 280 }, style]}
			/>
		);
	}

	const handleSelect = (next: unknown): void => {
		if (next instanceof Date) {
			if (valueProp === undefined) setInternal(next);
			onValueChange?.(next);
			setOpen(false);
		}
	};

	return (
		<>
			<TriggerChrome
				label={date ? formatDay(date) : placeholder}
				filled={date !== undefined}
				size={size}
				hasError={hasError}
				disabled={triggerDisabled}
				expanded={open}
				testID={testID}
				onPress={() => setOpen(true)}
				style={applySlot(applySlot({}, style), styles?.root)}
				accessibilityLabel={
					accessibilityLabel ?? (date ? formatDay(date) : placeholder)
				}
			/>
			<Sheet open={open} onClose={() => setOpen(false)} snap="half">
				<Calendar
					mode="single"
					value={date}
					defaultValue={defaultValue}
					month={month ?? date}
					min={min}
					max={max}
					disabledDates={disabledDates}
					onValueChange={handleSelect}
					accessibilityLabel="Choose date"
				/>
			</Sheet>
		</>
	);
}

/**
 * DateRangePicker: sheet-based range picker. The sheet stays open while
 * only `from` is chosen and closes once the range completes; a later
 * tap inside a controlled range never overrides the parent's value.
 */
export function DateRangePicker({
	value: valueProp,
	defaultValue,
	onValueChange,
	placeholder = "Pick a date range",
	size = "md",
	month,
	min,
	max,
	disabledDates,
	buttonDisabled = false,
	disabled,
	hasError = false,
	isLoading = false,
	accessibilityLabel,
	style,
	styles,
	testID = "k-date-picker-date-range-picker",
}: DateRangePickerProps): ReactElement {
	const [internal, setInternal] = useState<DateRangeValue | undefined>(
		defaultValue,
	);
	const [open, setOpen] = useState(false);
	const range = valueProp !== undefined ? valueProp : internal;
	const triggerDisabled = buttonDisabled || disabled === true;

	if (isLoading) {
		return (
			<Skeleton
				testID={testID}
				style={[{ height: HEIGHT[size], width: 300 }, style]}
			/>
		);
	}

	const label = range?.from
		? range.to
			? `${formatDay(range.from)} - ${formatDay(range.to)}`
			: formatDay(range.from)
		: placeholder;

	const handleSelect = (next: unknown): void => {
		if (next && typeof next === "object" && "from" in next) {
			const picked = next as DateRangeValue;
			if (valueProp === undefined) setInternal(picked);
			onValueChange?.(picked);
			if (picked.to) setOpen(false);
		}
	};

	return (
		<>
			<TriggerChrome
				label={label}
				filled={range?.from !== undefined}
				size={size}
				hasError={hasError}
				disabled={triggerDisabled}
				expanded={open}
				testID={testID}
				onPress={() => setOpen(true)}
				style={applySlot(applySlot({}, style), styles?.root)}
				accessibilityLabel={accessibilityLabel ?? label}
			/>
			<Sheet open={open} onClose={() => setOpen(false)} snap="half">
				<Calendar
					mode="range"
					value={range}
					defaultValue={defaultValue}
					month={month ?? range?.from}
					min={min}
					max={max}
					disabledDates={disabledDates}
					onValueChange={handleSelect}
					accessibilityLabel="Choose date range"
				/>
			</Sheet>
		</>
	);
}
