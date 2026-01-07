import { useCallback, useState } from "react";

/**
 * Toggle between two values
 *
 * @param options - Array of values to toggle between (default: [false, true])
 *
 * @example
 * ```tsx
 * const [value, toggle] = useToggle(['light', 'dark']);
 *
 * return (
 *   <button onClick={() => toggle()}>
 *     Current: {value}
 *   </button>
 * );
 * ```
 */
export function useToggle<T = boolean>(
	options: readonly [T, T] = [false, true] as any,
): [T, (value?: T) => void] {
	const [[option1, option2]] = useState(options);
	const [state, setState] = useState<T>(option1);

	const toggle = useCallback(
		(value?: T) => {
			if (typeof value !== "undefined") {
				setState(value);
			} else {
				setState((current) => (current === option1 ? option2 : option1));
			}
		},
		[option1, option2],
	);

	return [state, toggle];
}
