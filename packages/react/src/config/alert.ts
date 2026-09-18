/**
 * Alert styles — `variant` is the fill style, `color` the semantic color.
 * Default: subtle + primary.
 */
export const alertStyles = {
	base: "relative w-full rounded-lg px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 border",
	variants: {
		variant: {
			subtle: "",
			outline: "bg-transparent border-2 font-medium",
			solid: "border-transparent",
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
	},
	compoundVariants: [
		// subtle
		{
			variant: "subtle",
			color: "primary",
			className:
				"bg-primary/10 border-primary/20 text-primary [&>svg]:text-primary",
		},
		{
			variant: "subtle",
			color: "secondary",
			className:
				"bg-muted border text-foreground [&>svg]:text-muted-foreground",
		},
		{
			variant: "subtle",
			color: "destructive",
			className:
				"bg-destructive/10 border-destructive/20 text-destructive [&>svg]:text-destructive",
		},
		{
			variant: "subtle",
			color: "success",
			className:
				"bg-success/10 border-success/20 text-success [&>svg]:text-success",
		},
		{
			variant: "subtle",
			color: "warning",
			className:
				"bg-warning/10 border-warning/20 text-warning [&>svg]:text-warning",
		},
		{
			variant: "subtle",
			color: "info",
			className: "bg-info/10 border-info/20 text-info [&>svg]:text-info",
		},
		{
			variant: "subtle",
			color: "muted",
			className:
				"bg-muted border text-foreground [&>svg]:text-muted-foreground",
		},
		// outline
		{
			variant: "outline",
			color: "primary",
			className: "border-primary text-primary [&>svg]:text-primary",
		},
		{
			variant: "outline",
			color: "secondary",
			className:
				"border-muted-foreground text-muted-foreground [&>svg]:text-muted-foreground",
		},
		{
			variant: "outline",
			color: "destructive",
			className: "border-destructive text-destructive [&>svg]:text-destructive",
		},
		{
			variant: "outline",
			color: "success",
			className: "border-success text-success [&>svg]:text-success",
		},
		{
			variant: "outline",
			color: "warning",
			className: "border-warning text-warning [&>svg]:text-warning",
		},
		{
			variant: "outline",
			color: "info",
			className: "border-info text-info [&>svg]:text-info",
		},
		{
			variant: "outline",
			color: "muted",
			className:
				"border-muted-foreground text-muted-foreground [&>svg]:text-muted-foreground",
		},
		// solid
		{
			variant: "solid",
			color: "primary",
			className:
				"bg-primary text-primary-foreground [&>svg]:text-primary-foreground",
		},
		{
			variant: "solid",
			color: "secondary",
			className:
				"bg-secondary text-secondary-foreground [&>svg]:text-secondary-foreground",
		},
		{
			variant: "solid",
			color: "destructive",
			className:
				"bg-destructive text-destructive-foreground [&>svg]:text-destructive-foreground",
		},
		{
			variant: "solid",
			color: "success",
			className:
				"bg-success text-success-foreground [&>svg]:text-success-foreground",
		},
		{
			variant: "solid",
			color: "warning",
			className:
				"bg-warning text-warning-foreground [&>svg]:text-warning-foreground",
		},
		{
			variant: "solid",
			color: "info",
			className: "bg-info text-info-foreground [&>svg]:text-info-foreground",
		},
		{
			variant: "solid",
			color: "muted",
			className: "bg-muted text-muted-foreground [&>svg]:text-muted-foreground",
		},
	],
	defaultVariants: {
		variant: "subtle",
		color: "primary",
	} as const,
	icon: "size-4 translate-y-0.5",
	dismiss:
		"cursor-pointer absolute right-2 top-2 rounded-md p-1 hover:bg-accent transition-colors",
} as const;
