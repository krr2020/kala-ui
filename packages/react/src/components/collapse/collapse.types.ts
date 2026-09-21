import type { Easing } from "framer-motion";
import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";

export interface CollapseProps {
	ref?: React.Ref<HTMLDivElement>;
	/** If true, the content will be visible */
	in: boolean;
	children: React.ReactNode;
	/** Id — lets aria-controls point at the collapsible region */
	id?: string;
	className?: string;
	style?: React.CSSProperties;
	/** Transition duration in seconds */
	transitionDuration?: number;
	transitionTimingFunction?: Easing | Easing[];
	/** Called when the open/close animation completes */
	onTransitionEnd?: () => void;
	/** If true, opacity is animated alongside height */
	animateOpacity?: boolean;
	slotStyles?: SlotStyles;
}
