import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export type IndicatorPosition =
	| "top-left"
	| "top-center"
	| "top-right"
	| "middle-left"
	| "middle-center"
	| "middle-right"
	| "bottom-left"
	| "bottom-center"
	| "bottom-right";

export type IndicatorColor =
	| "primary"
	| "secondary"
	| "destructive"
	| "success"
	| "warning"
	| "info";

export interface IndicatorProps {
	/** Content the indicator decorates */
	children?: ReactNode;
	position?: IndicatorPosition;
	color?: IndicatorColor;
	/** Inset from the anchored edges, in px */
	offset?: number;
	/** Dot diameter (and height), in px */
	size?: number;
	withBorder?: boolean;
	/** Hidden entirely — the wrapper still renders */
	disabled?: boolean;
	/** Core-Animated opacity pulse (web's animate-pulse) */
	processing?: boolean;
	/** Badge text inside the dot */
	label?: ReactNode;
	/** Shrink the wrapper to its content instead of stretching */
	inline?: boolean;
	/** Root layout/positioning; sits below `slotStyles.root`. */
	style?: StyleProp<ViewStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
		dot?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
