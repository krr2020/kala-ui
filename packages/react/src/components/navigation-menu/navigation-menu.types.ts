import type * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";

export interface NavigationMenuProps
	extends React.ComponentProps<typeof NavigationMenuPrimitive.Root> {
	/** Whether to render the animated viewport wrapper. */
	viewport?: boolean;
	/** Per-part overrides: `root` wins over the legacy `className`/`style`. */
	slotStyles?: SlotStyles;
}
