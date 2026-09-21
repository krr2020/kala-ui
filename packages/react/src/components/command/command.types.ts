import type { DialogProps } from "@radix-ui/react-dialog";
import type { Command as CommandPrimitive } from "cmdk";
import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";

export interface CommandProps
	extends React.ComponentProps<typeof CommandPrimitive> {
	/** Per-part overrides: `root` wins over the legacy `className`/`style` props. */
	slotStyles?: SlotStyles;
}

export interface CommandDialogProps extends DialogProps {}
