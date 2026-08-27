import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "../../lib/utils";

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

export interface ContainerProps
	extends React.ComponentProps<"div">,
		VariantProps<typeof containerVariants> {
	asChild?: boolean;
}

function Container({
	ref,
	className,
	size,
	centered,
	asChild = false,
	...props
}: ContainerProps) {
	const Comp = asChild ? Slot : "div";
	return (
		<Comp
			data-kala-component="container"
			className={cn(containerVariants({ size, centered, className }))}
			ref={ref}
			{...props}
		/>
	);
}

export { Container, containerVariants };
