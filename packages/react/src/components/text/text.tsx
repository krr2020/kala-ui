import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "../../lib/utils";

const textVariants = cva("text-foreground", {
	variants: {
		size: {
			xs: "text-xs",
			sm: "text-sm",
			md: "text-base",
			lg: "text-lg",
			xl: "text-xl",
			"2xl": "text-2xl",
			"3xl": "text-3xl",
			"4xl": "text-4xl",
			"5xl": "text-5xl",
			"6xl": "text-6xl",
			"7xl": "text-7xl",
			"8xl": "text-8xl",
			"9xl": "text-9xl",
		},
		weight: {
			thin: "font-thin",
			extralight: "font-extralight",
			light: "font-light",
			normal: "font-normal",
			medium: "font-medium",
			semibold: "font-semibold",
			bold: "font-bold",
			extrabold: "font-extrabold",
			black: "font-black",
		},
		align: {
			left: "text-left",
			center: "text-center",
			right: "text-right",
			justify: "text-justify",
			start: "text-start",
			end: "text-end",
		},
		color: {
			primary: "text-primary",
			secondary: "text-secondary-foreground",
			destructive: "text-destructive",
			success: "text-success",
			warning: "text-warning",
			info: "text-info",
			muted: "text-muted-foreground",
		},
		truncate: {
			true: "truncate",
		},
	},
	defaultVariants: {
		size: "md",
		weight: "normal",
		align: "left",
	},
});

export interface TextProps
	extends Omit<React.HTMLAttributes<HTMLElement>, "color">,
		VariantProps<typeof textVariants>,
		React.RefAttributes<HTMLElement> {
	asChild?: boolean;
	as?: React.ElementType;
}

function Text({
	ref,
	className,
	size,
	weight,
	align,
	color,
	truncate,
	asChild = false,
	as: Tag = "p",
	...props
}: TextProps) {
	const Comp = asChild ? Slot : Tag;
	return (
		<Comp
			data-kala-component="text"
			className={cn(
				textVariants({ size, weight, align, color, truncate, className }),
			)}
			ref={ref}
			{...props}
		/>
	);
}

export { Text, textVariants };
