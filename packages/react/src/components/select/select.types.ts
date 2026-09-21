import type * as SelectPrimitive from "@radix-ui/react-select";
import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";

export interface SelectTriggerProps
	extends React.ComponentProps<typeof SelectPrimitive.Trigger> {
	/** Size variant. @default "md" */
	size?: "sm" | "md";
	/** Replace the trigger with a skeleton placeholder */
	isLoading?: boolean;
	/** Per-part overrides: `root` wins over `className`/`style` in every arm, `chevron` targets the dropdown glyph. */
	slotStyles?: SlotStyles;
}

export interface SelectContentProps
	extends React.ComponentProps<typeof SelectPrimitive.Content> {
	/** Stretch the content surface to the trigger width (popper position). */
	matchTriggerWidth?: boolean;
	/** Per-part overrides: `root` wins over `className`/`style` on the portal-rendered surface. */
	slotStyles?: SlotStyles;
}

export interface SelectItemProps
	extends React.ComponentProps<typeof SelectPrimitive.Item> {
	/** Per-part overrides: `root` wins over `className`/`style`, `itemIndicator` targets the check glyph. */
	slotStyles?: SlotStyles;
}

export interface NativeSelectProps
	extends Omit<React.ComponentProps<"select">, "size"> {
	/** Size variant. @default "md" */
	size?: "sm" | "md";
	/** Error state styling */
	hasError?: boolean;
	/** Success state styling */
	hasSuccess?: boolean;
	/** Per-part overrides: `root` targets the wrapper, `select` the native control, `icon` the chevron holder. */
	slotStyles?: SlotStyles;
}

export interface NativeSelectOptionProps
	extends React.ComponentProps<"option"> {}

export interface NativeSelectOptGroupProps
	extends React.ComponentProps<"optgroup"> {}
