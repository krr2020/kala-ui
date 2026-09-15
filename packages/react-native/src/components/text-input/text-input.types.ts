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
	style?: StyleProp<TextStyle>;
	/** Slot overrides: root wins over the library surface and `style`; group/section apply to the section wrapper. */
	styles?: {
		root?: StyleProp<TextStyle>;
		group?: StyleProp<ViewStyle>;
		section?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
