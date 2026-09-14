import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export interface CardProps {
	children: ReactNode;
	style?: StyleProp<ViewStyle>;
	testID?: string;
}
