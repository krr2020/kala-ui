import type * as React from "react";
import type { DateRange } from "react-day-picker";
import type { SlotStyles } from "../../lib/slot-styles";
import type { Calendar } from "../calendar";

export interface DatePickerProps
	extends Omit<
		React.ComponentProps<typeof Calendar>,
		"mode" | "selected" | "onSelect" | "className" | "required" | "disabled"
	> {
	/** Selected date (controlled) */
	value?: Date;
	/** Initially selected date (uncontrolled) */
	defaultValue?: Date;
	/** Callback fired when the selected date changes */
	onValueChange?: (date: Date | undefined) => void;
	/** Trigger placeholder text */
	placeholder?: string;
	/** Dates that cannot be selected */
	disabled?: React.ComponentProps<typeof Calendar>["disabled"];
	/** Disables the trigger button only */
	buttonDisabled?: boolean;
	/** Class on the popover calendar wrapper */
	className?: string;
	/** Class on the trigger button */
	buttonClassName?: string;
	/** date-fns format string for the trigger label */
	formatStr?: string;
	/** Renders a skeleton instead of the trigger */
	isLoading?: boolean;
	/** Per-part overrides: `root` wins over `buttonClassName` on the trigger and the loading skeleton, `icon` targets the calendar glyph. */
	slotStyles?: SlotStyles;
}

export interface DateRangePickerProps
	extends Omit<
		React.ComponentProps<typeof Calendar>,
		| "mode"
		| "selected"
		| "onSelect"
		| "className"
		| "defaultMonth"
		| "numberOfMonths"
		| "required"
		| "disabled"
	> {
	/** Selected range (controlled) */
	value?: DateRange;
	/** Initially selected range (uncontrolled) */
	defaultValue?: DateRange;
	/** Callback fired when the selected range changes */
	onValueChange?: (range: DateRange | undefined) => void;
	/** Trigger placeholder text */
	placeholder?: string;
	/** Dates that cannot be selected */
	disabled?: React.ComponentProps<typeof Calendar>["disabled"];
	/** Disables the trigger button only */
	buttonDisabled?: boolean;
	/** Class on the popover calendar wrapper */
	className?: string;
	/** Class on the trigger button */
	buttonClassName?: string;
	/** date-fns format string for the trigger label */
	formatStr?: string;
	/** Renders a skeleton instead of the trigger */
	isLoading?: boolean;
	/** Per-part overrides: `root` wins over `buttonClassName` on the trigger and the loading skeleton, `icon` targets the calendar glyph. */
	slotStyles?: SlotStyles;
}
