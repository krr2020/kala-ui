import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { badgeStyles } from "../../config/badge";
import { applySlot, mergeStyle } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import { useSlotStyles } from "../kala-provider";
import { Skeleton } from "../skeleton";
import type { BadgeProps } from "./badge.types";

const badgeVariants = cva(badgeStyles.base, {
	variants: badgeStyles.variants,
	compoundVariants: badgeStyles.compoundVariants as never,
	defaultVariants: badgeStyles.defaultVariants,
});

function Badge({
	className,
	style,
	slotStyles: slotStylesRaw,
	variant,
	color,
	shape,
	size,
	asChild = false,
	isLoading = false,
	...props
}: BadgeProps) {
	const slotStyles = useSlotStyles("badge", slotStylesRaw, variant ?? undefined);
	const root = applySlot(className, slotStyles?.root);
	if (isLoading) {
		return (
			<Skeleton
				data-kala-component="badge"
				style={mergeStyle(style, root.style)}
				className={cn(badgeStyles.loading, root.className)}
			/>
		);
	}

	const Comp = asChild ? Slot : "span";

	return (
		<Comp
			data-kala-component="badge"
			data-slot="badge"
			className={cn(
				badgeVariants({ variant, color, shape, size }),
				root.className,
			)}
			style={mergeStyle(style, root.style)}
			{...props}
		/>
	);
}

export { Badge, badgeVariants };
