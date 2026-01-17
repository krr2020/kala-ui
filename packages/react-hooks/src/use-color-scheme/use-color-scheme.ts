import { useMediaQuery } from "../use-media-query/use-media-query";

/**
 * Detects user system color scheme with window.matchMedia API
 *
 * @example
 * ```tsx
 * const colorScheme = useColorScheme(); // 'dark' or 'light'
 * ```
 */
export function useColorScheme(
	initialValue?: "dark" | "light",
): "dark" | "light" {
	const isDark = useMediaQuery(
		"(prefers-color-scheme: dark)",
		initialValue === "dark",
	);
	return isDark ? "dark" : "light";
}
