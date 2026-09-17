import { Calendar as CalendarIcon } from "lucide-react-native";
import type { ReactElement } from "react";
import { useState } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { Pressable, Text as RNText } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { formatDay } from "../../lib/date.utils";
import type { DateRangeValue } from "../calendar";
import { Calendar } from "../calendar";
import { Sheet } from "../sheet";
import { SURFACE_HEIGHTS as HEIGHT, trigger as triggerRow } from "../input-surface.styles";
import { Skeleton } from "../skeleton";
import { applySlot } from "../slot-styles";
import type {
	DatePickerProps,
	DateRangePickerProps,
} from "./date-picker.types";

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
	accessibilityLabel?: string;
}): ReactElement {
	const { theme } = useUnistyles();
	// an explicit field label must not hide the chosen value from TalkBack:
	// combine when filled, keep the bare name while the placeholder shows
	const announced =
		accessibilityLabel && filled
			? `${accessibilityLabel}, ${label}`
			: (accessibilityLabel ?? label);
	return (
		<Pressable
			testID={testID}
			accessibilityRole="button"
			accessibilityLabel={announced}
			accessibilityState={{ disabled, expanded }}
			disabled={disabled}
			onPress={disabled ? undefined : onPress}
			style={[
				triggerRow(theme, { size, hasError, disabled }),
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
	slotStyles,
	testID = "k-date-picker",
}: DatePickerProps): ReactElement {
	const [internal, setInternal] = useState<Date | undefined>(defaultValue);
	const [open, setOpen] = useState(false);

	const triggerDisabled = buttonDisabled || disabled === true;
	const date = valueProp !== undefined ? valueProp : internal;

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
				style={applySlot(applySlot({}, style), slotStyles?.root)}
				accessibilityLabel={accessibilityLabel}
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
	slotStyles,
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
				style={applySlot(applySlot({}, style), slotStyles?.root)}
				accessibilityLabel={accessibilityLabel}
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
