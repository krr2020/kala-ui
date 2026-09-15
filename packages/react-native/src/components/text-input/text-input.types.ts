import type {
	TextInputProps as RNTextInputProps,
	StyleProp,
	TextStyle,
} from "react-native";

export interface TextInputProps
	extends Omit<RNTextInputProps, "allowFontScaling"> {
	/** destructive border + foreground swap; validation copy stays app-side */
	hasError?: boolean;
	/** parity with Button's disabled: flips editable + a11y state */
	disabled?: boolean;
	style?: StyleProp<TextStyle>;
	/** Slot overrides: root wins over the library surface and `style`. */
	styles?: {
		root?: StyleProp<TextStyle>;
	};
	testID?: string;
}
