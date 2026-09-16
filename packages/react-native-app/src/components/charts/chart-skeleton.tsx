/**
 * ChartSkeleton: loading placeholder for the chart surfaces — a pulsing
 * plot block plus a legend row. Carries whatever marker the wrapped
 * chart passed so E2E flows stay on the same testID while loading.
 */

import { Skeleton } from "@kala-ui/react-native";
import type { ReactElement } from "react";
import { View } from "react-native";
import type { ChartSkeletonProps } from "./chart-skeleton.types";

export function ChartSkeleton({
	height = 120,
	legendCount = 3,
	style,
	styles,
	testID = "k-chart-skeleton",
}: ChartSkeletonProps): ReactElement {
	return (
		<View testID={testID} style={[{ gap: 12 }, style, styles?.root]}>
			<Skeleton style={{ height, width: "100%" }} />
			<View style={{ flexDirection: "row", gap: 12, justifyContent: "center" }}>
				{Array.from({ length: legendCount }, (_, i) => (
					<View
						// biome-ignore lint/suspicious/noArrayIndexKey: fixed-length placeholder rows, never reordered
						key={`legend-${i}`}
						style={{ flexDirection: "row", gap: 4, alignItems: "center" }}
					>
						<Skeleton variant="circle" style={{ width: 8, height: 8 }} />
						<Skeleton style={{ width: 32, height: 8 }} />
					</View>
				))}
			</View>
		</View>
	);
}
