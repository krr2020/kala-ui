import type {
	TextInputProps as RNTextInputProps,
	StyleProp,
	TextStyle,
} from "react-native";

export interface TextareaProps
	extends Omit<RNTextInputProps, "allowFontScaling"> {
	/** destructive border; validation copy stays app-side */
	hasError?: boolean;
	/** parity with Button's disabled: flips editable + a11y state */
	disabled?: boolean;
	/** visual row hint — maps to minHeight (web parity: min-h-[80px]) */
	rows?: number;
	/** show the loading skeleton surface, keeping the k-textarea marker */
	isLoading?: boolean;
	style?: StyleProp<TextStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: {
		root?: StyleProp<TextStyle>;
	};
	testID?: string;
}
