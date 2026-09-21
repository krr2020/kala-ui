import type * as MenubarPrimitive from "@radix-ui/react-menubar";
import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";

export interface MenubarProps
	extends React.ComponentProps<typeof MenubarPrimitive.Root> {
	/** Per-part overrides: `root` wins over the legacy `className`/`style`. */
	slotStyles?: SlotStyles;
}
