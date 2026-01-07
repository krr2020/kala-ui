import { useEffect, useState } from "react";

export interface WindowScrollPosition {
	x: number;
	y: number;
}

/**
 * Returns current window scroll position
 *
 * @example
 * ```tsx
 * const { x, y } = useWindowScroll();
 *
 * return (
 *   <div>
 *     Scroll position: {x}, {y}
 *   </div>
 * );
 * ```
 */
export function useWindowScroll(): WindowScrollPosition {
	const [scroll, setScroll] = useState<WindowScrollPosition>({
		x: typeof window !== "undefined" ? window.scrollX : 0,
		y: typeof window !== "undefined" ? window.scrollY : 0,
	});

	useEffect(() => {
		const handleScroll = () => {
			setScroll({
				x: window.scrollX,
				y: window.scrollY,
			});
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return scroll;
}
