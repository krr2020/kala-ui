import { useEffect, useRef } from "react";
import { useCallbackRef } from "../utils";

export interface UseIntervalOptions {
	/** Start interval immediately */
	autoInvoke?: boolean;
}

export interface UseIntervalReturnValue {
	start: () => void;
	stop: () => void;
	toggle: () => void;
	active: boolean;
}

/**
 * Declarative setInterval
 *
 * @param fn - Function to call
 * @param interval - Interval in milliseconds
 * @param options - Configuration options
 *
 * @example
 * ```tsx
 * const [seconds, setSeconds] = useState(0);
 * const interval = useInterval(() => setSeconds(s => s + 1), 1000);
 *
 * return (
 *   <div>
 *     <p>Seconds: {seconds}</p>
 *     <button onClick={interval.start}>Start</button>
 *     <button onClick={interval.stop}>Stop</button>
 *   </div>
 * );
 * ```
 */
export function useInterval(
	fn: () => void,
	interval: number,
	{ autoInvoke = false }: UseIntervalOptions = {},
): UseIntervalReturnValue {
	const fnRef = useCallbackRef(fn);
	const intervalRef = useRef<number | null>(null);
	const activeRef = useRef(false);

	const start = () => {
		if (!activeRef.current) {
			activeRef.current = true;
			intervalRef.current = window.setInterval(fnRef, interval);
		}
	};

	const stop = () => {
		if (activeRef.current && intervalRef.current !== null) {
			activeRef.current = false;
			window.clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	};

	const toggle = () => {
		if (activeRef.current) {
			stop();
		} else {
			start();
		}
	};

	useEffect(() => {
		if (autoInvoke) {
			start();
		}
		return stop;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [interval, autoInvoke]);

	return { start, stop, toggle, active: activeRef.current };
}
