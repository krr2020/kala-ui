"use client";

import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva } from "class-variance-authority";
import { applySlot, mergeStyle } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import { useSlotStyles } from "../kala-provider";
import type { ToggleProps } from "./toggle.types";

const toggleVariants = cva(
	`cursor-pointer inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0`,
	{
		variants: {
			variant: {
				default: "bg-transparent",
				outline:
					"border bg-transparent hover:bg-accent hover:text-accent-foreground",
			},
			size: {
				md: "h-9 px-2 min-w-9",
				sm: "h-8 px-1.5 min-w-8",
				lg: "h-10 px-2.5 min-w-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "md",
		},
	},
);

function Toggle({
	ref,
	className,
	style,
	slotStyles: slotStylesRaw,
	variant,
	size,
	...props
}: ToggleProps) {
	const slotStyles = useSlotStyles("toggle", slotStylesRaw, variant ?? undefined);
	const root = applySlot(
		cn(toggleVariants({ variant, size, className })),
		slotStyles?.root,
	);
	return (
		<TogglePrimitive.Root
			data-kala-component="toggle"
			ref={ref}
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		/>
	);
}

export { Toggle, toggleVariants };
