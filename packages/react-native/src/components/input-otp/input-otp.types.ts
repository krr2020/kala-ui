import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

export interface InputOtpProps {
	/** controlled code; when given, internal state never advances on its own */
	value?: string;
	/** initial code for uncontrolled usage */
	defaultValue?: string;
	/** fires once per entry change with the sanitized, clamped code */
	onChange?: (code: string) => void;
	/** total number of characters the code accepts */
	maxLength: number;
	/** blocks editing and dims the slots */
	disabled?: boolean;
	children: ReactNode;
	style?: StyleProp<ViewStyle>;
	/** Slot overrides: root wins over the library surface and `style`; field applies to the off-screen input. */
	styles?: {
		root?: StyleProp<ViewStyle>;
		field?: StyleProp<TextStyle>;
	};
	testID?: string;
}

export interface InputOtpSlotProps {
	/** 0-based slot position within the code */
	index: number;
	style?: StyleProp<ViewStyle>;
	styles?: { root?: StyleProp<ViewStyle> };
	testID?: string;
}

export interface InputOtpSeparatorProps {
	children?: ReactNode;
	testID?: string;
}
