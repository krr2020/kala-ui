import type { ReactNode } from "react";
import type {
	TextInputProps as RNTextInputProps,
	StyleProp,
	TextStyle,
	ViewStyle,
} from "react-native";

export interface TextInputProps
	extends Omit<RNTextInputProps, "allowFontScaling"> {
	/** destructive border + foreground swap; validation copy stays app-side */
	hasError?: boolean;
	/** parity with Button's disabled: flips editable + a11y state */
	disabled?: boolean;
	/** optional node rendered before the input inside the section wrapper */
	leftSection?: ReactNode;
	/** optional node rendered after the input inside the section wrapper */
	rightSection?: ReactNode;
	/** Root typography; sits below `slotStyles.root`. */
	style?: StyleProp<TextStyle>;
	/** slotStyles: root wins over the library surface and `style`; group/section apply to the section wrapper. */
	slotStyles?: {
		root?: StyleProp<TextStyle>;
		group?: StyleProp<ViewStyle>;
		section?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
