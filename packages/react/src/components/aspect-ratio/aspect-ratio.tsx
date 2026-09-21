"use client";

import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import { cva } from "class-variance-authority";

import { aspectRatioStyles } from "../../config/aspect-ratio";
import { applySlot, mergeStyle } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import type { AspectRatioProps } from "./aspect-ratio.types";

export const aspectRatioVariants = cva(aspectRatioStyles.base, {
	variants: aspectRatioStyles.variants,
	defaultVariants: aspectRatioStyles.defaultVariants,
});

function AspectRatio({
	className,
	style,
	slotStyles,
	ratio = 16 / 9,
	rounded,
	bordered,
	...props
}: AspectRatioProps) {
	const root = applySlot(
		cn(aspectRatioVariants({ rounded, bordered }), className),
		slotStyles?.root,
	);
	return (
		<AspectRatioPrimitive.Root
			data-kala-component="aspect-ratio"
			data-slot="aspect-ratio"
			ratio={ratio}
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		/>
	);
}

export { AspectRatio };
