import type { StyleProp, ViewStyle } from "react-native";

export interface ChartSkeletonProps {
	height?: number;
	legendCount?: number;
	style?: StyleProp<ViewStyle>;
	styles?: { root?: StyleProp<ViewStyle> };
	testID?: string;
}
