"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import { cva } from "class-variance-authority";
import { applySlot, mergeStyle, type SlotStyles } from "../../lib/slot-styles";

import { cn } from "../../lib/utils";
import { useSlotStyles } from "../kala-provider";
import type { LabelProps } from "./label.types";

const labelVariants = cva(
	"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground",
);

function Label({
	ref,
	className,
	style,
	slotStyles: slotStylesRaw,
	required,
	children,
	...props
}: LabelProps & { slotStyles?: SlotStyles }) {
	const slotStyles = useSlotStyles("label", slotStylesRaw);
	const root = applySlot(cn(labelVariants(), className), slotStyles?.root);
	return (
		<LabelPrimitive.Root
			data-kala-component="label"
			ref={ref}
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		>
			{children}
			{required && <span className="ml-1 text-destructive">*</span>}
		</LabelPrimitive.Root>
	);
}

export { Label, labelVariants };
