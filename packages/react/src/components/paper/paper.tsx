import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { applySlot, mergeStyle } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import type { PaperProps } from "./paper.types";

const paperVariants = cva("bg-background text-foreground", {
	variants: {
		shadow: {
			none: "shadow-none",
			xs: "shadow-sm",
			sm: "shadow",
			md: "shadow-md",
			lg: "shadow-lg",
			xl: "shadow-xl",
		},
		radius: {
			none: "rounded-none",
			sm: "rounded-sm",
			md: "rounded-md",
			lg: "rounded-lg",
			xl: "rounded-xl",
			full: "rounded-full",
		},
		withBorder: {
			true: "border border-border",
		},
	},
	defaultVariants: {
		shadow: "none",
		radius: "sm",
		withBorder: false,
	},
});

function Paper({
	ref,
	className,
	style,
	slotStyles,
	shadow,
	radius,
	withBorder,
	asChild = false,
	...props
}: PaperProps) {
	const Comp = asChild ? Slot : "div";
	const root = applySlot(
		cn(paperVariants({ shadow, radius, withBorder, className })),
		slotStyles?.root,
	);
	return (
		<Comp
			data-kala-component="paper"
			className={root.className}
			style={mergeStyle(style, root.style)}
			ref={ref}
			{...props}
		/>
	);
}

export { Paper, paperVariants };
