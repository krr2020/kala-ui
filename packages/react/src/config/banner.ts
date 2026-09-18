/** Banner styles — per-part base classes keyed by slotStyles part name. */
export const bannerStyles = {
	actions: "flex-1 flex items-center gap-3",
	close: "kala-touch cursor-pointer shrink-0 p-1 rounded hover:bg-overlay/20 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
	icon: "w-4 h-4",
} as const;
