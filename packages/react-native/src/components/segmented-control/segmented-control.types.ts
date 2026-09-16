export interface SegmentedControlItem {
	value: string;
	label: string;
	disabled?: boolean;
}

/** Plain strings render as their own label, mirroring the web API. */
export type SegmentedControlData = string | SegmentedControlItem;

export type SegmentedControlSize = "xs" | "sm" | "md" | "lg" | "xl";
export type SegmentedControlRadius = "xs" | "sm" | "md" | "lg" | "xl" | "full";

import type { StyleProp, ViewStyle } from "react-native";

export interface SegmentedControlProps {
	data: SegmentedControlData[];
	/** Controlled active value — when set, presses report but never override. */
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	disabled?: boolean;
	fullWidth?: boolean;
	size?: SegmentedControlSize;
	radius?: SegmentedControlRadius;
	accessibilityLabel?: string;
	/** slotStyles: root wins over the library surface. */
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
		segment?: StyleProp<ViewStyle>;
		indicator?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
