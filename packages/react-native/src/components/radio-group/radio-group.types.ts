import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export interface RadioGroupProps {
	/** Value of the selected item (controlled single select). */
	value?: string;
	onValueChange?: (value: string) => void;
	/** Disables every item in the group. */
	disabled?: boolean;
	accessibilityLabel?: string;
	children?: ReactNode;
	style?: StyleProp<ViewStyle>;
	testID?: string;
}

export interface RadioGroupItemProps {
	value: string;
	/** Primary label text next to the radio circle. */
	label?: string;
	/** Secondary text below the label. */
	description?: string;
	disabled?: boolean;
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
	testID?: string;
}
