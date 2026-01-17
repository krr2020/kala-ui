import { useCallback, useRef, useState } from "react";

/**
 * Detects hover state
 *
 * @example
 * ```tsx
 * const { ref, hovered } = useHover();
 * ```
 */
export function useHover<T extends HTMLElement = HTMLDivElement>() {
	const [hovered, setHovered] = useState(false);
	const ref = useRef<T>(null);

	const onMouseEnter = useCallback(() => setHovered(true), []);
	const onMouseLeave = useCallback(() => setHovered(false), []);

	const setRef = useCallback(
		(node: T | null) => {
			if (ref.current) {
				ref.current.removeEventListener("mouseenter", onMouseEnter);
				ref.current.removeEventListener("mouseleave", onMouseLeave);
			}

			if (node) {
				node.addEventListener("mouseenter", onMouseEnter);
				node.addEventListener("mouseleave", onMouseLeave);
			}

			// @ts-expect-error
			ref.current = node;
		},
		[onMouseEnter, onMouseLeave],
	);

	return { ref: setRef, hovered };
}
