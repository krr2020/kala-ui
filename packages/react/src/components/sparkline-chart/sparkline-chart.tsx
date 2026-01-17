/**
 * SparklineChart Component
 * Small inline chart for use in cards and dashboards
 * Optimized for compact display with minimal visual noise
 */

"use client";

import type { ApexOptions } from "apexcharts";
import { cn } from "../../lib/utils";
import { Chart } from "../charts/chart";
import { useThemeAwareChart } from "../charts";

export interface SparklineChartProps {
	/**
	 * Data points for the sparkline
	 */
	data: number[];

	/**
	 * Chart type
	 */
	type?: "line" | "area" | "bar";

	/**
	 * Primary color for the chart
	 */
	color?: string;

	/**
	 * Width of the chart in pixels
	 */
	width?: number | string;

	/**
	 * Height of the chart in pixels
	 */
	height?: number | string;

	/**
	 * Show values on hover
	 * @default false
	 */
	tooltip?: boolean;

	/**
	 * Optional className for styling
	 */
	className?: string;

	/**
	 * Gradient colors (for area charts)
	 */
	gradientFrom?: string;
	gradientTo?: string;

	/**
	 * Animation settings
	 */
	animated?: boolean;

	/**
	 * Enable interactions (hover states, markers, etc.)
	 * @default false
	 */
	interactive?: boolean;
}

export function SparklineChart({
	data,
	type = "line",
	color,
	width = "100%",
	height = 64,
	tooltip = false,
	className,
	gradientFrom,
	gradientTo,
	animated = true,
	interactive = false,
}: SparklineChartProps) {
	const { colors: themeColors, theme } = useThemeAwareChart();
	const chartColor = color || themeColors.primary[0];

	const options: ApexOptions = {
		chart: {
			type,
			sparkline: {
				enabled: true,
			},
			animations: {
				enabled: animated,
				speed: 400,
			},
			toolbar: {
				show: false,
			},
			zoom: {
				enabled: false,
			},
		},
		colors: [chartColor],
		states: {
			hover: {
				filter: {
					type: interactive ? "lighten" : "none",
				},
			},
			active: {
				filter: {
					type: "none",
				},
			},
		},
		stroke: {
			curve: "smooth",
			width: type === "line" ? 2 : 0,
		},
		fill: {
			type: type === "area" ? "gradient" : "solid",
			...(type === "area" && {
				gradient: {
					shadeIntensity: 1,
					opacityFrom: 0.7,
					opacityTo: 0.1,
					stops: [0, 100],
					...(gradientFrom &&
						gradientTo && {
						colorStops: [
							{
								offset: 0,
								color: gradientFrom,
								opacity: 0.7,
							},
							{
								offset: 100,
								color: gradientTo,
								opacity: 0.1,
							},
						],
					}),
				},
			}),
		},
		tooltip: {
			enabled: tooltip,
			theme: theme === "dark" || theme === "accent" ? "dark" : "light",
			x: {
				show: false,
			},
			y: {
				title: {
					formatter: () => "",
				},
			},
			marker: {
				show: false,
			},
		},
		markers: {
			size: 0,
			hover: {
				size: interactive ? 4 : 0,
			},
		},
		grid: {
			show: false,
		},
		xaxis: {
			labels: {
				show: false,
			},
			axisBorder: {
				show: false,
			},
			axisTicks: {
				show: false,
			},
			tooltip: {
				enabled: false,
			},
			crosshairs: {
				show: interactive,
			},
		},
		yaxis: {
			labels: {
				show: false,
			},
		},
		plotOptions: {
			bar: {
				columnWidth: "80%",
			},
		},
	};

	const series = [
		{
			name: "Value",
			data: data,
		},
	];

	return (
		<div className={cn("sparkline-chart", className)}>
			<Chart
				options={options}
				series={series}
				type={type}
				height={height}
				width={width}
			/>
		</div>
	);
}
