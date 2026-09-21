import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";

export interface RatingProps extends React.ComponentProps<"fieldset"> {
	/** Controlled value */
	value?: number;
	/** Default value for uncontrolled usage */
	defaultValue?: number;
	/** Callback when rating changes */
	onValueChange?: (value: number) => void;
	/** Number of stars */
	count?: number;
	/** Allow half-star ratings */
	allowHalf?: boolean;
	/** Disable interaction (read-only display) */
	readOnly?: boolean;
	/** Disable the input */
	disabled?: boolean;
	/** Size of stars */
	size?: "sm" | "md" | "lg";
	/** Additional className */
	className?: string;
	/** Accessible label */
	"aria-label"?: string;
	/** Per-part style overrides (root wins over className/style) */
	slotStyles?: SlotStyles;
}
