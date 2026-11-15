import type * as React from "react";
import type { IconComponent } from "../icons";
import type { SlotStyles } from "../../lib/slot-styles";

export interface NumberInputProps
	extends Omit<
		React.ComponentProps<"input">,
		"size" | "value" | "defaultValue" | "type"
	> {
	/** Controlled value */
	value?: number;
	/** Default value for uncontrolled usage */
	defaultValue?: number;
	/** Minimum allowed value */
	min?: number;
	/** Maximum allowed value */
	max?: number;
	/** Amount to increment/decrement per step */
	step?: number;
	/** Called with the new numeric value (undefined when input is cleared) */
	onValueChange?: (value: number | undefined) => void;
	/** Size variant */
	size?: "sm" | "md";
	/** Error state styling */
	hasError?: boolean;
	/** Success state styling */
	hasSuccess?: boolean;
	/** Show loading skeleton */
	isLoading?: boolean;
	/** Decrement-button glyph — any `{className, size}` icon component; defaults to kala's built-in minus. */
	decrementIcon?: IconComponent;
	/** Increment-button glyph — any `{className, size}` icon component; defaults to kala's built-in plus. */
	incrementIcon?: IconComponent;
	/** Per-part overrides: `root` wins over `className`/`style` in every arm; `increment`/`decrement` target the stepper buttons, `divider` their inner borders. */
	slotStyles?: SlotStyles;
}
