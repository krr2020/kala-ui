import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import type { IconComponent } from "../icon";

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
	/** icon-library component for the pressed check — kala Check by default */
	checkIcon?: IconComponent;
	/** icon-library component for the disabled lock — kala Lock by default */
	lockIcon?: IconComponent;
	accessibilityLabel?: string;
	/** Root layout/positioning; sits below `slotStyles.root`. */
	style?: StyleProp<ViewStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: { root?: StyleProp<ViewStyle> };
	testID?: string;
}
