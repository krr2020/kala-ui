/** TimePicker styles — per-part base classes keyed by slotStyles part name. */
export const timePickerStyles = {
	root: "inline-flex flex-col rounded-md border bg-card p-3 kala-surface-input",
	column: "flex flex-col items-center gap-1 min-w-0",
	colon: "flex items-center self-center mt-5 text-muted-foreground font-bold text-lg select-none",
	option:
		"w-10 h-8 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
	period:
		"w-10 h-8 rounded-md text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
	periodGroup: "flex flex-col gap-1 mt-6 ml-1",
} as const;
