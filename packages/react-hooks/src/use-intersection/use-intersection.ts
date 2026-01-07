import { useEffect, useRef, useState } from "react";

export interface UseIntersectionOptions extends IntersectionObserverInit {
	/** If true, observer will disconnect after first intersection */
	disconnectOnIntersect?: boolean;
}

export interface UseIntersectionReturnValue {
	/** Ref to attach to element */
	ref: React.RefObject<HTMLElement>;
	/** Intersection observer entry */
	entry: IntersectionObserverEntry | null;
}

/**
 * Uses Intersection Observer API to detect element visibility
 *
 * @param options - Intersection observer options
 *
 * @example
 * ```tsx
 * const { ref, entry } = useIntersection({
 *   threshold: 0.5,
 * });
 *
 * return (
 *   <div ref={ref}>
 *     {entry?.isIntersecting ? 'Visible' : 'Hidden'}
 *   </div>
 * );
 * ```
 */
export function useIntersection(
	options: UseIntersectionOptions = {},
): UseIntersectionReturnValue {
	const {
		disconnectOnIntersect = false,
		threshold,
		root,
		rootMargin,
	} = options;
	const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
	const ref = useRef<HTMLElement>(null);
	const observerRef = useRef<IntersectionObserver | null>(null);

	useEffect(() => {
		if (!ref.current) return undefined;

		if (observerRef.current) {
			observerRef.current.disconnect();
		}

		observerRef.current = new IntersectionObserver(
			([newEntry]) => {
				setEntry(newEntry);

				if (
					disconnectOnIntersect &&
					newEntry.isIntersecting &&
					observerRef.current
				) {
					observerRef.current.disconnect();
				}
			},
			{ threshold, root, rootMargin },
		);

		observerRef.current.observe(ref.current);

		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
		};
	}, [disconnectOnIntersect, threshold, root, rootMargin]);

	return { ref, entry };
}
