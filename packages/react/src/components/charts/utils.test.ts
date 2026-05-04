import { describe, expect, it, vi } from "vitest";
import {
	getDefaultChartOptions,
	defaultColors,
	formatNumber,
	formatCurrency,
	formatPercentage,
	createGradient,
	getResponsiveOptions,
} from "./utils";

// Mock theme-utils since it relies on DOM for theme detection
vi.mock("./theme-utils", () => ({
	getChartColors: (theme?: string) => ({
		primary: "#3b82f6",
		success: "#22c55e",
		warning: "#f59e0b",
		destructive: "#ef4444",
		info: "#06b6d4",
		mixed: "#8b5cf6",
		grid: "hsl(var(--border))",
		tooltipBg: "hsl(var(--popover))",
		tooltipText: "hsl(var(--popover-foreground))",
		legendText: "hsl(var(--muted-foreground))",
	}),
	getThemeAwareChartOptions: (theme?: string) => ({
		tooltip: {
			theme: "dark",
		},
		legend: {
			labels: {
				colors: ["#a1a1aa"],
			},
		},
	}),
}));

describe("charts/utils", () => {
	describe("getDefaultChartOptions", () => {
		it("returns options with default theme", () => {
			const options = getDefaultChartOptions();
			expect(options.chart).toBeDefined();
			expect(options.chart?.fontFamily).toBe("inherit");
			expect(options.chart?.background).toBe("transparent");
			expect(options.chart?.toolbar?.show).toBe(false);
			expect(options.chart?.zoom?.enabled).toBe(false);
			expect(options.grid).toBeDefined();
			expect(options.grid?.strokeDashArray).toBe(3);
			expect(options.grid?.xaxis?.lines?.show).toBe(false);
			expect(options.dataLabels?.enabled).toBe(false);
		});

		it("returns options with explicit theme", () => {
			const options = getDefaultChartOptions("light");
			expect(options.chart).toBeDefined();
			expect(options.tooltip).toBeDefined();
			expect(options.legend).toBeDefined();
		});

		it("returns options with dark theme", () => {
			const options = getDefaultChartOptions("dark");
			expect(options.chart).toBeDefined();
			expect(options.tooltip).toBeDefined();
		});

		it("returns options with neutral theme", () => {
			const options = getDefaultChartOptions("neutral");
			expect(options.chart).toBeDefined();
		});

		it("returns options with accent theme", () => {
			const options = getDefaultChartOptions("accent");
			expect(options.chart).toBeDefined();
		});
	});

	describe("defaultColors", () => {
		it("returns all color keys", () => {
			const colors = defaultColors();
			expect(colors).toHaveProperty("primary");
			expect(colors).toHaveProperty("success");
			expect(colors).toHaveProperty("warning");
			expect(colors).toHaveProperty("destructive");
			expect(colors).toHaveProperty("info");
			expect(colors).toHaveProperty("mixed");
		});

		it("returns colors with explicit theme", () => {
			const colors = defaultColors("dark");
			expect(colors.primary).toBe("#3b82f6");
			expect(colors.success).toBe("#22c55e");
		});

		it("returns colors with light theme", () => {
			const colors = defaultColors("light");
			expect(colors.primary).toBe("#3b82f6");
		});
	});

	describe("formatNumber", () => {
		it("formats millions", () => {
			expect(formatNumber(1500000)).toBe("1.5M");
		});

		it("formats exactly 1 million", () => {
			expect(formatNumber(1000000)).toBe("1.0M");
		});

		it("formats thousands", () => {
			expect(formatNumber(1500)).toBe("1.5K");
		});

		it("formats exactly 1 thousand", () => {
			expect(formatNumber(1000)).toBe("1.0K");
		});

		it("formats small numbers without units", () => {
			expect(formatNumber(42)).toBe("42");
		});

		it("formats zero", () => {
			expect(formatNumber(0)).toBe("0");
		});

		it("formats negative numbers (below threshold, no unit suffix)", () => {
			expect(formatNumber(-1500)).toBe("-1500");
		});

		it("formats decimals", () => {
			expect(formatNumber(1234)).toBe("1.2K");
		});
	});

	describe("formatCurrency", () => {
		it("formats USD currency", () => {
			const result = formatCurrency(1234.56);
			expect(result).toContain("1,234.56");
		});

		it("formats zero", () => {
			const result = formatCurrency(0);
			expect(result).toContain("0");
		});

		it("formats negative values", () => {
			const result = formatCurrency(-100);
			expect(result).toContain("-");
		});

		it("uses default USD currency", () => {
			const result = formatCurrency(100);
			expect(result).toContain("$");
		});

		it("supports custom currency", () => {
			const result = formatCurrency(100, "EUR");
			// The formatted value depends on runtime locale support
			expect(result).toBeDefined();
			expect(typeof result).toBe("string");
		});

		it("supports GBP currency", () => {
			const result = formatCurrency(100, "GBP");
			expect(typeof result).toBe("string");
		});
	});

	describe("formatPercentage", () => {
		it("formats percentage with default decimals", () => {
			expect(formatPercentage(12.345)).toBe("12.3%");
		});

		it("formats percentage with custom decimals", () => {
			expect(formatPercentage(12.345, 2)).toBe("12.35%");
		});

		it("formats zero", () => {
			expect(formatPercentage(0)).toBe("0.0%");
		});

		it("formats negative percentage", () => {
			expect(formatPercentage(-5.5)).toBe("-5.5%");
		});

		it("formats with 0 decimals", () => {
			expect(formatPercentage(99.9, 0)).toBe("100%");
		});
	});

	describe("createGradient", () => {
		it("returns gradient type object", () => {
			const gradient = createGradient("#3b82f6");
			expect(gradient.type).toBe("gradient");
			expect(gradient.gradient).toBeDefined();
			expect(gradient.gradient.shadeIntensity).toBe(1);
		});

		it("uses default opacity of 0.7", () => {
			const gradient = createGradient("#3b82f6");
			expect(gradient.gradient.opacityFrom).toBe(0.7);
			expect(gradient.gradient.opacityTo).toBeCloseTo(0.21);
		});

		it("uses custom opacity", () => {
			const gradient = createGradient("#3b82f6", 0.5);
			expect(gradient.gradient.opacityFrom).toBe(0.5);
			expect(gradient.gradient.opacityTo).toBeCloseTo(0.15);
		});

		it("has correct stops", () => {
			const gradient = createGradient("#3b82f6");
			expect(gradient.gradient.stops).toEqual([0, 90, 100]);
		});

		it("works with opacity of 1", () => {
			const gradient = createGradient("#fff", 1);
			expect(gradient.gradient.opacityFrom).toBe(1);
			expect(gradient.gradient.opacityTo).toBeCloseTo(0.3);
		});
	});

	describe("getResponsiveOptions", () => {
		it("returns array of responsive options", () => {
			const options = getResponsiveOptions();
			expect(Array.isArray(options)).toBe(true);
			expect(options).toHaveLength(2);
		});

		it("has tablet breakpoint at 768", () => {
			const options = getResponsiveOptions();
			expect(options[0].breakpoint).toBe(768);
			expect(options[0].options.chart?.height).toBe(300);
			expect(options[0].options.legend?.position).toBe("bottom");
		});

		it("has mobile breakpoint at 480", () => {
			const options = getResponsiveOptions();
			expect(options[1].breakpoint).toBe(480);
			expect(options[1].options.chart?.height).toBe(250);
			expect(options[1].options.legend?.show).toBe(false);
		});
	});
});
