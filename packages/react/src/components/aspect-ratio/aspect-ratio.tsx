"use client";

import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { aspectRatioStyles } from "../../config/aspect-ratio";
import {
	applySlot,
	mergeStyle,
	type SlotStyles,
} from "../../lib/slot-styles";
import { cn } from "../../lib/utils";

export const aspectRatioVariants = cva(aspectRatioStyles.base, {
	variants: aspectRatioStyles.variants,
	defaultVariants: aspectRatioStyles.defaultVariants,
});

interface AspectRatioProps
	extends React.ComponentProps<typeof AspectRatioPrimitive.Root>,
		VariantProps<typeof aspectRatioVariants> {
	rounded?: VariantProps<typeof aspectRatioVariants>["rounded"];
	bordered?: VariantProps<typeof aspectRatioVariants>["bordered"];
	slotStyles?: SlotStyles;
}

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

export { AspectRatio, type AspectRatioProps };
