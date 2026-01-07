"use client";

import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { aspectRatioStyles } from "../../config/aspect-ratio";
import { cn } from "../../lib/utils";

const aspectRatioVariants = cva(aspectRatioStyles.base, {
	variants: aspectRatioStyles.variants,
	defaultVariants: aspectRatioStyles.defaultVariants,
});

interface AspectRatioProps
	extends React.ComponentProps<typeof AspectRatioPrimitive.Root>,
		VariantProps<typeof aspectRatioVariants> {
	rounded?: VariantProps<typeof aspectRatioVariants>["rounded"];
	bordered?: VariantProps<typeof aspectRatioVariants>["bordered"];
}

function AspectRatio({
	className,
	ratio = 16 / 9,
	rounded,
	bordered,
	...props
}: AspectRatioProps) {
	return (
		<AspectRatioPrimitive.Root
			data-slot="aspect-ratio"
			ratio={ratio}
			className={cn(aspectRatioVariants({ rounded, bordered }), className)}
			{...props}
		/>
	);
}

export { AspectRatio, aspectRatioVariants, type AspectRatioProps };
