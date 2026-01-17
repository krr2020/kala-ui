import { useEffect } from "react";

/**
 * Adds event listener to window on component mount and removes it on unmount
 *
 * @example
 * ```tsx
 * useWindowEvent("resize", () => console.log("resized"));
 * ```
 */
export function useWindowEvent<K extends keyof WindowEventMap>(
	type: K,
	listener: (this: Window, ev: WindowEventMap[K]) => void,
	options?: boolean | AddEventListenerOptions,
): void {
	useEffect(() => {
		window.addEventListener(type, listener, options);
		return () => window.removeEventListener(type, listener, options);
	}, [type, listener, options]);
}
