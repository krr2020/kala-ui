export const nativeSelectStyles = {
	root: "relative w-full",
	select:
		"w-full rounded-[var(--kala-radius-input,var(--kala-radius-control))] border bg-background text-sm transition-colors kala-surface-input kala-focus-ring disabled:cursor-not-allowed disabled:opacity-50 appearance-none pr-10",
	size: {
		md: "h-[var(--kala-control-h)] px-3 py-2",
		sm: "h-[var(--kala-control-h-sm)] px-2 py-1 text-xs",
	},
	hasError: "border-destructive kala-focus-ring-destructive",
	hasSuccess: "border-success kala-focus-ring-success",
	icon: "pointer-events-none absolute right-2 top-1/2 -translate-y-1/2",
	iconGlyph: {
		md: "opacity-70 size-4",
		sm: "opacity-70 size-3",
	},
};
