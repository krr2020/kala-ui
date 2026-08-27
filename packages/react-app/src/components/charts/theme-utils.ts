/**
 * Chart Theme Utilities
 *
 * Charts resolve their colors from the live CSS custom properties (design
 * tokens), so a host that overrides `--primary`, `--border`, … flows into
 * every chart automatically — no JS palette to keep in sync. Tinted/shaded
 * ramp stops are built with `color-mix`. When resolution is impossible
 * (SSR, jsdom, unsupported syntax) each color falls back to a curated hex.
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

export type ChartThemeName = "light" | "dark" | "neutral" | "accent";

/**
 * Curated fallback palettes, used whenever CSS resolution is unavailable.
 * These mirror the default token values per theme.
 */
const FALLBACK: Record<ChartThemeName, ThemeColorScheme> = {
	light: {
		primary: ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"],
		success: ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0"],
		warning: ["#f59e0b", "#fbbf24", "#fcd34d", "#fde68a"],
		destructive: ["#ef4444", "#f87171", "#fca5a5", "#fecaca"],
		info: ["#0ea5e9", "#38bdf8", "#7dd3fc", "#bae6fd"],
		mixed: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#0ea5e9", "#6b7280"],
		grid: "#e5e7eb",
		axisLabels: "#6b7280",
		tooltipBg: "#ffffff",
		tooltipText: "#171717",
	},
	dark: {
		primary: ["#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8"],
		success: ["#34d399", "#10b981", "#059669", "#047857"],
		warning: ["#fbbf24", "#f59e0b", "#d97706", "#b45309"],
		destructive: ["#f87171", "#ef4444", "#dc2626", "#b91c1c"],
		info: ["#38bdf8", "#0ea5e9", "#0284c7", "#0369a1"],
		mixed: ["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#38bdf8", "#a1a1aa"],
		grid: "#374151",
		axisLabels: "#a1a1aa",
		tooltipBg: "#1e293b",
		tooltipText: "#fafafa",
	},
	neutral: {
		primary: ["#171717", "#262626", "#404040", "#525252"],
		success: ["#22c55e", "#16a34a", "#15803d", "#166534"],
		warning: ["#f59e0b", "#d97706", "#b45309", "#92400e"],
		destructive: ["#ef4444", "#dc2626", "#b91c1c", "#991b1b"],
		info: ["#3b82f6", "#2563eb", "#1d4ed8", "#1e40af"],
		mixed: ["#171717", "#22c55e", "#f59e0b", "#ef4444", "#3b82f6", "#737373"],
		grid: "#e5e5e5",
		axisLabels: "#737373",
		tooltipBg: "#ffffff",
		tooltipText: "#171717",
	},
	accent: {
		primary: ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"],
		success: ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0"],
		warning: ["#f59e0b", "#fbbf24", "#fcd34d", "#fde68a"],
		destructive: ["#ef4444", "#f87171", "#fca5a5", "#fecaca"],
		info: ["#0ea5e9", "#38bdf8", "#7dd3fc", "#bae6fd"],
		mixed: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#0ea5e9", "#6b7280"],
		grid: "#e5e7eb",
		axisLabels: "#737373",
		tooltipBg: "#ffffff",
		tooltipText: "#171717",
	},
};

/**
 * Get current theme from DOM
 */
