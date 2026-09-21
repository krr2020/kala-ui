/**
 * Banner styles — `variant` is the fill style, `color` the semantic color,
 * `position` the placement mode. Default: solid + info + fixed (the classic
 * full-width system banner).
 */
export const bannerStyles = {
	base: "w-full z-50 px-4 py-3 text-sm font-medium flex items-center justify-between gap-4",
	variants: {
		variant: {
			solid: "",
			subtle: "",
			outline: "",
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
		position: {
			fixed: "fixed top-0 left-0 right-0 shadow-md",
			static: "relative",
		},
	},
	compoundVariants: [
		// solid
		{ variant: "solid", color: "primary", className: "bg-primary text-primary-foreground" },
		{ variant: "solid", color: "secondary", className: "bg-secondary text-secondary-foreground" },
		{ variant: "solid", color: "destructive", className: "bg-destructive text-destructive-foreground" },
		{ variant: "solid", color: "success", className: "bg-success text-success-foreground" },
		{ variant: "solid", color: "warning", className: "bg-warning text-warning-foreground" },
		{ variant: "solid", color: "info", className: "bg-info text-info-foreground" },
		{ variant: "solid", color: "muted", className: "bg-muted text-muted-foreground" },
		// subtle
		{ variant: "subtle", color: "primary", className: "bg-primary/10 border border-primary/20 text-primary" },
		{ variant: "subtle", color: "secondary", className: "bg-muted border text-foreground" },
		{ variant: "subtle", color: "destructive", className: "bg-destructive/10 border border-destructive/20 text-destructive" },
		{ variant: "subtle", color: "success", className: "bg-success/10 border border-success/20 text-success" },
		{ variant: "subtle", color: "warning", className: "bg-warning/10 border border-warning/20 text-warning" },
		{ variant: "subtle", color: "info", className: "bg-info/10 border border-info/20 text-info" },
		{ variant: "subtle", color: "muted", className: "bg-muted border text-foreground" },
		// outline
		{ variant: "outline", color: "primary", className: "border border-primary text-primary" },
		{ variant: "outline", color: "secondary", className: "border border-muted-foreground text-muted-foreground" },
		{ variant: "outline", color: "destructive", className: "border border-destructive text-destructive" },
		{ variant: "outline", color: "success", className: "border border-success text-success" },
		{ variant: "outline", color: "warning", className: "border border-warning text-warning" },
		{ variant: "outline", color: "info", className: "border border-info text-info" },
		{ variant: "outline", color: "muted", className: "border border-muted-foreground text-muted-foreground" },
	],
	defaultVariants: {
		variant: "solid",
		color: "info",
		position: "fixed",
	} as const,
	actions: "flex-1 flex items-center gap-3",
	close: "kala-touch cursor-pointer shrink-0 p-1 rounded hover:bg-overlay/20 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
	icon: "w-4 h-4",
} as const;
