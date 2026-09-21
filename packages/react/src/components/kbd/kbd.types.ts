import type { VariantProps } from "class-variance-authority";
import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";
import type { kbdVariants } from "./kbd";

export interface KbdProps
	extends React.ComponentProps<"kbd">,
		VariantProps<typeof kbdVariants> {
	/** Key or array of keys to display as a chord */
	keys?: string | string[];
	slotStyles?: SlotStyles;
}
