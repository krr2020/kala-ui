import type * as React from "react";
import type * as ResizablePrimitive from "react-resizable-panels";
import type { SlotStyles } from "../../lib/slot-styles";

export interface ResizablePanelGroupProps
	extends React.ComponentProps<typeof ResizablePrimitive.Group> {
	slotStyles?: SlotStyles;
}

export interface ResizablePanelProps
	extends React.ComponentProps<typeof ResizablePrimitive.Panel> {
	slotStyles?: SlotStyles;
}

export interface ResizableHandleProps
	extends React.ComponentProps<typeof ResizablePrimitive.Separator> {
	withHandle?: boolean;
	slotStyles?: SlotStyles;
}
