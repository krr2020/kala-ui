export const badgeStyles = {
	base: "inline-flex items-center justify-center border-transparent px-2.5 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-colors",
	variants: {
		variant: {
			primary: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
			default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
			secondary:
				"bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/80",
			success: "bg-success text-success-foreground [a&]:hover:bg-success/80",
			danger:
				"bg-destructive text-destructive-foreground [a&]:hover:bg-destructive/80",
			destructive:
				"bg-destructive text-destructive-foreground [a&]:hover:bg-destructive/80",
			error: "bg-error text-error-foreground [a&]:hover:bg-error/80",
			warning: "bg-warning text-warning-foreground [a&]:hover:bg-warning/80",
			info: "bg-info text-info-foreground [a&]:hover:bg-info/80",
			light: "bg-muted text-muted-foreground [a&]:hover:bg-muted/80",
			dark: "bg-foreground text-card [a&]:hover:bg-foreground/90",
			muted: "bg-accent text-accent-foreground [a&]:hover:bg-accent/80",
			outline: "border text-foreground [a&]:hover:bg-accent",
		},
		shape: {
			default: "rounded",
			pill: "rounded-full",
		},
	},
	defaultVariants: {
		variant: "primary",
		shape: "default",
	} as const,
};
