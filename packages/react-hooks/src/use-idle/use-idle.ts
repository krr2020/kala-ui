import { useEffect, useRef, useState } from "react";

const DEFAULT_EVENTS: (keyof WindowEventMap)[] = [
	"keypress",
	"mousemove",
	"touchmove",
	"click",
	"scroll",
];

export interface UseIdleOptions {
	/** Activity events that reset the idle timer */
	events?: (keyof WindowEventMap)[];
	/** Whether the user starts out considered idle */
	initialState?: boolean;
}

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
	options: UseIdleOptions = {},
): boolean {
	const { events = DEFAULT_EVENTS, initialState = false } = options;
	const [idle, setIdle] = useState<boolean>(initialState);
	const timeoutId = useRef<number | null>(null);
	// Content-matched dep: inline array literals must not rebind listeners
	// on every render.
	const _eventsKey = events.join("\u0000");

	useEffect(() => {
		const startTimer = () => {
			if (timeoutId.current) {
				window.clearTimeout(timeoutId.current);
			}

			timeoutId.current = window.setTimeout(() => {
				setIdle(true);
			}, timeout);
		};

		const handleEvent = () => {
			setIdle(false);
			startTimer();
		};

		for (const event of events) {
			window.addEventListener(event, handleEvent);
		}

		// Schedule without marking the user active, so initialState survives
		// until the timeout lapses or real activity arrives.
		startTimer();

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
