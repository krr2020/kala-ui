"use client";

import { useUncontrolled } from "@kala-ui/react-hooks";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { cn } from "../../lib/utils";
import { Button } from "../button";
import { Calendar } from "../calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Skeleton } from "../skeleton";

export interface DatePickerProps
	extends Omit<
		React.ComponentProps<typeof Calendar>,
		"mode" | "selected" | "onSelect" | "className" | "required" | "disabled"
	> {
	/** Selected date (controlled) */
	value?: Date;
	/** Initially selected date (uncontrolled) */
	defaultValue?: Date;
	onValueChange?: (date: Date | undefined) => void;
	placeholder?: string;
	disabled?: React.ComponentProps<typeof Calendar>["disabled"];
	buttonDisabled?: boolean;
	className?: string;
	buttonClassName?: string;
	formatStr?: string;
	isLoading?: boolean;
}

export function DatePicker({
	value: valueProp,
	defaultValue,
	onValueChange,
	placeholder = "Pick a date",
	disabled,
	buttonDisabled = false,
	className,
	buttonClassName,
	formatStr = "PPP",
	isLoading = false,
	...props
}: DatePickerProps) {
	const [date, setDate] = useUncontrolled<Date | undefined>({
		value: valueProp,
		defaultValue,
		onChange: onValueChange,
	});

	if (isLoading) {
		return (
			<Skeleton className={cn("h-10 w-[280px] rounded-md", buttonClassName)} />
		);
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={cn(
						"w-[280px] justify-start text-left font-normal",
						!date && "text-muted-foreground",
						buttonClassName,
					)}
					disabled={buttonDisabled}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{date ? format(date, formatStr) : <span>{placeholder}</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className={cn("w-auto p-0", className)} align="start">
				<Calendar
					{...props}
					mode="single"
					selected={date}
					onSelect={setDate}
					required={false}
					disabled={disabled}
					autoFocus
				/>
			</PopoverContent>
		</Popover>
	);
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
	onValueChange?: (range: DateRange | undefined) => void;
	placeholder?: string;
	disabled?: React.ComponentProps<typeof Calendar>["disabled"];
	buttonDisabled?: boolean;
	className?: string;
	buttonClassName?: string;
	formatStr?: string;
	isLoading?: boolean;
}

export function DateRangePicker({
	value: valueProp,
	defaultValue,
	onValueChange,
	placeholder = "Pick a date range",
	disabled,
	buttonDisabled = false,
	className,
	buttonClassName,
	formatStr = "LLL dd, y",
	isLoading = false,
	...props
}: DateRangePickerProps) {
	const [dateRange, setDateRange] = useUncontrolled<DateRange | undefined>({
		value: valueProp,
		defaultValue,
		onChange: onValueChange,
	});

	if (isLoading) {
		return (
			<Skeleton className={cn("h-10 w-[300px] rounded-md", buttonClassName)} />
		);
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={cn(
						"w-[300px] justify-start text-left font-normal",
						!dateRange && "text-muted-foreground",
						buttonClassName,
					)}
					disabled={buttonDisabled}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{dateRange?.from ? (
						dateRange.to ? (
							<>
								{format(dateRange.from, formatStr)} -{" "}
								{format(dateRange.to, formatStr)}
							</>
						) : (
							format(dateRange.from, formatStr)
						)
					) : (
						<span>{placeholder}</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className={cn("w-auto p-0", className)} align="start">
				<Calendar
					{...props}
					mode="range"
					defaultMonth={dateRange?.from}
					selected={dateRange}
					onSelect={setDateRange}
					numberOfMonths={2}
					disabled={disabled}
				/>
			</PopoverContent>
		</Popover>
	);
}
