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
	// Provider renders no DOM node, so it carries no marker — the visible
	// parts (trigger, content) are the addressable surfaces.
	return (
		<TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />
	);
}

function Tooltip({
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
	// Root is context-only (no DOM); marker lives on trigger + content.
	return <TooltipPrimitive.Root {...props} />;
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
		<TooltipPrimitive.Portal>
			<TooltipPrimitive.Content
				data-kala-component="tooltip-content"
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
