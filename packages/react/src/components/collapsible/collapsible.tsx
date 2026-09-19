"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import type * as React from "react";

import { cn } from "../../lib/utils";
import { applySlot, mergeStyle, type SlotStyles } from "../../lib/slot-styles";

function Collapsible({
	ref,
	...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
	return (
		<CollapsiblePrimitive.Root
			data-kala-component="collapsible"
			ref={ref}
			data-slot="collapsible"
			{...props}
		/>
	);
}

function CollapsibleTrigger({
	ref,
	...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
	return (
		<CollapsiblePrimitive.CollapsibleTrigger
			data-kala-component="collapsible-trigger"
			ref={ref}
			data-slot="collapsible-trigger"
			{...props}
		/>
	);
}

function CollapsibleContent({
	className,
	style,
	slotStyles,
	ref,
	...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent> & {
	slotStyles?: SlotStyles;
}) {
	const root = applySlot(
		cn(
			"overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up",
			className,
		),
		slotStyles?.root,
	);
	return (
		<CollapsiblePrimitive.CollapsibleContent
			data-kala-component="collapsible-content"
			ref={ref}
			data-slot="collapsible-content"
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		/>
	);
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
