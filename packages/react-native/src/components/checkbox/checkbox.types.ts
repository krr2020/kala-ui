import type { StyleProp, ViewStyle } from "react-native";

export interface CheckboxProps {
	/** false | true | "indeterminate" — tri-state like the web control. */
	value?: boolean | "indeterminate";
	onValueChange?: (next: boolean) => void;
	disabled?: boolean;
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
		box?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
