import { useCallback, useState } from "react";
import { useIsomorphicEffect } from "../use-isomorphic-effect/use-isomorphic-effect";
import { useWindowEvent } from "../use-window-event/use-window-event";

export interface ViewportSize {
	width: number;
	height: number;
}

const eventOptions = { passive: true };

/**
 * Returns current viewport width and height
 *
 * @example
 * ```tsx
 * const { width, height } = useViewportSize();
 * ```
 */
export function useViewportSize(): ViewportSize {
	const [windowSize, setWindowSize] = useState<ViewportSize>({
		width: 0,
		height: 0,
	});

	const setSize = useCallback(() => {
		setWindowSize({ width: window.innerWidth, height: window.innerHeight });
	}, []);

	useWindowEvent("resize", setSize, eventOptions);
	useWindowEvent("orientationchange", setSize, eventOptions);

	useIsomorphicEffect(setSize, []);

	return windowSize;
}
