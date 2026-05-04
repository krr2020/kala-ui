import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { useThemeAwareChart } from "./use-theme-aware-chart";

describe("useThemeAwareChart", () => {
	beforeEach(() => {
		document.documentElement.classList.remove("dark", "neutral", "accent");
	});

	afterEach(() => {
		document.documentElement.classList.remove("dark", "neutral", "accent");
	});

	it("should return light theme colors by default", () => {
		const { result } = renderHook(() => useThemeAwareChart());
		expect(result.current.theme).toBe("light");
		expect(result.current.colors).toBeDefined();
		expect(result.current.colors.primary).toBeInstanceOf(Array);
		expect(result.current.colors.mixed).toBeInstanceOf(Array);
	});

	it("should detect dark theme from DOM", () => {
		document.documentElement.classList.add("dark");
		const { result } = renderHook(() => useThemeAwareChart());
		expect(result.current.theme).toBe("dark");
	});

	it("should detect neutral theme from DOM", () => {
		document.documentElement.classList.add("neutral");
		const { result } = renderHook(() => useThemeAwareChart());
		expect(result.current.theme).toBe("neutral");
	});

	it("should detect accent theme from DOM", () => {
		document.documentElement.classList.add("accent");
		const { result } = renderHook(() => useThemeAwareChart());
		expect(result.current.theme).toBe("accent");
	});

	it("should detect accent theme over dark theme (dark + accent)", () => {
		document.documentElement.classList.add("dark", "accent");
		const { result } = renderHook(() => useThemeAwareChart());
		expect(result.current.theme).toBe("accent");
	});

	it("should return colors object with expected keys", () => {
		const { result } = renderHook(() => useThemeAwareChart());
		const colorKeys = [
			"primary",
			"success",
			"warning",
			"destructive",
			"info",
			"mixed",
			"grid",
			"axisLabels",
			"tooltipBg",
			"tooltipText",
		];
		for (const key of colorKeys) {
			expect(result.current.colors).toHaveProperty(key);
		}
	});

	it("should update theme when DOM classes change to dark", async () => {
		const { result } = renderHook(() => useThemeAwareChart());
		expect(result.current.theme).toBe("light");

		act(() => {
			document.documentElement.classList.add("dark");
			// Force a class attribute mutation so MutationObserver fires
			document.documentElement.setAttribute(
				"class",
				document.documentElement.className,
			);
		});

		await waitFor(() => {
			expect(result.current.theme).toBe("dark");
		});
	});

	it("should update theme when DOM classes change to neutral", async () => {
		const { result } = renderHook(() => useThemeAwareChart());
		expect(result.current.theme).toBe("light");

		act(() => {
			document.documentElement.classList.add("neutral");
			document.documentElement.setAttribute(
				"class",
				document.documentElement.className,
			);
		});

		await waitFor(() => {
			expect(result.current.theme).toBe("neutral");
		});
	});

	it("should return different color sets for different themes", () => {
		const { result: lightResult, unmount } = renderHook(() => useThemeAwareChart());
		const lightColors = lightResult.current.colors;
		unmount();

		document.documentElement.classList.add("dark");
		const { result: darkResult } = renderHook(() => useThemeAwareChart());
		const darkColors = darkResult.current.colors;

		// Colors should differ between light and dark
		expect(lightColors.grid).not.toBe(darkColors.grid);
		expect(lightColors.tooltipBg).not.toBe(darkColors.tooltipBg);
	});
});
