import type { StyleProp, ViewStyle } from "react-native";

export interface SwitchProps {
	value?: boolean;
	onValueChange?: (next: boolean) => void;
	disabled?: boolean;
	accessibilityLabel?: string;
	/** Root layout/positioning; sits below `slotStyles.root`. */
	style?: StyleProp<ViewStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
		track?: StyleProp<ViewStyle>;
		thumb?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
