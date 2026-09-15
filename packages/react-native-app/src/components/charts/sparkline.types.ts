import type { StyleProp, ViewStyle } from "react-native";

export interface SparklineProps {
	data: number[];
	width?: number;
	height?: number;
	/** Theme tone name resolved through the unistyles theme. */
	tone?: string;
	emptyMessage?: string;
	isLoading?: boolean;
	style?: StyleProp<ViewStyle>;
	styles?: { root?: StyleProp<ViewStyle> };
	testID?: string;
}
