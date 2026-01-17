import { useEffect, useRef, useState } from "react";

const DEFAULT_EVENTS: (keyof WindowEventMap)[] = [
	"keypress",
	"mousemove",
	"touchmove",
	"click",
	"scroll",
];

/**
 * Detects user inactivity
 *
 * @example
 * ```tsx
 * const idle = useIdle(5000); // 5 seconds
 * ```
 */
export function useIdle(
	timeout: number,
	options: { events?: (keyof WindowEventMap)[]; initialState?: boolean } = {},
): boolean {
	const { events = DEFAULT_EVENTS, initialState = false } = options;
	const [idle, setIdle] = useState<boolean>(initialState);
	const timeoutId = useRef<number | null>(null);

	useEffect(() => {
		const handleEvent = () => {
			setIdle(false);

			if (timeoutId.current) {
				window.clearTimeout(timeoutId.current);
			}

			timeoutId.current = window.setTimeout(() => {
				setIdle(true);
			}, timeout);
		};

		for (const event of events) {
			window.addEventListener(event, handleEvent);
		}

		handleEvent();

		return () => {
			for (const event of events) {
				window.removeEventListener(event, handleEvent);
			}
			if (timeoutId.current) {
				window.clearTimeout(timeoutId.current);
			}
		};
	}, [timeout, events]);

	return idle;
}
