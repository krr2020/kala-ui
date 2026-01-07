import { useCallback } from "react";
import { assignRef, mergeRefs } from "../utils";

/**
 * Merges multiple refs into a single ref callback
 *
 * @param refs - Refs to merge
 *
 * @example
 * ```tsx
 * const MyComponent = forwardRef((props, ref) => {
 *   const internalRef = useRef();
 *   const mergedRef = useMergedRef(ref, internalRef);
 *
 *   return <div ref={mergedRef} />;
 * });
 * ```
 */
export function useMergedRef<T>(...refs: React.ForwardedRef<T>[]) {
	return useCallback(mergeRefs(...refs), refs);
}

export { assignRef, mergeRefs };
