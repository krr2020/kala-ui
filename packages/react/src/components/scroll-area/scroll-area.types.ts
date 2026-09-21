import type * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";

export interface ScrollAreaProps
	extends React.ComponentProps<typeof ScrollAreaPrimitive.Root> {
	slotStyles?: SlotStyles;
}
