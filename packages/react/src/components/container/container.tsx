import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { applySlot, mergeStyle } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import { useSlotStyles } from "../kala-provider";
import type { ContainerProps } from "./container.types";

const containerVariants = cva("mx-auto w-full px-4 md:px-6 lg:px-8", {
	variants: {
		size: {
			sm: "max-w-sm",
			md: "max-w-md",
			lg: "max-w-lg",
			xl: "max-w-xl",
			"2xl": "max-w-2xl",
			full: "max-w-none",
		},
		centered: {
			true: "flex flex-col items-center justify-center",
		},
	},
	defaultVariants: {
		size: "xl",
	},
});

function Container({
	ref,
	className,
	style,
	slotStyles: slotStylesRaw,
	size,
	centered,
	asChild = false,
	...props
}: ContainerProps) {
	const slotStyles = useSlotStyles("container", slotStylesRaw);
	const Comp = asChild ? Slot : "div";
	const root = applySlot(
		cn(containerVariants({ size, centered, className })),
		slotStyles?.root,
	);
	return (
		<Comp
			data-kala-component="container"
			className={root.className}
			style={mergeStyle(style, root.style)}
			ref={ref}
			{...props}
		/>
	);
}

export { Container, containerVariants };
