import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export type RadioGroupOrientation = "vertical" | "horizontal";

export interface RadioGroupProps {
	/** Value of the selected item (controlled single select). */
	value?: string;
	/** uncontrolled seed; ignored when `value` is provided */
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	/** Disables every item in the group. */
	disabled?: boolean;
	/** Layout of the items: stacked list (default) or wrapping inline row. */
	orientation?: RadioGroupOrientation;
	accessibilityLabel?: string;
	children?: ReactNode;
	/** Root layout/positioning; sits below `slotStyles.root`. */
	style?: StyleProp<ViewStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
		item?: StyleProp<ViewStyle>;
	};
	testID?: string;
}

export interface RadioGroupItemProps {
	value: string;
	/** Primary label text next to the radio circle. */
	label?: string;
	/** Secondary text below the label. */
	description?: string;
	disabled?: boolean;
	/** destructive stroke on the resting circle; destructive dot on the primary fill when checked */
	hasError?: boolean;
	accessibilityLabel?: string;
	/** Root layout/positioning; sits below `slotStyles.root`. */
	style?: StyleProp<ViewStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: { root?: StyleProp<ViewStyle> };
	testID?: string;
}
