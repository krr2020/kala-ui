import type { DateRange } from "react-day-picker";
import type { Calendar } from "../calendar/calendar";

export interface DatePickerProps
	extends Omit<
		React.ComponentProps<typeof Calendar>,
		"mode" | "selected" | "onSelect" | "className" | "required" | "disabled"
	> {
	date?: Date;
	onDateChange?: (date: Date | undefined) => void;
	placeholder?: string;
	disabled?: React.ComponentProps<typeof Calendar>["disabled"];
	buttonDisabled?: boolean;
	className?: string;
	buttonClassName?: string;
	formatStr?: string;
	isLoading?: boolean;
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
	dateRange?: DateRange;
	onDateRangeChange?: (range: DateRange | undefined) => void;
	placeholder?: string;
	disabled?: React.ComponentProps<typeof Calendar>["disabled"];
	buttonDisabled?: boolean;
	className?: string;
	buttonClassName?: string;
	formatStr?: string;
	isLoading?: boolean;
}
