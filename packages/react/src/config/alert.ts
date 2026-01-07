export const alertStyles = {
	base: "relative w-full rounded-lg px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 border",
	variants: {
		variant: {
			primary: "",
			secondary: "",
			success: "",
			danger: "",
			destructive: "",
			warning: "",
			info: "",
		},
		style: {
			default: "",
			outline: "bg-transparent border-2 font-medium",
			solid:
				"border-transparent text-primary-foreground [&>svg]:text-primary-foreground",
		},
	},
	compoundVariants: [
		// Default style variants
		{
			variant: "primary",
			style: "default",
			className:
				"bg-primary/10 border-primary/20 text-primary [&>svg]:text-primary",
		},
		{
			variant: "secondary",
			style: "default",
			className:
				"bg-muted border text-foreground [&>svg]:text-muted-foreground",
		},
		{
			variant: "success",
			style: "default",
			className:
				"bg-success/10 border-success/20 text-success [&>svg]:text-success",
		},
		{
			variant: "danger",
			style: "default",
			className:
				"bg-destructive/10 border-destructive/20 text-destructive [&>svg]:text-destructive",
		},
		{
			variant: "destructive",
			style: "default",
			className:
				"bg-destructive/10 border-destructive/20 text-destructive [&>svg]:text-destructive",
		},
		{
			variant: "warning",
			style: "default",
			className:
				"bg-warning/10 border-warning/20 text-warning [&>svg]:text-warning",
		},
		{
			variant: "info",
			style: "default",
			className: "bg-info/10 border-info/20 text-info [&>svg]:text-info",
		},
		// Outline style variants
		{
			variant: "primary",
			style: "outline",
			className: "border-primary text-primary [&>svg]:text-primary",
		},
		{
			variant: "secondary",
			style: "outline",
			className:
				"border-muted-foreground text-muted-foreground [&>svg]:text-muted-foreground",
		},
		{
			variant: "success",
			style: "outline",
			className: "border-success text-success [&>svg]:text-success",
		},
		{
			variant: "danger",
			style: "outline",
			className: "border-destructive text-destructive [&>svg]:text-destructive",
		},
		{
			variant: "destructive",
			style: "outline",
			className: "border-destructive text-destructive [&>svg]:text-destructive",
		},
		{
			variant: "warning",
			style: "outline",
			className: "border-warning text-warning [&>svg]:text-warning",
		},
		{
			variant: "info",
			style: "outline",
			className: "border-info text-info [&>svg]:text-info",
		},
		// Solid style variants
		{
			variant: "primary",
			style: "solid",
			className: "bg-primary text-primary-foreground",
		},
		{
			variant: "secondary",
			style: "solid",
			className: "bg-secondary text-secondary-foreground",
		},
		{
			variant: "success",
			style: "solid",
			className: "bg-success text-success-foreground",
		},
		{
			variant: "danger",
			style: "solid",
			className: "bg-destructive text-destructive-foreground",
		},
		{
			variant: "destructive",
			style: "solid",
			className: "bg-destructive text-destructive-foreground",
		},
		{
			variant: "warning",
			style: "solid",
			className: "bg-warning text-warning-foreground",
		},
		{
			variant: "info",
			style: "solid",
			className: "bg-info text-info-foreground",
		},
	],
	defaultVariants: {
		variant: "primary",
		style: "default",
	} as const,
} as const;
