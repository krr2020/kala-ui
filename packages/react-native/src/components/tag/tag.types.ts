import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import type { IconColor, IconComponent } from "../icon";

export type TagColor =
	| "primary"
	| "secondary"
	| "destructive"
	| "success"
	| "warning"
	| "info"
	| "muted";

export type TagVariant = "solid" | "outline" | "subtle";
export type TagSize = "sm" | "md" | "lg";

export interface TagProps {
	variant?: TagVariant;
	color?: TagColor;
	size?: TagSize;
	/** Show the remove affordance; each press calls this exactly once. */
	onRemove?: () => void;
	/** Icon-library component rendered before the label; themed to the tag's fg. */
	icon?: IconComponent;
	/** Hard override for the icon color: token key or raw color string. */
	iconColor?: IconColor;
	children?: ReactNode;
	/** Root layout/positioning; sits below `slotStyles.root`. */
	style?: StyleProp<ViewStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
		remove?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
