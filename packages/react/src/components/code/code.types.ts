import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";

export interface CodeProps
	extends React.HTMLAttributes<HTMLElement>,
		React.RefAttributes<HTMLElement> {
	/** Render as a block (`pre`) instead of inline (`code`) */
	block?: boolean;
	/** Extra classes for text/bg, e.g. "text-blue-600 bg-blue-50" */
	color?: string;
	slotStyles?: SlotStyles;
}
