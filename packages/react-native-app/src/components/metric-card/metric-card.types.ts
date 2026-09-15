import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export type MetricTone =
	| "primary"
	| "destructive"
	| "success"
	| "warning"
	| "info"
	| "muted";

export interface MetricCardProps {
	title: string;
	value: number | string;
	icon?: ReactNode;
	change?: number;
	changeLabel?: string;
	subtitle?: string;
	tone?: MetricTone;
	emptyMessage?: string;
	isLoading?: boolean;
	style?: StyleProp<ViewStyle>;
	styles?: { root?: StyleProp<ViewStyle> };
	testID?: string;
}

export interface MetricCardSkeletonProps {
	style?: StyleProp<ViewStyle>;
	styles?: { root?: StyleProp<ViewStyle> };
	testID?: string;
}
