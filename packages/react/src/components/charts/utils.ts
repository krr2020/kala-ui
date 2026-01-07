/**
 * Chart Utilities
 * Helper functions and default configurations for charts
 */

import type { ApexOptions } from "apexcharts";
import { getChartColors, getThemeAwareChartOptions } from "./theme-utils";

/**
 * Get default chart options that match our design system
 * @param theme - Optional theme override, otherwise detects from DOM
 */
export function getDefaultChartOptions(theme?: "light" | "dark" | "neutral" | "accent"): ApexOptions {
	const themeColors = getChartColors(theme);
	const themeOptions = getThemeAwareChartOptions(theme);

	return {
		chart: {
			fontFamily: "inherit",
			foreColor: "hsl(var(--muted-foreground))",
			background: "transparent",
			toolbar: {
				show: false,
			},
			zoom: {
				enabled: false,
			},
		},
		grid: {
			borderColor: themeColors.grid,
			strokeDashArray: 3,
			xaxis: {
				lines: {
					show: false,
				},
			},
		},
		dataLabels: {
			enabled: false,
		},
		tooltip: {
			theme: themeOptions.tooltip.theme,
		},
		legend: {
			labels: {
				colors: themeOptions.legend.labels.colors,
			},
		},
	};
}

/**
 * Default color palette matching design tokens
 * @param theme - Optional theme override, otherwise detects from DOM
 * @deprecated Use getChartColors() instead for theme-aware colors
 */
export function defaultColors(theme?: "light" | "dark" | "neutral" | "accent") {
	const colors = getChartColors(theme);
	return {
		primary: colors.primary,
		success: colors.success,
		warning: colors.warning,
		destructive: colors.destructive,
		info: colors.info,
		mixed: colors.mixed,
	};
}

/**
 * Format number with appropriate units
 */
export function formatNumber(value: number): string {
	if (value >= 1000000) {
		return `${(value / 1000000).toFixed(1)}M`;
	}
	if (value >= 1000) {
		return `${(value / 1000).toFixed(1)}K`;
	}
	return value.toFixed(0);
}

/**
 * Format currency values
 */
export function formatCurrency(value: number, currency = "USD"): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	}).format(value);
}

/**
 * Format percentage values
 */
export function formatPercentage(value: number, decimals = 1): string {
	return `${value.toFixed(decimals)}%`;
}

/**
 * Generate gradient colors for area charts
 */
export function createGradient(
	_color: string,
	opacity = 0.7,
): {
	type: "gradient";
	gradient: {
		shadeIntensity: number;
		opacityFrom: number;
		opacityTo: number;
		stops: number[];
	};
} {
	return {
		type: "gradient",
		gradient: {
			shadeIntensity: 1,
			opacityFrom: opacity,
			opacityTo: opacity * 0.3,
			stops: [0, 90, 100],
		},
	};
}

/**
 * Get responsive breakpoints for charts
 */
export function getResponsiveOptions(): ApexResponsive[] {
	return [
		{
			breakpoint: 768,
			options: {
				chart: {
					height: 300,
				},
				legend: {
					position: "bottom",
				},
			},
		},
		{
			breakpoint: 480,
			options: {
				chart: {
					height: 250,
				},
				legend: {
					show: false,
				},
			},
		},
	];
}

interface ApexResponsive {
	breakpoint: number;
	options: ApexOptions;
}
