import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export interface CardProps {
	children: ReactNode;
	style?: StyleProp<ViewStyle>;
	/** Slot overrides: root wins over the library surface and `style`. */
	styles?: {
		root?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
