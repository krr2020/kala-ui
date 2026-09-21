import type * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";

export interface CollapsibleProps
	extends React.ComponentProps<typeof CollapsiblePrimitive.Root> {}

export interface CollapsibleContentProps
	extends React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent> {
	/** Per-part overrides: `root` wins over the legacy `className`/`style` props. */
	slotStyles?: SlotStyles;
}
