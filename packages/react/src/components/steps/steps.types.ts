import type { VariantProps } from "class-variance-authority";
import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";
import type { stepsVariants } from "./steps";

export interface StepItem {
	title: string;
	description?: string;
	icon?: React.ReactNode;
}

export interface StepsProps
	extends React.ComponentProps<"ol">,
		VariantProps<typeof stepsVariants> {
	/** Current step index, 0-based (controlled) */
	value: number;
	/** Initial step index, 0-based (uncontrolled) */
	defaultValue?: number;
	items: StepItem[];
	onValueChange?: (step: number) => void;
	/**
	 * Show connecting lines between steps
	 * @default true
	 */
	showLine?: boolean;
	slotStyles?: SlotStyles;
}
