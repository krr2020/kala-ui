import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

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
	/** Icon rendered before the label. */
	icon?: ReactNode;
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
