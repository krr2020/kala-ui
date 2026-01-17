/**
 * Area Chart Component
 * Beautiful area charts with gradient fills, perfect for time series and trends
 */

"use client";

import type { ApexOptions } from "apexcharts";
import { useMemo } from "react";
import { cn } from "../../lib/utils";
import { Chart } from "./chart";
import type { AreaChartProps, ReferenceLine } from "./chart.types";
import { useThemeAwareChart } from "./use-theme-aware-chart";
import { getDefaultChartOptions } from "./utils";

export function AreaChart({
	series,
	categories,
	colors,
	height = 350,
	width = "100%",
	className,
	title,
	subtitle,
	toolbar = false,
	animations = true,
	curve = "smooth",
	stacked = false,
	dataLabels = false,
	yAxisLabel,
	referenceLines = [],
	options: customOptions,
}: AreaChartProps) {
	const { colors: themeColors } = useThemeAwareChart();

	const chartOptions: ApexOptions = useMemo(() => {
		const baseOptions = getDefaultChartOptions();

		// Use theme-aware colors if not provided
		const chartColors = colors || themeColors.mixed;

		const options: ApexOptions = {
			...baseOptions,
			chart: {
				...baseOptions.chart,
				type: "area",
				stacked,
				toolbar: {
					show: toolbar,
					tools: {
						download: true,
						selection: true,
						zoom: true,
						zoomin: true,
						zoomout: true,
						pan: true,
						reset: true,
					},
				},
				animations: {
					enabled: animations,
					speed: 800,
				},
			},
			colors: chartColors,
			dataLabels: {
				enabled: dataLabels,
			},
			stroke: {
				curve,
				width: 2,
			},
			fill: {
				type: "gradient",
				gradient: {
					shadeIntensity: 1,
					opacityFrom: 0.7,
					opacityTo: 0.2,
					stops: [0, 90, 100],
				},
			},
			xaxis: {
				categories,
				labels: {
					style: {
						colors: "hsl(var(--muted-foreground))",
						fontSize: "12px",
					},
				},
				axisBorder: {
					color: "hsl(var(--border))",
				},
				axisTicks: {
					color: "hsl(var(--border))",
				},
			},
			yaxis: {
				...(yAxisLabel && {
					title: {
						text: yAxisLabel,
						style: {
							color: "hsl(var(--muted-foreground))",
							fontSize: "12px",
						},
					},
				}),
				labels: {
					style: {
						colors: "hsl(var(--muted-foreground))",
						fontSize: "12px",
					},
				},
			},
			grid: {
				borderColor: "hsl(var(--border))",
				strokeDashArray: 3,
			},
			tooltip: {
				theme: document.documentElement.classList.contains("dark")
					? "dark"
					: "light",
				x: {
					show: true,
				},
				y: {
					formatter: (value: number) => value.toLocaleString(),
				},
			},
			legend: {
				position: "top",
				horizontalAlign: "right",
				labels: {
					colors: "hsl(var(--foreground))",
				},
			},
			...(title && {
				title: {
					text: title,
					style: {
						fontSize: "16px",
						fontWeight: "600",
						color: "hsl(var(--foreground))",
					},
				},
			}),
			...(subtitle && {
				subtitle: {
					text: subtitle,
					style: {
						fontSize: "12px",
						color: "hsl(var(--muted-foreground))",
					},
				},
			}),
			annotations: {
				yaxis: referenceLines.map((line: ReferenceLine) => ({
					y: line.value,
					borderColor: line.color || themeColors.destructive[0],
					strokeDashArray: line.dashArray || 3,
					label: {
						text: line.label || "",
						style: {
							color: "#fff",
							background: line.color || themeColors.destructive[0],
						},
					},
				})),
			},
			...customOptions,
		};

		return options;
	}, [
		colors,
		themeColors,
		categories,
		toolbar,
		animations,
		curve,
		stacked,
		dataLabels,
		yAxisLabel,
		title,
		subtitle,
		referenceLines,
		customOptions,
	]);

	return (
		<div className={cn("bg-card rounded-lg p-4", className)}>
			<Chart
				options={chartOptions}
				series={series}
				type="area"
				height={height}
				width={width}
			/>
		</div>
	);
}
