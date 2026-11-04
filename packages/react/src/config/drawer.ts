export const drawerStyles = {
	overlay: "fixed inset-0 z-(--kala-z-overlay) bg-overlay backdrop-blur-sm",
	root: "fixed z-(--kala-z-overlay) flex flex-col overflow-hidden bg-background kala-surface-card",
	sides: {
		left: "inset-y-0 left-0 h-dvh max-h-dvh border-r",
		right: "inset-y-0 right-0 h-dvh max-h-dvh border-l",
	},
	vertical: {
		bottom:
			"inset-x-0 bottom-0 mt-24 max-h-[calc(100dvh-6rem)] rounded-t-lg border-t",
		top: "inset-x-0 top-0 mb-24 max-h-[calc(100dvh-6rem)] rounded-b-lg border-b",
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
	header:
		"sticky top-0 z-10 grid shrink-0 gap-1 border-b bg-background px-4 py-3",
	body: "min-h-0 flex-1 overflow-y-auto overscroll-contain",
	headerRow: "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3",
	headerContent: "grid min-w-0 gap-1",
	headerAlign: {
		left: "text-left",
		center: "text-center",
		right: "text-right",
	},
	close:
		"kala-touch shrink-0 rounded-full bg-muted/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
	closeIcon: "size-4",
	footer:
		"mt-auto flex shrink-0 flex-col gap-2 border-t bg-background px-6 py-5",
	footerSticky: "sticky bottom-0 z-10",
	title: "text-lg font-semibold leading-none tracking-tight text-foreground",
	description: "text-sm text-muted-foreground",
} as const;
