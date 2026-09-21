"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import type * as React from "react";

import { cn } from "../../lib/utils";
import { tagStyles } from "../../config/tag";
import { applySlot, mergeStyle, type SlotStyles } from "../../lib/slot-styles";

const tagClasses = cva(tagStyles.base, {
	variants: tagStyles.variants,
	compoundVariants: tagStyles.compoundVariants as never,
	defaultVariants: tagStyles.defaultVariants,
});

export interface TagProps
	extends Omit<React.ComponentProps<"span">, "color">,
		VariantProps<typeof tagClasses> {
	/** Show remove button */
	onRemove?: () => void;
	/** Icon to show before label */
	icon?: React.ReactNode;
	/** Per-part overrides: `root` wins over `className`/`style`, `icon` targets the icon wrapper, `remove` the remove button. */
	slotStyles?: SlotStyles;
}

function Tag({
	className,
	style,
	slotStyles,
	variant,
	color,
	size,
	onRemove,
	icon,
	children,
	...props
}: TagProps) {
	const root = applySlot(cn(tagClasses({ variant, color, size }), className), slotStyles?.root);
	const iconSlot = applySlot(tagStyles.icon, slotStyles?.icon);
	const remove = applySlot(tagStyles.remove, slotStyles?.remove);
	return (
		<span
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
			{children}
			{onRemove && (
				<button
					type="button"
					onClick={onRemove}
					aria-label="Remove"
					className={remove.className}
					style={remove.style}
				>
					<X aria-hidden="true" />
				</button>
			)}
		</span>
	);
}

export { Tag };
