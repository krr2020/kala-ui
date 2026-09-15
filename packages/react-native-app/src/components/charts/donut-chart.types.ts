import type { StyleProp, ViewStyle } from "react-native";

export interface DonutChartDatum {
	label: string;
	value: number;
	/** Theme tone name for this segment; defaults cycle the palette. */
	tone?: string;
}

export interface DonutChartProps {
	data: DonutChartDatum[];
	size?: number;
	thickness?: number;
	emptyMessage?: string;
	isLoading?: boolean;
	style?: StyleProp<ViewStyle>;
	styles?: { root?: StyleProp<ViewStyle> };
	testID?: string;
}
