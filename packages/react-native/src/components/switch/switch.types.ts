import type { StyleProp, ViewStyle } from "react-native";

export interface SwitchProps {
	value?: boolean;
	onValueChange?: (next: boolean) => void;
	disabled?: boolean;
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
	testID?: string;
}
