/** Resizable styles — per-part base classes keyed by slotStyles part name. */
export const resizableStyles = {
	handle: "bg-separator z-10 flex items-center justify-center rounded-sm border transition-colors group-data-[orientation=vertical]:h-2 group-data-[orientation=vertical]:w-8 group-data-[orientation=horizontal]:h-8 group-data-[orientation=horizontal]:w-2 hover:bg-primary/50",
} as const;
