/**
 * Popover styles.
 *
 * `variant` — "default" (surface) or "solid" (fully colored body; requires
 * `color`). `headerColor` tints the PopoverHeader strip on an otherwise
 * default popover. The arrow follows the effective color.
 */
export const POPOVER_COLORS = [
	"primary",
	"secondary",
	"destructive",
	"success",
	"warning",
	"info",
	"muted",
] as const;

export type PopoverColor = (typeof POPOVER_COLORS)[number];

export const popoverStyles = {
	base: "z-30 w-72 origin-(--radix-popover-content-transform-origin) rounded-md drop-shadow-md outline-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1 duration-200",
	variants: {
		variant: {
			default: "bg-popover text-popover-foreground border kala-surface-popover",
			solid: "border-0",
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
		padding: {
			md: "p-4",
			none: "",
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
	],
	defaultVariants: {
		variant: "default",
		color: "primary",
		padding: "md",
	},
	header: {
		base: "font-semibold border-b border-muted-foreground rounded-t-md px-4 py-3",
		variants: {
			color: {
				primary: "bg-primary text-primary-foreground border-transparent",
				secondary: "bg-secondary text-secondary-foreground border-transparent",
				destructive:
					"bg-destructive text-destructive-foreground border-transparent",
				success: "bg-success text-success-foreground border-transparent",
				warning: "bg-warning text-warning-foreground border-transparent",
				info: "bg-info text-info-foreground border-transparent",
				muted: "bg-muted text-muted-foreground border-transparent",
			},
		},
		defaultVariants: {},
	},
	arrow: {
		base: "z-30 size-2.5",
		variants: {
			color: {
				primary: "bg-primary border-primary",
				secondary: "bg-secondary border-secondary",
				destructive: "bg-destructive border-destructive",
				success: "bg-success border-success",
				warning: "bg-warning border-warning",
				info: "bg-info border-info",
				muted: "bg-muted border-muted",
			},
		},
		defaultVariants: {},
	},
} as const;
