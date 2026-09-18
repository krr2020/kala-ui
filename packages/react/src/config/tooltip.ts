/** Tooltip styles — per-part base classes keyed by slotStyles part name. */
export const tooltipStyles = {
	content:
		"z-30 rounded-md border bg-popover px-3 py-1.5 text-xs text-popover-foreground duration-200 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 kala-surface-popover",
	arrow: "z-30 size-2.5 rotate-225 border-t border-l bg-popover border-inherit -translate-y-[50%] kala-surface-popover",
} as const;
