import type * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";

export interface TooltipProviderProps
	extends React.ComponentProps<typeof TooltipPrimitive.Provider> {}

export interface TooltipProps
	extends React.ComponentProps<typeof TooltipPrimitive.Root> {}

export interface TooltipTriggerProps
	extends React.ComponentProps<typeof TooltipPrimitive.Trigger> {}

export interface TooltipContentProps
	extends React.ComponentProps<typeof TooltipPrimitive.Content> {
	/** Per-part overrides: `root` wins over `className`/`style` on the content surface, `arrow` targets the arrow glyph. */
	slotStyles?: SlotStyles;
}
