import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";

export interface ColorInputProps
	extends Omit<React.ComponentProps<"input">, "onChange"> {
	/** Controlled value */
	value?: string;
	/** Initial value for the uncontrolled component */
	defaultValue?: string;
	/** Callback fired when the value changes */
	onValueChange?: (value: string) => void;
	/** Renders with error styles */
	error?: boolean;
	/** Renders with success styles */
	success?: boolean;
	/** Whether to show the color preview swatch (default: true) */
	withPreview?: boolean;
	/** Per-part overrides: `root` wins over the legacy `className`/`style` props. */
	slotStyles?: SlotStyles;
}
