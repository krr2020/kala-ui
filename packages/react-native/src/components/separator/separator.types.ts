import type { StyleProp, ViewStyle } from "react-native";

export type SeparatorOrientation = "horizontal" | "vertical";

export interface SeparatorProps {
	orientation?: SeparatorOrientation;
	/**
	 * True (default) hides the divider from screen readers — the web default.
	 * Set false only when the divider separates meaningful regions.
	 */
	decorative?: boolean;
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
