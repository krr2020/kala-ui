import type { VariantProps } from "class-variance-authority";
import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";
import type { indicatorVariants } from "./indicator";

export interface IndicatorProps
	extends Omit<React.ComponentProps<"div">, "color">,
		VariantProps<typeof indicatorVariants> {
	/** Indicator position relative to the target element */
	position?:
		| "top-left"
		| "top-center"
		| "top-right"
		| "middle-left"
		| "middle-center"
		| "middle-right"
		| "bottom-left"
		| "bottom-center"
		| "bottom-right";
	/** Offset from the edge of the target element, in px */
	offset?: number;
	inline?: boolean;
	/** Size of the indicator in px */
	size?: number;
	withBorder?: boolean;
	/** Disabled (hidden) indicator */
	disabled?: boolean;
	/** Show a processing animation */
	processing?: boolean;
	label?: React.ReactNode;
	children?: React.ReactNode;
	slotStyles?: SlotStyles;
}
