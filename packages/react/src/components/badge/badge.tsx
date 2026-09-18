import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { badgeStyles } from "../../config/badge";
import { applySlot, mergeStyle, type SlotStyles } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import { Skeleton } from "../skeleton";

const badgeVariants = cva(badgeStyles.base, {
	variants: badgeStyles.variants,
	compoundVariants: badgeStyles.compoundVariants as never,
	defaultVariants: badgeStyles.defaultVariants,
});

function Badge({
	className,
	style,
	slotStyles,
	variant,
	color,
	shape,
	asChild = false,
	isLoading = false,
	...props
}: React.ComponentProps<"span"> &
	VariantProps<typeof badgeVariants> & {
		asChild?: boolean;
		isLoading?: boolean;
		/** Per-part overrides: `root` wins over the legacy `className`/`style` props. */
		slotStyles?: SlotStyles;
	}) {
	const root = applySlot(className, slotStyles?.root);
	if (isLoading) {
		return (
			<Skeleton
				data-kala-component="badge"
				style={mergeStyle(style, root.style)}
				className={cn(
					"inline-flex h-5 w-16 items-center rounded-full",
					root.className,
				)}
			/>
		);
	}

	const Comp = asChild ? Slot : "span";

	return (
		<Comp
			data-kala-component="badge"
			data-slot="badge"
			className={cn(badgeVariants({ variant, color, shape }), root.className)}
			style={mergeStyle(style, root.style)}
			{...props}
		/>
	);
}

export { Badge, badgeVariants };
