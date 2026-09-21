import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";

export interface InputGroupProps extends React.ComponentProps<"div"> {
	slotStyles?: SlotStyles;
}
