import type * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";

export interface ContextMenuProps
	extends React.ComponentProps<typeof ContextMenuPrimitive.Root> {}

export interface ContextMenuContentProps
	extends React.ComponentProps<typeof ContextMenuPrimitive.Content> {
	/** Per-part overrides: `root` wins over the legacy `className`/`style` props. */
	slotStyles?: SlotStyles;
}
