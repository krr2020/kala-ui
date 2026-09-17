import type { StyleProp, ViewStyle } from "react-native";

export interface CheckboxProps {
	/** false | true | "indeterminate" — tri-state like the web control. */
	value?: boolean | "indeterminate";
	onValueChange?: (next: boolean) => void;
	disabled?: boolean;
	/** destructive border on the resting box; destructive icon when active */
	hasError?: boolean;
	/** text rendered beside the box; merged into the a11y label */
	label?: string;
	accessibilityLabel?: string;
	/** swaps the control for a skeleton surface keeping the marker */
	isLoading?: boolean;
	/** Root layout/positioning; sits below `slotStyles.root`. */
	style?: StyleProp<ViewStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
		box?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
