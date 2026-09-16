import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export interface CardProps {
	children: ReactNode;
	style?: StyleProp<ViewStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: {
		root?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
