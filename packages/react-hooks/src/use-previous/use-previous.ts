import { useEffect, useRef } from "react";

/**
 * Returns the previous value of state
 *
 * @param value - Current value
 *
 * @example
 * ```tsx
 * const [count, setCount] = useState(0);
 * const previousCount = usePrevious(count);
 *
 * return (
 *   <div>
 *     <p>Current: {count}</p>
 *     <p>Previous: {previousCount}</p>
 *     <button onClick={() => setCount(count + 1)}>Increment</button>
 *   </div>
 * );
 * ```
 */
export function usePrevious<T>(value: T): T | undefined {
	const ref = useRef<T>();

	useEffect(() => {
		ref.current = value;
	}, [value]);

	return ref.current;
}
