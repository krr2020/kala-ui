import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";

export interface BurgerProps extends React.ComponentProps<"button"> {
	opened?: boolean;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	slotStyles?: SlotStyles;
}