function getCurrentTheme(): ChartThemeName {
	// Chart components call this during render; on the server there is no DOM.
	if (typeof document === "undefined") return "light";
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

/*
 * Resolution cache. Keyed by the requested CSS color; invalidated whenever
 * the theme class list on <html> changes (the standard way themes switch).
 */
const resolutionCache = new Map<string, string>();
let cacheKey: string | null = null;

/**
 * Resolve any CSS color expression (var(), color-mix(), …) to a concrete
 * color string via a detached probe element. Returns `fallback` when there
 * is no DOM or the expression cannot be resolved (SSR, test environments).
 */
function resolveColor(cssColor: string, fallback: string): string {
	if (typeof document === "undefined") return fallback;

	const classKey = document.documentElement.className;
	if (cacheKey !== classKey) {
		resolutionCache.clear();
		cacheKey = classKey;
	}
	const cached = resolutionCache.get(cssColor);
	if (cached !== undefined) return cached;

	let resolved = "";
	try {
		const probe = document.createElement("div");
		probe.style.display = "none";
		probe.style.color = cssColor;
		document.body.appendChild(probe);
		resolved = getComputedStyle(probe).color;
		document.body.removeChild(probe);
	} catch {
		resolved = "";
	}
	// Unresolved expressions come back empty or unresolved-with-var(); both
	// mean the runtime can't compute the color — use the curated fallback.
	if (!resolved || resolved.includes("var(")) resolved = fallback;
	resolutionCache.set(cssColor, resolved);
	return resolved;
}

/**
 * Light-surface ramp: base color, then progressively lighter tints.
 */
function tintRamp(base: string, fallback: ColorPalette): ColorPalette {
	return [
		resolveColor(base, fallback[0]),
		resolveColor(`color-mix(in oklab, ${base}, white 30%)`, fallback[1]),
		resolveColor(`color-mix(in oklab, ${base}, white 55%)`, fallback[2]),
		resolveColor(`color-mix(in oklab, ${base}, white 75%)`, fallback[3]),
	];
}

/**
 * Dark-surface ramp: lighter than base, base, then progressively darker shades.
 */
function shadeRamp(base: string, fallback: ColorPalette): ColorPalette {
	return [
		resolveColor(`color-mix(in oklab, ${base}, white 25%)`, fallback[0]),
		resolveColor(base, fallback[1]),
		resolveColor(`color-mix(in oklab, ${base}, black 15%)`, fallback[2]),
		resolveColor(`color-mix(in oklab, ${base}, black 35%)`, fallback[3]),
	];
}

/**
 * Build the token-driven color scheme for a theme.
 */
function buildScheme(theme: ChartThemeName): ThemeColorScheme {
	const fallback = FALLBACK[theme];
	const isDark = theme === "dark";
	const ramp = isDark ? shadeRamp : tintRamp;

	return {
		primary: ramp("var(--primary)", fallback.primary),
		success: ramp("var(--success)", fallback.success),
		warning: ramp("var(--warning)", fallback.warning),
		destructive: ramp("var(--destructive)", fallback.destructive),
		info: ramp("var(--info)", fallback.info),
		mixed: [
			resolveColor("var(--primary)", fallback.mixed[0]),
			resolveColor("var(--success)", fallback.mixed[1]),
			resolveColor("var(--warning)", fallback.mixed[2]),
			resolveColor("var(--destructive)", fallback.mixed[3]),
			resolveColor("var(--info)", fallback.mixed[4]),
			resolveColor("var(--muted-foreground)", fallback.mixed[5]),
		],
		grid: resolveColor(
			"color-mix(in oklab, var(--border), transparent 45%)",
			fallback.grid,
		),
		axisLabels: resolveColor("var(--muted-foreground)", fallback.axisLabels),
		tooltipBg: resolveColor("var(--popover)", fallback.tooltipBg),
		tooltipText: resolveColor(
			"var(--popover-foreground)",
			fallback.tooltipText,
		),
	};
}

/**
 * Get theme-aware chart colors, resolved from the active CSS tokens.
 * @param theme - Optional theme override, otherwise detects from DOM.
 * When an explicit theme differs from the DOM state there is no matching
 * stylesheet to resolve against, so the curated fallbacks are returned.
 */
export function getChartColors(theme?: ChartThemeName): ThemeColorScheme {
	const activeTheme = theme || getCurrentTheme();
	if (theme && theme !== getCurrentTheme()) return FALLBACK[theme];
	return buildScheme(activeTheme);
}

/**
 * Get default chart options with theme-aware colors
 * @param theme - Optional theme override
 */
export function getThemeAwareChartOptions(theme?: ChartThemeName) {
	const colors = getChartColors(theme);
	const tooltipTheme: "dark" | "light" =
		getCurrentTheme() === "dark" ? "dark" : "light";

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
			theme: tooltipTheme,
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
