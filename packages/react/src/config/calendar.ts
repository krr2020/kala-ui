/**
 * Calendar styles — react-day-picker owns the DOM; these bases feed its
 * `classNames` map (merged over `getDefaultClassNames()` in the component).
 * The RTL arms and the showWeekNumber/captionLayout conditionals sit beside
 * their bases so the component composes without literals.
 */
export const calendarStyles = {
	root: "bg-background group/calendar p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
	rootRtlNext: "rtl:**:[.rdp-button\\_next>svg]:rotate-180",
	rootRtlPrevious: "rtl:**:[.rdp-button\\_previous>svg]:rotate-180",
	innerRoot: "w-fit",
	skeleton: "p-3",
	months: "flex gap-4 flex-col md:flex-row relative",
	month: "flex flex-col w-full gap-4",
	nav: "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
	navButton: "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
	month_caption:
		"flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)",
	dropdowns:
		"w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5",
	dropdown_root:
		"relative focus-within:border-primary border focus-within:ring rounded-md kala-surface-input",
	dropdown: "absolute bg-popover inset-0 opacity-0",
	caption_label: "select-none font-medium",
	captionLabelLabel: "text-sm",
	captionLabelDropdown:
		"rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5",
	month_grid: "w-full border-collapse",
	weekdays: "flex",
	weekday:
		"text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none",
	week: "flex w-full mt-2",
	week_number_header: "select-none w-(--cell-size)",
	week_number: "text-[0.8rem] select-none text-muted-foreground",
	day: "relative w-full h-full p-0 text-center [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none",
	dayWeekNumber: "[&:nth-child(2)[data-selected=true]_button]:rounded-l-md",
	dayDefault: "[&:first-child[data-selected=true]_button]:rounded-l-md",
	range_start: "rounded-l-md bg-accent",
	range_middle: "rounded-none",
	range_end: "rounded-r-md bg-accent",
	today: "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
	outside: "text-muted-foreground aria-selected:text-muted-foreground",
	disabled: "text-muted-foreground opacity-50",
	hidden: "invisible",
	chevron: "size-4",
	weekNumber: "flex size-(--cell-size) items-center justify-center text-center",
	dayButton:
		"data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-primary group-data-[focused=true]/day:ring/50 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md [&>span]:text-xs [&>span]:opacity-70",
} as const;
