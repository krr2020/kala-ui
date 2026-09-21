import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import type * as React from "react";
import { applySlot, mergeStyle } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import { useSlotStyles } from "../kala-provider";
import type { HeadingProps } from "./heading.types";

const headingVariants = cva(
	"font-heading font-bold tracking-tight text-foreground",
	{
		variants: {
			size: {
				h1: "text-4xl lg:text-5xl",
				h2: "text-3xl lg:text-4xl",
				h3: "text-2xl lg:text-3xl",
				h4: "text-xl lg:text-2xl",
				h5: "text-lg lg:text-xl",
				h6: "text-base lg:text-lg",
			},
			align: {
				left: "text-left",
				center: "text-center",
				right: "text-right",
			},
			weight: {
				default: "font-bold",
				medium: "font-medium",
				semibold: "font-semibold",
				extrabold: "font-extrabold",
			},
		},
		defaultVariants: {
			size: "h2",
			align: "left",
			weight: "default",
		},
	},
);

function Heading({
	ref,
	className,
	style,
	slotStyles: slotStylesRaw,
	size,
	align,
	weight,
	asChild = false,
	as,
	...props
}: HeadingProps) {
	const slotStyles = useSlotStyles("heading", slotStylesRaw);
	const defaultTag = (size as React.ElementType) || "h2";
	const Tag = asChild ? Slot : as || defaultTag;
	const root = applySlot(
		cn(headingVariants({ size, align, weight, className })),
		slotStyles?.root,
	);

	return (
		<Tag
			data-kala-component="heading"
			className={root.className}
			style={mergeStyle(style, root.style)}
			ref={ref}
			{...props}
		/>
	);
}

export { Heading, headingVariants };
