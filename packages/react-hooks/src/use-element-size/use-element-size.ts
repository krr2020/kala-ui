import { useCallback, useEffect, useState } from "react";

export interface ElementSize {
	width: number;
	height: number;
}

/**
 * Tracks element size using ResizeObserver
 *
 * The ref is a stable callback ref, so the observer attaches whenever the
 * node mounts — including after the initial render — and re-attaches when it
 * swaps to a different node. Size resets to zero whenever the tracked node
 * changes or detaches.
 *
 * @example
 * ```tsx
 * const [ref, { width, height }] = useElementSize<HTMLDivElement>();
 *
 * return (
 *   <div ref={ref}>
 *     Size: {width} x {height}
 *   </div>
 * );
 * ```
 */
export function useElementSize<T extends HTMLElement = HTMLDivElement>(): [
	React.RefCallback<T>,
	ElementSize,
] {
	const [size, setSize] = useState<ElementSize>({
		width: 0,
		height: 0,
	});
	const [node, setNode] = useState<T | null>(null);

	const ref = useCallback((element: T | null) => {
		setNode(element);
	}, []);

	useEffect(() => {
		// Return the previous object while already zeroed to avoid a
		// redundant render on the mount pass before the ref attaches.
		const resetSize = () =>
			setSize((prev) =>
				prev.width === 0 && prev.height === 0 ? prev : { width: 0, height: 0 },
			);

		if (!node) {
			resetSize();
			return undefined;
		}

		// A previous node's size is stale once a different node attaches.
		resetSize();

		const observer = new ResizeObserver((entries) => {
			if (entries[0]) {
				const { width, height } = entries[0].contentRect;
				setSize({ width, height });
			}
		});

		observer.observe(node);

		return () => {
			observer.disconnect();
		};
	}, [node]);

	return [ref, size];
}
