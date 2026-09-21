import type * as React from "react";
import type { Drawer as DrawerPrimitive } from "vaul";
import type { SlotStyles } from "../../lib/slot-styles";

export interface DrawerContentProps
	extends React.ComponentProps<typeof DrawerPrimitive.Content> {
	/**
	 * Width (left/right) or height (top/bottom) preset
	 * @default "md"
	 */
	size?: "sm" | "md" | "lg" | "xl" | "full";
	/** Per-part overrides: `root` wins over the legacy `className`/`style` props. */
	slotStyles?: SlotStyles;
}
