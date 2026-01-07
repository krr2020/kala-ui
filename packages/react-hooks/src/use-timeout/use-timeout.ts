import { useEffect, useRef } from "react";
import { useCallbackRef } from "../utils";

/**
 * Declarative setTimeout
 *
 * @param fn - Function to call
 * @param delay - Delay in milliseconds
 *
 * @example
 * ```tsx
 * const [visible, setVisible] = useState(true);
 *
 * useTimeout(() => {
 *   setVisible(false);
 * }, 3000);
 *
 * return visible ? <div>This will disappear after 3s</div> : null;
 * ```
 */
export function useTimeout(fn: () => void, delay: number) {
	const fnRef = useCallbackRef(fn);
	const timeoutRef = useRef<number | null>(null);

	useEffect(() => {
		timeoutRef.current = window.setTimeout(fnRef, delay);

		return () => {
			if (timeoutRef.current !== null) {
				window.clearTimeout(timeoutRef.current);
			}
		};
	}, [delay, fnRef]);

	return timeoutRef;
}
