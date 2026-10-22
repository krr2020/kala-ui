/**
 * Drawer styles keyed by component slot. The root scrolls while header and
 * footer slots remain sticky, keeping actions available in long drawers.
 */
export const drawerStyles = {
	overlay: "fixed inset-0 z-(--kala-z-overlay) bg-overlay backdrop-blur-sm",
	root: "fixed z-(--kala-z-overlay) flex flex-col bg-background kala-surface-card",
	sides: {
		left: "inset-y-0 left-0 h-dvh max-h-dvh overflow-y-auto overscroll-contain border-r",
		right:
			"inset-y-0 right-0 h-dvh max-h-dvh overflow-y-auto overscroll-contain border-l",
	},
	vertical: {
		bottom:
			"inset-x-0 bottom-0 mt-24 max-h-[calc(100dvh-6rem)] overflow-y-auto overscroll-contain rounded-t-lg border-t",
		top: "inset-x-0 top-0 mb-24 max-h-[calc(100dvh-6rem)] overflow-y-auto overscroll-contain rounded-b-lg border-b",
	},
	size: {
		width: {
			sm: "w-[min(24rem,100vw)] max-w-[100vw] sm:max-w-[24rem]",
			md: "w-[min(32rem,100vw)] max-w-[100vw] sm:max-w-[32rem]",
			lg: "w-[min(40rem,100vw)] max-w-[100vw] sm:max-w-[40rem]",
			xl: "w-[min(48rem,100vw)] max-w-[100vw] sm:max-w-[48rem]",
			full: "w-screen max-w-none",
		},
		height: {
			sm: "h-[24rem] max-h-[calc(100dvh-6rem)] sm:max-h-[24rem]",
			md: "h-[32rem] max-h-[calc(100dvh-6rem)] sm:max-h-[32rem]",
			lg: "h-[40rem] max-h-[calc(100dvh-6rem)] sm:max-h-[40rem]",
			xl: "h-[48rem] max-h-[calc(100dvh-6rem)] sm:max-h-[48rem]",
			full: "h-[calc(100dvh-6rem)] sm:max-h-none",
		},
	},
	handle: "mx-auto mt-4 h-1.5 w-12 rounded-full bg-muted",
	header: "sticky top-0 z-10 grid gap-1.5 border-b bg-background px-6 py-5",
	headerRow: "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3",
	headerContent: "grid min-w-0 gap-1.5",
	headerAlign: {
		left: "text-left",
		center: "text-center",
		right: "text-right",
	},
	close: "shrink-0",
	closeIcon: "size-4",
	footer: "mt-auto flex flex-col gap-2 border-t bg-background px-6 py-5",
	footerSticky: "sticky bottom-0 z-10",
	title: "text-lg font-semibold leading-none tracking-tight text-foreground",
	description: "text-sm text-muted-foreground",
} as const;
