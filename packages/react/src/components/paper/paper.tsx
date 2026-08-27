import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "../../lib/utils";

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

export interface PaperProps
	extends React.ComponentProps<"div">,
		VariantProps<typeof paperVariants> {
	asChild?: boolean;
}

function Paper({
	ref,
	className,
	shadow,
	radius,
	withBorder,
	asChild = false,
	...props
}: PaperProps) {
	const Comp = asChild ? Slot : "div";
	return (
		<Comp
			data-kala-component="paper"
			className={cn(paperVariants({ shadow, radius, withBorder, className }))}
			ref={ref}
			{...props}
		/>
	);
}

export { Paper, paperVariants };
