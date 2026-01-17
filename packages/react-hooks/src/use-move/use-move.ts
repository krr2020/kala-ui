import { useEffect, useRef, useState } from "react";

export interface UseMovePosition {
	x: number;
	y: number;
}

export const clamp = (value: number, min: number, max: number) =>
	Math.min(Math.max(value, min), max);

/**
 * Handles move events (mouse/touch) on an element
 * Useful for building custom sliders, color pickers, etc.
 *
 * @example
 * ```tsx
 * const { ref, active } = useMove(({ x, y }) => setValue({ x, y }));
 * ```
 */
export function useMove<T extends HTMLElement = HTMLDivElement>(
	onChange: (value: UseMovePosition) => void,
	handlers?: {
		onScrubStart?: () => void;
		onScrubStop?: () => void;
	},
) {
	const ref = useRef<T>(null);
	const mounted = useRef<boolean>(false);
	const [active, setActive] = useState(false);

	useEffect(() => {
		mounted.current = true;
		return () => {
			mounted.current = false;
		};
	}, []);

	useEffect(() => {
		const handleMouseMove = (event: MouseEvent | TouchEvent) => {
			if (ref.current) {
				const rect = ref.current.getBoundingClientRect();
				const { clientX, clientY } =
					"touches" in event ? event.touches[0] : (event as MouseEvent);

				const x = clamp((clientX - rect.left) / rect.width, 0, 1);
				const y = clamp((clientY - rect.top) / rect.height, 0, 1);

				onChange({ x, y });
			}
		};

		const handleMouseUp = () => {
			setActive(false);
			handlers?.onScrubStop?.();
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
			window.removeEventListener("touchmove", handleMouseMove);
			window.removeEventListener("touchend", handleMouseUp);
		};

		const handleMouseDown = (event: MouseEvent | TouchEvent) => {
			if (event.cancelable) {
				event.preventDefault();
			}

			setActive(true);
			handlers?.onScrubStart?.();
			handleMouseMove(event);

			window.addEventListener("mousemove", handleMouseMove);
			window.addEventListener("mouseup", handleMouseUp);
			window.addEventListener("touchmove", handleMouseMove);
			window.addEventListener("touchend", handleMouseUp);
		};

		const element = ref.current;
		if (element) {
			element.addEventListener("mousedown", handleMouseDown);
			element.addEventListener("touchstart", handleMouseDown);
		}

		return () => {
			if (element) {
				element.removeEventListener("mousedown", handleMouseDown);
				element.removeEventListener("touchstart", handleMouseDown);
			}
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
			window.removeEventListener("touchmove", handleMouseMove);
			window.removeEventListener("touchend", handleMouseUp);
		};
	}, [onChange, handlers]);

	return { ref, active };
}
