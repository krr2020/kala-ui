import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";

export interface PasswordStrengthIndicatorProps
	extends React.ComponentProps<"div"> {
	password: string;
	/** Per-part overrides: `root` wins over the legacy `className`/`style`. */
	slotStyles?: SlotStyles;
}
