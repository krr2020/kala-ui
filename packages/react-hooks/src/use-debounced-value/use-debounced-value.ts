import { useCallback, useEffect, useRef, useState } from "react";

export interface UseDebouncedValueOptions {
	/** If true, the value will be updated on the leading edge */
	leading?: boolean;
}

export type UseDebouncedValueReturnValue<T> = [T, () => void];

/**
 * Debounces value changes with cancel support
 *
 * @param value - The value to debounce
 * @param wait - Delay in milliseconds
 * @param options - Configuration options
 *
 * @example
 * ```tsx
 * const [value, setValue] = useState('');
 * const [debounced, cancel] = useDebouncedValue(value, 500);
 *
 * return (
 *   <div>
 *     <input value={value} onChange={(e) => setValue(e.target.value)} />
 *     <button onClick={cancel}>Cancel</button>
 *     <p>Debounced: {debounced}</p>
 *   </div>
 * );
 * ```
 */
export function useDebouncedValue<T>(
	value: T,
	wait: number,
	options: UseDebouncedValueOptions = { leading: false },
): UseDebouncedValueReturnValue<T> {
	const [_value, setValue] = useState(value);
	const mountedRef = useRef(false);
	const timeoutRef = useRef<number | null>(null);
	const cooldownRef = useRef(false);

	const cancel = useCallback(() => {
		if (timeoutRef.current !== null) {
			window.clearTimeout(timeoutRef.current);
		}
	}, []);

	useEffect(() => {
		if (mountedRef.current) {
			if (!cooldownRef.current && options.leading) {
				cooldownRef.current = true;
				setValue(value);
			} else {
				cancel();
				timeoutRef.current = window.setTimeout(() => {
					cooldownRef.current = false;
					setValue(value);
				}, wait);
			}
		}
	}, [value, options.leading, wait, cancel]);

	useEffect(() => {
		mountedRef.current = true;
		return cancel;
	}, [cancel]);

	return [_value, cancel];
}
