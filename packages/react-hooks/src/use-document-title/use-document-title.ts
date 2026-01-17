import { useIsomorphicEffect } from "../use-isomorphic-effect/use-isomorphic-effect";

/**
 * Sets document.title to given string
 *
 * @example
 * ```tsx
 * useDocumentTitle("My awesome page");
 * ```
 */
export function useDocumentTitle(title: string): void {
	useIsomorphicEffect(() => {
		if (typeof title === "string" && title.trim().length > 0) {
			document.title = title.trim();
		}
	}, [title]);
}
