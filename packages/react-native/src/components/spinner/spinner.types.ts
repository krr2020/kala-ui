import type { StyleProp, ViewStyle } from "react-native";
import type { IconComponent } from "../icon";

export type SpinnerSize = "sm" | "md" | "lg" | "xl";
export type SpinnerVariant = "default" | "muted" | "white" | "ghost";

export interface SpinnerProps {
	size?: SpinnerSize;
	variant?: SpinnerVariant;
	/** icon-library component to spin — kala Loader2 glyph by default */
	icon?: IconComponent;
	/** Screen-reader text; also the default accessibilityLabel. */
	label?: string;
	accessibilityLabel?: string;
	/** Root layout/positioning; sits below `slotStyles.root`. */
	style?: StyleProp<ViewStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
