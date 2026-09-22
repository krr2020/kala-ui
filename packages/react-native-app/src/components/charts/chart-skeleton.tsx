/**
 * ChartSkeleton: loading placeholder for the chart surfaces — a pulsing
 * plot block plus a legend row. Carries whatever marker the wrapped
 * chart passed so E2E flows stay on the same testID while loading.
 */

import { Skeleton } from "@kala-ui/react-native";
import type { ReactElement } from "react";
import { View } from "react-native";
import type { ChartSkeletonProps } from "./chart-skeleton.types";
import {
	skeletonLegendBone,
	skeletonLegendChipStyle,
	skeletonLegendDot,
	skeletonLegendRowStyle,
	skeletonPlotStyle,
	skeletonRootStyle,
} from "./charts.styles";

export function ChartSkeleton({
	height = 120,
	legendCount = 3,
	style,
	styles,
	testID = "k-chart-skeleton",
}: ChartSkeletonProps): ReactElement {
	return (
		<View testID={testID} style={[skeletonRootStyle, style, styles?.root]}>
			<Skeleton style={skeletonPlotStyle(height)} />
			<View style={skeletonLegendRowStyle}>
				{Array.from({ length: legendCount }, (_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: fixed-length placeholder rows, never reordered
					<View key={`legend-${i}`} style={skeletonLegendChipStyle}>
						<Skeleton variant="circle" style={skeletonLegendDot} />
						<Skeleton style={skeletonLegendBone} />
					</View>
				))}
			</View>
		</View>
	);
}
