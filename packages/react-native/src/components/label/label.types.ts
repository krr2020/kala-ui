import type { ReactNode } from "react";
import type { StyleProp, TextStyle } from "react-native";

export interface LabelProps {
	children: ReactNode;
	/** Appends a destructive-colored * (web parity). */
	required?: boolean;
	style?: StyleProp<TextStyle>;
	/** Slot overrides: root wins over the library surface and `style`. */
	styles?: {
		root?: StyleProp<TextStyle>;
	};
	testID?: string;
}
