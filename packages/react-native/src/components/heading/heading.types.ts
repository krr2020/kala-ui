import type { ReactNode } from "react";
import type { StyleProp, TextStyle } from "react-native";

export type HeadingSize = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export type HeadingWeight = "default" | "medium" | "semibold" | "extrabold";
export type HeadingAlign = "left" | "center" | "right";

export interface HeadingProps {
	children: ReactNode;
	size?: HeadingSize;
	weight?: HeadingWeight;
	align?: HeadingAlign;
	style?: StyleProp<TextStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: {
		root?: StyleProp<TextStyle>;
	};
	testID?: string;
}
