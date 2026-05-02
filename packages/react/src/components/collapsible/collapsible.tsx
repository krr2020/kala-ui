"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import type * as React from "react";

import { cn } from "../../lib/utils";

function Collapsible({
	ref,
	...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
	return (
		<CollapsiblePrimitive.Root ref={ref} data-slot="collapsible" {...props} />
	);
}

function CollapsibleTrigger({
	ref,
	...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
	return (
		<CollapsiblePrimitive.CollapsibleTrigger
			ref={ref}
			data-slot="collapsible-trigger"
			{...props}
		/>
	);
}

function CollapsibleContent({
	className,
	ref,
	...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
	return (
		<CollapsiblePrimitive.CollapsibleContent
			ref={ref}
			data-slot="collapsible-content"
			className={cn(
				"overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up",
				className,
			)}
			{...props}
		/>
	);
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
