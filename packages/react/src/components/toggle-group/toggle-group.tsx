"use client";

import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { applySlot, mergeStyle } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import { useSlotStyles } from "../kala-provider";
import { toggleVariants } from "../toggle/toggle";
import type { ToggleGroupProps } from "./toggle-group.types";

const ToggleGroupContext = React.createContext<
	VariantProps<typeof toggleVariants>
>({
	size: "md",
	variant: "default",
});

function ToggleGroup({
	className,
	style,
	slotStyles: slotStylesRaw,
	variant,
	size,
	children,
	ref,
	...props
}: ToggleGroupProps) {
	const slotStyles = useSlotStyles("toggle-group", slotStylesRaw, variant ?? undefined);
	return (
		<ToggleGroupContext.Provider value={{ variant, size }}>
			<ToggleGroupPrimitive.Root
				ref={ref}
				data-kala-component="toggle-group"
				data-slot="toggle-group"
				className={
					applySlot(
						cn("flex items-center justify-center gap-1", className),
						slotStyles?.root,
					).className
				}
				style={mergeStyle(style, applySlot("", slotStyles?.root).style)}
				{...props}
			>
				{children}
			</ToggleGroupPrimitive.Root>
		</ToggleGroupContext.Provider>
	);
}

function ToggleGroupItem({
	className,
	children,
	variant,
	size,
	ref,
	...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
	VariantProps<typeof toggleVariants>) {
	const context = React.useContext(ToggleGroupContext);

	return (
		<ToggleGroupPrimitive.Item
			data-kala-component="toggle-group-item"
			ref={ref}
			data-slot="toggle-group-item"
			className={cn(
				toggleVariants({
					variant: variant ?? context.variant,
					size: size ?? context.size,
				}),
				className,
			)}
			{...props}
		>
			{children}
		</ToggleGroupPrimitive.Item>
	);
}

export { ToggleGroup, ToggleGroupItem };
