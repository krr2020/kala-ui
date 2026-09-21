"use client";

import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import type * as React from "react";
import { applySlot, mergeStyle, type SlotStyles } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import type { HoverCardProps } from "./hover-card.types";

function HoverCard({
	openDelay = 200,
	closeDelay = 0,
	...props
}: HoverCardProps) {
	return (
		<HoverCardPrimitive.Root
			data-kala-component="hover-card"
			data-slot="hover-card"
			openDelay={openDelay}
			closeDelay={closeDelay}
			{...props}
		/>
	);
}

function HoverCardTrigger({
	...props
}: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
	return (
		<HoverCardPrimitive.Trigger
			data-kala-component="hover-card-trigger"
			data-slot="hover-card-trigger"
			{...props}
		/>
	);
}

function HoverCardContent({
	className,
	style,
	slotStyles,
	align = "center",
	sideOffset = 4,
	...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content> & {
	slotStyles?: SlotStyles;
}) {
	const root = applySlot(
		cn(
			"z-30 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none kala-surface-popover",
			"data-[state=open]:animate-in data-[state=closed]:animate-out",
			"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
			"data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
			"data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
			"data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
			className,
		),
		slotStyles?.root,
	);
	return (
		<HoverCardPrimitive.Portal>
			<HoverCardPrimitive.Content
				data-kala-component="hover-card-content"
				data-slot="hover-card-content"
				align={align}
				sideOffset={sideOffset}
				className={root.className}
				style={mergeStyle(style, root.style)}
				{...props}
			/>
		</HoverCardPrimitive.Portal>
	);
}

export { HoverCard, HoverCardContent, HoverCardTrigger };
