import { useEffect, useRef, useState } from "react";

export interface ElementSize {
	width: number;
	height: number;
}

/**
 * Tracks element size using ResizeObserver
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
	React.RefObject<T>,
	ElementSize,
] {
	const ref = useRef<T>(null);
	const [size, setSize] = useState<ElementSize>({
		width: 0,
		height: 0,
	});

	useEffect(() => {
		if (!ref.current) return undefined;

		const observer = new ResizeObserver((entries) => {
			if (entries[0]) {
				const { width, height } = entries[0].contentRect;
				setSize({ width, height });
			}
		});

		observer.observe(ref.current);

		return () => {
			observer.disconnect();
		};
	}, []);

	return [ref, size];
}
