import { useCallback, useEffect, useState } from "react";

export interface UseHoverReturn<T extends HTMLElement = HTMLElement> {
	/** Stable callback ref — attach it to the element to watch */
	ref: React.RefCallback<T>;
	/** Whether the pointer is currently over the element */
	hovered: boolean;
}

/**
 * Detects hover state on the attached element
 *
 * The ref is a stable callback ref; the listeners bind through an effect
 * whenever the node attaches, so late-mounting and swapped nodes are handled.
 * Pointer events cover mouse, touch and pen input. Hovered resets to false
 * when the node detaches.
 *
 * @example
 * ```tsx
 * const { ref, hovered } = useHover();
 *
 * return <div ref={ref}>{hovered ? 'Hovered' : 'Not hovered'}</div>;
 * ```
 */
export function useHover<
	T extends HTMLElement = HTMLElement,
>(): UseHoverReturn<T> {
	const [hovered, setHovered] = useState(false);
	const [node, setNode] = useState<T | null>(null);

	const ref = useCallback((element: T | null) => {
		setNode(element);
		if (!element) {
			setHovered(false);
		}
	}, []);

	useEffect(() => {
		if (!node) return undefined;

		const handleEnter = () => setHovered(true);
		const handleLeave = () => setHovered(false);

		node.addEventListener("pointerenter", handleEnter);
		node.addEventListener("pointerleave", handleLeave);

		return () => {
			node.removeEventListener("pointerenter", handleEnter);
			node.removeEventListener("pointerleave", handleLeave);
		};
	}, [node]);

	return { ref, hovered };
}
