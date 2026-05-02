"use client";

import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils";
import { toggleVariants } from "../toggle/toggle";

const ToggleGroupContext = React.createContext<
	VariantProps<typeof toggleVariants>
>({
	size: "default",
	variant: "default",
});

function ToggleGroup({
	className,
	variant,
	size,
	children,
	ref,
	...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
	VariantProps<typeof toggleVariants>) {
	return (
		<ToggleGroupContext.Provider value={{ variant, size }}>
			<ToggleGroupPrimitive.Root
				ref={ref}
				data-slot="toggle-group"
				className={cn("flex items-center justify-center gap-1", className)}
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
