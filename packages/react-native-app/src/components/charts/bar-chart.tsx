/**
 * BarChart: hand-rolled SVG column chart (no ApexCharts on native — the
 * web dependency is canvas- and window-bound). Values normalize against
 * the tallest bar; degenerate input collapses to stubs or the empty arm.
 */
import type { ReactElement } from "react";
import { Text, View } from "react-native";
import Svg, { Rect } from "react-native-svg";
import { useUnistyles } from "react-native-unistyles";
import { barHeights } from "../../lib/chart-geometry";
import type { BarChartProps } from "./bar-chart.types";
import { ChartSkeleton } from "./chart-skeleton";

interface ThemeShape {
	[key: string]: string | number;
	mutedForeground: string;
	border: string;
}

function slug(label: string): string {
	return label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function BarChart({
	data,
	height = 120,
	width = 240,
	tone = "primary",
	emptyMessage = "No data available",
	isLoading = false,
	style,
	styles,
	testID = "k-bar-chart",
}: BarChartProps): ReactElement {
	const { theme } = useUnistyles() as unknown as { theme: ThemeShape };

	if (isLoading) {
		return (
			<ChartSkeleton
				height={height}
				style={style}
				styles={styles}
				testID={testID}
			/>
		);
	}

	if (data.length === 0) {
		return (
			<View
				testID={testID}
				style={[
					{
						height,
						justifyContent: "center",
						alignItems: "center",
						borderWidth: 1,
						borderColor: theme.border,
					},
					style,
					styles?.root,
				]}
			>
				<Text style={{ color: theme.mutedForeground, fontSize: 13 }}>
					{emptyMessage}
				</Text>
			</View>
		);
	}

	const fill = String(theme[tone] ?? theme.primary);
	const heights = barHeights(
		data.map((d) => d.value),
		height,
	);
	const slot = width / data.length;
	const barWidth = slot * 0.6;

	return (
		<View
			testID={testID}
			accessibilityLabel={`bar chart: ${data
				.map((d) => `${d.label} ${d.value}`)
				.join(", ")}`}
			style={[style, styles?.root]}
		>
			<Svg width={width} height={height}>
				{heights.map((h, i) => (
					<Rect
						key={data[i].label}
						testID={`k-bar-chart-bar-${slug(data[i].label)}`}
						x={i * slot + (slot - barWidth) / 2}
						y={height - h}
						width={barWidth}
						height={h}
						fill={fill}
						rx={2}
					/>
				))}
			</Svg>
			<View style={{ flexDirection: "row", width }}>
				{data.map((d) => (
					<Text
						key={d.label}
						numberOfLines={1}
						style={{
							flex: 1,
							textAlign: "center",
							fontSize: 11,
							color: theme.mutedForeground,
						}}
					>
						{d.label}
					</Text>
				))}
			</View>
		</View>
	);
}
