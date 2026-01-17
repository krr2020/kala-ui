/**
 * Chart Theme Utilities
 * Theme-aware color system for charts that respects light/dark mode
 */

/**
 * Chart color palette type
 */
export type ColorPalette = string[];

/**
 * Color scheme configuration for different themes
 */
export interface ThemeColorScheme {
	primary: ColorPalette;
	success: ColorPalette;
	warning: ColorPalette;
	destructive: ColorPalette;
	info: ColorPalette;
	mixed: ColorPalette;
	grid: string;
	axisLabels: string;
	tooltipBg: string;
	tooltipText: string;
}

/**
 * Light theme color palette
 * Matches CSS variables in globals.css for :root
 */
const lightTheme: ThemeColorScheme = {
	primary: ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"],
	success: ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0"],
	warning: ["#f59e0b", "#fbbf24", "#fcd34d", "#fde68a"],
	destructive: ["#ef4444", "#f87171", "#fca5a5", "#fecaca"],
	info: ["#0ea5e9", "#38bdf8", "#7dd3fc", "#bae6fd"],
	mixed: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"],
	grid: "#e5e7eb", // hsl(211 27% 81%)
	axisLabels: "#6b7280", // hsl(215.4 16.3% 46.9%)
	tooltipBg: "#ffffff",
	tooltipText: "#171717",
};

/**
 * Dark theme color palette
 * Matches CSS variables in globals.css for .dark
 */
const darkTheme: ThemeColorScheme = {
	primary: ["#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8"],
	success: ["#34d399", "#10b981", "#059669", "#047857"],
	warning: ["#fbbf24", "#f59e0b", "#d97706", "#b45309"],
	destructive: ["#f87171", "#ef4444", "#dc2626", "#b91c1c"],
	info: ["#38bdf8", "#0ea5e9", "#0284c7", "#0369a1"],
	mixed: ["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa", "#f472b6"],
	grid: "#374151", // hsl(221 32% 43%) with alpha
	axisLabels: "#a1a1aa", // hsl(215 20.2% 65.1%)
	tooltipBg: "#1e293b",
	tooltipText: "#fafafa",
};

/**
 * Neutral theme color palette
 * Matches CSS variables in globals.css for .neutral
 */
const neutralTheme: ThemeColorScheme = {
	primary: ["#171717", "#262626", "#404040", "#525252"],
	success: ["#22c55e", "#16a34a", "#15803d", "#166534"],
	warning: ["#f59e0b", "#d97706", "#b45309", "#92400e"],
	destructive: ["#ef4444", "#dc2626", "#b91c1c", "#991b1b"],
	info: ["#3b82f6", "#2563eb", "#1d4ed8", "#1e40af"],
	mixed: ["#171717", "#22c55e", "#f59e0b", "#ef4444", "#7c3aed", "#db2777"],
	grid: "#e5e5e5",
	axisLabels: "#737373",
	tooltipBg: "#ffffff",
	tooltipText: "#171717",
};

/**
 * Accent theme color palette (light theme with accent styling)
 * Matches CSS variables in globals.css for .accent
 */
const accentTheme: ThemeColorScheme = {
	primary: ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"],
	success: ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0"],
	warning: ["#f59e0b", "#fbbf24", "#fcd34d", "#fde68a"],
	destructive: ["#ef4444", "#f87171", "#fca5a5", "#fecaca"],
	info: ["#0ea5e9", "#38bdf8", "#7dd3fc", "#bae6fd"],
	mixed: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"],
	grid: "#e5e7eb",
	axisLabels: "#737373",
	tooltipBg: "#ffffff",
	tooltipText: "#171717",
};

/**
 * Get current theme from DOM
 */
function getCurrentTheme(): "light" | "dark" | "neutral" | "accent" {
	if (document.documentElement.classList.contains("dark")) {
		return document.documentElement.classList.contains("accent")
			? "accent"
			: "dark";
	}
	if (document.documentElement.classList.contains("neutral")) {
		return "neutral";
	}
	if (document.documentElement.classList.contains("accent")) {
		return "accent";
	}
	return "light";
}

/**
 * Get theme color scheme
 */
function getThemeScheme(
	theme?: "light" | "dark" | "neutral" | "accent",
): ThemeColorScheme {
	const activeTheme = theme || getCurrentTheme();

	switch (activeTheme) {
		case "dark":
			return darkTheme;
		case "neutral":
			return neutralTheme;
		case "accent":
			return accentTheme;
		default:
			return lightTheme;
	}
}

/**
 * Get theme-aware chart colors
 * @param theme - Optional theme override, otherwise detects from DOM
 * @returns Color palette for current theme
 */
export function getChartColors(
	theme?: "light" | "dark" | "neutral" | "accent",
): ThemeColorScheme {
	return getThemeScheme(theme);
}

/**
 * Get default chart options with theme-aware colors
 * @param theme - Optional theme override
 */
export function getThemeAwareChartOptions(
	theme?: "light" | "dark" | "neutral" | "accent",
) {
	const colors = getChartColors(theme);

	return {
		grid: {
			borderColor: colors.grid,
			strokeDashArray: 3,
			xaxis: {
				lines: {
					show: false,
				},
			},
		},
		tooltip: {
			theme: getCurrentTheme() === "dark" ? "dark" : "light",
		},
		legend: {
			labels: {
				colors: colors.axisLabels,
			},
		},
	};
}

/**
 * Create a theme-aware chart instance
 * Use this to get colors that will update when theme changes
 */
export function createThemeAwareChart() {
	let currentTheme = getCurrentTheme();
	let colors = getChartColors(currentTheme);

	return {
		/**
		 * Get current colors
		 */
		getColors: () => colors,

		/**
		 * Update colors based on current theme
		 */
		updateColors: () => {
			const newTheme = getCurrentTheme();
			if (newTheme !== currentTheme) {
				currentTheme = newTheme;
				colors = getChartColors(currentTheme);
				return true; // Theme changed
			}
			return false; // Theme unchanged
		},

		/**
		 * Get current theme
		 */
		getTheme: () => currentTheme,
	};
}
