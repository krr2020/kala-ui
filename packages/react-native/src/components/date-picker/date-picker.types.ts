import type { StyleProp, ViewStyle } from "react-native";
import type { DateRangeValue } from "../calendar";

/** Calendar props forwarded into the sheet of both picker triggers. */
export interface PickerCalendarProps {
	/** Initially visible month inside the sheet. */
	month?: Date;
	/** Earliest selectable date (inclusive). */
	min?: Date;
	/** Latest selectable date (inclusive). */
	max?: Date;
	/** Extra per-day disable rule, merged with min/max. */
	disabledDates?: (date: Date) => boolean;
}

export interface DatePickerProps extends PickerCalendarProps {
	/** Controlled date; locks display until the parent re-renders. */
	value?: Date;
	/** Uncontrolled seed; ignored when `value` is provided. */
	defaultValue?: Date;
	/** Fires on commit; still fires when controlled. */
	onValueChange?: (date: Date | undefined) => void;
	placeholder?: string;
	size?: "sm" | "md";
	/** Disables the trigger (the calendar stays usable inside the sheet). */
	buttonDisabled?: boolean;
	/** Legacy alias of buttonDisabled, kept for web API parity. */
	disabled?: boolean;
	hasError?: boolean;
	/** Swaps the trigger for a skeleton surface keeping the marker. */
	isLoading?: boolean;
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: { root?: StyleProp<ViewStyle> };
	testID?: string;
}

export interface DateRangePickerProps extends PickerCalendarProps {
	/** Controlled range; locks display until the parent re-renders. */
	value?: DateRangeValue;
	/** Uncontrolled seed; ignored when `value` is provided. */
	defaultValue?: DateRangeValue;
	/** Fires on every phase change; still fires when controlled. */
	onValueChange?: (range: DateRangeValue | undefined) => void;
	placeholder?: string;
	size?: "sm" | "md";
	/** Disables the trigger (the calendar stays usable inside the sheet). */
	buttonDisabled?: boolean;
	/** Legacy alias of buttonDisabled, kept for web API parity. */
	disabled?: boolean;
	hasError?: boolean;
	/** Swaps the trigger for a skeleton surface keeping the marker. */
	isLoading?: boolean;
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: { root?: StyleProp<ViewStyle> };
	testID?: string;
}
