/** ScrollArea styles — per-part base classes keyed by slotStyles part name. */
export const scrollAreaStyles = {
	scrollbar: "flex touch-none select-none transition-colors",
	thumb:
		"bg-border relative flex-1 rounded-full transition-colors hover:bg-border/80",
} as const;
