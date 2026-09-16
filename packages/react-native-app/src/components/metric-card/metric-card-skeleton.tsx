/**
 * MetricCardSkeleton: pulsing title / value / change bars inside the
 * card frame; keeps the k-metric-card marker while loading.
 */

import { Skeleton } from "@kala-ui/react-native";
import type { ReactElement } from "react";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import type { MetricCardSkeletonProps } from "./metric-card.types";

export function MetricCardSkeleton({
	style,
	styles,
	testID = "k-metric-card",
}: MetricCardSkeletonProps): ReactElement {
	const { theme } = useUnistyles();
	return (
		<View
			testID={testID}
			style={[
				{
					flexDirection: "row",
					backgroundColor: theme.card,
					borderWidth: 1,
					borderColor: theme.border,
				},
				style,
				styles?.root,
			]}
		>
			<View style={{ width: 4, backgroundColor: theme.muted }} />
			<View style={{ flex: 1, padding: 16, gap: 10 }}>
				<Skeleton style={{ height: 12, width: "50%" }} />
				<Skeleton style={{ height: 28, width: "70%" }} />
				<Skeleton style={{ height: 12, width: "40%" }} />
			</View>
		</View>
	);
}
