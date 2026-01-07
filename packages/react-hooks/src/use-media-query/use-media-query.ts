import { useEffect, useState } from "react";

export interface UseMediaQueryOptions {
	/** If true, the initial value will be computed in useEffect */
	getInitialValueInEffect?: boolean;
}

/**
 * Subscribes to media queries
 *
 * @param query - Media query string
 * @param initialValue - Initial value to use before media query is evaluated
 * @param options - Configuration options
 *
 * @example
 * ```tsx
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
 *
 * return (
 *   <div>
 *     {isMobile ? 'Mobile View' : 'Desktop View'}
 *   </div>
 * );
 * ```
 */
export function useMediaQuery(
	query: string,
	initialValue?: boolean,
	{ getInitialValueInEffect = true }: UseMediaQueryOptions = {},
): boolean {
	const getInitialValueFn = () => {
		if (typeof initialValue === "boolean") {
			return initialValue;
		}

		if (typeof window !== "undefined" && "matchMedia" in window) {
			return window.matchMedia(query).matches;
		}

		return false;
	};

	const [matches, setMatches] = useState(
		getInitialValueInEffect ? initialValue : getInitialValueFn(),
	);

	useEffect(() => {
		if (typeof window === "undefined" || !("matchMedia" in window)) {
			return undefined;
		}

		const mediaQuery = window.matchMedia(query);
		setMatches(mediaQuery.matches);

		const handler = (event: MediaQueryListEvent) => {
			setMatches(event.matches);
		};

		// Modern browsers
		if (mediaQuery.addEventListener) {
			mediaQuery.addEventListener("change", handler);
			return () => mediaQuery.removeEventListener("change", handler);
		}

		// Legacy browsers
		// @ts-expect-error - deprecated but needed for older Safari
		mediaQuery.addListener(handler);
		// @ts-expect-error
		return () => mediaQuery.removeListener(handler);
	}, [query]);

	return matches || false;
}
