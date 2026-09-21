import type * as SeparatorPrimitive from "@radix-ui/react-separator";
import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";

export interface SeparatorProps
	extends React.ComponentProps<typeof SeparatorPrimitive.Root> {
	slotStyles?: SlotStyles;
}
