/** NumberInput styles — per-part base classes keyed by slotStyles part name. */
export const numberInputStyles = {
	root: "flex w-full rounded-md border bg-card kala-surface-input transition-colors",
	increment:
		"flex items-center justify-center px-2.5 text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-l border-inherit",
	decrement:
		"flex items-center justify-center px-2.5 text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-r border-inherit",
} as const;
