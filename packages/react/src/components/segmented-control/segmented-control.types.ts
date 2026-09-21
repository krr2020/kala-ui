import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";

export interface SegmentedControlItem {
	value: string;
	label: React.ReactNode;
	disabled?: boolean;
}

export type SegmentedControlData = string | SegmentedControlItem;

export interface SegmentedControlProps
	extends Omit<React.ComponentProps<"div">, "onChange"> {
	data: SegmentedControlData[];
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	disabled?: boolean;
	name?: string;
	fullWidth?: boolean;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	radius?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
	slotStyles?: SlotStyles;
}
