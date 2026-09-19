import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

/** Fill style — `color` stays the semantic hue across variants. */
export type BadgeVariant = "solid" | "outline" | "subtle";
export type BadgeColor =
	| "primary"
	| "secondary"
	| "destructive"
	| "success"
	| "warning"
	| "info"
	| "muted";
export type BadgeShape = "rounded" | "pill";

export interface BadgeProps {
	children?: ReactNode;
	variant?: BadgeVariant;
	color?: BadgeColor;
	shape?: BadgeShape;
	/** text-line clamp — applies to string/number children only */
	numberOfLines?: number;
	/** Root layout/positioning; sits below `slotStyles.root`. */
	style?: StyleProp<ViewStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
