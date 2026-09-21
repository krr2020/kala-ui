import type { VariantProps } from "class-variance-authority";
import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";
import type { fieldVariants } from "./field";

export interface FieldProps
	extends React.ComponentProps<"fieldset">,
		VariantProps<typeof fieldVariants> {
	/** Per-part overrides: `root` wins over the legacy `className`/`style` props. */
	slotStyles?: SlotStyles;
}
