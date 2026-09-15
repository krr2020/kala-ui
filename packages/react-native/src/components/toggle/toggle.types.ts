import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export type ToggleSize = "sm" | "md" | "lg";
export type ToggleVariant = "default" | "outline";

export interface ToggleProps {
	children?: ReactNode;
	/** Controlled pressed state — locks the visuals until the parent updates */
	pressed?: boolean;
	/** Initial pressed state for the uncontrolled arm */
	defaultPressed?: boolean;
	onPressedChange?: (pressed: boolean) => void;
	variant?: ToggleVariant;
	size?: ToggleSize;
	disabled?: boolean;
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
	/** Slot overrides: root wins over the library surface and `style`. */
	styles?: { root?: StyleProp<ViewStyle> };
	testID?: string;
}
