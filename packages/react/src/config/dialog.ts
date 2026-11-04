/**
 * Dialog geometry uses disjoint mobile/desktop variants: generic utility
 * classes emitted later by consumers must not override the desktop panel.
 * Dialog widths are independent of the page-container scale.
 */
const mobilePanel =
	"max-sm:inset-0 max-sm:h-full max-sm:w-full max-sm:max-h-none max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-none!";
const desktopPanel =
	"sm:inset-auto sm:h-auto sm:w-[90vw] sm:max-h-[90vh] sm:rounded-[var(--kala-radius-card)] sm:top-[50%] sm:left-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%]";
const desktopPosition =
	"sm:fixed! sm:top-[50%]! sm:left-[50%]! sm:translate-x-[-50%]! sm:translate-y-[-50%]!";
const closeControl =
	"kala-touch absolute top-4 right-4 z-10 inline-flex size-11 items-center justify-center rounded-full bg-muted/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:bg-accent disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export const dialogStyles = {
	overlay:
		"data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-(--kala-z-overlay) bg-overlay backdrop-blur-sm",
	content:
		"bg-card text-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed z-(--kala-z-overlay) flex flex-col overflow-hidden border duration-200 kala-surface-card",
	sizes: {
		sm: `${mobilePanel} ${desktopPanel} sm:max-w-[24rem] ${desktopPosition}`,
		md: `${mobilePanel} ${desktopPanel} sm:max-w-[32rem] ${desktopPosition}`,
		lg: `${mobilePanel} ${desktopPanel} sm:max-w-[42rem] ${desktopPosition}`,
		xl: `${mobilePanel} ${desktopPanel} sm:max-w-[56rem] ${desktopPosition}`,
		full: "inset-0 w-full h-full max-h-none translate-x-0 translate-y-0 rounded-none!",
	},
	close: closeControl,
	closeIcon: "size-5",
	header: "flex shrink-0 flex-col gap-1.5 px-6 py-4 border-b",
	footer:
		"flex shrink-0 flex-col-reverse gap-2 sm:flex-row sm:justify-end px-6 py-4 border-t bg-muted/50 rounded-b-[var(--kala-radius-card)]",
	title: "text-lg font-semibold leading-none tracking-tight text-foreground",
	description: "text-sm leading-relaxed text-muted-foreground",
	body: "flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-4",
} as const;
