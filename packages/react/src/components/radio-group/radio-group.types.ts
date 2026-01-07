import type * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import type * as React from "react";

export interface RadioGroupProps
	extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
	/**
	 * Visual variant of the radio group
	 * @default "default"
	 */
	variant?: "default" | "cards" | "buttons";
	/**
	 * Size of radio buttons
	 * @default "md"
	 */
	size?: "sm" | "md" | "lg";
}

export interface RadioGroupItemProps
	extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
	/**
	 * Label text for the radio item
	 */
	label?: string;
	/**
	 * Description text displayed below the label
	 */
	description?: string;
	/**
	 * Show error state
	 */
	error?: boolean;
}
