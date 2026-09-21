/**
 * ErrorBoundary styles — only the default fallback owns styled DOM; the
 * healthy path renders children verbatim.
 */
export const errorBoundaryStyles = {
	fallback:
		"rounded-md border border-destructive/50 bg-destructive/5 p-4 text-sm kala-surface-card",
} as const;
