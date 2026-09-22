/**
 * Sparkline: one-path trend line sized for embedding (metric rows,
 * table cells). NaN samples are dropped, not read as zero.
 */

import type { ReactElement } from "react";
import { Text, View } from "react-native";
import Svg, { Polyline } from "react-native-svg";
import { useUnistyles } from "react-native-unistyles";
import { sparklinePoints } from "../../lib/chart-geometry";
import { ChartSkeleton } from "./chart-skeleton";
import { emptyBoxStyle, emptyTextStyle } from "./charts.styles";
import type { SparklineProps } from "./sparkline.types";

export function Sparkline({
	data,
	width = 120,
	height = 36,
	tone = "primary",
	emptyMessage = "No data available",
	isLoading = false,
	style,
	styles,
	testID = "k-sparkline",
}: SparklineProps): ReactElement {
	const { theme } = useUnistyles();

	if (isLoading) {
		return (
			<ChartSkeleton
				height={height}
				legendCount={0}
				style={style}
				styles={styles}
				testID={testID}
			/>
		);
	}

	const points = sparklinePoints(data, width, height);

	if (data.length === 0 || points === "") {
		return (
			<View
				testID={testID}
				style={[emptyBoxStyle(theme, { width, height }), style, styles?.root]}
			>
				<Text style={emptyTextStyle(theme, 12)}>{emptyMessage}</Text>
			</View>
		);
	}

	return (
		<View
			testID={testID}
			accessibilityLabel="sparkline trend"
			style={[style, styles?.root]}
		>
			<Svg width={width} height={height}>
				<Polyline
					testID="k-sparkline-line"
					points={points}
					fill="none"
					stroke={String(theme[tone] ?? theme.primary)}
					strokeWidth={2}
				/>
			</Svg>
		</View>
	);
}
