/**
 * Dialog styles — per-part base classes keyed by slotStyles part name.
 * `sizes` re-clamps the mobile full-bleed base into a centered panel at
 * the sm: breakpoint; "full" opts out of that clamp for content-heavy
 * overlays (same contract as Drawer's "full").
 */
export const dialogStyles = {
	overlay:
		"data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-30 bg-overlay backdrop-blur-sm",
	content:
		"bg-card text-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed inset-0 z-30 flex flex-col w-full h-full max-h-none translate-x-0 translate-y-0 rounded-none border duration-200 kala-surface-card",
	sizes: {
		sm: "sm:inset-auto sm:h-auto sm:w-[90vw] sm:max-w-sm sm:max-h-[90vh] sm:rounded-[var(--kala-radius-card)] sm:top-[50%] sm:left-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%]",
		md: "sm:inset-auto sm:h-auto sm:w-[90vw] sm:max-w-lg sm:max-h-[90vh] sm:rounded-[var(--kala-radius-card)] sm:top-[50%] sm:left-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%]",
		lg: "sm:inset-auto sm:h-auto sm:w-[90vw] sm:max-w-2xl sm:max-h-[90vh] sm:rounded-[var(--kala-radius-card)] sm:top-[50%] sm:left-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%]",
		xl: "sm:inset-auto sm:h-auto sm:w-[90vw] sm:max-w-4xl sm:max-h-[90vh] sm:rounded-[var(--kala-radius-card)] sm:top-[50%] sm:left-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%]",
		full: "",
	},
	close: "absolute top-4 right-4 rounded-[var(--kala-radius-sm)] opacity-70 transition-opacity hover:opacity-100 disabled:pointer-events-none p-1 hover:bg-accent",
	closeIcon: "size-5",
	header: "flex flex-col gap-1.5 px-6 py-4 border-b",
	footer: "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end px-6 py-4 border-t bg-muted/50 rounded-b-[var(--kala-radius-card)]",
	title: "text-lg font-semibold leading-none tracking-tight text-foreground",
	description: "text-sm leading-relaxed text-muted-foreground",
	body: "flex-auto overflow-y-auto px-6 py-4 min-h-0",
} as const;
