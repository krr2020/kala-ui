import type { StyleProp, ViewStyle } from "react-native";

export type SpinnerSize = "sm" | "md" | "lg" | "xl";
export type SpinnerVariant = "default" | "muted" | "white" | "ghost";

export interface SpinnerProps {
	size?: SpinnerSize;
	variant?: SpinnerVariant;
	/** Screen-reader text; also the default accessibilityLabel. */
	label?: string;
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
	/** Slot overrides: root wins over the library surface and `style`. */
	styles?: {
		root?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
