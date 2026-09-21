/**
 * Banner styles — `color` selects the semantic surface, `position` the
 * placement mode. Default: info + fixed.
 */
export const bannerStyles = {
	base: "w-full z-50 px-4 py-3 text-sm font-medium flex items-center justify-between gap-4",
	variants: {
		color: {
			info: "bg-info text-info-foreground",
			warning: "bg-warning text-warning-foreground",
			destructive: "bg-destructive text-destructive-foreground",
			success: "bg-success text-success-foreground",
		},
		position: {
			fixed: "fixed top-0 left-0 right-0 shadow-md",
			static: "relative",
		},
	},
	defaultVariants: {
		color: "info",
		position: "fixed",
	} as const,
	actions: "flex-1 flex items-center gap-3",
	close: "kala-touch cursor-pointer shrink-0 p-1 rounded hover:bg-overlay/20 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
	icon: "w-4 h-4",
} as const;
