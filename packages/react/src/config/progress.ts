/**
 * Progress styles — per-part base classes keyed by slotStyles part name.
 * `sizes`/`colors` feed the root and indicator composition; `stripedGradient`
 * overlays a moving stripe pattern when `striped` is set.
 */
export const progressStyles = {
	root: "relative w-full overflow-hidden rounded-full bg-primary/20",
	indicator: "h-full w-full flex-1 transition-all duration-500 ease-in-out",
	valueLabel: "flex h-full items-center justify-center text-xs font-medium",
	group: "relative w-full overflow-hidden rounded-full bg-primary/20 flex",
	sizes: {
		sm: "h-1",
		md: "h-2.5",
		lg: "h-4",
	},
	colors: {
		primary: "bg-primary",
		secondary: "bg-secondary",
		destructive: "bg-destructive",
		success: "bg-success",
		warning: "bg-warning",
		info: "bg-info",
	},
	stripedGradient:
		"bg-[linear-gradient(45deg,color-mix(in_srgb,var(--foreground)_15%,transparent)_25%,transparent_25%,transparent_50%,color-mix(in_srgb,var(--foreground)_15%,transparent)_50%,color-mix(in_srgb,var(--foreground)_15%,transparent)_75%,transparent_75%,transparent)]",
} as const;
