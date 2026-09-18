"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type * as React from "react";

import { cn } from "../../lib/utils";
import { tooltipStyles } from "../../config/tooltip";
import { applySlot, mergeStyle, type SlotStyles } from "../../lib/slot-styles";

function TooltipProvider({
	delayDuration = 0,
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
	return (
		<TooltipPrimitive.Provider
			data-kala-component="tooltip-provider"
			data-slot="tooltip-provider"
			delayDuration={delayDuration}
			{...props}
		/>
	);
}

function Tooltip({
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
	return (
		<TooltipPrimitive.Root
			data-kala-component="tooltip"
			data-slot="tooltip"
			{...props}
		/>
	);
}

function TooltipTrigger({
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
	return (
		<TooltipPrimitive.Trigger
			data-kala-component="tooltip-trigger"
			data-slot="tooltip-trigger"
			{...props}
		/>
	);
}

function TooltipContent({
	className,
	style,
	slotStyles,
	sideOffset = 4,
	children,
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> & {
	/** Per-part overrides: `root` wins over `className`/`style` on the content surface, `arrow` targets the arrow glyph. */
	slotStyles?: SlotStyles;
}) {
	const root = applySlot(tooltipStyles.content, slotStyles?.root ?? null);
	const arrow = applySlot(tooltipStyles.arrow, slotStyles?.arrow);
	return (
		<TooltipPrimitive.Portal data-kala-component="tooltip-content">
			<TooltipPrimitive.Content
				data-slot="tooltip-content"
				sideOffset={sideOffset}
				className={cn(root.className, className)}
				style={mergeStyle(style, root.style)}
				{...props}
			>
				{children}
				<TooltipPrimitive.Arrow asChild width={10} height={5}>
					<div className={arrow.className} style={arrow.style} />
				</TooltipPrimitive.Arrow>
			</TooltipPrimitive.Content>
		</TooltipPrimitive.Portal>
	);
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
