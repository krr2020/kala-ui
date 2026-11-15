import type * as SelectPrimitive from "@radix-ui/react-select";
import type * as React from "react";
import type { IconComponent } from "../icons";
import type { SlotStyles } from "../../lib/slot-styles";

export interface SelectTriggerProps
	extends React.ComponentProps<typeof SelectPrimitive.Trigger> {
	/** Size variant. @default "md" */
	size?: "sm" | "md";
	/** Replace the trigger with a skeleton placeholder */
	isLoading?: boolean;
	/** Trigger chevron — any `{className, size}` icon component; defaults to kala's built-in chevron. */
	chevronIcon?: IconComponent;
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
	/** Selected-item check — any `{className, size}` icon component; defaults to kala's built-in check. */
	checkIcon?: IconComponent;
	/** Per-part overrides: `root` wins over `className`/`style`, `itemIndicator` targets the check glyph. */
	slotStyles?: SlotStyles;
}
