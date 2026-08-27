/**
 * Theme-Aware Chart Hook
 * Custom hook to manage theme-aware charts with automatic re-renders on theme changes
 */

import { useEffect, useState } from "react";
import { getChartColors } from "./theme-utils";

/**
 * Hook to get theme-aware chart colors with automatic re-renders on theme changes
 * This hook listens for theme changes and triggers component re-renders to update chart colors
 */
export function useThemeAwareChart() {
	const [theme, setTheme] = useState<"light" | "dark" | "neutral" | "accent">(
		() => {
			// Detect initial theme from DOM
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
		},
	);

	const colors = getChartColors(theme);

	useEffect(() => {
		// Listen for theme changes by observing DOM class changes
		if (typeof document === "undefined") return;

		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (
					mutation.type === "attributes" &&
					mutation.attributeName === "class"
				) {
					const element = document.documentElement;
					const classList = element.classList;

					let newTheme: "light" | "dark" | "neutral" | "accent" = "light";

					if (classList.contains("dark")) {
						newTheme = classList.contains("accent") ? "accent" : "dark";
					} else if (classList.contains("neutral")) {
						newTheme = "neutral";
					} else if (classList.contains("accent")) {
						newTheme = "accent";
					}

					setTheme(newTheme);
				}
			});
		});

		// Observe the document element for class changes (theme changes)
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class"],
		});

		return () => {
			observer.disconnect();
		};
	}, []);

	return {
		colors,
		theme,
	};
}
