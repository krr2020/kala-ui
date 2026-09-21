import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";

export interface TimelineProps extends React.ComponentProps<"div"> {
	slotStyles?: SlotStyles;
	children: React.ReactNode;
}
