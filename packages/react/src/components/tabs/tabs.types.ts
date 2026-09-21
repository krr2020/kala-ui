import type * as TabsPrimitive from "@radix-ui/react-tabs";
import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";

export interface TabsProps
	extends React.ComponentProps<typeof TabsPrimitive.Root> {
	slotStyles?: SlotStyles;
}
