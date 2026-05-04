import { describe, expect, it, beforeEach, afterEach } from "vitest";
import {
	getChartColors,
	getThemeAwareChartOptions,
	createThemeAwareChart,
} from "./theme-utils";

describe("theme-utils", () => {
	beforeEach(() => {
		document.documentElement.classList.remove("dark", "neutral", "accent");
	});

	afterEach(() => {
		document.documentElement.classList.remove("dark", "neutral", "accent");
	});

	describe("getChartColors", () => {
		it("should return light theme colors by default", () => {
			const colors = getChartColors();
			expect(colors.grid).toBe("#e5e7eb");
			expect(colors.tooltipBg).toBe("#ffffff");
			expect(colors.tooltipText).toBe("#171717");
		});

		it("should return light theme colors when explicitly passed", () => {
			const colors = getChartColors("light");
			expect(colors.grid).toBe("#e5e7eb");
			expect(colors.tooltipBg).toBe("#ffffff");
		});

		it("should return dark theme colors", () => {
			const colors = getChartColors("dark");
			expect(colors.grid).toBe("#374151");
			expect(colors.tooltipBg).toBe("#1e293b");
			expect(colors.tooltipText).toBe("#fafafa");
		});

		it("should return neutral theme colors", () => {
			const colors = getChartColors("neutral");
			expect(colors.grid).toBe("#e5e5e5");
			expect(colors.axisLabels).toBe("#737373");
			expect(colors.tooltipBg).toBe("#ffffff");
		});

		it("should return accent theme colors", () => {
			const colors = getChartColors("accent");
			expect(colors.grid).toBe("#e5e7eb");
			expect(colors.axisLabels).toBe("#737373");
		});

		it("should detect dark theme from DOM when no argument passed", () => {
			document.documentElement.classList.add("dark");
			const colors = getChartColors();
			expect(colors.grid).toBe("#374151");
		});

		it("should detect accent over dark from DOM", () => {
			document.documentElement.classList.add("dark", "accent");
			const colors = getChartColors();
			expect(colors.grid).toBe("#e5e7eb");
		});

		it("should detect neutral theme from DOM", () => {
			document.documentElement.classList.add("neutral");
			const colors = getChartColors();
			expect(colors.grid).toBe("#e5e5e5");
		});

		it("should detect accent theme from DOM", () => {
			document.documentElement.classList.add("accent");
			const colors = getChartColors();
			expect(colors.grid).toBe("#e5e7eb");
		});

		it("should override DOM theme when argument is passed", () => {
			document.documentElement.classList.add("dark");
			const colors = getChartColors("light");
			expect(colors.grid).toBe("#e5e7eb");
		});

		it("should return arrays for all color palettes", () => {
			const colors = getChartColors("light");
			expect(colors.primary).toBeInstanceOf(Array);
			expect(colors.success).toBeInstanceOf(Array);
			expect(colors.warning).toBeInstanceOf(Array);
			expect(colors.destructive).toBeInstanceOf(Array);
			expect(colors.info).toBeInstanceOf(Array);
			expect(colors.mixed).toBeInstanceOf(Array);
		});

		it("should return correct primary colors for each theme", () => {
			const light = getChartColors("light");
			const dark = getChartColors("dark");
			expect(light.primary[0]).toBe("#3b82f6");
			expect(dark.primary[0]).toBe("#60a5fa");
		});
	});

	describe("getThemeAwareChartOptions", () => {
		it("should return options with grid configuration", () => {
			const options = getThemeAwareChartOptions("light");
			expect(options.grid).toBeDefined();
			expect(options.grid.borderColor).toBe("#e5e7eb");
			expect(options.grid.strokeDashArray).toBe(3);
		});

		it("should return dark tooltip theme for dark mode", () => {
			document.documentElement.classList.add("dark");
			const options = getThemeAwareChartOptions();
			expect(options.tooltip.theme).toBe("dark");
		});

		it("should return light tooltip theme for light mode", () => {
			const options = getThemeAwareChartOptions("light");
			expect(options.tooltip.theme).toBe("light");
		});

		it("should return legend label colors", () => {
			const options = getThemeAwareChartOptions("light");
			expect(options.legend.labels.colors).toBe("#6b7280");
		});

		it("should disable x-axis grid lines", () => {
			const options = getThemeAwareChartOptions("light");
			expect(options.grid.xaxis.lines.show).toBe(false);
		});

		it("should detect theme from DOM for tooltip", () => {
			document.documentElement.classList.add("dark");
			const options = getThemeAwareChartOptions();
			expect(options.tooltip.theme).toBe("dark");
		});
	});

	describe("createThemeAwareChart", () => {
		it("should return an object with getColors, updateColors, and getTheme", () => {
			const chart = createThemeAwareChart();
			expect(chart.getColors).toBeInstanceOf(Function);
			expect(chart.updateColors).toBeInstanceOf(Function);
			expect(chart.getTheme).toBeInstanceOf(Function);
		});

		it("should return colors from getColors", () => {
			const chart = createThemeAwareChart();
			const colors = chart.getColors();
			expect(colors).toBeDefined();
			expect(colors.primary).toBeInstanceOf(Array);
			expect(colors.mixed).toBeInstanceOf(Array);
		});

		it("should return current theme from getTheme", () => {
			document.documentElement.classList.remove("dark", "neutral", "accent");
			const chart = createThemeAwareChart();
			expect(chart.getTheme()).toBe("light");
		});

		it("should return false when theme has not changed on updateColors", () => {
			const chart = createThemeAwareChart();
			const changed = chart.updateColors();
			expect(changed).toBe(false);
		});

		it("should return true and update colors when theme changes on updateColors", () => {
			const chart = createThemeAwareChart();
			expect(chart.getTheme()).toBe("light");

			document.documentElement.classList.add("dark");
			const changed = chart.updateColors();
			expect(changed).toBe(true);
			expect(chart.getTheme()).toBe("dark");

			const newColors = chart.getColors();
			expect(newColors.grid).toBe("#374151");
		});

		it("should return false when updateColors is called again without theme change", () => {
			document.documentElement.classList.add("dark");
			const chart = createThemeAwareChart();
			chart.updateColors(); // First call detects change
			const changed = chart.updateColors(); // Second call should be false
			expect(changed).toBe(false);
		});
	});
});
