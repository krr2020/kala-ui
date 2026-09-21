"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { applySlot, mergeStyle } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import type {
	CollapsibleContentProps,
	CollapsibleProps,
} from "./collapsible.types";

function Collapsible({ ref, ...props }: CollapsibleProps) {
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
}: CollapsibleContentProps) {
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
