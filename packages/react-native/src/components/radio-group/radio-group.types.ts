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
	accessibilityLabel?: string;
	/** Root layout/positioning; sits below `slotStyles.root`. */
	style?: StyleProp<ViewStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: { root?: StyleProp<ViewStyle> };
	testID?: string;
}
