/**
 * Button styles.
 *
 * Two orthogonal axes:
 * - `variant` — fill style: solid | outline | ghost | subtle | link
 * - `color` — semantic color: primary | secondary | destructive | success |
 *   warning | info | muted
 *
 * Omitting `color` selects the variant's neutral treatment (solid → primary,
 * outline/ghost → border/surface tokens, subtle → muted, link → primary).
 */
export const buttonStyles = {
	base: "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--kala-radius-control)] text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed kala-focus-ring kala-touch",
	variants: {
		variant: {
			solid: "",
			outline: "",
			ghost: "",
			subtle: "",
			link: "",
		},
		color: {
			primary: "",
			secondary: "",
			destructive: "",
			success: "",
			warning: "",
			info: "",
			muted: "",
		},
		size: {
			md: "h-[var(--kala-control-h)] px-[var(--kala-control-px)] py-2",
			xs: "h-[var(--kala-control-h-xs)] px-[var(--kala-control-px-xs)] text-xs",
			sm: "h-[var(--kala-control-h-sm)] px-[var(--kala-control-px-sm)]",
			lg: "h-[var(--kala-control-h-lg)] px-[var(--kala-control-px-lg)]",
			icon: "size-[var(--kala-control-h)]",
		},
		fullWidth: {
			true: "w-full",
		},
		rounded: {
			true: "rounded-full",
		},
	},
	compoundVariants: [
		// ---- neutral baselines (no color) ----
		{
			variant: "solid",
			className: "bg-primary text-primary-foreground hover:bg-primary/90",
		},
		{
			variant: "outline",
			className: "border bg-card hover:bg-accent hover:text-accent-foreground",
		},
		{
			variant: "ghost",
			className: "hover:bg-accent hover:text-accent-foreground",
		},
		{
			variant: "subtle",
			className: "bg-muted text-muted-foreground hover:bg-muted/80",
		},
		{
			variant: "link",
			className: "text-primary underline-offset-4 hover:underline",
		},
		// ---- solid + color ----
		{
			variant: "solid",
			color: "primary",
			className: "bg-primary text-primary-foreground hover:bg-primary/90",
		},
		{
			variant: "solid",
			color: "secondary",
			className: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
		},
		{
			variant: "solid",
			color: "destructive",
			className:
				"bg-destructive text-destructive-foreground hover:bg-destructive/90",
		},
		{
			variant: "solid",
			color: "success",
			className: "bg-success text-success-foreground hover:bg-success/80",
		},
		{
			variant: "solid",
			color: "warning",
			className: "bg-warning text-warning-foreground hover:bg-warning/80",
		},
		{
			variant: "solid",
			color: "info",
			className: "bg-info text-info-foreground hover:bg-info/80",
		},
		{
			variant: "solid",
			color: "muted",
			className: "bg-accent text-accent-foreground hover:bg-accent/80",
		},
		// ---- outline + color ----
		{
			variant: "outline",
			color: "primary",
			className:
				"border-primary text-primary bg-card hover:bg-primary hover:text-primary-foreground",
		},
		{
			variant: "outline",
			color: "secondary",
			className:
				"border-secondary text-secondary bg-card hover:bg-secondary hover:text-secondary-foreground",
		},
		{
			variant: "outline",
			color: "destructive",
			className:
				"border-destructive text-destructive bg-card hover:bg-destructive hover:text-destructive-foreground",
		},
		{
			variant: "outline",
			color: "success",
			className:
				"border-success text-success bg-card hover:bg-success hover:text-success-foreground",
		},
		{
			variant: "outline",
			color: "warning",
			className:
				"border-warning text-warning bg-card hover:bg-warning hover:text-warning-foreground",
		},
		{
			variant: "outline",
			color: "info",
			className:
				"border-info text-info bg-card hover:bg-info hover:text-info-foreground",
		},
		{
			variant: "outline",
			color: "muted",
			className:
				"border text-muted-foreground bg-card hover:bg-muted hover:text-muted-foreground",
		},
		// ---- ghost + color ----
		{
			variant: "ghost",
			color: "primary",
			className: "text-primary hover:bg-primary/10",
		},
		{
			variant: "ghost",
			color: "secondary",
			className: "text-secondary hover:bg-secondary/10",
		},
		{
			variant: "ghost",
			color: "destructive",
			className: "text-destructive hover:bg-destructive/10",
		},
		{
			variant: "ghost",
			color: "success",
			className: "text-success hover:bg-success/10",
		},
		{
			variant: "ghost",
			color: "warning",
			className: "text-warning hover:bg-warning/10",
		},
		{
			variant: "ghost",
			color: "info",
			className: "text-info hover:bg-info/10",
		},
		{
			variant: "ghost",
			color: "muted",
			className: "text-muted-foreground hover:bg-muted",
		},
		// ---- subtle + color ----
		{
			variant: "subtle",
			color: "primary",
			className: "bg-primary/10 text-primary hover:bg-primary/15",
		},
		{
			variant: "subtle",
			color: "secondary",
			className: "bg-secondary/10 text-secondary hover:bg-secondary/15",
		},
		{
			variant: "subtle",
			color: "destructive",
			className: "bg-destructive/10 text-destructive hover:bg-destructive/15",
		},
		{
			variant: "subtle",
			color: "success",
			className: "bg-success/10 text-success hover:bg-success/15",
		},
		{
			variant: "subtle",
			color: "warning",
			className: "bg-warning/10 text-warning hover:bg-warning/15",
		},
		{
			variant: "subtle",
			color: "info",
			className: "bg-info/10 text-info hover:bg-info/15",
		},
		{
			variant: "subtle",
			color: "muted",
			className: "bg-muted text-muted-foreground hover:bg-muted/80",
		},
		// ---- link + color ----
		{
			variant: "link",
			color: "primary",
			className: "text-primary underline-offset-4 hover:underline",
		},
		{
			variant: "link",
			color: "secondary",
			className: "text-secondary underline-offset-4 hover:underline",
		},
		{
			variant: "link",
			color: "destructive",
			className: "text-destructive underline-offset-4 hover:underline",
		},
		{
			variant: "link",
			color: "success",
			className: "text-success underline-offset-4 hover:underline",
		},
		{
			variant: "link",
			color: "warning",
			className: "text-warning underline-offset-4 hover:underline",
		},
		{
			variant: "link",
			color: "info",
			className: "text-info underline-offset-4 hover:underline",
		},
		{
			variant: "link",
			color: "muted",
			className: "text-muted-foreground underline-offset-4 hover:underline",
		},
	],
	defaultVariants: {
		variant: "solid",
		size: "md",
		fullWidth: false,
		rounded: false,
	} as const,
	spinner: "animate-spin h-4 w-4",
};
