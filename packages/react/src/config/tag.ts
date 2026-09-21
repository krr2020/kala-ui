/**
 * Tag styles — `variant` is the fill style, `color` the semantic color,
 * `size` the density. Default: subtle + muted + md.
 */
export const tagStyles = {
	base: "inline-flex items-center gap-1 font-medium transition-colors select-none",
	variants: {
		variant: {
			solid: "",
			outline: "border bg-transparent",
			subtle: "",
		},
		shape: {
			rounded: "rounded-[var(--kala-radius-control)]",
			pill: "rounded-full",
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
			sm: "text-xs px-2 py-0.5 [&_svg]:size-3",
			md: "text-sm px-2.5 py-1 [&_svg]:size-3.5",
			lg: "text-base px-3 py-1.5 [&_svg]:size-4",
		},
	},
	compoundVariants: [
		{
			variant: "solid",
			color: "primary",
			className: "bg-primary text-primary-foreground",
		},
		{
			variant: "solid",
			color: "secondary",
			className: "bg-secondary text-secondary-foreground",
		},
		{
			variant: "solid",
			color: "destructive",
			className: "bg-destructive text-destructive-foreground",
		},
		{
			variant: "solid",
			color: "success",
			className: "bg-success text-success-foreground",
		},
		{
			variant: "solid",
			color: "warning",
			className: "bg-warning text-warning-foreground",
		},
		{
			variant: "solid",
			color: "info",
			className: "bg-info text-info-foreground",
		},
		{
			variant: "solid",
			color: "muted",
			className: "bg-muted text-muted-foreground",
		},
		{
			variant: "outline",
			color: "primary",
			className: "border-primary text-primary",
		},
		{
			variant: "outline",
			color: "secondary",
			className: "border-secondary text-secondary",
		},
		{
			variant: "outline",
			color: "destructive",
			className: "border-destructive text-destructive",
		},
		{
			variant: "outline",
			color: "success",
			className: "border-success text-success",
		},
		{
			variant: "outline",
			color: "warning",
			className: "border-warning text-warning",
		},
		{
			variant: "outline",
			color: "info",
			className: "border-info text-info",
		},
		{
			variant: "outline",
			color: "muted",
			className: "border-muted-foreground text-muted-foreground",
		},
		{
			variant: "subtle",
			color: "primary",
			className: "bg-primary/10 text-primary",
		},
		{
			variant: "subtle",
			color: "secondary",
			className: "bg-secondary/10 text-secondary",
		},
		{
			variant: "subtle",
			color: "destructive",
			className: "bg-destructive/10 text-destructive",
		},
		{
			variant: "subtle",
			color: "success",
			className: "bg-success/10 text-success",
		},
		{
			variant: "subtle",
			color: "warning",
			className: "bg-warning/10 text-warning",
		},
		{
			variant: "subtle",
			color: "info",
			className: "bg-info/10 text-info",
		},
		{
			variant: "subtle",
			color: "muted",
			className: "bg-muted text-muted-foreground",
		},
	],
	defaultVariants: {
		variant: "subtle",
		color: "muted",
		size: "md",
		shape: "pill",
	} as const,
	icon: "shrink-0",
	remove:
		"shrink-0 rounded-full hover:opacity-70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current transition-opacity",
} as const;
