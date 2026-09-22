/**
 * MetricCardSkeleton: pulsing title / value / change bars inside the
 * card frame; keeps the k-metric-card marker while loading.
 */

import { Skeleton } from "@kala-ui/react-native";
import type { ReactElement } from "react";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import {
	cardStyle,
	skeletonAccentStyle,
	skeletonBodyStyle,
	skeletonChangeBone,
	skeletonTitleBone,
	skeletonValueBone,
} from "./metric-card.styles";
import type { MetricCardSkeletonProps } from "./metric-card.types";

export function MetricCardSkeleton({
	style,
	styles,
	testID = "k-metric-card",
}: MetricCardSkeletonProps): ReactElement {
	const { theme } = useUnistyles();
	return (
		<View testID={testID} style={[cardStyle(theme), style, styles?.root]}>
			<View style={skeletonAccentStyle(theme)} />
			<View style={skeletonBodyStyle}>
				<Skeleton style={skeletonTitleBone} />
				<Skeleton style={skeletonValueBone} />
				<Skeleton style={skeletonChangeBone} />
			</View>
		</View>
	);
}
