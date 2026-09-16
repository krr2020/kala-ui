import type { ReactNode } from "react";
import type { StyleProp, TextStyle } from "react-native";

/** Mobile type scale — the web 4xl–9xl arms are desktop-only and omitted. */
export type TextSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
export type TextWeight =
	| "thin"
	| "extralight"
	| "light"
	| "normal"
	| "medium"
	| "semibold"
	| "bold"
	| "extrabold"
	| "black";
export type TextAlign = "left" | "center" | "right";
export type TextColor =
	| "primary"
	| "secondary"
	| "destructive"
	| "success"
	| "warning"
	| "info"
	| "muted"
	| "foreground";

export interface TextProps {
	children: ReactNode;
	size?: TextSize;
	weight?: TextWeight;
	align?: TextAlign;
	/** themed color key or any raw color string */
	color?: TextColor | (string & {});
	/** single-line clamp with trailing ellipsis */
	truncate?: boolean;
	/** Root typography; sits below `slotStyles.root`. */
	style?: StyleProp<TextStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: {
		root?: StyleProp<TextStyle>;
	};
	testID?: string;
}
