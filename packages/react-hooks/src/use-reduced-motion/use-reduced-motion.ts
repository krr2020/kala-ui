import { useMediaQuery } from "../use-media-query/use-media-query";

/**
 * Detects if user prefers reduced motion
 *
 * @example
 * ```tsx
 * const reduceMotion = useReducedMotion();
 * ```
 */
export function useReducedMotion(initialValue?: boolean): boolean {
	return useMediaQuery("(prefers-reduced-motion: reduce)", initialValue);
}
