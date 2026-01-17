import { useEffect, useRef, useState } from "react";

export interface MousePosition {
	x: number;
	y: number;
}

/**
 * Tracks mouse position
 *
 * @example
 * ```tsx
 * const { ref, x, y } = useMouse();
 * ```
 */
export function useMouse<T extends HTMLElement = HTMLElement>() {
	const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });
	const ref = useRef<T>(null);

	useEffect(() => {
		const handleMouseMove = (event: MouseEvent) => {
			if (ref.current) {
				const rect = ref.current.getBoundingClientRect();
				setPosition({
					x: Math.floor(event.clientX - rect.left),
					y: Math.floor(event.clientY - rect.top),
				});
			} else {
				setPosition({ x: event.clientX, y: event.clientY });
			}
		};

		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	return { ref, ...position };
}
