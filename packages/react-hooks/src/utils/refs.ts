import { useCallback, useEffect, useRef } from "react";

/**
 * Creates a stable callback ref that always has the latest callback
 */
export function useCallbackRef<T extends (...args: unknown[]) => unknown>(
	callback: T,
): T {
	const callbackRef = useRef(callback);

	useEffect(() => {
		callbackRef.current = callback;
	});

	return useCallback(((...args) => callbackRef.current?.(...args)) as T, []);
}

/**
 * Merges multiple refs into a single ref callback
 */
export function assignRef<T>(ref: React.ForwardedRef<T>, value: T | null) {
	if (typeof ref === "function") {
		ref(value);
	} else if (ref !== null && ref !== undefined) {
		(ref as React.MutableRefObject<T | null>).current = value;
	}
}

export function mergeRefs<T>(...refs: React.ForwardedRef<T>[]) {
	return (node: T | null) => {
		refs.forEach((ref) => {
			assignRef(ref, node);
		});
	};
}
