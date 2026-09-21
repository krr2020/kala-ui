import type * as PopoverPrimitive from "@radix-ui/react-popover";
import type * as React from "react";
import type { PopoverColor } from "../../config/popover";
import type { SlotStyles } from "../../lib/slot-styles";

export interface PopoverProps
	extends React.ComponentProps<typeof PopoverPrimitive.Root> {}

export interface PopoverContentProps
	extends Omit<React.ComponentProps<typeof PopoverPrimitive.Content>, "color"> {
	/** Whether to show the arrow pointing to the trigger. @default true */
	showArrow?: boolean;
	/** Visual variant: `default` (surface + border) or `solid` (fully colored, tinted by `color`). @default "default" */
	variant?: "default" | "solid";
	/** Semantic color — tints a solid popover and the arrow. @default "primary" */
	color?: PopoverColor;
	/** Tint the PopoverHeader strip of a default (surface) popover */
	headerColor?: PopoverColor;
	/** Per-part overrides: `root` wins over `className`/`style` on the content surface, `arrow` targets the arrow glyph. */
	slotStyles?: SlotStyles;
}

export interface PopoverHeaderProps
	extends Omit<React.ComponentProps<"div">, "color"> {
	/** Tint the header strip; falls back to the parent PopoverContent's headerColor (or its color for solid popovers). */
	color?: PopoverColor;
	/** Per-part overrides: `root` wins over the legacy `className`/`style` props. */
	slotStyles?: SlotStyles;
}
