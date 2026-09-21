import type * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";

export interface DropdownMenuProps
	extends React.ComponentProps<typeof DropdownMenuPrimitive.Root> {}

export interface DropdownMenuContentProps
	extends React.ComponentProps<typeof DropdownMenuPrimitive.Content> {
	/** Per-part overrides: `root` wins over `className`/`style` on the portal-rendered surface. */
	slotStyles?: SlotStyles;
}
