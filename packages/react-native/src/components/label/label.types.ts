import type { ReactNode } from "react";
import type { StyleProp, TextStyle } from "react-native";

export interface LabelProps {
	children: ReactNode;
	/** Appends a destructive-colored * (web parity). */
	required?: boolean;
	/** Root typography; sits below `slotStyles.root`. */
	style?: StyleProp<TextStyle>;
	/** slotStyles: root wins over the library surface and `style`. */
	slotStyles?: {
		root?: StyleProp<TextStyle>;
	};
	testID?: string;
}
