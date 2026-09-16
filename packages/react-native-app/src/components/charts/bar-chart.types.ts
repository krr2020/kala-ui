import type { KalaTheme } from "@kala-ui/react-native";

/** Color token names a chart tone accepts (color keys of KalaTheme only). */
export type ChartTone = {
	[K in keyof KalaTheme]: K extends `${string}Foreground` | `${string}Alpha`
		? never
		: KalaTheme[K] extends string
			? K
			: never;
}[keyof KalaTheme];

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
	tone?: ChartTone;
	emptyMessage?: string;
	isLoading?: boolean;
	style?: StyleProp<ViewStyle>;
	styles?: { root?: StyleProp<ViewStyle> };
	testID?: string;
}
