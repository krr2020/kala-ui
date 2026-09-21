"use client";

import { useUncontrolled } from "@kala-ui/react-hooks";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import type { DateRange } from "react-day-picker";
import { datePickerStyles } from "../../config/date-picker";
import { applySlot, type SlotStyles } from "../../lib/slot-styles";
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
	/** Per-part overrides: `root` wins over `buttonClassName` on the trigger and the loading skeleton, `icon` targets the calendar glyph. */
	slotStyles?: SlotStyles;
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
	slotStyles,
	...props
}: DatePickerProps) {
	const [date, setDate] = useUncontrolled<Date | undefined>({
		value: valueProp,
		defaultValue,
		onChange: onValueChange,
	});
	const [open, setOpen] = React.useState(false);

	if (isLoading) {
		const skeletonRoot = applySlot(
			cn("h-10 w-[280px] rounded-md", buttonClassName),
			slotStyles?.root,
		);
		return (
			<Skeleton
				data-kala-component="date-picker"
				className={skeletonRoot.className}
			/>
		);
	}

	const trigger = applySlot(
		cn(
			datePickerStyles.trigger,
			!date && "text-muted-foreground",
			buttonClassName,
		),
		slotStyles?.root,
	);
	const icon = applySlot(datePickerStyles.icon, slotStyles?.icon);

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}
		>
			<PopoverTrigger asChild data-kala-component="date-picker">
				<Button
					variant="outline"
					className={trigger.className}
					disabled={buttonDisabled}
				>
					<CalendarIcon className={icon.className} style={icon.style} />
					{date ? format(date, formatStr) : <span>{placeholder}</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className={cn(datePickerStyles.content, className)}
				align="start"
			>
				<Calendar
					{...props}
					mode="single"
					selected={date}
					onSelect={(selectedDate) => {
						setDate(selectedDate);
						setOpen(false);
					}}
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
	/** Per-part overrides: `root` wins over `buttonClassName` on the trigger and the loading skeleton, `icon` targets the calendar glyph. */
	slotStyles?: SlotStyles;
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
	slotStyles,
	...props
}: DateRangePickerProps) {
	const [dateRange, setDateRange] = useUncontrolled<DateRange | undefined>({
		value: valueProp,
		defaultValue,
		onChange: onValueChange,
	});
	const [open, setOpen] = React.useState(false);
	// react-day-picker v10 reports {from: X, to: X} already on the FIRST
	// click, so completion can't be read off the shape — track the phase.
	const awaitingRangeEndRef = React.useRef(false);
	const handleOpenChange = (nextOpen: boolean) => {
		setOpen(nextOpen);
		if (nextOpen) {
			awaitingRangeEndRef.current = false;
		}
	};

	if (isLoading) {
		const skeletonRoot = applySlot(
			cn("h-10 w-[300px] rounded-md", buttonClassName),
			slotStyles?.root,
		);
		return (
			<Skeleton
				data-kala-component="date-range-picker"
				className={skeletonRoot.className}
			/>
		);
	}

	const trigger = applySlot(
		cn(
			datePickerStyles.triggerRange,
			!dateRange && "text-muted-foreground",
			buttonClassName,
		),
		slotStyles?.root,
	);
	const icon = applySlot(datePickerStyles.icon, slotStyles?.icon);

	return (
		<Popover
			open={open}
			onOpenChange={handleOpenChange}
		>
			<PopoverTrigger asChild data-kala-component="date-range-picker">
				<Button
					variant="outline"
					className={trigger.className}
					disabled={buttonDisabled}
				>
					<CalendarIcon className={icon.className} style={icon.style} />
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
			<PopoverContent
				className={cn(datePickerStyles.content, className)}
				align="start"
			>
				<Calendar
					{...props}
					mode="range"
					defaultMonth={dateRange?.from}
					selected={dateRange}
					onSelect={(range) => {
						setDateRange(range);
						if (!awaitingRangeEndRef.current) {
							// First click picked the start — stay open for the end.
							awaitingRangeEndRef.current = true;
						} else {
							// Second click completed (or re-picked) the range.
							awaitingRangeEndRef.current = false;
							setOpen(false);
						}
					}}
					numberOfMonths={2}
					disabled={disabled}
				/>
			</PopoverContent>
		</Popover>
	);
}
