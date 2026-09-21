/**
 * MultiSelect styles — every class site in the component keyed by
 * slotStyles part name; conditional arms (hover/disabled, matchTriggerWidth)
 * sit beside their bases so the component composes without literals.
 */
export const multiSelectStyles = {
	root: "relative flex min-h-10 w-full items-center justify-between rounded-md border bg-background text-sm transition-colors kala-surface-input",
	rootHover: "hover:bg-accent/50",
	rootDisabled: "cursor-not-allowed opacity-50",
	trigger: "absolute inset-0 z-0 rounded-md kala-focus-ring",
	chipsContainer:
		"pointer-events-none relative z-10 flex flex-1 flex-wrap items-center gap-1 py-1.5 pl-3",
	placeholder: "text-muted-foreground",
	chip: "inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground",
	chipIcon: "mr-1 flex size-3 items-center",
	chipRemove:
		"kala-touch pointer-events-auto rounded-sm hover:bg-secondary-foreground/20",
	chipRemoveIcon: "size-3",
	overflowChip:
		"inline-flex items-center rounded bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground",
	controls: "pointer-events-none relative z-10 flex items-center gap-1 py-1.5 pr-3",
	clearAll:
		"kala-touch pointer-events-auto mr-1 rounded-sm opacity-50 hover:opacity-100",
	clearAllIcon: "size-4",
	chevron: "size-4 shrink-0 opacity-50",
	popoverContent: "z-30 p-0",
	command:
		"rounded-lg border bg-popover text-popover-foreground kala-surface-popover",
	commandMatched: "w-full",
	commandFluid: "min-w-[200px]",
	groupHeader: "sticky top-0 z-10 bg-popover p-0 kala-surface-card",
	groupHeaderItem: "cursor-pointer rounded-none border-b py-2",
	checkbox: "mr-2 pointer-events-none",
	separator: "my-1",
	optionIcon: "mr-2 flex size-4 items-center text-muted-foreground",
	truncate: "truncate",
} as const;
