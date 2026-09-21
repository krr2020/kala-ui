/**
 * Badge styles — `variant` is the fill style, `color` the semantic color.
 * Default: solid + primary.
 */
export const badgeStyles = {
	base: "inline-flex items-center justify-center border-transparent px-2.5 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-colors",
	variants: {
		variant: {
			solid: "",
			outline: "",
			subtle: "",
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
		shape: {
			rounded: "rounded",
			pill: "rounded-full",
		},
	},
	compoundVariants: [
		{
			variant: "solid",
			color: "primary",
			className: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
		},
		{
			variant: "solid",
			color: "secondary",
			className:
				"bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/80",
		},
		{
			variant: "solid",
			color: "destructive",
			className:
				"bg-destructive text-destructive-foreground [a&]:hover:bg-destructive/80",
		},
		{
			variant: "solid",
			color: "success",
			className: "bg-success text-success-foreground [a&]:hover:bg-success/80",
		},
		{
			variant: "solid",
			color: "warning",
			className: "bg-warning text-warning-foreground [a&]:hover:bg-warning/80",
		},
		{
			variant: "solid",
			color: "info",
			className: "bg-info text-info-foreground [a&]:hover:bg-info/80",
		},
		{
			variant: "solid",
			color: "muted",
			className: "bg-accent text-accent-foreground [a&]:hover:bg-accent/80",
		},
		{
			variant: "outline",
			color: "primary",
			className: "border-primary text-primary [a&]:hover:bg-primary/10",
		},
		{
			variant: "outline",
			color: "secondary",
			className: "border-secondary text-secondary [a&]:hover:bg-secondary/10",
		},
		{
			variant: "outline",
			color: "destructive",
			className:
				"border-destructive text-destructive [a&]:hover:bg-destructive/10",
		},
		{
			variant: "outline",
			color: "success",
			className: "border-success text-success [a&]:hover:bg-success/10",
		},
		{
			variant: "outline",
			color: "warning",
			className: "border-warning text-warning [a&]:hover:bg-warning/10",
		},
		{
			variant: "outline",
			color: "info",
			className: "border-info text-info [a&]:hover:bg-info/10",
		},
		{
			variant: "outline",
			color: "muted",
			className:
				"border-muted-foreground text-muted-foreground [a&]:hover:bg-muted",
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
		{ variant: "subtle", color: "info", className: "bg-info/10 text-info" },
		{
			variant: "subtle",
			color: "muted",
			className: "bg-muted text-muted-foreground",
		},
		{
			variant: "outline",
			className: "border text-foreground [a&]:hover:bg-accent",
		},
	],
	defaultVariants: {
		variant: "solid",
		color: "primary",
		shape: "rounded",
	} as const,
	loading: "inline-flex h-5 w-16 items-center rounded-full",
};
