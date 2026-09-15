import type { StyleProp, ViewStyle } from "react-native";

export interface BarChartDatum {
	label: string;
	value: number;
}

export interface BarChartProps {
	data: BarChartDatum[];
	height?: number;
	width?: number;
	/** Theme tone name resolved through the unistyles theme. */
	tone?: string;
	emptyMessage?: string;
	isLoading?: boolean;
	style?: StyleProp<ViewStyle>;
	styles?: { root?: StyleProp<ViewStyle> };
	testID?: string;
}
