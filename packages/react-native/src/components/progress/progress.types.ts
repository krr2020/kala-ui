import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export type ProgressColor =
	| "primary"
	| "secondary"
	| "destructive"
	| "success"
	| "warning"
	| "info";
export type ProgressSize = "sm" | "md" | "lg";

export interface ProgressProps {
	/** Clamped into [min, max]; omitted values render an empty track. */
	value?: number;
	min?: number;
	max?: number;
	color?: ProgressColor;
	size?: ProgressSize;
	/** Static text inside the indicator (md/lg only — sm is too thin). */
	label?: ReactNode;
	/** Renders the rounded percentage inside the indicator instead. */
	showValue?: boolean;
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
	testID?: string;
}
