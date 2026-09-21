"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { tooltipStyles } from "../../config/tooltip";
import { applySlot, mergeStyle } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import type {
	TooltipContentProps,
	TooltipProps,
	TooltipProviderProps,
	TooltipTriggerProps,
} from "./tooltip.types";

function TooltipProvider({
	delayDuration = 0,
	...props
}: TooltipProviderProps) {
	// Provider renders no DOM node, so it carries no marker — the visible
	// parts (trigger, content) are the addressable surfaces.
	return <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />;
}

function Tooltip({ ...props }: TooltipProps) {
	// Root is context-only (no DOM); marker lives on trigger + content.
	return <TooltipPrimitive.Root {...props} />;
}

function TooltipTrigger({ ...props }: TooltipTriggerProps) {
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
}: TooltipContentProps) {
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
