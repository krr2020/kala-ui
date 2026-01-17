import { useMemo, useState } from "react";

export interface UseCounterOptions {
	min?: number;
	max?: number;
}

export interface UseCounterHandlers {
	increment: () => void;
	decrement: () => void;
	set: (value: number) => void;
	reset: () => void;
}

/**
 * Manages numeric counter
 *
 * @example
 * ```tsx
 * const [count, handlers] = useCounter(0, { min: 0, max: 10 });
 * ```
 */
export function useCounter(
	initialValue = 0,
	options: UseCounterOptions = {},
): [number, UseCounterHandlers] {
	const { min, max } = options;
	const [count, setCount] = useState<number>(initialValue);

	const handlers = useMemo(
		() => ({
			increment: () =>
				setCount((current) => {
					const next = current + 1;
					return max !== undefined && next > max ? current : next;
				}),
			decrement: () =>
				setCount((current) => {
					const next = current - 1;
					return min !== undefined && next < min ? current : next;
				}),
			set: (value: number) =>
				setCount((_current) => {
					let next = value;
					if (max !== undefined && next > max) next = max;
					if (min !== undefined && next < min) next = min;
					return next;
				}),
			reset: () => setCount(initialValue),
		}),
		[initialValue, min, max],
	);

	return [count, handlers];
}
