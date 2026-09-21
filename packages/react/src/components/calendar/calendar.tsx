"use client";

import {
	ChevronDownIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
} from "lucide-react";

import * as React from "react";
import {
	type DayButton,
	DayPicker,
	getDefaultClassNames,
} from "react-day-picker";

import { calendarStyles } from "../../config/calendar";
import { applySlot, mergeStyle, type SlotStyles } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import { Button, buttonVariants } from "../button";
import { useSlotStyles } from "../kala-provider";
import { CalendarSkeleton } from "./calendar-skeleton";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
	buttonVariant?: React.ComponentProps<typeof Button>["variant"];
	isLoading?: boolean;
	skeletonConfig?: import("./calendar-skeleton").CalendarSkeletonConfig;
	skeleton?: React.ReactNode;
	slotStyles?: SlotStyles;
};

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	captionLayout = "label",
	buttonVariant = "ghost",
	formatters,
	components,
	isLoading = false,
	skeletonConfig,
	skeleton,
	style,
	slotStyles: slotStylesRaw,
	...props
}: CalendarProps) {
	const slotStyles = useSlotStyles("calendar", slotStylesRaw);
	if (isLoading) {
		if (skeleton) {
			const root = applySlot(
				cn(calendarStyles.skeleton, className),
				slotStyles?.root,
			);
			return (
				<div
					data-kala-component="calendar"
					className={root.className}
					style={mergeStyle(style, root.style)}
				>
					{skeleton}
				</div>
			);
		}
		const root = applySlot(cn(className), slotStyles?.root);
		return (
			<CalendarSkeleton
				data-kala-component="calendar"
				{...skeletonConfig}
				className={root.className}
				style={mergeStyle(style, root.style)}
			/>
		);
	}
	const c = calendarStyles;
	const defaultClassNames = getDefaultClassNames();
	const root = applySlot(
		cn(c.root, c.rootRtlNext, c.rootRtlPrevious, className),
		slotStyles?.root,
	);

	return (
		<DayPicker
			data-kala-component="calendar"
			showOutsideDays={showOutsideDays}
			className={root.className}
			style={mergeStyle(style, root.style)}
			captionLayout={captionLayout}
			formatters={{
				formatMonthDropdown: (date) =>
					date.toLocaleString("default", { month: "short" }),
				...formatters,
			}}
			classNames={{
				root: cn(c.innerRoot, defaultClassNames.root),
				months: cn(c.months, defaultClassNames.months),
				month: cn(c.month, defaultClassNames.month),
				nav: cn(c.nav, defaultClassNames.nav),
				button_previous: cn(
					buttonVariants({ variant: buttonVariant }),
					c.navButton,
					defaultClassNames.button_previous,
				),
				button_next: cn(
					buttonVariants({ variant: buttonVariant }),
					c.navButton,
					defaultClassNames.button_next,
				),
				month_caption: cn(c.month_caption, defaultClassNames.month_caption),
				dropdowns: cn(c.dropdowns, defaultClassNames.dropdowns),
				dropdown_root: cn(c.dropdown_root, defaultClassNames.dropdown_root),
				dropdown: cn(c.dropdown, defaultClassNames.dropdown),
				caption_label: cn(
					c.caption_label,
					captionLayout === "label"
						? c.captionLabelLabel
						: c.captionLabelDropdown,
					defaultClassNames.caption_label,
				),
				month_grid: cn(c.month_grid, defaultClassNames.month_grid),
				weekdays: cn(c.weekdays, defaultClassNames.weekdays),
				weekday: cn(c.weekday, defaultClassNames.weekday),
				week: cn(c.week, defaultClassNames.week),
				week_number_header: cn(
					c.week_number_header,
					defaultClassNames.week_number_header,
				),
				week_number: cn(c.week_number, defaultClassNames.week_number),
				day: cn(
					c.day,
					props.showWeekNumber ? c.dayWeekNumber : c.dayDefault,
					defaultClassNames.day,
				),
				range_start: cn(c.range_start, defaultClassNames.range_start),
				range_middle: cn(c.range_middle, defaultClassNames.range_middle),
				range_end: cn(c.range_end, defaultClassNames.range_end),
				today: cn(c.today, defaultClassNames.today),
				outside: cn(c.outside, defaultClassNames.outside),
				disabled: cn(c.disabled, defaultClassNames.disabled),
				hidden: cn(c.hidden, defaultClassNames.hidden),
				...classNames,
			}}
			components={{
				Root: ({ className, rootRef, ...props }) => {
					return (
						<div
							data-slot="calendar"
							ref={rootRef}
							className={cn(className)}
							{...props}
						/>
					);
				},
				Chevron: ({ className, orientation, ...props }) => {
					if (orientation === "left") {
						return (
							<ChevronLeftIcon
								className={cn(c.chevron, className)}
								{...props}
							/>
						);
					}

					if (orientation === "right") {
						return (
							<ChevronRightIcon
								className={cn(c.chevron, className)}
								{...props}
							/>
						);
					}

					return (
						<ChevronDownIcon className={cn(c.chevron, className)} {...props} />
					);
				},
				DayButton: CalendarDayButton,
				WeekNumber: ({ children, ...props }) => {
					return (
						<td {...props}>
							<div className={c.weekNumber}>{children}</div>
						</td>
					);
				},
				...components,
			}}
			{...props}
		/>
	);
}

function CalendarDayButton({
	className,
	day,
	modifiers,
	color: _color,
	...props
}: React.ComponentProps<typeof DayButton>) {
	const defaultClassNames = getDefaultClassNames();

	const ref = React.useRef<HTMLButtonElement>(null);
	React.useEffect(() => {
		if (modifiers.focused) ref.current?.focus();
	}, [modifiers.focused]);

	return (
		<Button
			data-kala-component="calendar-day-button"
			ref={ref}
			variant="ghost"
			size="icon"
			data-day={day.date.toLocaleDateString()}
			data-selected-single={
				modifiers.selected &&
				!modifiers.range_start &&
				!modifiers.range_end &&
				!modifiers.range_middle
			}
			data-range-start={modifiers.range_start}
			data-range-end={modifiers.range_end}
			data-range-middle={modifiers.range_middle}
			className={cn(calendarStyles.dayButton, defaultClassNames.day, className)}
			{...props}
		/>
	);
}

export { Calendar, CalendarDayButton };
