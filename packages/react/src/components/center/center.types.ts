import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";

export interface CenterProps extends React.ComponentProps<"div"> {
	asChild?: boolean;
	inline?: boolean;
	slotStyles?: SlotStyles;
}
