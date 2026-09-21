"use client";

import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { X } from "lucide-react";
import { tagStyles } from "../../config/tag";
import { applySlot, mergeStyle } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import type { TagProps } from "./tag.types";

export const tagClasses = cva(tagStyles.base, {
	variants: tagStyles.variants,
	compoundVariants: tagStyles.compoundVariants as never,
	defaultVariants: tagStyles.defaultVariants,
});

function Tag({
	className,
	style,
	slotStyles,
	variant,
	color,
	size,
	shape,
	asChild = false,
	onRemove,
	dismissLabel = "Remove",
	icon,
	children,
	...props
}: TagProps) {
	const root = applySlot(
		cn(tagClasses({ variant, color, size, shape }), className),
		slotStyles?.root,
	);
	const iconSlot = applySlot(tagStyles.icon, slotStyles?.icon);
	const remove = applySlot(tagStyles.remove, slotStyles?.remove);
	const Comp = asChild ? Slot : "span";
	return (
		<Comp
			data-kala-component="tag"
			data-slot="tag"
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		>
			{icon && (
				<span
					aria-hidden="true"
					className={iconSlot.className}
					style={iconSlot.style}
				>
					{icon}
				</span>
			)}
			<Slottable>{children}</Slottable>
			{onRemove && (
				<button
					type="button"
					onClick={onRemove}
					aria-label={dismissLabel}
					className={remove.className}
					style={remove.style}
				>
					<X aria-hidden="true" />
				</button>
			)}
		</Comp>
	);
}

export { Tag };
