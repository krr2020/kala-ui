/**
 * Bar Chart Component
 * Vertical and horizontal bar charts for comparing values across categories
 */

"use client";

import type { ApexOptions } from "apexcharts";
import { useMemo } from "react";
import { cn } from "../../lib/utils";
import { Chart } from "./chart";
import type { BarChartProps } from "./chart.types";
import { getDefaultChartOptions } from "./utils";
import { useThemeAwareChart } from "./use-theme-aware-chart";

export function BarChart({
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
	horizontal = false,
	stacked = false,
	dataLabels = false,
	barWidth = 70,
	options: customOptions,
}: BarChartProps) {
	const { colors: themeColors } = useThemeAwareChart();

	const chartOptions: ApexOptions = useMemo(() => {
		const baseOptions = getDefaultChartOptions();

		// Use theme-aware colors if not provided
		const chartColors = colors || themeColors.mixed;

		const options: ApexOptions = {
			...baseOptions,
			chart: {
				...baseOptions.chart,
				type: "bar",
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
			plotOptions: {
				bar: {
					horizontal,
					borderRadius: 4,
					columnWidth: `${barWidth}%`,
					barHeight: `${barWidth}%`,
					dataLabels: {
						position: horizontal ? "top" : "center",
					},
				},
			},
			dataLabels: {
				enabled: dataLabels,
				style: {
					fontSize: "12px",
					colors: ["hsl(var(--foreground))"],
				},
			},
			stroke: {
				show: true,
				width: 1,
				colors: ["transparent"],
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
				labels: {
					style: {
						colors: "hsl(var(--muted-foreground))",
						fontSize: "12px",
					},
					formatter: (value: number) => value.toLocaleString(),
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
			...customOptions,
		};

		return options;
	}, [
		colors,
		themeColors,
		categories,
		horizontal,
		stacked,
		dataLabels,
		barWidth,
		toolbar,
		animations,
		title,
		subtitle,
		customOptions,
	]);

	return (
		<Chart
			className={cn("w-full", className)}
			options={chartOptions}
			series={series}
			type="bar"
			height={height}
			width={width}
		/>
	);
}
