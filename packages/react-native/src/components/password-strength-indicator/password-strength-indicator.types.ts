import type { StyleProp, ViewStyle } from "react-native";

export interface PasswordStrengthIndicatorProps {
	/** the password to score; empty string renders nothing */
	password: string;
	style?: StyleProp<ViewStyle>;
	/** slotStyles: root wins over the library surface and `style`; segment applies to each strength bar. */
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
		segment?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
