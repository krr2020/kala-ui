/**
 * DonutChart: proportion ring built from stroke-dasharray circle arcs
 * (same technique as RingProgress). The center reads the en-US
 * formatted total so the number is deterministic across locales.
 */

import type { ReactElement } from "react";
import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useUnistyles } from "react-native-unistyles";
import { donutArcs } from "../../lib/chart-geometry";
import { ChartSkeleton } from "./chart-skeleton";
import {
	donutOverlayStyle,
	donutTotalStyle,
	emptyBoxStyle,
	emptyTextStyle,
	svgOverlayStyle,
} from "./charts.styles";
import type { ChartTone, DonutChartProps } from "./donut-chart.types";

const PALETTE: ChartTone[] = [
	"primary",
	"success",
	"warning",
	"destructive",
	"info",
];

function slug(label: string): string {
	return label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function DonutChart({
	data,
	size = 140,
	thickness = 16,
	emptyMessage = "No data available",
	isLoading = false,
	style,
	styles,
	testID = "k-donut-chart",
}: DonutChartProps): ReactElement {
	const { theme } = useUnistyles();

	if (isLoading) {
		return (
			<ChartSkeleton
				height={size}
				style={style}
				styles={styles}
				testID={testID}
			/>
		);
	}

	const arcs = donutArcs(data.map((d) => d.value));

	if (data.length === 0 || arcs.length === 0) {
		return (
			<View
				testID={testID}
				style={[
					emptyBoxStyle(theme, { width: size, height: size }),
					style,
					styles?.root,
				]}
			>
				<Text style={emptyTextStyle(theme, 13)}>{emptyMessage}</Text>
			</View>
		);
	}

	const radius = (size - thickness) / 2;
	const circumference = radius * 2 * Math.PI;
	const total = data.reduce(
		(sum, d) => sum + (Number.isFinite(d.value) ? Math.max(0, d.value) : 0),
		0,
	);

	return (
		<View
			testID={testID}
			accessibilityLabel={`donut chart: ${data
				.map((d) => `${d.label} ${Math.max(0, d.value)}`)
				.join(", ")}`}
			style={[{ width: size, height: size }, style, styles?.root]}
		>
			<Svg width={size} height={size} style={svgOverlayStyle}>
				<Circle
					testID="k-donut-chart-track"
					cx={size / 2}
					cy={size / 2}
					r={radius}
					stroke={theme.muted}
					strokeWidth={thickness}
					fill="none"
				/>
				{arcs.map((arc, i) => {
					const tone = data[i].tone ?? PALETTE[i % PALETTE.length];
					const length = arc.fraction * circumference;
					return (
						<Circle
							key={data[i].label}
							testID={`k-donut-chart-segment-${slug(data[i].label)}`}
							cx={size / 2}
							cy={size / 2}
							r={radius}
							stroke={String(theme[tone] ?? theme.primary)}
							strokeWidth={thickness}
							fill="none"
							strokeDasharray={`${length} ${circumference - length}`}
							// SVG arcs start at 3 o'clock; rotate so segment 0 starts at 12.
							origin={`${size / 2}, ${size / 2}`}
							rotation={arc.offset * 360 - 90}
						/>
					);
				})}
			</Svg>
			<View style={donutOverlayStyle(size)}>
				<Text style={donutTotalStyle}>{total.toLocaleString("en-US")}</Text>
			</View>
		</View>
	);
}
